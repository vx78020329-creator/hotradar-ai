"""BaseAgent - Abstract base class for all HotRadar AI agents."""

from abc import ABC, abstractmethod
from datetime import datetime, timezone
from typing import Any
import logging
import time


class BaseAgent(ABC):
    """Base class for all HotRadar AI agents.

    Every agent must:
      1. Set `name` and `description` class attributes.
      2. Implement the `execute` async method.
      3. Return a structured dict from `execute`.

    The `run` wrapper adds timing, logging, and error handling.
    """

    name: str = "base"
    description: str = ""
    schedule_interval: int = 3600  # seconds between scheduled runs

    def __init__(self) -> None:
        self.logger = logging.getLogger(self.name)
        self.start_time: float = 0

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    @abstractmethod
    async def execute(self, **kwargs: Any) -> dict[str, Any]:
        """Execute the agent's main logic and return structured result."""
        ...

    async def run(self, **kwargs: Any) -> dict[str, Any]:
        """Run with timing and error handling.

        Returns a dict with `status` ("success" | "error"), `data` or
        `error`, and `duration_ms`.
        """
        self.start_time = time.time()
        self.logger.info("Starting %s", self.name)
        try:
            result = await self.execute(**kwargs)
            duration = self._elapsed_ms()
            self.logger.info("Completed %s in %dms", self.name, duration)
            return {"status": "success", "data": result, "duration_ms": duration}
        except Exception as exc:
            duration = self._elapsed_ms()
            self.logger.error("Failed %s: %s", self.name, exc)
            return {"status": "error", "error": str(exc), "duration_ms": duration}

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def _elapsed_ms(self) -> int:
        return int((time.time() - self.start_time) * 1000)

    def _now_iso(self) -> str:
        return datetime.now(timezone.utc).isoformat() + "Z"

    def __repr__(self) -> str:
        return f"<{self.__class__.__name__} name={self.name!r}>"

