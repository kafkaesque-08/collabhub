# ML teammate matching model

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

model = SentenceTransformer('all-MiniLM-L6-v2')

sample_users = [
    {
        "name": "Ananya Mehta",
        "college": "BITS Pilani",
        "skills": ["Python", "Machine Learning", "FastAPI", "Data Science"],
    },
    {
        "name": "Varun Patil",
        "college": "NIT Trichy",
        "skills": ["React Native", "Firebase", "JavaScript", "UI/UX"],
    },
    {
        "name": "Sneha Joshi",
        "college": "VIT Vellore",
        "skills": ["Blockchain", "Solidity", "Web3", "Smart Contracts"],
    },
    {
        "name": "Rohan Singh",
        "college": "IIT Delhi",
        "skills": ["Deep Learning", "PyTorch", "Computer Vision", "Python"],
    },
    {
        "name": "Priya Sharma",
        "college": "IET Lucknow",
        "skills": ["React", "Node.js", "MongoDB", "Express"],
    },
]

def find_matches(skills: list, project_type: str):
    query = ", ".join(skills)
    query_embedding = model.encode([query])
    user_texts = [", ".join(user["skills"]) for user in sample_users]
    user_embeddings = model.encode(user_texts)
    scores = cosine_similarity(query_embedding, user_embeddings)[0]
    results = []
    for i, score in enumerate(scores):
        results.append({
            "name": sample_users[i]["name"],
            "college": sample_users[i]["college"],
            "skills": sample_users[i]["skills"],
            "match_score": round(float(score), 2)
        })
    results.sort(key=lambda x: x["match_score"], reverse=True)
    return results[:3]