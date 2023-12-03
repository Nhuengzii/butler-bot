from pydantic import BaseModel


class PostGuildCommandBody(BaseModel):
    command_id: str

class PostGuildBody(BaseModel):
    guild_id: str
