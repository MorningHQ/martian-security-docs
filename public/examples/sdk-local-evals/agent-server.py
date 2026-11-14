"""Serve the example agent over HTTP, so you can try a URL target on your own machine.

    python3 agent-server.py

It listens on http://127.0.0.1:8765/chat. Send {"message": "..."} with the header
"Authorization: Bearer demo-token" and it returns {"reply": "..."}.

This is a local teaching server. The fixed token only shows how a suite file passes a
credential from your environment; it is not an example of how to protect a real service.
"""

import json
from http.server import BaseHTTPRequestHandler, HTTPServer

from agent import answer

TOKEN = "demo-token"


class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/chat":
            self.reply(404, {"error": "not found"})
        elif self.headers.get("Authorization") != f"Bearer {TOKEN}":
            self.reply(401, {"error": "missing or wrong token"})
        else:
            body = json.loads(self.rfile.read(int(self.headers.get("Content-Length", "0"))))
            self.reply(200, {"reply": answer(body["message"])})

    def reply(self, status, value):
        data = json.dumps(value).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


if __name__ == "__main__":
    print("Example agent listening on http://127.0.0.1:8765/chat (Ctrl+C to stop)")
    HTTPServer(("127.0.0.1", 8765), Handler).serve_forever()
