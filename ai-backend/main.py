# python server

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from ai_assistant import get_assistant_response

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
    
class assistantrequest(BaseModel):
    question : str
    project: dict

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

@app.post("/assistant")
async def assistant(req: assistantrequest):
    answer = get_assistant_response(req.question, req.project)
    return {"answer":answer}

