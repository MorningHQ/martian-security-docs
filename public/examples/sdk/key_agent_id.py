"""Print the exact registration UUID bound to this Martian API key.

Reads GET /v1/sdk/capabilities; it does not execute a target or model. The secret
stays in process memory. Successful stdout contains only the UUID, for shell use.
"""

import sys
from uuid import UUID

import httpx

from martian import MartianConfig


class IdentityError(ValueError):
    """The key does not identify one registered agent for CI attribution."""


def bound_agent_id(payload: object) -> str:
    if not isinstance(payload, dict):
        raise IdentityError("Backend returned an invalid capability response.")
    identifier = payload.get("agent_id")
    if not identifier:
        raise IdentityError(
            "This key is not agent-bound. Create a replacement key and select "
            "your existing registration under Agent restriction, then load its token."
        )
    try:
        return str(UUID(str(identifier)))
    except ValueError:
        raise IdentityError("Backend did not return a valid bound agent UUID.") from None


def main() -> int:
    try:
        config = MartianConfig.from_env()
        with httpx.Client(
            base_url=config.api_url,
            headers={"Authorization": "Bearer " + config.token.get_secret_value()},
            timeout=config.request_timeout_seconds,
            follow_redirects=False,
            trust_env=config.trust_env,
        ) as client:
            response = client.get("/v1/sdk/capabilities")
            response.raise_for_status()
            identifier = bound_agent_id(response.json())
    except IdentityError as error:
        print(str(error), file=sys.stderr)
        return 2
    except httpx.HTTPStatusError as error:
        print(
            f"Agent lookup was denied (HTTP {error.response.status_code}). "
            "Check the approved origin, key state, and organization access.",
            file=sys.stderr,
        )
        return 2
    except httpx.HTTPError:
        print("Could not reach the approved Backend for agent lookup.", file=sys.stderr)
        return 2
    except (ValueError, TypeError):
        print("Missing or invalid platform configuration or capability response.", file=sys.stderr)
        return 2
    print(identifier)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
