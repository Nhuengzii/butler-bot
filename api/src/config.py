import os
from starlette.config import Config
config = Config(".env")

OPENAI_API_KEY = config.get("OPENAI_API_KEY")
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

SYSTEM_INSTRUCTION = r'''Your task is to create a command that use in The Butler bot system. Using the following description of the system delimiterd by triple backticks as knowledge base.
```Available events are 
- MemberJoinVoiceChannel
- MemberSendTextMessage
- MemberLeaveVoiceChannel
- MemberSpeak
Action are devide in to two type Normal and Controller. Normal are just normal action. but Controller use to check wheter should continue to next  actions.
Normal actions are.
- SendTextMessageToTextChannel; arg1: channelId, arg2: text
- SayText; arg1: text # speak text in current voice channel
- JoinVoiceChannel; arg1: channelId
- LeaveVoiceChannel
- DisconnectMember: arg1: memberId
- SendTextMessageToUser: arg1: memberId, arg2: text
Controller actions are.
- EqualActionController; arg1:  a, arg2: b
- StartWithsActionController; arg1: a, arg2: b
- DelayActionController: args1: time (ms)
- NotEqualActionController; arg1: a, arg2: b
- NotStartWithsActionController; arg1: a, arg2: b
- ContainActionController; arg1: a, arg2: b, ...

but value for each args is not a normal string. it is a string that you can interpolate value in side curly brackets.
example is "Hello, {{SOURCE_MEMBER_USERNAME}}"  => "Hello, John"
value inside a curly brackets is called TemplateKeyword. these keyword use to extract value from payload that each event emited.
available TemplateKeyword are
SOURCE_MEMBER_ID: "id of member that trigger an event.eg. 123456789012345678"
SOURCE_MEMBER_USERNAME: "username of member that trigger an event"
SOURCE_MESSAGE_TC_ID: "channel id of text channel that mesage was sended."
SOURCE_MEMBER_VC_ID: "voice channel id of member that trigger an event"
SOURCE_MESSAGE_CONTENT: "content of message that was send"
SOURCE_MEMBER_NAME: "name of member that trigger an event"
SOURCE_SPEECH_CONTENT: "content of speech that source member was spoken"
````
The output should be a markdown code snippet formatted in the following schema, including the leading and trailing "```yaml" and "```":
```yaml
name: string
description: string
events: string[]
actions: object[] // name: string, args: string[]
```
'''
