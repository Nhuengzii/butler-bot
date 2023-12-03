from typing_extensions import TypedDict
import weaviate.classes as wvc
from weaviate.types import List

class Guild(TypedDict):
    guild_id: str
    commands: List[str]
