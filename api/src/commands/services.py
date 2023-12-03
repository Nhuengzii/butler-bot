from typing import List
from uuid import UUID

import yaml
from src.commands.utils import command_to_yaml, example_from_similar_commands, yaml_to_command
from .models import ButlerCommand
from src.database import  command_collection
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from src.config import SYSTEM_INSTRUCTION
llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.1)


def list_commands():
    """List all commands"""
    objs =  command_collection.query.fetch_objects()
    commands: List[tuple[UUID, ButlerCommand]] = []
    for o in objs.objects:
        if o.properties.get("command"):
            commands.append((o.uuid, yaml.safe_load(o.properties["command"])))
    return commands

def insert_command(command: ButlerCommand):
    """Insert a command"""
    parsed_command = command_to_yaml(command)
    uid = command_collection.data.insert(properties={"command": parsed_command})
    return uid

def delete_command(uuid: str):
    """Delete a command"""
    command_collection.data.delete_by_id(uuid=uuid)

def list_similar_commands(q: str):
    """List similar commands"""
    sims = command_collection.query.near_text(query=q,limit=2)
    commands: List[tuple[UUID, ButlerCommand]] = []
    for o in sims.objects:
        if o.properties.get("command"):
            commands.append((o.uuid, yaml.safe_load(o.properties["command"])))
    return commands

template = ChatPromptTemplate.from_messages([
    ("system", f'{SYSTEM_INSTRUCTION}\nExample:\n{{examples}}'),
    ("human", '''Please generate command from this instruction: {instruction}'''),
])

def gen_command(instruction: str):
    sim_commands = list_similar_commands(instruction)
    messages = template.format_messages(instruction=instruction, examples=example_from_similar_commands([c[1] for c in sim_commands]))
    output = llm.invoke(input=messages)
    if (type(output.content) == str):
        command = yaml_to_command(output.content, with_backtick=True)
        return command
    else:
        raise Exception("Invalid command")
