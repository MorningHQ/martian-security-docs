"""Small Martian HTTP-chat tutorial adapter; Python 3.12+, standard library only.

Run behind a trusted HTTPS ingress for hosted Martian access. The default
callback is synthetic/deterministic and makes no model or provider calls.
"""

from __future__ import annotations

import argparse
import asyncio
import hmac
import importlib
import inspect
import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit

MAX_BODY_BYTES = 1024 * 1024
STRING_FIELDS = (
    "campaign_id", "target_id", "conversation_id", "message", "action_id"
)
REQUEST_FIELDS = {*STRING_FIELDS, "turn", "reset"}


def validate_request(value: object) -> dict:
    if not isinstance(value, dict) or set(value) != REQUEST_FIELDS:
        raise ValueError("Expected the seven martian-http-chat-v1 request fields")
    if any(not isinstance(value[key], str) or not value[key].strip() for key in STRING_FIELDS):
        raise ValueError("Request identities and message must be nonempty strings")
    if type(value["turn"]) is not int or value["turn"] < 1:
        raise ValueError("turn must be a positive integer")
    if type(value["reset"]) is not bool:
        raise ValueError("reset must be a boolean")
    return value


def make_handler(callback, token: str):
    class Handler(BaseHTTPRequestHandler):
        # Do not log headers, credentials, prompts, responses or client addresses.
        def log_message(self, _format, *_args):
            pass

        def send_json(self, status: int, value: dict, **headers):
            data = json.dumps(value, ensure_ascii=False, allow_nan=False).encode("utf-8")
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Cache-Control", "no-store")
            for name, content in headers.items():
                self.send_header(name.replace("_", "-"), content)
            self.end_headers()
            self.wfile.write(data)

        def authenticated(self) -> bool:
            if not token:
                return True
            provided = self.headers.get("Authorization", "")
            return hmac.compare_digest(provided.encode(), f"Bearer {token}".encode())

        def do_GET(self):
            if urlsplit(self.path).path == "/health":
                self.send_json(200, {"status": "ok", "contract": "martian-http-chat-v1"})
            else:
                self.send_json(404, {"error": "not_found"})

        def do_OPTIONS(self):
            if urlsplit(self.path).path != "/chat":
                self.send_json(404, {"error": "not_found"})
            elif not self.authenticated():
                self.send_json(401, {"error": "unauthorized"}, WWW_Authenticate="Bearer")
            else:
                self.send_response(204)
                self.send_header("Allow", "POST, OPTIONS")
                self.send_header("Content-Length", "0")
                self.end_headers()

        def do_POST(self):
            if urlsplit(self.path).path != "/chat":
                self.send_json(404, {"error": "not_found"})
                return
            if not self.authenticated():
                self.send_json(401, {"error": "unauthorized"}, WWW_Authenticate="Bearer")
                return
            if self.headers.get_content_type() != "application/json":
                self.send_json(415, {"error": "content_type_must_be_application_json"})
                return
            if self.headers.get("Transfer-Encoding"):
                self.send_json(400, {"error": "send_a_content_length_request"})
                return
            try:
                length = int(self.headers.get("Content-Length", "-1"))
            except ValueError:
                length = -1
            if length < 0:
                self.send_json(411, {"error": "content_length_required"})
                return
            if length > MAX_BODY_BYTES:
                self.send_json(413, {"error": "request_too_large"})
                return
            try:
                request = validate_request(json.loads(self.rfile.read(length)))
            except (ValueError, UnicodeDecodeError):
                self.send_json(422, {"error": "invalid_chat_request"})
                return
            try:
                result = callback(request["message"])
                if inspect.isawaitable(result):
                    result = asyncio.run(result)
                if not isinstance(result, str) or not result.strip():
                    raise ValueError("Callback must return nonempty text")
                self.send_json(200, {"content": result})
            except Exception:
                # Callback exceptions can contain provider secrets; do not echo them.
                self.send_json(502, {"error": "callback_failed"})

    return Handler


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--callback", default="demo_agent:answer", help="Trusted local module:function")
    args = parser.parse_args()
    module, separator, name = args.callback.partition(":")
    if not separator or not module or not name:
        parser.error("--callback must be a trusted local module:function")
    try:
        callback = getattr(importlib.import_module(module), name)
        if not callable(callback):
            raise TypeError("Callback is not callable")
    except (ImportError, AttributeError, TypeError):
        parser.error("Cannot load callback; check the module:function and local imports")
    token = os.environ.get("MARTIAN_ADAPTER_TOKEN", "")
    with ThreadingHTTPServer((args.host, args.port), make_handler(callback, token)) as server:
        print(f"HTTP chat listening at http://{args.host}:{server.server_port}; bearer={'enabled' if token else 'disabled'}", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
