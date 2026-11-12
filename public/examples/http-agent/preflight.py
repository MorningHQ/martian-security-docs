"""Check the running tutorial service over real HTTP/HTTPS, without redirects."""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import HTTPRedirectHandler, ProxyHandler, Request, build_opener


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, _req, _fp, _code, _msg, _headers, _newurl):
        return None


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--origin", default="http://127.0.0.1:8765")
    args = parser.parse_args()
    origin = args.origin.rstrip("/")
    parts = urlsplit(origin)
    if not parts.hostname or parts.username or parts.password or parts.path or parts.query or parts.fragment:
        parser.error("Use only the service origin, without credentials, path, query or fragment")
    if parts.scheme != "https" and not (parts.scheme == "http" and parts.hostname in ("localhost", "127.0.0.1", "::1")):
        parser.error("Use public HTTPS, or loopback HTTP for the local check")
    opener = build_opener(ProxyHandler({}), NoRedirect)
    headers = {"Content-Type": "application/json"}
    token = os.environ.get("MARTIAN_ADAPTER_TOKEN", "")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    request = json.loads(Path(__file__).with_name("request.json").read_text())
    try:
        with opener.open(origin + "/health", timeout=15) as response:
            health = json.load(response)
            if response.status != 200 or not isinstance(health, dict) or health.get("status") != "ok":
                raise ValueError("Health did not report the expected ready state")
        with opener.open(Request(origin + "/chat", data=json.dumps(request).encode(), headers=headers), timeout=15) as response:
            result = json.load(response)
            if response.status != 200 or not isinstance(result, dict) or result.get("content") != "READY":
                raise ValueError("The demo callback did not return READY")
    except HTTPError as error:
        print(f"Preflight failed: HTTP {error.code}; inspect auth, URL and server state.", file=sys.stderr)
        raise SystemExit(1) from None
    except (URLError, TimeoutError, ValueError, OSError):
        print("Preflight failed: inspect reachability, trusted TLS, JSON and the demo callback.", file=sys.stderr)
        raise SystemExit(1) from None
    print("Health: HTTP 200, status ok")
    print("Chat: HTTP 200, content READY; one deterministic callback request")
    print("This checks adapter wiring; it is not Martian onboarding or a model-quality assessment.")


if __name__ == "__main__":
    main()
