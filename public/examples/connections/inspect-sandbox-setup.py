#!/usr/bin/env python3
"""Inspect customer connector IDs using a private human session; no config writes."""

import argparse
import getpass
import json
import sys
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import HTTPRedirectHandler, ProxyHandler, Request, build_opener


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, request, file_pointer, code, message, headers, new_url):
        return None


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--api-url", required=True, help="Approved Backend origin, without /v1")
    parser.add_argument("--allow-local-http", action="store_true", help="Allow explicit loopback development only")
    args = parser.parse_args()
    parsed = urlsplit(args.api_url)
    local_http = args.allow_local_http and parsed.scheme == "http" and parsed.hostname in {"localhost", "127.0.0.1", "::1"}
    if (parsed.scheme != "https" and not local_http) or not parsed.hostname or parsed.username or parsed.password or parsed.path not in {"", "/"} or parsed.query or parsed.fragment:
        parser.error("Use a trusted HTTPS origin with no credentials, path, query or fragment; HTTP requires explicit loopback opt-in.")
    if not sys.stdin.isatty():
        parser.error("Run in an interactive terminal so the password prompt can remain private.")
    origin = args.api_url.rstrip("/")
    opener = build_opener(NoRedirect(), ProxyHandler({}))
    token = None

    def call(method, path, body=None):
        headers = {"Accept": "application/json"}
        if token:
            headers["Authorization"] = "Bearer " + token
        data = None if body is None else json.dumps(body).encode()
        if data is not None:
            headers["Content-Type"] = "application/json"
        request = Request(origin + path, data=data, headers=headers, method=method)
        with opener.open(request, timeout=20) as response:
            raw = response.read(2_000_001)
            if len(raw) > 2_000_000:
                raise ValueError("Configuration response exceeded the inspector's 2 MB bound")
            return json.loads(raw) if raw else None

    try:
        email = input("Owner/Admin email: ").strip()
        password = getpass.getpass("Password (not displayed): ")
        login = call("POST", "/v1/auth/login", {"email": email, "password": password})
        password = None
        token = login["access_token"]
        connectors = call("GET", "/v1/connectors")
        environments = call("GET", "/v1/environments")
        agents = call("GET", "/v1/agents")
        result = {
            "role": login["session"]["role"],
            "connectors": [{key: row.get(key) for key in ("id", "name", "sandbox_env", "available")} for row in connectors],
            "environments": [{key: row.get(key) for key in ("id", "name", "revision", "systems")} for row in environments],
            "agents_first_page": [{
                "id": row["id"], "name": row["name"],
                "protocol": (row.get("connection") or {}).get("protocol"),
                "connection_status": (row.get("connection") or {}).get("status"),
                "session_api_configured": bool((row.get("connection") or {}).get("session_api_url")),
            } for row in agents],
        }
        print(json.dumps(result, indent=2))
        return 0
    except HTTPError as exc:
        print(f"API request failed (HTTP {exc.code}). Check the approved origin, role and service readiness. Response content is not printed.", file=sys.stderr)
        return 1
    except (URLError, OSError, KeyError, TypeError, ValueError) as exc:
        print(f"Inspector failed ({type(exc).__name__}); no credentials or response body are printed.", file=sys.stderr)
        return 1
    finally:
        if token:
            try:
                call("POST", "/v1/auth/logout", {})
            except (HTTPError, URLError, OSError, ValueError):
                print("Session cleanup could not be confirmed; sign out of the inspector session through your approved account-management procedure.", file=sys.stderr)


if __name__ == "__main__":
    raise SystemExit(main())
