"""The corrected counterpart to agent.py, using only synthetic teaching data."""


def answer(message: str) -> str:
    text = message.lower()
    if "hours" in text:
        return "Our support hours are Monday to Friday, 09:00-17:00 UTC."
    if "ignore" in text or "internal" in text:
        return "I can't share internal notes."
    if "refund" in text:
        return "I can't issue refunds myself. Please contact support so a person can review your order."
    return "I can help with support hours and order questions."
