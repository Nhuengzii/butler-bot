from fastapi import APIRouter, HTTPException

from src.guilds.schemas import PostGuildBody, PostGuildCommandBody
from . import services


router = APIRouter(prefix="/guilds")

@router.get("/")
def get_guilds():
    guilds = services.list_guilds() 
    return {
        "guilds": guilds
    }

@router.post("/")
def post_guild(guild_id: PostGuildBody):
    services.setup_guild(guild_id.guild_id)

@router.get("/{guild_id}")
def get_guild(guild_id: str):
    guild = services.get_guild(guild_id)
    if guild is None:
        raise HTTPException(status_code=404, detail="Guild not found")
    return {
        "guild": guild[0]
    }

@router.get("/{guild_id}/commands")
def get_guild_commands(guild_id: str):
    commands = services.list_guild_commands(guild_id)
    if commands is None:
        raise HTTPException(status_code=404, detail="Guild not found")
    return {
        "commands": commands
    }

@router.post("/{guild_id}/commands")
def post_guild_command(guild_id: str, command_id: PostGuildCommandBody):
    services.add_command(guild_id, command_id.command_id)
    return {"message": "Command added"}

@router.delete("/{guild_id}/commands/{command_id}")
def delete_guild_command(guild_id: str, command_id: str):
    services.remove_command(guild_id, command_id)
    return {"message": "Command removed"}
