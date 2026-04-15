from typing import List, Dict
import json
from openai import OpenAI
from app.core.config import settings

class TransformationService:
    def __init__(self):
        if settings.OPENAI_API_KEY:
            self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        else:
            self.client = None

    async def generate_roadmap(self, missing_skills: List[str], target_role: str) -> List[Dict]:
        """
        Generates a structured transformation roadmap.
        """
        if not settings.OPENAI_API_KEY:
            return [
                {
                    "week": 1,
                    "focus": "Foundations",
                    "milestone": f"Basic competency in {missing_skills[0] if missing_skills else 'Core Tech'}",
                    "projects": ["Environment setup", "Hello World prototype"]
                },
                {
                    "week": 2,
                    "focus": "Integration",
                    "milestone": "API and Data Flow",
                    "projects": ["Connect frontend to backend mock"]
                }
            ]

        prompt = f"""
        Generate a 4-week learning roadmap for a professional moving into a {target_role} role. 
        Focus on acquiring these missing skills: {missing_skills}.
        
        Return a JSON list of objects:
        [
            {{"week": 1, "focus": "...", "milestone": "...", "projects": ["p1", "p2"]}}
        ]
        """

        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": "You are a professional corporate trainer AI."},
                {"role": "user", "content": prompt}
            ]
        )

        data = json.loads(response.choices[0].message.content)
        return data.get("roadmap", data) if isinstance(data, dict) else data

transformation_service = TransformationService()
