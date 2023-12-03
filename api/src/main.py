from fastapi import FastAPI
from .commands.router import router as commands_router

app = FastAPI()
app.include_router(commands_router)

@app.get("/")
async def read_root():
    return {"message": "Hello World"}
