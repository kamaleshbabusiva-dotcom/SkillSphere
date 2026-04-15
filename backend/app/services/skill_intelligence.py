import json
import base64
import io
from pdfminer.high_level import extract_text as extract_pdf_text
from typing import Dict, List, Any, Optional
from openai import OpenAI
from app.core.config import settings

class SkillIntelligenceService:
    def __init__(self):
        if settings.OPENAI_API_KEY:
            self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        else:
            self.client = None

    async def analyze_resume(self, text: Optional[str] = None, image_b64: Optional[str] = None, file_bytes: Optional[bytes] = None, filename: Optional[str] = None) -> Dict[str, Any]:
        """
        Analyzes a resume (text, image, or file bytes) and returns extracted skills, SWOT, and career guidance.
        """
        # If file_bytes is provided, handle extraction based on filename
        if file_bytes and filename:
            ext = filename.split(".")[-1].lower()
            if ext == "pdf":
                try:
                    # Using pdfminer.six for robust text extraction
                    text = extract_pdf_text(io.BytesIO(file_bytes))
                except Exception as e:
                    print(f"Error parsing PDF: {e}")
            elif ext in ["png", "jpg", "jpeg"]:
                image_b64 = base64.b64encode(file_bytes).decode("utf-8")
            elif ext == "txt":
                try:
                    text = file_bytes.decode("utf-8")
                except:
                    text = None
        if not self.client:
            # Basic validation for mock mode
            is_valid = False
            if text and len(text.strip()) > 50:
                # Optimized keyword list for professional resume detection
                keywords = ["experience", "education", "skills", "projects", "work", "resume", "cv", "summary", "profile", "expert", "achievements", "objective", "certifications", "portfolio", "qualifications"]
                # Count matches to determine validity
                match_count = sum(1 for keyword in keywords if keyword in text.lower())
                if match_count >= 3:
                    is_valid = True
            elif image_b64:
                # In mock mode, we'll use a simple filename heuristic to simulate strictness
                if filename and any(kw in filename.lower() for kw in ["resume", "cv", "profile", "identity"]):
                    is_valid = True
                else:
                    is_valid = False
            
            if not is_valid:
                return {
                    "is_valid_resume": False,
                    "error_message": "UPLOAD A VALID FILE"
                }

            # High-fidelity fallback for demo
            return {
                "is_valid_resume": True,
                "extracted_skills": {
                    "Technical": ["Python", "FastAPI", "React", "Docker"],
                    "Soft": ["Leadership", "Communication"],
                    "Domain": ["FinTech", "Cloud Architecture"]
                },
                "swot": {
                    "strengths": ["Strong backend foundation", "API design expertise"],
                    "weaknesses": ["Limited frontend state management experience"],
                    "opportunities": ["Transition to AI Engineering", "Leading cross-functional teams"],
                    "threats": ["Rapid automation of entry-level coding tasks"],
                    "enlightenment_score": 82
                },
                "career_guidance": {
                    "target_role": "Senior AI Solutions Architect",
                    "next_steps": "Focus on mastering Vector Databases and RAG patterns to boost role readiness by 15%.",
                    "key_skill_to_master": "System Orchestration"
                },
                "bio": "Strategic software engineer with a focus on scalable backend systems and emerging AI integration."
            }

        content = []
        if text:
            content.append({"type": "text", "text": f"Analyze this resume text: {text}"})
        if image_b64:
            content.append({
                "type": "image_url",
                "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"}
            })

        prompt = """
        You are the SkillSphere AI Intelligence Engine. 
        Perform a deep analysis of this resume (provided as text or image).
        
        1. VALIDATION: Determine if this is actually a professional resume or CV. If not, set 'is_valid_resume' to false.
        2. EXTRACTION: Extract technical, soft, and domain skills.
        3. SWOT: Perform a Professional SWOT analysis.
        4. ROLE DISCOVERY: Identify the most logical 'Target Next-Level Role'.
        5. GUIDANCE: Provide specific career enhancement advice.
        6. BIO: Generate a professional 2-sentence executive bio.
        
        Return ONLY a JSON object with this structure:
        {
          "is_valid_resume": boolean,
          "error_message": string (IF 'is_valid_resume' is false, this MUST be: "UPLOAD A VALID FILE"),
          "extracted_skills": { "Technical": [], "Soft": [], "Domain": [] },
          "swot": { "strengths": [], "weaknesses": [], "opportunities": [], "threats": [], "enlightenment_score": number 0-100 },
          "career_guidance": { "target_role": string, "next_steps": string, "key_skill_to_master": string },
          "bio": string
        }
        """

        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": "You are a world-class HR Intelligence AI. Always respond in JSON."},
                {"role": "user", "content": [
                    {"type": "text", "text": prompt},
                    *content
                ]}
            ]
        )

        return json.loads(response.choices[0].message.content)

    async def extract_skills_from_text(self, text: str) -> Dict[str, List[str]]:
        # Maintaining backward compatibility if needed, but analyze_resume is preferred
        result = await self.analyze_resume(text=text)
        return result.get("extracted_skills", {})

skill_service = SkillIntelligenceService()
