from typing import List, Dict, Any, Optional


def generate_weekly_learning_path(target_role: str, focus_skills: Optional[List[str]] = None) -> Dict[str, Any]:
    """
    Generate a simple 7-day learning path tailored to a `target_role` and optional `focus_skills`.
    This is deterministic and lightweight so it can be used without external APIs.
    """
    if focus_skills is None:
        focus_skills = ["foundations", "practical_projects", "reading", "tools"]

    title = f"7-Day Learning Path: {target_role}"

    days = []
    # A simple template for the 7 days
    templates = [
        {
            "goal": "Foundational Concepts",
            "activities": [
                "Read an introductory article or chapter on core concepts.",
                "Watch a 30–60 minute tutorial video.",
                "Take notes and write 3 summary points."
            ],
            "resources": [
                "Official docs", "Beginner tutorial videos", "Intro blog posts"
            ]
        },
        {
            "goal": "Hands-on Exercises",
            "activities": [
                "Complete a short guided exercise or notebook.",
                "Implement a tiny example from scratch.",
                "Commit code and write a short README."
            ],
            "resources": ["GitHub examples", "Colab / Notebook", "Coding kata"]
        },
        {
            "goal": "Deep Dive",
            "activities": [
                "Read a technical paper or deep-dive article.",
                "Summarize key trade-offs and patterns.",
                "Discuss insights in notes or a short post."
            ],
            "resources": ["ArXiv / Medium / Blog posts"]
        },
        {
            "goal": "Tools & Ecosystem",
            "activities": [
                "Learn the main tools and libraries used for the role.",
                "Install and run a small toolchain example.",
                "Bookmark important references."
            ],
            "resources": ["Official tooling docs", "Quickstart guides"]
        },
        {
            "goal": "Project Work",
            "activities": [
                "Start a small project that applies the learned concepts.",
                "Break the project into 3 tasks and implement one.",
                "Open an issue or TODO list for next steps."
            ],
            "resources": ["Project templates", "Starter repos"]
        },
        {
            "goal": "Feedback & Refinement",
            "activities": [
                "Review your code and notes; refactor a small part.",
                "Seek feedback (peer review or community).",
                "Update your learning goals based on feedback."
            ],
            "resources": ["Code review checklist", "Community forums"]
        },
        {
            "goal": "Synthesis & Next Steps",
            "activities": [
                "Create a summary document of what you learned.",
                "Plan the next 2-week roadmap with measurable goals.",
                "Share your project or notes publicly."
            ],
            "resources": ["Templates for learning plans", "Publishing guides"]
        }
    ]

    for i in range(7):
        tpl = templates[i % len(templates)]
        day = {
            "day": f"Day {i+1}",
            "goal": tpl["goal"],
            "activities": tpl["activities"],
            "resources": tpl["resources"],
        }

        # Add a tiny customization note when focus_skills provided
        if focus_skills:
            day["note"] = f"Focus on: {', '.join(focus_skills[:3])}"

        days.append(day)

    return {"title": title, "target_role": target_role, "days": days}
