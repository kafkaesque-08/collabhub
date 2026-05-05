# python server

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
                   "https://collabhub-app.vercel.app"],
    
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class SkillRequest(BaseModel):
    skills: List[str]
    project_type: str
    
class TagRequest(BaseModel):
    description: str    

@app.get("/health") #  simple endpoint to verify the server is alive.
def health():
    return {"status": "CollabHub AI is running!"}

@app.post("/match")
def match_teammates(request: SkillRequest):
    from matcher import find_matches
    results = find_matches(request.skills, request.project_type)
    return {"matches": results}
    
@app.post("/tags")
def extract_tags(request: TagRequest):
    from tagger import get_tags
    tags = get_tags(request.description)
    return {"tags": tags}    
    
    

