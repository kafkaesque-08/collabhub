# NLP auto-tagging logic

# NLP tag extractor
import re

TECH_KEYWORDS = [
    # Languages
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C#",
    "Rust", "Go", "Swift", "Kotlin", "PHP", "Ruby", "Dart",
    # Frontend
    "React", "Next.js", "Vue", "Angular", "HTML", "CSS",
    "Tailwind", "Bootstrap", "React Native", "Flutter",
    # Backend
    "FastAPI", "Django", "Flask", "Node.js", "Express",
    "Spring", "Laravel", "Rails",
    # Databases
    "PostgreSQL", "MongoDB", "MySQL", "Redis", "Supabase",
    "Firebase", "SQLite", "Prisma",
    # AI/ML
    "Machine Learning", "Deep Learning", "NLP", "Computer Vision",
    "PyTorch", "TensorFlow", "Keras", "scikit-learn", "OpenCV",
    "Hugging Face", "LangChain", "RAG", "GenAI", "Agentic AI",
    # Cloud/DevOps
    "AWS", "GCP", "Azure", "Docker", "Kubernetes",
    "Vercel", "Railway", "Heroku", "CI/CD", "Linux",
    # Other
    "Blockchain", "Solidity", "Web3", "GraphQL", "REST API",
    "WebSocket", "Redis", "Elasticsearch", "Kafka",
    "Git", "GitHub", "API", "Microservices",
]

def get_tags(description: str):
    description_lower = description.lower()
    found_tags = []

    for keyword in TECH_KEYWORDS:
        pattern = r'\b' + re.escape(keyword.lower()) + r'\b'
        if re.search(pattern, description_lower):
            if keyword not in found_tags:
                found_tags.append(keyword)

    return found_tags[:8]