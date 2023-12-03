from .models import ButlerCommand
import yaml

def example_from_similar_commands(commands: list[ButlerCommand]) -> str:
    return ("="*20+"\n").join([command_to_yaml(command) for command in commands])

def command_to_yaml(command: ButlerCommand) -> str:
   return yaml.dump(command, allow_unicode=True)

def yaml_to_command(yaml_str: str, with_backtick: bool = False) -> ButlerCommand:
   yaml_str = yaml_str.strip()
   if with_backtick:
      yaml_str = yaml_str[7:-3]
   return yaml.safe_load(yaml_str)
