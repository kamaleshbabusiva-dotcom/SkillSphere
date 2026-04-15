import json
from openai import OpenAI
from app.core.config import settings
from typing import List, Dict

class PredictionService:
    def __init__(self):
        if settings.OPENAI_API_KEY:
            self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        else:
            self.client = None

    async def predict_future_skills(self, current_skills: List[str], target_role: str) -> List[Dict]:
        """
        Predicts future critical skills for a specific role and user profile.
        """
        if not settings.OPENAI_API_KEY:
            return [
                {"skill": "Large Language Model Orchestration", "reason": "Shift from building models to orchestrating specialized agents.", "urgency": "High"},
                {"skill": "Vector Database Management", "reason": "RAG architectures are becoming standard for enterprise AI.", "urgency": "Medium"},
                {"skill": "AI Ethics & Compliance", "reason": "Regulatory frameworks like EU AI Act require specialized oversight.", "urgency": "High"}
            ]

        prompt = f"""
        Given the current skills of a professional and their target role, 
        predict 3-4 critical future skills they will need in the next 24 months. 
        Consider industry evolution and technology trends.
        
        Current Skills: {current_skills}
        Target Role: {target_role}
        
        Return output as a JSON list of objects:
        [
            {{"skill": "skill_name", "reason": "why they need it", "urgency": "Low/Medium/High"}}
        ]
        """

        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": "You are a strategic workforce planning AI."},
                {"role": "user", "content": prompt}
            ]
        )

        data = json.loads(response.choices[0].message.content)
        return data.get("future_skills", data) if isinstance(data, dict) else data

prediction_service = PredictionService()
