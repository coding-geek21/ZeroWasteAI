from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.routers import (
    auth, scan, inventory, predictions,
    actions, dashboard, impact, food_banks, chat,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("ZeroWaste AI backend starting up...")
    yield
    print("ZeroWaste AI backend shutting down...")


app = FastAPI(
    title="ZeroWaste AI API",
    description="AI-powered food waste prevention platform.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,        prefix="/api/auth", tags=["Auth"])
app.include_router(scan.router,        prefix="/api",      tags=["Scan"])
app.include_router(inventory.router,   prefix="/api",      tags=["Inventory"])
app.include_router(predictions.router, prefix="/api",      tags=["Predictions"])
app.include_router(actions.router,     prefix="/api",      tags=["Actions"])
app.include_router(chat.router,        prefix="/api",      tags=["Chat"])
app.include_router(dashboard.router,   prefix="/api",      tags=["Dashboard"])
app.include_router(impact.router,      prefix="/api",      tags=["Impact"])
app.include_router(food_banks.router,  prefix="/api",      tags=["Food Banks"])


@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "message": "ZeroWaste AI API is running"}


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy", "version": "1.0.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8080, reload=True)
