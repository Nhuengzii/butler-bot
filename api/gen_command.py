from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
import os
os.environ["OPENAI_API_KEY"] = "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"
llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.1)
butter_command_context = r'''You're discord bot assistance that can create commands that compose of a list of actions via yaml. with these template.
```yaml
name: "Command name"
targetEvents:
- "EVENT1"
- "EVENT2"
actions:
- name: "Action1"
  args:
  - "value for arg1 of Action1"
  - "value for arg2 of Action1"
- name: "Action2"
  args:
  - "value for arg1 of Action2"
  - "value for arg2 of Action2"
  - "value for arg3 of Action2"
```

Available events are 
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
Controller actions are.
- EqualActionController; arg1:  a, arg2: b
- StartWithsActionController; arg1: a, arg2: b
- DelayActionController: args1: time (ms)
- NotEqualActionController; arg1: a, arg2: b
- NotStartWithsActionController; arg1: a, arg2: b

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

according to these template. I want you to create a command as a yaml(only yaml do not need to explain what it does.) string for the following user instruction.
you also need to support both thai and english instruction.'''

template = ChatPromptTemplate.from_messages([
    ("system", butter_command_context),
    ("human", "create command that do the following instruction. remove <@43533635635> from vc if he send 'kickme' message and then report."),
    ("ai", '''```yaml
name: "kick <@43533635635> if he send 'kickme' message and tell me."
targetEvents:
- "MemberSendTextMessage"
actions:
- name: EqualActionController
  args:
  - "{{SOURCE_MEMBER_ID}}"
  - "43533635635"
- name: "EqualActionController"
  args:
  - "{{SOURCE_MESSAGE_CONTENT}}"
  - "kickme"
- name: "DisconnectMember"
  args:
  - "{{SOURCE_MEMBER_ID}}"
- name: "SayText"
  args:
  - "I kicked {{SOURCE_MEMBER_NAME}} from vc"
```'''),
    ("human", "create command that do the following instruction. {instruction}")
])
def gen_command(instruction: str):
    messages = template.format_messages(instruction=instruction)
    return llm.invoke(messages).content
    

if __name__ == "__main__":
    inst = "if member said: ควย then say: ไอ้สัสพูดคำหยาบทำไม โดนเตะแน่ then disconnect member"
    command = gen_command(instruction=inst)
    print(command)
