#!/usr/bin/env python3
"""Store the released payment example in one empty synthetic QA environment."""

import argparse
import getpass
import hashlib
import json
import sys
import uuid
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import HTTPRedirectHandler, ProxyHandler, Request, build_opener


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args):
        return None


class SetupError(ValueError):
    """A safe setup explanation containing no server response content."""


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":")).encode()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--api-url", required=True, help="Approved Backend origin, without /v1")
    parser.add_argument("--environment-id", required=True, type=uuid.UUID)
    parser.add_argument("--allow-local-http", action="store_true")
    args = parser.parse_args()
    parsed = urlsplit(args.api_url)
    local = args.allow_local_http and parsed.scheme == "http" and parsed.hostname in {"localhost", "127.0.0.1", "::1"}
    if (parsed.scheme != "https" and not local) or not parsed.hostname or parsed.username or parsed.password or parsed.path not in {"", "/"} or parsed.query or parsed.fragment:
        parser.error("Use a trusted HTTPS origin; HTTP requires explicit loopback opt-in.")
    if not sys.stdin.isatty():
        parser.error("Run interactively so the password prompt remains private.")
    opener = build_opener(NoRedirect(), ProxyHandler({}))
    origin, token, write_started = args.api_url.rstrip("/"), None, False
    environment_path = f"/v1/environments/{args.environment_id}"

    def call(method, path, body=None):
        headers = {"Accept": "application/json"}
        if token:
            headers["Authorization"] = "Bearer " + token
        raw = None if body is None else json.dumps(body).encode()
        if raw is not None:
            headers["Content-Type"] = "application/json"
        with opener.open(Request(origin + path, data=raw, headers=headers, method=method), timeout=90) as response:
            content = response.read(2_000_001)
            if len(content) > 2_000_000:
                raise SetupError("Response exceeded the 2 MB bound")
            return json.loads(content) if content else None

    try:
        email = input("Member/Admin/Owner email: ").strip()
        password = getpass.getpass("Password (not displayed): ")
        login = call("POST", "/v1/auth/login", {"email": email, "password": password})
        password = None
        token = login["access_token"]
        if login["session"]["role"] not in {"member", "admin", "owner"}:
            raise SetupError("Seed authoring requires Member, Admin or Owner")
        environment = call("GET", environment_path)
        if environment["systems"] != ["stripe"]:
            raise SetupError("Use a separate environment containing only stripe")
        connectors = call("GET", "/v1/connectors")
        payment = next(row for row in connectors if row["id"] == "stripe")
        if payment.get("sandbox_env") != "paypal" or not payment.get("available"):
            raise SetupError("The supported stripe-to-paypal mapping is unavailable")
        example = call("GET", "/v1/connectors/stripe/seed-example")
        if example["system"] != "stripe" or example["sandbox_env"] != "paypal":
            raise SetupError("Unexpected example mapping")
        document = example["example"]
        account = "omar.haddad@contoso.example"
        if not any(row["email"] == account for row in document["users"]):
            raise SetupError("The released example changed; review it before proceeding")
        data = call("GET", environment_path + "/data")
        existing = [row for row in data["documents"] if row["system"] == "stripe"]
        if existing:
            if len(existing) != 1 or existing[0]["variant_key"] != "shared":
                raise SetupError("Existing or personal data needs review; nothing was overwritten")
            saved = call("GET", environment_path + "/data/" + existing[0]["id"])
            if saved["status"] != "ready" or saved["verdict"] != "manual" or canonical(saved["document"]) != canonical(document):
                raise SetupError("Existing data differs; nothing was overwritten")
            reused = True
        else:
            if data["worlds"]:
                raise SetupError("Use an empty environment; a world already exists")
            write_started = True
            saved = call("PUT", environment_path + "/data/stripe/document", {"document": document, "verdict": "manual"})
            reused = False
        retained = call("GET", environment_path + "/data/" + saved["id"])
        if retained["status"] != "ready" or retained["verdict"] != "manual" or canonical(retained["document"]) != canonical(document):
            raise SetupError("Inspect the original stored seed; readback did not match")
        print(json.dumps({
            "environment_id": str(args.environment_id), "revision": environment["revision"],
            "seed_document_id": retained["id"], "reused_existing_seed": reused,
            "source": "released example stored through the customer API; no model generation",
            "document_sha256": hashlib.sha256(canonical(document)).hexdigest(),
            "binding_username": account, "record_counts": retained["record_counts"],
        }, indent=2))
        return 0
    except (HTTPError, URLError, OSError, KeyError, TypeError, ValueError, StopIteration) as exc:
        status = f" (HTTP {exc.code})" if isinstance(exc, HTTPError) else ""
        print(f"Seed setup stopped: {type(exc).__name__}{status}. No credentials or response body are printed.", file=sys.stderr)
        if isinstance(exc, SetupError):
            print(str(exc), file=sys.stderr)
        if write_started:
            print("A write was attempted. Inspect this environment's stored data before retrying; do not assume it failed.", file=sys.stderr)
        return 1
    finally:
        if token:
            try:
                call("POST", "/v1/auth/logout", {})
            except (HTTPError, URLError, OSError, ValueError):
                print("Session cleanup could not be confirmed; sign out through your approved account procedure.", file=sys.stderr)


if __name__ == "__main__":
    raise SystemExit(main())
