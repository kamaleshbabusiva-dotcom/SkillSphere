"""
Connect Chat AI Service
Uses Google Gemini API for real-time meeting assistant responses.
Falls back to a rich rule-based system if no API key is configured.
"""

import google.generativeai as genai
from app.core.config import settings


class ConnectChatService:
    def __init__(self):
        self.model = None
        if settings.GEMINI_API_KEY:
            try:
                genai.configure(api_key=settings.GEMINI_API_KEY)
                self.model = genai.GenerativeModel("gemini-2.0-flash")
            except Exception as e:
                print(f"[ConnectChat] Gemini init error: {e}")
                self.model = None

    async def get_response(self, message: str, history: list = None) -> str:
        """
        Generate a response to a user message during a meeting.
        Uses Gemini API if available, otherwise falls back to rule-based.
        """
        if self.model:
            return await self._gemini_response(message, history)
        return self._fallback_response(message)

    async def _gemini_response(self, message: str, history: list = None) -> str:
        system_prompt = (
            "You are SkillSphere AI Assistant — a helpful, concise meeting chatbot embedded in a "
            "video conferencing platform for professionals and learners. "
            "Your role is to assist users during their learning sessions by answering questions about "
            "technology, programming, career advice, interview preparation, skill development, and more. "
            "Keep responses concise (under 200 words), use bullet points when helpful, and be encouraging. "
            "Format important terms in **bold**. You can use emojis sparingly for friendliness."
        )

        try:
            chat_history = []
            if history:
                for msg in history[-10:]:  # Keep last 10 messages for context
                    role = "user" if msg.get("role") == "user" else "model"
                    chat_history.append({
                        "role": role,
                        "parts": [msg.get("content", "")]
                    })

            chat = self.model.start_chat(history=chat_history)
            
            # Prepend system context to the first message if no history
            if not chat_history:
                prompt = f"{system_prompt}\n\nUser question: {message}"
            else:
                prompt = message

            response = chat.send_message(prompt)
            return response.text
        except Exception as e:
            print(f"[ConnectChat] Gemini error: {e}")
            return self._fallback_response(message)

    def _fallback_response(self, message: str) -> str:
        """Rich rule-based fallback when no API key is configured."""
        low = message.lower().strip()

        # Greeting
        if any(w in low for w in ["hello", "hi", "hey", "sup", "greetings"]):
            return (
                "Hello! 👋 I'm your **SkillSphere AI Assistant**.\n\n"
                "I'm here to help during your session! I can:\n"
                "• Answer **technical questions** (Python, React, Cloud, etc.)\n"
                "• Give **career & interview** advice\n"
                "• Explain **algorithms & concepts**\n"
                "• Share **learning resources**\n\n"
                "What would you like to explore?"
            )

        # Help
        if low in ["help", "what can you do", "what can you do?"]:
            return (
                "Here's what I can help with during your session:\n\n"
                "🔧 **Technical Q&A** — Python, JavaScript, React, SQL, Cloud\n"
                "🎯 **Interview Prep** — Mock questions, STAR method, tips\n"
                "📈 **Career Advice** — Role transitions, salary, growth paths\n"
                "🧠 **Concepts** — Algorithms, system design, data structures\n"
                "📚 **Resources** — Courses, books, tutorials\n\n"
                "Just type your question!"
            )

        # Python
        if "python" in low:
            if "list" in low and "comprehension" in low:
                return (
                    "**Python List Comprehensions** 🐍\n\n"
                    "A concise way to create lists:\n"
                    "```python\n"
                    "# Traditional\n"
                    "squares = []\n"
                    "for x in range(10):\n"
                    "    squares.append(x**2)\n\n"
                    "# List comprehension\n"
                    "squares = [x**2 for x in range(10)]\n"
                    "```\n\n"
                    "You can also add **conditions**:\n"
                    "```python\n"
                    "evens = [x for x in range(20) if x % 2 == 0]\n"
                    "```\n\n"
                    "They're ~2x faster than equivalent loops! 🚀"
                )
            if "decorator" in low:
                return (
                    "**Python Decorators** 🎨\n\n"
                    "Decorators wrap functions to extend behavior:\n"
                    "```python\n"
                    "def timer(func):\n"
                    "    def wrapper(*args, **kwargs):\n"
                    "        start = time.time()\n"
                    "        result = func(*args, **kwargs)\n"
                    "        print(f'Took {time.time()-start:.2f}s')\n"
                    "        return result\n"
                    "    return wrapper\n\n"
                    "@timer\n"
                    "def slow_function():\n"
                    "    time.sleep(1)\n"
                    "```\n\n"
                    "Common use cases: **logging**, **auth**, **caching**, **rate limiting**."
                )
            return (
                "**Python** is one of the most versatile languages! 🐍\n\n"
                "Key areas to master:\n"
                "• **Data structures** — lists, dicts, sets, tuples\n"
                "• **OOP** — classes, inheritance, magic methods\n"
                "• **Async** — asyncio, aiohttp for concurrent I/O\n"
                "• **Type hints** — improve code quality & IDE support\n"
                "• **Testing** — pytest, unittest, mocking\n\n"
                "What specific Python topic interests you?"
            )

        # JavaScript / React
        if any(w in low for w in ["javascript", "js ", "react", "nextjs", "next.js", "frontend"]):
            if "react" in low or "nextjs" in low or "next.js" in low:
                return (
                    "**React / Next.js Best Practices** ⚛️\n\n"
                    "• Use **Server Components** for data fetching\n"
                    "• **useCallback/useMemo** to prevent unnecessary re-renders\n"
                    "• **Custom hooks** for shared logic\n"
                    "• **Suspense boundaries** for loading states\n"
                    "• **App Router** for file-based routing\n\n"
                    "Pro tip: In Next.js, prefer **Server Actions** over API routes for forms! 🚀"
                )
            return (
                "**JavaScript Tips** ✨\n\n"
                "• **Destructuring** — `const { a, b } = obj;`\n"
                "• **Optional chaining** — `user?.profile?.name`\n"
                "• **Nullish coalescing** — `value ?? 'default'`\n"
                "• **Promise.allSettled()** — Handle multiple async ops\n"
                "• **Proxy/Reflect** — Meta-programming power\n\n"
                "Modern JS is incredibly powerful. What aspect do you need help with?"
            )

        # Interview
        if any(w in low for w in ["interview", "behavioral", "technical interview"]):
            return (
                "**Interview Preparation Guide** 🎯\n\n"
                "**Technical Rounds:**\n"
                "• Practice **LeetCode medium** problems daily\n"
                "• Master **Big-O analysis** for time/space complexity\n"
                "• Study **system design** — scalability, databases, caching\n\n"
                "**Behavioral Rounds:**\n"
                "• Use the **STAR method** (Situation, Task, Action, Result)\n"
                "• Prepare stories about **conflict resolution**, **leadership**, **failure**\n\n"
                "**Tips:**\n"
                "• Think aloud during coding — show your reasoning\n"
                "• Ask clarifying questions before solving\n"
                "• Test edge cases after your solution\n\n"
                "Want me to give you a mock interview question? 💡"
            )

        # DSA / Algorithms
        if any(w in low for w in ["algorithm", "data structure", "dsa", "leetcode", "sorting", "binary search"]):
            return (
                "**Data Structures & Algorithms** 🧠\n\n"
                "Essential topics to master:\n"
                "1. **Arrays & Strings** — Two pointers, sliding window\n"
                "2. **Hash Maps** — O(1) lookups, counting patterns\n"
                "3. **Trees & Graphs** — BFS, DFS, shortest path\n"
                "4. **Dynamic Programming** — Memoization, tabulation\n"
                "5. **Sorting** — QuickSort, MergeSort, HeapSort\n\n"
                "**Study strategy:**\n"
                "• Start with **Easy** problems, build patterns\n"
                "• Do 2-3 problems/day consistently\n"
                "• Review solutions even when you solve it\n\n"
                "Which topic would you like to explore?"
            )

        # System Design
        if any(w in low for w in ["system design", "architecture", "scalab", "microservice"]):
            return (
                "**System Design Fundamentals** 🏗️\n\n"
                "Follow this framework:\n"
                "1. **Requirements** — Functional vs non-functional\n"
                "2. **Estimation** — QPS, storage, bandwidth\n"
                "3. **High-level design** — Components & data flow\n"
                "4. **Deep dives** — Database choice, caching, queues\n"
                "5. **Trade-offs** — CAP theorem, consistency vs availability\n\n"
                "**Key technologies:**\n"
                "• **Load Balancers** — Nginx, HAProxy\n"
                "• **Caching** — Redis, Memcached\n"
                "• **Message Queues** — Kafka, RabbitMQ\n"
                "• **Databases** — SQL vs NoSQL trade-offs\n\n"
                "Want me to walk through a specific system design problem?"
            )

        # Career / Salary
        if any(w in low for w in ["career", "salary", "job", "resume", "role", "switch", "transition"]):
            return (
                "**Career Growth Strategy** 📈\n\n"
                "• **Build in public** — Share projects on GitHub, blog posts\n"
                "• **Network actively** — Attend meetups, join communities\n"
                "• **Upskill strategically** — Focus on high-demand areas (AI/ML, Cloud)\n"
                "• **Get certifications** — AWS, GCP, Azure for cloud roles\n\n"
                "**Salary negotiation tips:**\n"
                "• Research market rates on Levels.fyi, Glassdoor\n"
                "• Never share your current salary first\n"
                "• Negotiate total compensation, not just base\n\n"
                "What specific career question do you have?"
            )

        # AI / ML
        if any(w in low for w in ["machine learning", "ml", "ai", "deep learning", "neural", "llm", "gpt", "transformer"]):
            return (
                "**AI & Machine Learning** 🤖\n\n"
                "**Learning Path:**\n"
                "1. **Math foundations** — Linear algebra, probability, calculus\n"
                "2. **Classical ML** — Regression, SVM, Random Forest\n"
                "3. **Deep Learning** — CNNs, RNNs, Transformers\n"
                "4. **LLMs** — Fine-tuning, RAG, prompt engineering\n"
                "5. **MLOps** — Model deployment, monitoring, CI/CD\n\n"
                "**Hot topics in 2026:**\n"
                "• **Agentic AI** — Autonomous task planning\n"
                "• **Multimodal models** — Vision + Language\n"
                "• **Small Language Models** — Efficient edge deployment\n\n"
                "Which area interests you most?"
            )

        # Cloud
        if any(w in low for w in ["cloud", "aws", "azure", "gcp", "docker", "kubernetes", "k8s", "devops"]):
            return (
                "**Cloud & DevOps** ☁️\n\n"
                "**Essential skills:**\n"
                "• **Containers** — Docker for packaging, K8s for orchestration\n"
                "• **IaC** — Terraform, CloudFormation for infrastructure\n"
                "• **CI/CD** — GitHub Actions, Jenkins, GitLab CI\n"
                "• **Monitoring** — Prometheus, Grafana, CloudWatch\n"
                "• **Serverless** — Lambda, Cloud Functions for event-driven\n\n"
                "**Certification path:**\n"
                "AWS CCP → SAA → SAP → Specialty certs\n\n"
                "What cloud topic do you need help with?"
            )

        # SQL / Database
        if any(w in low for w in ["sql", "database", "postgres", "mysql", "mongodb", "nosql"]):
            return (
                "**Database Fundamentals** 🗄️\n\n"
                "**SQL essentials:**\n"
                "• **JOINs** — INNER, LEFT, RIGHT, FULL\n"
                "• **Window functions** — ROW_NUMBER, RANK, LAG/LEAD\n"
                "• **Indexing** — B-tree, Hash, Composite indexes\n"
                "• **Normalization** — 1NF, 2NF, 3NF, BCNF\n\n"
                "**SQL vs NoSQL:**\n"
                "• **SQL** — ACID, structured data, complex queries\n"
                "• **NoSQL** — Flexible schema, horizontal scaling\n\n"
                "Pro tip: Always **EXPLAIN ANALYZE** your queries! 🔍"
            )

        # Git
        if any(w in low for w in ["git", "github", "version control", "merge", "branch"]):
            return (
                "**Git Best Practices** 🔀\n\n"
                "• **Commit often** with clear messages\n"
                "• Use **feature branches** — never commit to main directly\n"
                "• **Rebase** for clean history, **merge** for preserving context\n"
                "• **Squash commits** before merging PRs\n"
                "• Use **conventional commits** — `feat:`, `fix:`, `docs:`\n\n"
                "**Useful commands:**\n"
                "• `git stash` — Save work temporarily\n"
                "• `git log --oneline --graph` — Visual history\n"
                "• `git bisect` — Find the commit that broke things\n\n"
                "Need help with a specific Git scenario?"
            )

        # Thank you
        if any(w in low for w in ["thanks", "thank you", "thx", "great", "awesome", "perfect"]):
            return (
                "You're welcome! 😊 Happy to help during your session.\n\n"
                "Feel free to ask me anything else — I'm here throughout your meeting! 🚀"
            )

        # Default
        if len(message.split()) < 3:
            return (
                f"I'd love to help with **\"{message}\"**! "
                f"Could you give me a bit more detail so I can provide a thorough answer? 🤔"
            )

        return (
            f"Great question about **\"{message[:50]}{'...' if len(message)>50 else ''}\"**! 💡\n\n"
            "Based on current industry practices, here are my thoughts:\n"
            "• Break the problem into smaller, manageable parts\n"
            "• Research best practices and established patterns\n"
            "• Build a prototype and iterate based on feedback\n"
            "• Document your learnings for future reference\n\n"
            "Would you like me to go deeper into any specific aspect?"
        )


connect_chat_service = ConnectChatService()
