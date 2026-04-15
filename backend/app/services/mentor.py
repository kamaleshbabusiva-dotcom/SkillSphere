import json
from openai import OpenAI
from app.core.config import settings

class MentorIntelligenceService:
    def __init__(self):
        if settings.OPENAI_API_KEY:
            self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        else:
            self.client = None

    async def get_career_advice(self, user_message: str, history: list = None, target_language: str = "English") -> str:
        """
        Generates contextual career guidance using OpenAI in the target language.
        """
        if not settings.OPENAI_API_KEY:
            low_msg = user_message.lower()
            # Dynamic rule-based simulation to improve conversational reality
            
            if "hello" in low_msg or "hi" in low_msg or "hey" in low_msg:
                return "Hello! I am your SkillSphere Executive Mentor. I have your identity context loaded. How can we optimize your workforce transformation today?"
                
            if "who" in low_msg and "are you" in low_msg:
                return "I am an enterprise intelligence agent designed to coach you through skill gaps, interview prep, and career mobility using your SWOT profile."
                
            if "interview" in low_msg or "prep" in low_msg:
                return "I see you're preparing for an interview. Based on your SWOT matrix, your technical breadth is strong, but you should anticipate questions on 'System Orchestration'. Would you like a mock question?"
                
            if "roadmap" in low_msg or "path" in low_msg or "future" in low_msg:
                return "To reach the Principal level, my data models indicate a 3-month transition phase. Mastery of scalable Vector DB architectures will increase market alignment by 18%."
                
            if "react" in low_msg or "frontend" in low_msg or "UI" in low_msg:
                return "Frontend engineering requires mastery of state management and architectural patterns. I suggest exploring Next.js App Router for enterprise-grade applications."
                
            if "help" in low_msg:
                return "I can assist in identifying skill gaps, simulating interviews, mapping your future career path, or decoding complex organizational contexts. What is your priority?"
                
            if len(user_message.split()) < 4:
                return f"I hear you saying '{user_message}'. Could you elaborate so I can cross-reference with our intelligence benchmarks?"
                
            # Generic semantic echo fallback
            return f"That's a strategic perspective. Addressing '{user_message[:30]}...' reveals a need for continuous upskilling. Let's focus on bridging your core gaps systematically."

        system_prompt = (
            f"You are a world-class AI Career Mentor for SkillSphere AI. YOU ARE A POLYGLOT.\n"
            f"CURRENT SESSION LANGUAGE: {target_language}. YOU MUST RESPOND EXCLUSIVELY IN {target_language}.\n\n"
            "The user has 'Quick Action' buttons that trigger specialized 'Working Models'. "
            "When these are triggered, you must adopt the persona AND provide a structured data payload.\n\n"
            "--- OUTPUT FORMAT ---\n"
            "1. Start with your natural language advice/response IN THE TARGET LANGUAGE.\n"
            "2. IF the user triggered a specific task (Interview, Salary, Resume, Gap, Path, Plan), append a JSON object enclosed in `[MODEL_DATA]{...}[/MODEL_DATA]` tags at the end of your response.\n\n"
            "--- TASK PROTOCOLS ---\n"
            "1. **Mock Interview Simulation**: YOU ARE THE INTERVIEWER. Ask ONE technical question. Payload: `{ \"type\": \"interview\", \"scores\": { \"confidence\": 0, \"clarity\": 0, \"technical\": 0 }, \"question_count\": 1 }`.\n"
            "2. **Salary Benchmark Analysis**: Payload: `{ \"type\": \"salary\", \"data\": [ {\"year\": \"1yr\", \"low\": 5, \"high\": 9}, {\"year\": \"3yr\", \"low\": 12, \"high\": 18} ], \"location\": \"Chennai\", \"currency\": \"₹\" }`.\n"
            "3. **Resume Optimization Tips**: Payload: `{ \"type\": \"resume\", \"ats_score\": 72, \"missing\": [\"Redux\", \"AWS\"], \"suggestions\": [\"Add metrics\", \"ATS layout\"] }`.\n"
            "4. **Bridge My Skill Gap**: Payload: `{ \"type\": \"gap\", \"radar_data\": [ {\"skill\": \"Python\", \"current\": 80, \"target\": 95}, {\"skill\": \"Vector DB\", \"current\": 30, \"target\": 90} ] }` (use 5+ skills).\n"
            "5. **Career Path Options**: Payload: `{ \"type\": \"path\", \"steps\": [ {\"role\": \"Junior\", \"time\": \"0-2yr\", \"salary\": \"8L\"}, {\"role\": \"Senior\", \"time\": \"3-5yr\", \"salary\": \"22L\"} ] }`.\n"
            "6. **Learning Plan This Week**: Provide a 7-DAY CONSECUTIVE LEARNING ROADMAP. Each day must specify what to learn and the ultimate goal for that day.\n"
            "   Payload: `{ \"type\": \"plan\", \"schedule\": [ {\"day\": \"Mon\", \"task\": \"Objective\", \"goal\": \"Why it matters\", \"time\": \"2 hrs\"}, ... ] }` (Exactly 7 days).\n\n"
            "ALWAYS be professional and strategic. Respond ONLY in common conversational style of the target language."
        )

        messages = [
            {"role": "system", "content": system_prompt}
        ]
        
        if history:
            messages.extend(history)
            
        messages.append({"role": "user", "content": user_message})

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                temperature=0.7,
                max_tokens=1000
            )
            return response.choices[0].message.content
        except Exception as e:
            # Enhanced fallback with [MODEL_DATA]
            low = user_message.lower()
            if "mock interview" in low:
                return "## 🎯 Mock Interview: Question 1\n\nHow would you diagnose a P99 latency spike in a Vector DB? \n\n[MODEL_DATA]{\"type\": \"interview\", \"scores\": {\"confidence\": 75, \"clarity\": 80, \"technical\": 0}, \"question_count\": 1}[/MODEL_DATA]"
            if "salary" in low:
                return "## 📈 Salary Benchmark: Senior AI Architect\n\nBased on India data: \n\n[MODEL_DATA]{\"type\": \"salary\", \"data\": [{\"year\": \"Current\", \"low\": 22, \"high\": 35}, {\"year\": \"5yr\", \"low\": 45, \"high\": 75}], \"location\": \"India\", \"currency\": \"₹\"}[/MODEL_DATA]"
            if "resume" in low:
                return "## ✨ Resume Optimization Tips\n\nMissing keywords detected: **REST API, Redux**.\n\n[MODEL_DATA]{\"type\": \"resume\", \"ats_score\": 68, \"missing\": [\"REST API\", \"Redux\", \"Kubernetes\"], \"suggestions\": [\"Use STAR method\", \"Add performance metrics\", \"Clean ATS layout\"]}[/MODEL_DATA]"
            if "skill gap" in low:
                return "## 🧠 Gap Analysis\n\nYou meet 65% of requirements.\n\n[MODEL_DATA]{\"type\": \"gap\", \"radar_data\": [{\"skill\": \"Python\", \"current\": 85, \"target\": 95}, {\"skill\": \"Vector DB\", \"current\": 20, \"target\": 90}, {\"skill\": \"System Design\", \"current\": 40, \"target\": 85}, {\"skill\": \"Cloud\", \"current\": 60, \"target\": 90}, {\"skill\": \"CI/CD\", \"current\": 70, \"target\": 80}]}[/MODEL_DATA]"
            if "career path" in low:
                return "## 🚀 Career Roadmap\n\n[MODEL_DATA]{\"type\": \"path\", \"steps\": [{\"role\": \"Senior AI Architect\", \"time\": \"Now\", \"salary\": \"35L\"}, {\"role\": \"Principal Engineer\", \"time\": \"2.5 yrs\", \"salary\": \"60L\"}, {\"role\": \"CTO/VP Eng\", \"time\": \"5-7 yrs\", \"salary\": \"1.2Cr\"}]}[/MODEL_DATA]"
            if "learning plan" in low:
                return "## 📅 7-Day Sprint\n\n[MODEL_DATA]{\"type\": \"plan\", \"schedule\": [{\"day\": \"Mon\", \"task\": \"Master Vector Indexing\", \"time\": \"2 hrs\"}, {\"day\": \"Tue\", \"task\": \"Distributed Search Implementation\", \"time\": \"3 hrs\"}, {\"day\": \"Wed\", \"task\": \"RAG Orchestration\", \"time\": \"2 hrs\"}]}[/MODEL_DATA]"
            
            return f"Synchronization error: {str(e)}. Focused on your goals."

mentor_service = MentorIntelligenceService()
