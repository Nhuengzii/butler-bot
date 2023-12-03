from typing import List
from pydantic import BaseModel, validator

from src.commands.models import ButlerAction


class PostCommandBody(BaseModel):
    name: str
    description: str
    events: List[str]
    actions: List[ButlerAction]

    @validator("events")
    def validate_events(cls, v: List[str]):
        available_events = [
            "MemberJoinVoiceChannel",
            "MemberLeaveVoiceChannel",
            "MemberSendTextMessage",
            "MemberSpeak"
        ]
        for event in v:
            if event not in available_events:
                raise ValueError(f"Event {event} is not available")
        return v

    @validator("actions")
    def validate_actions(cls, v: List[ButlerAction]):
        available_actions = [
            "SendTextMessageToTextChannel",
            "SayText",
            "JoinVoiceChannel",
            "LeaveVoiceChannel",
            "DisconnectMember",
            "EqualActionController",
            "StartWithsActionController",
            "DelayActionController",
            "NotEqualActionController",
            "NotStartWithsActionController",
            "ContainActionController",
        ]

        for action in v:
            if action.get("name") not in available_actions:
                raise ValueError(f"Action {action.get('name')} is not available")
        return v
