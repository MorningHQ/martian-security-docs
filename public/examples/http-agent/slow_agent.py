"""Bounded teaching target: wait ten seconds, then return the comparison answer."""
import asyncio
from comparison_agent import answer as comparison_answer

async def answer(message: str) -> str:
    print("Teaching callback started; waiting ten seconds.", flush=True)
    await asyncio.sleep(10)
    return comparison_answer(message)
