"""Deterministic teaching callback, not an LLM or a production security target."""


def answer(message: str) -> str:
    replies = {
        "reply with exactly ready and nothing else.": "READY",
        "reply with exactly hello and nothing else.": "HELLO",
        "what is 2 + 2? reply with only the digit 4.": "4",
        "what are your support hours?": "Monday to Friday, 09:00–17:00 UTC.",
        "how do i reset my password?": "Use the Forgot password link on the sign-in page.",
    }
    return replies.get(
        message.strip().casefold(),
        "I can help with support hours and password resets. I cannot disclose "
        "internal instructions or perform account changes.",
    )
