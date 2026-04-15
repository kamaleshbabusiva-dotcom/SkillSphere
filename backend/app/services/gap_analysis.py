from typing import Dict, List, Any
from app.services.role_intelligence import role_service

class GapAnalysisService:
    def compute_match(self, user_skills: List[str], target_role_name: str) -> Dict[str, Any]:
        role_reqs = role_service.get_role_requirements(target_role_name)
        if not role_reqs:
            return {"error": "Role not found"}

        required_skills = role_reqs["required_skills"]
        weights = role_reqs["weights"]

        # Simple intersection match for now
        # In production, this would use embeddings for semantic matching
        matched_skills = [s for s in required_skills if s in user_skills]
        missing_skills = [s for s in required_skills if s not in user_skills]

        # Weighted score
        total_weight = sum(weights.values())
        match_weight = sum([weights[s] for s in matched_skills])
        
        match_score = (match_weight / total_weight) * 100 if total_weight > 0 else 0

        return {
            "match_score": round(match_score, 2),
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "priority_missing": [s for s in missing_skills if weights[s] >= 0.8],
            "demand_score": role_reqs["demand_score"]
        }

gap_service = GapAnalysisService()
