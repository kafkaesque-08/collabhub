from dotenv import load_dotenv
import os

load_dotenv()

from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY")) 

def get_assistant_response(question: str, project_context: dict) -> str:
    system_prompt = """You are CollabHub's AI assistant — a helpful, concise advisor for student developers.
You help users evaluate project ideas, suggest tech stacks, assess feasibility, and improve descriptions.
Keep responses under 150 words. Be direct and practical. Speak like a smart senior dev, not a textbook."""

    user_message = f"""Project: {project_context.get('title', 'Untitled')}
Description: {project_context.get('description', 'No description')}
Tags: {', '.join(project_context.get('tags', []))}

User's question: {question}"""

    response = client.chat.completions.create(
        model="qwen/qwen3-32b",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        max_tokens=300
    )

    return response.choices[0].message.content