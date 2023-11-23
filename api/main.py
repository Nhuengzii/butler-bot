from fastapi import FastAPI
from gen_command import gen_command

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "Hello World"}

@app.get("/gen-command")
async def generate_command(instruction: str):
    command = gen_command(instruction)
    return {"command": command}
