from typing import List, Dict

class RoleIntelligenceService:
    def __init__(self):
        # Benchmark enterprise roles
        self.roles = {
            "Senior AI Architect": {
                "required_skills": ["Python", "PyTorch", "OpenAI API", "System Design", "Cloud Architecture"],
                "weights": {"Python": 0.9, "PyTorch": 1.0, "OpenAI API": 0.8, "System Design": 0.9, "Cloud Architecture": 0.7},
                "demand_score": 95
            },
            "Full Stack Principal": {
                "required_skills": ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
                "weights": {"Next.js": 1.0, "React": 0.9, "TypeScript": 0.8, "Node.js": 0.8, "PostgreSQL": 0.7, "Tailwind CSS": 0.6},
                "demand_score": 88
            },
            "Cloud Security Engineer": {
                "required_skills": ["AWS", "Kubernetes", "IAM", "VPC", "Compliance", "Python"],
                "weights": {"AWS": 1.0, "Kubernetes": 0.9, "IAM": 1.0, "VPC": 0.8, "Compliance": 0.7, "Python": 0.5},
                "demand_score": 92
            }
        }

    def get_role_requirements(self, role_name: str) -> Dict:
        return self.roles.get(role_name, {})

    def list_roles(self) -> List[str]:
        return list(self.roles.keys())

role_service = RoleIntelligenceService()
