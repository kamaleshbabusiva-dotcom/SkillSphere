import asyncio
import sys
import os

# Add backend to path
sys.path.append(r'c:\Users\User\Documents\MSA.J CLG HACKATHON\backend')

from app.services.skill_intelligence import skill_service

async def test_validation():
    print("Testing Valid Resume Text...")
    valid_text = """
    John Doe
    Experience: Senior Software Engineer at Tech Corp for 5 years.
    Education: BS in Computer Science from Stanford.
    Skills: Python, FastAPI, React, AWS.
    Projects: Built a large scale distributed system.
    """
    result = await skill_service.analyze_resume(text=valid_text)
    print(f"Valid Text Result: is_valid={result.get('is_valid_resume')}")
    if not result.get('is_valid_resume'):
        print(f"Error: {result.get('error_message')}")

    print("\nTesting Invalid Text...")
    invalid_text = "This is just a random shopping list: apples, bananas, milk, eggs."
    result = await skill_service.analyze_resume(text=invalid_text)
    print(f"Invalid Text Result: is_valid={result.get('is_valid_resume')}")
    print(f"Error: {result.get('error_message')}")

if __name__ == "__main__":
    asyncio.run(test_validation())
