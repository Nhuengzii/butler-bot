from fastapi import FastAPI
from .commands.router import router as commands_router
from .guilds.router import router as guilds_router

app = FastAPI()
app.include_router(commands_router)
app.include_router(guilds_router)

@app.get("/")
async def read_root():
    return {"message": "Hello World"}
