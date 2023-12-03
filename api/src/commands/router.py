from fastapi import APIRouter

from src.commands.models import ButlerCommand

from .schemas import PostCommandBody
from . import services


router = APIRouter(prefix="/commands")

@router.get("/")
def get_commands():
    commands = services.list_commands()
    return {
        "commands": [
            {
                "uuid": uuid,
                "command": command
            } for uuid, command in commands
        ]
    }

@router.get("/{uuid}")
def get_command(uuid: str):
    command = services.get_command(uuid)
    if command is None:
        return None
    return command

@router.post("/")
def post_commands(command: PostCommandBody):
    uuid = services.insert_command(ButlerCommand(
        name=command.name,
        description=command.description,
        events=command.events,
        actions=command.actions
    ))

    return {
        "uuid": uuid
    }

@router.delete("/{uuid}")
def delete_command(uuid: str):
    services.delete_command(uuid)
    return {"uuid": uuid}

@router.get("/similar")
def get_similar_commands(q: str):
    commands = services.list_similar_commands(q)
    return {
        "commands": [
            {
                "uuid": uuid,
                "command": command
            } for uuid, command in commands
        ]
    }

@router.get("/gen-command")
def get_gen_command(q: str):
    command = services.gen_command(q)
    return {
        "command": command
    }
