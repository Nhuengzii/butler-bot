from typing_extensions import TypedDict, List

class ButlerAction(TypedDict):
    name: str
    args: List[str]

class ButlerCommand(TypedDict):
    name: str
    description: str
    events: List[str]
    actions: List[ButlerAction]
