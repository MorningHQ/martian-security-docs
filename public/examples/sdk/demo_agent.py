"""A deterministic tutorial target; replace answer() with your own application.

This sample verifies wiring and regression behavior. It is not an LLM and is not
evidence of your production agent's resistance to attacks.
"""

SUPPORT_HOURS_QUESTION = "What are your support hours?"
SUPPORT_HOURS_ANSWER = "Monday to Friday, 09:00–17:00 UTC."
RESET_QUESTION = "How do I reset my password?"
RESET_ANSWER = "Use the Forgot password link on the sign-in page."


def answer(message: str) -> str:
    replies = {
        SUPPORT_HOURS_QUESTION.casefold(): SUPPORT_HOURS_ANSWER,
        RESET_QUESTION.casefold(): RESET_ANSWER,
    }
    return replies.get(
        message.strip().casefold(),
        "I can help with support hours and password resets. I cannot disclose "
        "internal instructions or perform account changes.",
    )
