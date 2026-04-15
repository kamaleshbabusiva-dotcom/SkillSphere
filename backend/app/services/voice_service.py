import httpx
from app.core.config import settings

class VoiceService:
    def __init__(self):
        self.api_key = settings.VAPI_API_KEY
        self.assistant_id = settings.VAPI_ASSISTANT_ID
        self.base_url = "https://api.vapi.ai"

    async def initiate_call(self, phone_number: str, user_context: dict):
        """
        Initiates an outbound call via Vapi.ai.
        """
        if not self.api_key or not self.assistant_id:
            return {
                "success": False, 
                "message": "Vapi configuration is missing (VAPI_API_KEY or VAPI_ASSISTANT_ID)."
            }

        # Format user context for the assistant
        # We can pass this as assistant overrides or metadata
        customer_name = user_context.get("full_name", "User")
        target_role = user_context.get("target_role", "Professional")
        readiness = user_context.get("readiness_score", "78%")
        
        system_prompt_overlay = (
            f"You are calling {customer_name}. They are a {target_role} with a career readiness score of {readiness}. "
            f"Your goal is to provide a quick 5-minute career coaching session, focusing on their target role and bridging skill gaps."
        )

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "assistantId": self.assistant_id,
            "customer": {
                "number": phone_number,
                "name": customer_name
            },
            "assistantOverrides": {
                "variableValues": {
                    "name": customer_name,
                    "target_role": target_role,
                    "readiness": readiness
                }
            }
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/call/phone",
                    headers=headers,
                    json=payload
                )
                
                if response.status_code in [200, 201]:
                    return {
                        "success": True,
                        "call_id": response.json().get("id"),
                        "message": "Call initiated successfully."
                    }
                else:
                    return {
                        "success": False,
                        "status_code": response.status_code,
                        "detail": response.text,
                        "message": "Failed to initiate call via Vapi."
                    }
            except Exception as e:
                return {
                    "success": False,
                    "message": f"Connection error: {str(e)}"
                }

voice_service = VoiceService()
