from enum import Enum


class State(Enum):
    POTENTIAL_USER = "POTENTIAL_USER"
    WAITING_APPROVAL = "WAITING_APPROVAL"
    PAUSED = "PAUSED"
