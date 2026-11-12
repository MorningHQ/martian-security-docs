# Runnable Martian HTTP-chat adapter

Python 3.12 or newer; no third-party Python packages. Run commands from this
directory. `server.py` wraps an importable local `module:function` callback in
the actual `martian-http-chat-v1` wire format.

The supplied `demo_agent.answer` recognizes five fixed teaching questions. It
returns deterministic text, makes no LLM/provider calls and performs no account
changes. Passing its dataset checks verifies wiring, not production model quality
or resistance to attacks.

## 1. Start the local service

```sh
python3 --version
python3 server.py --host 127.0.0.1 --port 8765 --callback demo_agent:answer
```

Keep this terminal running. In another terminal in the same directory:

```sh
curl --fail-with-body --silent --show-error http://127.0.0.1:8765/health
curl --fail-with-body --silent --show-error \
  --header 'Content-Type: application/json' \
  --data-binary @request.json http://127.0.0.1:8765/chat
python3 preflight.py --origin http://127.0.0.1:8765
```

Without a configured bearer, expect health `{"status":"ok",...}`, chat
`{"content":"READY"}`, and a successful preflight. The preflight makes one
deterministic chat request. If `MARTIAN_ADAPTER_TOKEN` is already set, use the
authenticated curl form below; `preflight.py` reads the token automatically.

## 2. Configure the adapter's optional bearer

This is a new credential for **your adapter**, not a Martian platform API key or
model-provider key. Inject a strong opaque token from your secret manager into
`MARTIAN_ADAPTER_TOKEN` before starting the server. For a disposable tutorial,
this generates one without printing its value:

```sh
export MARTIAN_ADAPTER_TOKEN="$(python3 -c 'import secrets; print(secrets.token_urlsafe(32))')"
python3 server.py --host 127.0.0.1 --port 8765 --callback demo_agent:answer
```

Stop the earlier process before restarting on the same port. Use the same token
in the client environment. The health route remains public; `/chat` and its
connectivity OPTIONS request require the bearer when configured. Missing or
incorrect credentials return HTTP 401 without invoking the callback.

The curl config is supplied through stdin so the bearer is not an argument:

```sh
python3 -c 'import json, os; print("header = " + json.dumps("Authorization: Bearer " + os.environ["MARTIAN_ADAPTER_TOKEN"]))' |
  curl --config - --fail-with-body --silent --show-error \
    --header 'Content-Type: application/json' \
    --data-binary @request.json http://127.0.0.1:8765/chat
python3 preflight.py --origin http://127.0.0.1:8765
```

Do not use verbose/trace request logging or copy the token into source files,
screenshots or support messages. Creating a new token changes the server's
credential only after restart; update/revalidate the Martian connection as well.

## 3. Make it reachable over public HTTPS

**Localhost is only a local preflight.** Hosted Martian sends requests from its
servers, so a laptop's `127.0.0.1`, a private/VPN-only address or local self-signed
certificate does not satisfy hosted onboarding.

### A. Disposable Docker Desktop tutorial tunnel

For the synthetic tutorial on a machine running Docker Desktop, keep the
bearer-protected Python service on `127.0.0.1:8765` and run this in another
terminal. This uses the exact Cloudflare image digest tested for the walkthrough:

```sh
docker run --rm --name martian-http-demo-tunnel \
  cloudflare/cloudflared@sha256:b94b96edf2c9c4360f8879c8580cfaa99077f19c849ec595ca2f711b27d4f344 \
  tunnel --no-autoupdate --protocol http2 \
  --url http://host.docker.internal:8765
```

Read the generated `https://…trycloudflare.com` origin from the tunnel's terminal.
It needs no Cloudflare account or domain. Keep both processes running. The
hostname changes when a new tunnel is created. Saved connection endpoints cannot
be edited: onboard a replacement with the new chat/health URLs, validate and
approve it, then select that registration for future runs. Retain historical runs
and disable the old connection when retiring it. This forwards only the teaching adapter. Never point
it at the Martian backend, a credential service or another private application.

This exact Docker Desktop path passed trusted public HTTPS preflight, bearer
rejections, actual Martian validation and three-record target execution in the
recorded local QA environment. `host.docker.internal` is the Docker Desktop host
address; this command is not a generic Linux Docker networking recipe.

[Cloudflare Quick Tunnels](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/)
are for temporary development/testing, with no availability guarantee. They have
a 200 concurrent-request limit and do not support SSE. This adapter uses normal
JSON requests and does not need SSE. Use your approved durable ingress for a
persistent endpoint.

### B. Dedicated host with Caddy

For the alternative foreground Caddy recipe, provide:

1. A customer-controlled **dedicated Linux test host** with Python 3.12+ and this
   directory copied onto it. Keep the process available for the whole run.
2. A public DNS hostname you control, such as `agent.YOUR-DOMAIN`, with correct
   A/AAAA records pointing to that host. A published AAAA record must be reachable
   over IPv6, not just an unreachable placeholder.
3. Inbound TCP 80 and 443 routed to the host, free for this test ingress, outbound
   access for certificate issuance, and a publicly trusted certificate. Do not
   publish the private Python port 8765 through the host firewall.
4. The current compatible stable [Caddy package](https://caddyserver.com/docs/install)
   installed on that host and permission to bind public ports. The supplied
   `Caddyfile.example` terminates TLS and forwards only to the same host's loopback
   adapter. Use persistent, writable Caddy certificate storage.

On that host, start the adapter in terminal one with the adapter token injected:

```sh
python3 server.py --host 127.0.0.1 --port 8765 --callback demo_agent:answer
```

In terminal two:

```sh
cp Caddyfile.example Caddyfile
# Edit Caddyfile: replace agent.example.com with your actual public DNS hostname.
sudo caddy run --config "$PWD/Caddyfile" --adapter caddyfile
```

Caddy obtains/renews public TLS for the configured DNS hostname when its stated
DNS/network/storage prerequisites are met. Both foreground processes must remain
running. For a stable service, use your host's normal process supervisor; this
tutorial does not provision a server, DNS, firewall or long-running service for
you. See [Caddy's reverse proxy recipe](https://caddyserver.com/docs/quick-starts/reverse-proxy)
and [automatic HTTPS prerequisites](https://caddyserver.com/docs/automatic-https).

### Verify either HTTPS origin

From a **different machine/network**, with the adapter token injected there:

```sh
export MARTIAN_ADAPTER_ORIGIN='https://YOUR-PUBLIC-HOST'
curl --fail-with-body --silent --show-error "$MARTIAN_ADAPTER_ORIGIN/health"
python3 -c 'import json, os; print("header = " + json.dumps("Authorization: Bearer " + os.environ["MARTIAN_ADAPTER_TOKEN"]))' |
  curl --config - --fail-with-body --silent --show-error \
    --header 'Content-Type: application/json' \
    --data-binary @request.json "$MARTIAN_ADAPTER_ORIGIN/chat"
python3 preflight.py --origin "$MARTIAN_ADAPTER_ORIGIN"
```

These commands keep certificate verification enabled and do not follow redirects.
Expect the same health/READY response. A redirect to login, HTML page, certificate
error or timeout is a failed preflight, not a usable chat endpoint.

Use the generated tunnel origin or your configured DNS origin above. The Caddy
alternative is source-reviewed; it was not used for the recorded walkthrough.
If neither public HTTPS option is available, use the SDK's local-callback workflow
instead. A platform API key or browser session cannot make localhost reachable.

## 4. Onboard and evaluate

An organization Owner/Admin opens Agents → Onboard agent and selects **Martian
HTTP chat**, with **Agent chat endpoint** `https://YOUR-HOST/chat` and **Health
endpoint (optional)** `https://YOUR-HOST/health`. Choose **Bearer token** and put
the adapter token in **Target credential** when configured; otherwise choose
**None**. Leave Session API base and session-management credentials empty: this
example is stateless and implements no session API or sandbox business tools.

Follow Save and validate → Validate connection → review approval conditions →
Approve connection. Connectivity validation does not send a model prompt and
does not by itself verify the POST response format. A real, bounded Evals run is
the next end-to-end check. Import `first-evaluation.jsonl`, publish it, explicitly
select the **Default** project and follow the first-evaluation guide. Its three
records match the default deterministic callback.

## 5. Optional comparison variant

After retaining a successful baseline, stop only your tutorial adapter and restart
it with the same bearer, port and HTTPS tunnel:

```sh
python3 server.py --host 127.0.0.1 --port 8765 --callback comparison_agent:answer
```

Keep the original published dataset unchanged. The variant deliberately returns
` ready `, `hello` and `4.` for its three tutorial inputs. Canonical exact match
trims outer whitespace and ignores case, so the intended result is two passes
and one punctuation failure. This is a new target evaluation of changed code,
not a retry to repair telemetry. The baseline preflight expects `READY` exactly;
run that preflight before switching callbacks.

An owner/admin can record the deployed callback's revision in the agent's
Connection tab using **Current deployed code or build revision → Save revision**.
This is a customer declaration, not independent endpoint attestation. Run the
same dataset once and compare the retained baseline and candidate. Changing the
callback preserves the registration; do not claim that an agent ID proves which
binary or prompt was deployed.

## Request/response contract

`POST /chat` requires `Content-Type: application/json` and the complete object in
`request.json`: campaign_id, target_id, conversation_id, message, turn, reset,
action_id. Runtime IDs/values vary. Requests can also carry Martian correlation
headers and an Idempotency-Key. The adapter preserves the wire contract but only
passes `message` to the configured callback.

Return a JSON object with nonempty string `content`, for example
`{"content":"READY"}`. This sample returns HTTP 422 for invalid JSON/fields,
415 for another content type, 413 for a body over 1 MiB, 404 for an unknown path,
and 502 for a callback error or empty/non-string result. Its errors/logs omit raw
prompts and credentials. `GET /health` returns status ok; `OPTIONS /chat` supports
the connectivity check when no health URL is supplied.

## Connect your own callback

Create an importable module next to the server or on your configured Python path:

```python
# my_agent.py
def answer(message: str) -> str:
    # Call your own application here using its private server-side configuration.
    # Configure provider/network timeouts in that application.
    return "Your application's actual response"
```

```sh
python3 server.py --callback my_agent:answer
```

Synchronous and async callbacks returning nonempty text are supported. The demo
preflight intentionally expects READY, so adapt its expected answer when testing
your real application. A provider call made by your callback can incur its normal
cost. No provider implementation or provider credential is supplied here.

Callback code, model/provider credentials and business-side integrations stay in
your adapter. The Martian target credential only authorizes this HTTP endpoint;
it should not be a raw provider API key. This small standard-library server is a
teaching adapter, not a production web-server or session-management framework.
It has no durable idempotency, rate limiting or business-side-effect verification.
The callback owner must provide those controls and network timeouts when needed.
Each accepted HTTP request calls the callback once; no retry-to-pass is performed.

Prefer the SDK local-callback integration if you want evaluations/red teaming in
your process without exposing a public HTTP service. This adapter is the separate
path for console-triggered, server-to-server HTTP target calls.
