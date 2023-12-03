from typing_extensions import List
from uuid import UUID

from fastapi import HTTPException
from src.commands.models import ButlerCommand
from src.commands import services as command_services
from src.database import guild_collection
from .models import Guild
import weaviate.classes as wvc

def setup_guild(guild_id: str):
    if get_guild(guild_id) is not None:
        raise HTTPException(status_code=409, detail="Guild already exists")
    guild: Guild = {
        "guild_id": guild_id,
        "commands": []
    }
    guild_collection.data.insert(properties=dict(guild))

def list_guilds():
    fetches =  guild_collection.query.fetch_objects(return_properties=Guild)
    guilds: List[Guild] = []
    for f in fetches.objects:
        guilds.append({
            "commands": f.properties.get("commands"),
            "guild_id": f.properties.get("guild_id")
        })
    print(guilds)
    return guilds

def list_guild_commands(guild_id: str):
    guild = get_guild(guild_id)
    if guild is None:
        return None
    guild, gid = guild
    commands: List[ButlerCommand] = []
    for command_id in guild["commands"]:
        print(command_id)
        c = command_services.get_command(command_id)
        if c is None:
            print(f"Command {command_id} not found")
            continue
        commands.append(c)
    return commands

def get_guild(guild_id: str) -> tuple[Guild, UUID] | None:
    fetch = guild_collection.query.fetch_objects(
        filters=wvc.Filter(path="guild_id").equal(guild_id),
        limit=1,
        return_properties=Guild
    )
    if len(fetch.objects) == 0:
        return None
    return (fetch.objects[0].properties, fetch.objects[0].uuid)

def add_command(guild_id: str, command_id: str):
    guild = get_guild(guild_id)
    if guild is None:
        return
    guild, gid = guild
    if str(command_id) in guild["commands"]:
        return
    guild["commands"] = list(set(guild["commands"]))
    guild["commands"].append(command_id)
    guild_collection.data.update({
        "commands": guild["commands"]
    }, gid)

def remove_command(guild_id: str, command_id: str):
    guild = get_guild(guild_id)
    if guild is None:
        return
    guild, gid = guild
    if str(command_id) not in guild["commands"]:
        return
    guild["commands"] = list(set(guild["commands"]))
    guild["commands"].remove(str(command_id))

    guild_collection.data.update({
        "commands": guild["commands"]
    }, gid)

