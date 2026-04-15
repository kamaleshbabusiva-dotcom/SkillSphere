"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  FlaskConical,
  Play,
  Timer,
  CheckCircle2,
  XCircle,
  Trophy,
  Zap,
  ArrowRight,
  RotateCcw,
  Star,
  Brain,
  Code,
  Database,
  Cloud,
  Shield,
  TrendingUp,
  Target,
  Award,
  ChevronRight,
  Sparkles,
  Lock,
  Unlock,
  Flame,
  BarChart3,
  BookOpen,
  GraduationCap,
  Lightbulb,
  Clock,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// ============================================================
// TYPE DEFINITIONS
// ============================================================

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number; // index of correct option
  explanation: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

interface TestCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  description: string;
  questions: Question[];
  bestScore: number;
  attempts: number;
  unlocked: boolean;
}

interface TestResult {
  categoryId: string;
  score: number;
  total: number;
  percentage: number;
  timeTaken: number;
  date: string;
  answers: { questionId: number; selected: number; correct: number; isCorrect: boolean }[];
}

// ============================================================
// QUESTION BANKS
// ============================================================

const pythonQuestions: Question[] = [
  {
    id: 1,
    question: "What is the output of: print(type([]) is list)?",
    options: ["True", "False", "TypeError", "None"],
    correct: 0,
    explanation: "The `type()` function returns the type of an object, and comparing it with `is` to `list` returns True for a list literal.",
    difficulty: "beginner",
  },
  {
    id: 2,
    question: "Which of the following is used to create a generator in Python?",
    options: ["return statement", "yield statement", "generate keyword", "async keyword"],
    correct: 1,
    explanation: "The `yield` statement is used in a function to make it a generator function, which returns a generator iterator.",
    difficulty: "beginner",
  },
  {
    id: 3,
    question: "What does the `__init__` method do in a Python class?",
    options: ["Destroys the object", "Initializes the object", "Compiles the code", "Imports modules"],
    correct: 1,
    explanation: "__init__ is a special constructor method that initializes newly created objects with default or provided values.",
    difficulty: "beginner",
  },
  {
    id: 4,
    question: "What is a decorator in Python?",
    options: [
      "A design pattern for UI",
      "A function that modifies another function",
      "A type of variable",
      "A CSS-like styling syntax",
    ],
    correct: 1,
    explanation: "Decorators in Python are functions that take another function and extend its behavior without explicitly modifying it, using the @decorator syntax.",
    difficulty: "intermediate",
  },
  {
    id: 5,
    question: "What is the difference between `deepcopy` and `copy`?",
    options: [
      "No difference",
      "deepcopy copies references, copy copies objects",
      "deepcopy recursively copies all nested objects",
      "copy is faster because it copies more",
    ],
    correct: 2,
    explanation: "copy.copy() creates a shallow copy (copies references for nested objects), while copy.deepcopy() recursively copies all nested objects creating completely independent copies.",
    difficulty: "intermediate",
  },
  {
    id: 6,
    question: "What does GIL stand for in Python?",
    options: [
      "Global Import Lock",
      "General Iteration Loop",
      "Global Interpreter Lock",
      "Garbage Indexing Layer",
    ],
    correct: 2,
    explanation: "The GIL (Global Interpreter Lock) is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes simultaneously in CPython.",
    difficulty: "advanced",
  },
  {
    id: 7,
    question: "Which data structure uses LIFO (Last In, First Out)?",
    options: ["Queue", "Stack", "Linked List", "Tree"],
    correct: 1,
    explanation: "A Stack uses LIFO ordering — the last element pushed is the first one popped, like a stack of plates.",
    difficulty: "beginner",
  },
  {
    id: 8,
    question: "What is the time complexity of dict lookup in Python on average?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
    correct: 2,
    explanation: "Python dictionaries use hash tables internally, providing O(1) average case time complexity for lookups, insertions, and deletions.",
    difficulty: "intermediate",
  },
  {
    id: 9,
    question: "What is a metaclass in Python?",
    options: [
      "A class that inherits from multiple parents",
      "A class of a class — defines how classes behave",
      "A private class variable",
      "A compiled class",
    ],
    correct: 1,
    explanation: "A metaclass is the 'class of a class' — it defines how classes themselves are created and behave. `type` is the default metaclass in Python.",
    difficulty: "advanced",
  },
  {
    id: 10,
    question: "What does `*args` do in a function definition?",
    options: [
      "Makes arguments required",
      "Allows passing variable number of positional arguments",
      "Creates a pointer to the argument",
      "Validates argument types",
    ],
    correct: 1,
    explanation: "*args allows a function to accept any number of positional arguments, which are collected into a tuple inside the function.",
    difficulty: "beginner",
  },
];

const mlAiQuestions: Question[] = [
  {
    id: 1,
    question: "What is the primary goal of supervised learning?",
    options: [
      "Find hidden patterns in data",
      "Learn a mapping from inputs to outputs using labeled data",
      "Maximize a reward signal",
      "Reduce dimensionality",
    ],
    correct: 1,
    explanation: "Supervised learning uses labeled training data (input-output pairs) to learn a function that maps new inputs to appropriate outputs.",
    difficulty: "beginner",
  },
  {
    id: 2,
    question: "What is the 'vanishing gradient' problem?",
    options: [
      "GPU memory overflow",
      "Gradients become extremely small during backpropagation",
      "The model runs out of data",
      "Loss function returns zero",
    ],
    correct: 1,
    explanation: "The vanishing gradient problem occurs when gradients shrink exponentially as they propagate backward through deep layers, making it difficult for early layers to learn.",
    difficulty: "intermediate",
  },
  {
    id: 3,
    question: "Which activation function is commonly used in the output layer for binary classification?",
    options: ["ReLU", "Sigmoid", "Tanh", "Softmax"],
    correct: 1,
    explanation: "Sigmoid squashes values to (0,1), making it ideal for binary classification output where we need a probability between 0 and 1.",
    difficulty: "beginner",
  },
  {
    id: 4,
    question: "What is the purpose of dropout in neural networks?",
    options: [
      "Speed up training",
      "Reduce overfitting by randomly deactivating neurons",
      "Increase model parameters",
      "Normalize batch data",
    ],
    correct: 1,
    explanation: "Dropout randomly zeroes out a fraction of neurons during training, preventing co-adaptation and acting as an ensemble regularization technique.",
    difficulty: "intermediate",
  },
  {
    id: 5,
    question: "What does 'attention mechanism' do in Transformers?",
    options: [
      "Compresses the model",
      "Allows the model to focus on relevant parts of the input",
      "Speeds up data loading",
      "Reduces model size",
    ],
    correct: 1,
    explanation: "Attention mechanisms allow models to dynamically focus on the most relevant parts of the input sequence when producing each output, capturing long-range dependencies.",
    difficulty: "intermediate",
  },
  {
    id: 6,
    question: "What is precision in a classification context?",
    options: [
      "TP / (TP + FN)",
      "TP / (TP + FP)",
      "(TP + TN) / Total",
      "TN / (TN + FP)",
    ],
    correct: 1,
    explanation: "Precision = True Positives / (True Positives + False Positives). It measures what fraction of positive predictions were actually correct.",
    difficulty: "intermediate",
  },
  {
    id: 7,
    question: "What architecture is BERT based on?",
    options: ["CNN", "RNN", "Transformer Encoder", "GAN"],
    correct: 2,
    explanation: "BERT (Bidirectional Encoder Representations from Transformers) uses the encoder portion of the Transformer architecture with bidirectional self-attention.",
    difficulty: "advanced",
  },
  {
    id: 8,
    question: "What is the role of the learning rate in gradient descent?",
    options: [
      "Determines the model architecture",
      "Controls the step size of parameter updates",
      "Sets the number of epochs",
      "Defines the loss function",
    ],
    correct: 1,
    explanation: "The learning rate controls how much the model's weights are adjusted during each training step—too high can overshoot, too low slows convergence.",
    difficulty: "beginner",
  },
  {
    id: 9,
    question: "What is a Generative Adversarial Network (GAN)?",
    options: [
      "A single network for classification",
      "Two networks (generator and discriminator) competing against each other",
      "A network for reinforcement learning",
      "A database optimization algorithm",
    ],
    correct: 1,
    explanation: "GANs consist of a generator that creates synthetic data and a discriminator that evaluates it, competing in a minimax game to produce increasingly realistic outputs.",
    difficulty: "advanced",
  },
  {
    id: 10,
    question: "Which technique helps prevent overfitting?",
    options: [
      "Adding more hidden layers",
      "Increasing learning rate",
      "L2 regularization",
      "Using more complex features",
    ],
    correct: 2,
    explanation: "L2 regularization (weight decay) adds a penalty proportional to the squared magnitude of weights, discouraging overly complex models and reducing overfitting.",
    difficulty: "beginner",
  },
];

const systemDesignQuestions: Question[] = [
  {
    id: 1,
    question: "What is the CAP theorem?",
    options: [
      "Code, Architecture, Performance",
      "A distributed system can guarantee at most 2 of: Consistency, Availability, Partition tolerance",
      "Cloud, API, Protocol",
      "Cache, Access, Persistence",
    ],
    correct: 1,
    explanation: "The CAP theorem states that a distributed system can simultaneously provide at most two of: Consistency, Availability, and Partition tolerance.",
    difficulty: "intermediate",
  },
  {
    id: 2,
    question: "What is horizontal scaling?",
    options: [
      "Adding more CPU to a single server",
      "Adding more machines to distribute load",
      "Upgrading RAM and storage",
      "Installing a faster network card",
    ],
    correct: 1,
    explanation: "Horizontal scaling (scaling out) adds more machines/nodes to your pool of resources, distributing load across multiple servers.",
    difficulty: "beginner",
  },
  {
    id: 3,
    question: "What is the primary purpose of a load balancer?",
    options: [
      "Store data persistently",
      "Distribute incoming traffic across multiple servers",
      "Compile application code",
      "Manage database schemas",
    ],
    correct: 1,
    explanation: "A load balancer distributes incoming network traffic across multiple servers to ensure no single server is overwhelmed, improving reliability and performance.",
    difficulty: "beginner",
  },
  {
    id: 4,
    question: "What pattern does a message queue implement?",
    options: ["Observer pattern", "Producer-Consumer pattern", "Singleton pattern", "Factory pattern"],
    correct: 1,
    explanation: "Message queues implement the Producer-Consumer (Pub-Sub) pattern, decoupling producers who generate messages from consumers who process them asynchronously.",
    difficulty: "intermediate",
  },
  {
    id: 5,
    question: "What is database sharding?",
    options: [
      "Backing up data",
      "Splitting data across multiple databases",
      "Encrypting database records",
      "Indexing table columns",
    ],
    correct: 1,
    explanation: "Sharding partitions data horizontally across multiple database instances (shards), each containing a subset of the total data, enabling horizontal scaling.",
    difficulty: "intermediate",
  },
  {
    id: 6,
    question: "What is the purpose of a CDN?",
    options: [
      "Central Database Node",
      "Caches and serves content from geographically distributed edge servers",
      "Manages DNS records",
      "Compiles JavaScript code",
    ],
    correct: 1,
    explanation: "A Content Delivery Network caches content at edge locations worldwide, serving users from the nearest server to reduce latency and improve load times.",
    difficulty: "beginner",
  },
  {
    id: 7,
    question: "What is eventual consistency?",
    options: [
      "All reads always see the latest write",
      "The system will eventually converge to a consistent state given no new updates",
      "Data is never consistent",
      "Only one node has the correct data",
    ],
    correct: 1,
    explanation: "Eventual consistency guarantees that, given enough time and no new updates, all replicas will converge to the same state — trading immediate consistency for higher availability.",
    difficulty: "advanced",
  },
  {
    id: 8,
    question: "Which caching strategy updates cache when data changes?",
    options: [
      "Cache-aside (Lazy loading)",
      "Write-through",
      "Time-based expiry",
      "Manual invalidation",
    ],
    correct: 1,
    explanation: "Write-through caching writes data to both the cache and the backing store simultaneously, ensuring the cache is always up to date at the cost of write latency.",
    difficulty: "advanced",
  },
  {
    id: 9,
    question: "What is a microservices architecture?",
    options: [
      "One large monolithic application",
      "Small, independent services that communicate over APIs",
      "A database design pattern",
      "A type of frontend framework",
    ],
    correct: 1,
    explanation: "Microservices architecture decomposes an application into small, loosely coupled services that can be developed, deployed, and scaled independently.",
    difficulty: "beginner",
  },
  {
    id: 10,
    question: "What is the purpose of a circuit breaker pattern?",
    options: [
      "Physical hardware protection",
      "Prevents cascading failures by stopping calls to failing services",
      "Encrypts network traffic",
      "Manages user sessions",
    ],
    correct: 1,
    explanation: "The circuit breaker pattern detects failures and encapsulates logic to prevent calls to a failing service, allowing it time to recover and preventing cascading failures.",
    difficulty: "advanced",
  },
];

const cloudDevOpsQuestions: Question[] = [
  {
    id: 1,
    question: "What is Infrastructure as Code (IaC)?",
    options: [
      "Writing code inside servers",
      "Managing infrastructure through machine-readable configuration files",
      "A programming language for clouds",
      "Building physical data centers",
    ],
    correct: 1,
    explanation: "IaC manages and provisions infrastructure through code/configuration files rather than manual processes, enabling version control and automation.",
    difficulty: "beginner",
  },
  {
    id: 2,
    question: "What is a Docker container?",
    options: [
      "A physical server",
      "A lightweight, standalone package that includes everything to run an application",
      "A programming language",
      "A database system",
    ],
    correct: 1,
    explanation: "A Docker container is a lightweight, standalone, executable package that includes everything needed to run a piece of software — code, runtime, libraries, and settings.",
    difficulty: "beginner",
  },
  {
    id: 3,
    question: "What is Kubernetes primarily used for?",
    options: [
      "Writing Python code",
      "Container orchestration and management",
      "Frontend development",
      "Database design",
    ],
    correct: 1,
    explanation: "Kubernetes (K8s) is an open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications.",
    difficulty: "beginner",
  },
  {
    id: 4,
    question: "What is CI/CD?",
    options: [
      "Code Integration / Code Delivery",
      "Continuous Integration / Continuous Deployment",
      "Cloud Infrastructure / Cloud Design",
      "Central Intelligence / Central Database",
    ],
    correct: 1,
    explanation: "CI/CD stands for Continuous Integration (frequent merging and automated testing) and Continuous Deployment/Delivery (automated release to production).",
    difficulty: "beginner",
  },
  {
    id: 5,
    question: "What is the difference between a VM and a container?",
    options: [
      "They are identical",
      "VMs virtualize hardware; containers virtualize the OS kernel",
      "Containers are heavier than VMs",
      "VMs are faster than containers",
    ],
    correct: 1,
    explanation: "VMs run full OS copies with virtualized hardware (heavy), while containers share the host OS kernel, making them faster and more lightweight than VMs.",
    difficulty: "intermediate",
  },
  {
    id: 6,
    question: "What does Terraform do?",
    options: [
      "Monitors application logs",
      "Provisions and manages cloud infrastructure using declarative configuration",
      "Deploys frontend code",
      "Manages team schedules",
    ],
    correct: 1,
    explanation: "Terraform is an IaC tool that uses declarative configuration files (HCL) to provision and manage infrastructure across multiple cloud providers.",
    difficulty: "intermediate",
  },
  {
    id: 7,
    question: "What is a service mesh?",
    options: [
      "A Wi-Fi network type",
      "A dedicated infrastructure layer for managing service-to-service communication",
      "A database replication method",
      "A frontend routing library",
    ],
    correct: 1,
    explanation: "A service mesh (e.g., Istio) provides a dedicated infrastructure layer for managing service-to-service communication, handling traffic management, security, and observability.",
    difficulty: "advanced",
  },
  {
    id: 8,
    question: "What is blue-green deployment?",
    options: [
      "Deploying to test and prod simultaneously",
      "Running two identical environments and switching traffic between them",
      "A color-coded logging system",
      "Deploying only at night",
    ],
    correct: 1,
    explanation: "Blue-green deployment maintains two identical production environments. The new version is deployed to the idle environment, and traffic is switched over once validated.",
    difficulty: "intermediate",
  },
  {
    id: 9,
    question: "What is the 12-Factor App methodology?",
    options: [
      "A grading system",
      "A methodology for building scalable, portable cloud-native applications",
      "A security framework with 12 rules",
      "A database normalization technique",
    ],
    correct: 1,
    explanation: "The 12-Factor App is a methodology for building SaaS apps that are portable, scalable, and suitable for deployment on modern cloud platforms.",
    difficulty: "advanced",
  },
  {
    id: 10,
    question: "What is observability in DevOps?",
    options: [
      "Team performance tracking",
      "The ability to understand system state from its external outputs (logs, metrics, traces)",
      "Watching deployment pipelines",
      "Monitoring disk usage only",
    ],
    correct: 1,
    explanation: "Observability is the ability to measure and understand a system's internal state from its external outputs — primarily through the three pillars: logs, metrics, and traces.",
    difficulty: "intermediate",
  },
];

const webDevQuestions: Question[] = [
  {
    id: 1,
    question: "What does the Virtual DOM do in React?",
    options: [
      "Directly manipulates the browser DOM",
      "Creates an in-memory representation of the UI for efficient updates",
      "Compiles JavaScript to HTML",
      "Manages server-side routing",
    ],
    correct: 1,
    explanation: "The Virtual DOM is a lightweight in-memory representation of the actual DOM. React uses it to calculate minimal DOM mutations needed, improving performance.",
    difficulty: "beginner",
  },
  {
    id: 2,
    question: "What is the purpose of `useEffect` in React?",
    options: [
      "Declare state variables",
      "Perform side effects in functional components",
      "Define component styles",
      "Create event handlers",
    ],
    correct: 1,
    explanation: "useEffect lets you perform side effects (data fetching, subscriptions, DOM manipulation) in functional components, running after the render is committed to the screen.",
    difficulty: "beginner",
  },
  {
    id: 3,
    question: "What is CORS?",
    options: [
      "Cross-Origin Resource Sharing — a security mechanism for cross-domain HTTP requests",
      "Central Origin Routing System",
      "A JavaScript framework",
      "A CSS preprocessor",
    ],
    correct: 0,
    explanation: "CORS (Cross-Origin Resource Sharing) is a browser security feature that restricts HTTP requests across different origins, requiring explicit server-side headers to allow them.",
    difficulty: "intermediate",
  },
  {
    id: 4,
    question: "What is Server-Side Rendering (SSR)?",
    options: [
      "Rendering JavaScript on the client",
      "Generating HTML on the server for each request",
      "Using CSS to style pages",
      "Caching static files",
    ],
    correct: 1,
    explanation: "SSR generates the full HTML for a page on the server for each request, improving SEO and initial page load time compared to client-side rendering.",
    difficulty: "intermediate",
  },
  {
    id: 5,
    question: "What is a closure in JavaScript?",
    options: [
      "Ending a program",
      "A function that retains access to its outer scope variables",
      "A CSS display property",
      "A database connection",
    ],
    correct: 1,
    explanation: "A closure is a function that remembers and can access variables from the scope in which it was created, even after that scope has exited.",
    difficulty: "intermediate",
  },
  {
    id: 6,
    question: "What is the difference between `==` and `===` in JavaScript?",
    options: [
      "No difference",
      "`==` compares with type coercion, `===` compares without type coercion",
      "`===` is slower",
      "`==` is used for strings, `===` for numbers",
    ],
    correct: 1,
    explanation: "`==` (loose equality) performs type coercion before comparison, while `===` (strict equality) checks both value and type without coercion.",
    difficulty: "beginner",
  },
  {
    id: 7,
    question: "What is Next.js `getServerSideProps` used for?",
    options: [
      "Client-side state management",
      "Fetch data on the server at request time for SSR",
      "Define CSS modules",
      "Configure database connections",
    ],
    correct: 1,
    explanation: "getServerSideProps runs on the server for every request, fetching data needed to render the page with up-to-date content before sending HTML to the client.",
    difficulty: "intermediate",
  },
  {
    id: 8,
    question: "What are Web Workers used for?",
    options: [
      "Making HTTP requests",
      "Running JavaScript in background threads without blocking the UI",
      "Styling web pages",
      "Managing browser cookies",
    ],
    correct: 1,
    explanation: "Web Workers run scripts in background threads, allowing CPU-intensive tasks to execute without blocking the main UI thread, keeping the interface responsive.",
    difficulty: "advanced",
  },
  {
    id: 9,
    question: "What is tree shaking?",
    options: [
      "A gardening metaphor for code cleanup",
      "Eliminating unused code from the final bundle during build",
      "A CSS animation technique",
      "A testing methodology",
    ],
    correct: 1,
    explanation: "Tree shaking is a dead-code elimination technique used by bundlers (like Webpack, Rollup) to remove unused exports from the final JavaScript bundle, reducing file size.",
    difficulty: "advanced",
  },
  {
    id: 10,
    question: "What is hydration in Next.js?",
    options: [
      "Adding water to servers",
      "Attaching event listeners to server-rendered HTML on the client",
      "Fetching data from APIs",
      "Compressing HTML output",
    ],
    correct: 1,
    explanation: "Hydration is the process where React takes over the server-rendered HTML on the client side, attaching event listeners and making the page interactive.",
    difficulty: "advanced",
  },
];

const dataStructuresQuestions: Question[] = [
  {
    id: 1,
    question: "What is the time complexity of searching in a balanced BST?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
    correct: 1,
    explanation: "A balanced Binary Search Tree has O(log n) search time because each comparison eliminates half the remaining nodes.",
    difficulty: "beginner",
  },
  {
    id: 2,
    question: "What is a hash collision?",
    options: [
      "When the hash table runs out of space",
      "When two different keys produce the same hash value",
      "When the hash function is too slow",
      "When data is corrupted",
    ],
    correct: 1,
    explanation: "A hash collision occurs when two different keys produce the same hash value, requiring collision resolution strategies like chaining or open addressing.",
    difficulty: "intermediate",
  },
  {
    id: 3,
    question: "Which sorting algorithm has the best worst-case time complexity?",
    options: ["Quick Sort", "Merge Sort", "Bubble Sort", "Selection Sort"],
    correct: 1,
    explanation: "Merge Sort guarantees O(n log n) worst-case time complexity, while Quick Sort can degrade to O(n²) in the worst case.",
    difficulty: "beginner",
  },
  {
    id: 4,
    question: "What data structure is best for BFS (Breadth-First Search)?",
    options: ["Stack", "Queue", "Heap", "Array"],
    correct: 1,
    explanation: "BFS uses a Queue (FIFO) to explore vertices level by level, processing all neighbors of the current node before moving to the next level.",
    difficulty: "beginner",
  },
  {
    id: 5,
    question: "What is dynamic programming?",
    options: [
      "Real-time programming",
      "Solving problems by breaking them into overlapping subproblems and caching results",
      "Programming with dynamic variables",
      "Allocating memory dynamically",
    ],
    correct: 1,
    explanation: "Dynamic programming solves complex problems by breaking them into simpler overlapping subproblems, storing results (memoization/tabulation) to avoid redundant computation.",
    difficulty: "intermediate",
  },
  {
    id: 6,
    question: "What is the space complexity of recursive fibonacci without memoization?",
    options: ["O(1)", "O(n)", "O(n²)", "O(2^n)"],
    correct: 1,
    explanation: "Each recursive call adds a frame to the call stack, and the maximum depth is n, giving O(n) space complexity despite O(2^n) time complexity.",
    difficulty: "intermediate",
  },
  {
    id: 7,
    question: "What is an AVL tree?",
    options: [
      "A type of hash table",
      "A self-balancing binary search tree where height difference between subtrees is at most 1",
      "A graph traversal algorithm",
      "A minimum spanning tree",
    ],
    correct: 1,
    explanation: "An AVL tree is a self-balancing BST that maintains a balance factor (height difference between left and right subtrees) of at most 1 for every node.",
    difficulty: "advanced",
  },
  {
    id: 8,
    question: "What is amortized analysis?",
    options: [
      "Average cost analysis over time",
      "Worst-case analysis per operation averaged over a sequence of operations",
      "Best-case analysis",
      "Space complexity analysis",
    ],
    correct: 1,
    explanation: "Amortized analysis determines the average time per operation over a worst-case sequence of operations, even if individual operations may be expensive occasionally.",
    difficulty: "advanced",
  },
  {
    id: 9,
    question: "What is a trie (prefix tree) best used for?",
    options: [
      "Sorting numbers",
      "Efficient string prefix matching and autocomplete",
      "Graph shortest path",
      "Matrix multiplication",
    ],
    correct: 1,
    explanation: "A trie is a tree-like data structure optimized for retrieving keys in a dataset of strings, making it ideal for autocomplete, spell checking, and prefix matching.",
    difficulty: "intermediate",
  },
  {
    id: 10,
    question: "What is the difference between a min-heap and a max-heap?",
    options: [
      "No difference",
      "Min-heap: root is smallest; Max-heap: root is largest",
      "Min-heap is faster",
      "Max-heap uses less memory",
    ],
    correct: 1,
    explanation: "In a min-heap, the root element is the minimum and every parent is smaller than its children. In a max-heap, the root is the maximum with parents larger than children.",
    difficulty: "beginner",
  },
];

// ============================================================
// UTILITY: Load/Save progress from localStorage
// ============================================================

function loadProgress(): Record<string, { bestScore: number; attempts: number; history: TestResult[] }> {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem("ss_lab_progress");
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress: Record<string, { bestScore: number; attempts: number; history: TestResult[] }>) {
  if (typeof window === "undefined") return;
  localStorage.setItem("ss_lab_progress", JSON.stringify(progress));
}

// ============================================================
// MAIN LAB DASHBOARD COMPONENT
// ============================================================

export default function LabDashboard() {
  const { user } = useAuth();

  // State
  const [progress, setProgress] = useState<Record<string, { bestScore: number; attempts: number; history: TestResult[] }>>(loadProgress);
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [lastResult, setLastResult] = useState<TestResult | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");
  const [leaderboardView, setLeaderboardView] = useState(false);

  // Build categories
  const categories: TestCategory[] = [
    {
      id: "python",
      name: "Python Mastery",
      icon: Code,
      color: "text-yellow-400",
      gradient: "from-yellow-600 to-orange-600",
      description: "Core Python concepts, OOP, generators, decorators and advanced patterns",
      questions: pythonQuestions,
      bestScore: progress["python"]?.bestScore || 0,
      attempts: progress["python"]?.attempts || 0,
      unlocked: true,
    },
    {
      id: "ml-ai",
      name: "AI & Machine Learning",
      icon: Brain,
      color: "text-purple-400",
      gradient: "from-purple-600 to-pink-600",
      description: "Neural networks, transformers, training techniques and ML fundamentals",
      questions: mlAiQuestions,
      bestScore: progress["ml-ai"]?.bestScore || 0,
      attempts: progress["ml-ai"]?.attempts || 0,
      unlocked: true,
    },
    {
      id: "system-design",
      name: "System Design",
      icon: Database,
      color: "text-blue-400",
      gradient: "from-blue-600 to-cyan-600",
      description: "Scalability, distributed systems, CAP theorem and architecture patterns",
      questions: systemDesignQuestions,
      bestScore: progress["system-design"]?.bestScore || 0,
      attempts: progress["system-design"]?.attempts || 0,
      unlocked: true,
    },
    {
      id: "cloud-devops",
      name: "Cloud & DevOps",
      icon: Cloud,
      color: "text-cyan-400",
      gradient: "from-cyan-600 to-teal-600",
      description: "Docker, Kubernetes, CI/CD, IaC and cloud-native practices",
      questions: cloudDevOpsQuestions,
      bestScore: progress["cloud-devops"]?.bestScore || 0,
      attempts: progress["cloud-devops"]?.attempts || 0,
      unlocked: true,
    },
    {
      id: "web-dev",
      name: "Web Development",
      icon: Code,
      color: "text-green-400",
      gradient: "from-green-600 to-emerald-600",
      description: "React, Next.js, JavaScript internals, SSR, and modern web patterns",
      questions: webDevQuestions,
      bestScore: progress["web-dev"]?.bestScore || 0,
      attempts: progress["web-dev"]?.attempts || 0,
      unlocked: true,
    },
    {
      id: "dsa",
      name: "Data Structures & Algorithms",
      icon: Shield,
      color: "text-red-400",
      gradient: "from-red-600 to-rose-600",
      description: "Trees, graphs, sorting, dynamic programming and complexity analysis",
      questions: dataStructuresQuestions,
      bestScore: progress["dsa"]?.bestScore || 0,
      attempts: progress["dsa"]?.attempts || 0,
      unlocked: true,
    },
  ];

  const activeCategory = categories.find((c) => c.id === activeTestId);

  // Compute aggregate stats
  const totalAttempts = categories.reduce((sum, c) => sum + c.attempts, 0);
  const totalTests = categories.length;
  const completedTests = categories.filter((c) => c.attempts > 0).length;
  const avgScore = completedTests > 0
    ? Math.round(categories.filter((c) => c.attempts > 0).reduce((s, c) => s + c.bestScore, 0) / completedTests)
    : 0;

  // Radar data for performance overview
  const performanceRadar = categories.map((c) => ({
    subject: c.name.split(" ")[0],
    score: c.bestScore,
    fullMark: 100,
  }));

  // Handle test completion
  const handleTestComplete = (result: TestResult) => {
    const newProgress = { ...progress };
    const existing = newProgress[result.categoryId] || { bestScore: 0, attempts: 0, history: [] };
    existing.attempts += 1;
    if (result.percentage > existing.bestScore) {
      existing.bestScore = result.percentage;
    }
    existing.history = [...(existing.history || []), result].slice(-10); // keep last 10
    newProgress[result.categoryId] = existing;
    setProgress(newProgress);
    saveProgress(newProgress);
    setLastResult(result);
    setShowResults(true);
  };

  // Bar chart data for scores
  const scoreBarData = categories.map((c) => ({
    name: c.name.split(" ")[0],
    score: c.bestScore,
    color: c.bestScore >= 80 ? "#22c55e" : c.bestScore >= 50 ? "#6366f1" : c.bestScore > 0 ? "#f59e0b" : "#333",
  }));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 mb-20 px-6">
      <AnimatePresence>
        {/* Test Engine */}
        {activeTestId && activeCategory && !showResults && (
          <TestEngine
            category={activeCategory}
            difficulty={selectedDifficulty}
            onComplete={handleTestComplete}
            onExit={() => setActiveTestId(null)}
          />
        )}

        {/* Results Screen */}
        {showResults && lastResult && (
          <ResultsScreen
            result={lastResult}
            category={categories.find((c) => c.id === lastResult.categoryId)!}
            onRetry={() => {
              setShowResults(false);
              // keep activeTestId so test restarts
            }}
            onBack={() => {
              setShowResults(false);
              setActiveTestId(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Main Dashboard — only show when no test is active */}
      {!activeTestId && !showResults && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-[10px] uppercase font-bold text-emerald-400 tracking-widest flex items-center gap-1.5">
                  <FlaskConical size={12} /> Skill Lab: ACTIVE
                </div>
                <div className="px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-[10px] uppercase font-bold text-indigo-400 tracking-widest flex items-center gap-1.5">
                  <Flame size={12} /> {totalAttempts} Total Attempts
                </div>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl font-black tracking-tighter"
              >
                Skill <span className="text-emerald-500">Laboratory</span>
              </motion.h1>
              <p className="text-gray-500 mt-2 font-medium italic text-lg">
                MATLAB-style micro-assessments • Validate & Sharpen your competencies in real-time
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex gap-2 bg-white/5 rounded-2xl p-1.5">
                {(["all", "beginner", "intermediate", "advanced"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDifficulty(d)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all relative ${
                      selectedDifficulty === d ? "text-white" : "text-gray-500 hover:text-white"
                    }`}
                  >
                    {selectedDifficulty === d && (
                      <motion.div
                        layoutId="diff-pill"
                        className="absolute inset-0 bg-emerald-600/30 rounded-xl border border-emerald-500/30"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">{d}</span>
                  </button>
                ))}
              </div>
            </div>
          </header>

          {/* Overview Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Tests Available", value: totalTests.toString(), icon: BookOpen, color: "text-blue-400", sub: "Skill Categories" },
              { label: "Tests Completed", value: `${completedTests}/${totalTests}`, icon: CheckCircle2, color: "text-green-400", sub: "Categories Attempted" },
              { label: "Total Attempts", value: totalAttempts.toString(), icon: Flame, color: "text-orange-400", sub: "All-time Sessions" },
              { label: "Average Best Score", value: `${avgScore}%`, icon: Trophy, color: "text-yellow-400", sub: "Across All Labs" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass p-7 rounded-[32px] flex items-center gap-5 group hover:border-emerald-500/30 transition-all bg-white/[0.02]"
              >
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform shadow-inner border border-white/5`}>
                  <stat.icon size={28} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-2xl font-black">{stat.value}</p>
                  <p className="text-[10px] text-gray-600">{stat.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Performance Radar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1 glass p-8 rounded-[40px]"
            >
              <h2 className="text-xl font-black mb-2 flex items-center gap-2">
                <Target className="text-emerald-400" size={20} /> Performance Map
              </h2>
              <p className="text-gray-500 text-xs mb-6">Your best scores across all categories</p>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={performanceRadar}>
                    <PolarGrid stroke="#222" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#666", fontSize: 10, fontWeight: "bold" }} />
                    <Radar name="Score" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.4} animationDuration={1000} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#050505", border: "1px solid #333", borderRadius: "16px", padding: "12px" }}
                      formatter={(value: any) => [`${value}%`, "Best Score"]}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Score Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 glass p-8 rounded-[40px]"
            >
              <h2 className="text-xl font-black mb-2 flex items-center gap-2">
                <BarChart3 className="text-indigo-400" size={20} /> Score Breakdown
              </h2>
              <p className="text-gray-500 text-xs mb-6">Best score per category — aim for 80%+ to master</p>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreBarData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                    <XAxis dataKey="name" tick={{ fill: "#666", fontSize: 11, fontWeight: "bold" }} />
                    <YAxis tick={{ fill: "#555", fontSize: 10 }} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#050505", border: "1px solid #333", borderRadius: "16px", padding: "12px" }}
                      formatter={(value: any) => [`${value}%`, "Best Score"]}
                    />
                    <Bar dataKey="score" radius={[8, 8, 0, 0]} animationDuration={1000}>
                      {scoreBarData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Test Categories Grid */}
          <div>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <GraduationCap className="text-emerald-400" /> Available Labs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, i) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass p-7 rounded-[32px] group hover:border-emerald-500/30 transition-all cursor-pointer relative overflow-hidden"
                  onClick={() => {
                    if (category.unlocked) {
                      setShowResults(false);
                      setActiveTestId(category.id);
                    }
                  }}
                >
                  {/* Decorative glow */}
                  <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${category.gradient} opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity`} />

                  <div className="relative z-10 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <category.icon size={24} className="text-white" />
                      </div>
                      <div className="flex items-center gap-2">
                        {category.attempts > 0 && (
                          <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            category.bestScore >= 80
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : category.bestScore >= 50
                                ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}>
                            Best: {category.bestScore}%
                          </div>
                        )}
                        {!category.unlocked ? (
                          <Lock size={16} className="text-gray-600" />
                        ) : (
                          <Unlock size={16} className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div>
                      <h3 className="font-black text-lg mb-1">{category.name}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{category.description}</p>
                    </div>

                    {/* Meta Row */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div className="flex items-center gap-4 text-[11px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <Lightbulb size={12} /> {category.questions.length} Questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame size={12} /> {category.attempts} Attempts
                        </span>
                      </div>
                      <div className={`px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r ${category.gradient} text-white opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1`}>
                        Start <Play size={12} />
                      </div>
                    </div>

                    {/* Progress bar */}
                    {category.attempts > 0 && (
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${category.bestScore}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className={`h-full rounded-full ${
                            category.bestScore >= 80
                              ? "bg-green-500"
                              : category.bestScore >= 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="glass p-12 rounded-[56px] bg-gradient-to-br from-emerald-600/15 via-transparent to-teal-600/5 border-emerald-500/20 relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-2xl shadow-emerald-500/20 shrink-0">
                  <Lightbulb size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black">How the Skill Lab Works</h2>
                  <p className="text-gray-400 text-sm">MATLAB-style assessments designed for maximum learning efficiency</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { step: "01", title: "Pick a Category", desc: "Choose from 6 skill domains covering Python, AI/ML, System Design, Cloud, Web Dev & DSA" },
                  { step: "02", title: "Take the Lab Test", desc: "Answer 10 timed MCQ questions with difficulty filtering — 30 seconds per question" },
                  { step: "03", title: "Get Instant Feedback", desc: "See your score, correct answers with explanations, and performance breakdown" },
                  { step: "04", title: "Track Progress", desc: "Your scores update the radar chart and bar graphs. Aim for 80%+ mastery in all labs" },
                ].map((s, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/5 group hover:border-emerald-500/20 transition-all">
                    <p className="text-4xl font-black text-emerald-500/40 mb-2">{s.step}</p>
                    <h3 className="font-bold text-sm mb-1">{s.title}</h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 blur-[120px] rounded-full" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

// ============================================================
// TEST ENGINE COMPONENT
// ============================================================

function TestEngine({
  category,
  difficulty,
  onComplete,
  onExit,
}: {
  category: TestCategory;
  difficulty: "all" | "beginner" | "intermediate" | "advanced";
  onComplete: (result: TestResult) => void;
  onExit: () => void;
}) {
  const filteredQuestions =
    difficulty === "all"
      ? category.questions
      : category.questions.filter((q) => q.difficulty === difficulty);

  const questions = filteredQuestions.length > 0 ? filteredQuestions : category.questions;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answers, setAnswers] = useState<{ questionId: number; selected: number; correct: number; isCorrect: boolean }[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [totalTime, setTotalTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentIndex];

  // Timer
  useEffect(() => {
    if (isAnswered) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up — auto-submit wrong answer
          handleAnswer(-1);
          return 30;
        }
        return prev - 1;
      });
      setTotalTime((prev) => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isAnswered]);

  const handleAnswer = useCallback(
    (optionIndex: number) => {
      if (isAnswered) return;
      setIsAnswered(true);
      setSelectedOption(optionIndex);
      if (timerRef.current) clearInterval(timerRef.current);

      const isCorrect = optionIndex === currentQuestion.correct;
      setAnswers((prev) => [
        ...prev,
        {
          questionId: currentQuestion.id,
          selected: optionIndex,
          correct: currentQuestion.correct,
          isCorrect,
        },
      ]);
    },
    [isAnswered, currentQuestion]
  );

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(30);
    } else {
      // Test complete
      const correctCount = [...answers].filter((a) => a.isCorrect).length;
      const result: TestResult = {
        categoryId: category.id,
        score: correctCount,
        total: questions.length,
        percentage: Math.round((correctCount / questions.length) * 100),
        timeTaken: totalTime,
        date: new Date().toISOString(),
        answers: [...answers],
      };
      onComplete(result);
    }
  };

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  const correctSoFar = answers.filter((a) => a.isCorrect).length;

  const difficultyColors: Record<string, string> = {
    beginner: "text-green-400 bg-green-500/10 border-green-500/20",
    intermediate: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    advanced: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  return (
    <motion.div
      key="test-engine"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-[#050505]/98 backdrop-blur-2xl z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="w-full max-w-3xl space-y-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center`}>
              <category.icon size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-black text-lg">{category.name}</h2>
              <p className="text-xs text-gray-500">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 size={14} className="text-green-400" />
              <span className="text-green-400 font-bold">{correctSoFar}</span>
              <span className="text-gray-600">/</span>
              <span className="text-gray-400">{currentIndex + (isAnswered ? 1 : 0)}</span>
            </div>
            <button
              onClick={onExit}
              className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${progressPercent}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Timer */}
        <div className="flex items-center justify-between">
          <div className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${difficultyColors[currentQuestion.difficulty]}`}>
            {currentQuestion.difficulty}
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${
            timeLeft <= 10 ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-white/5 text-gray-300 border border-white/5"
          } ${timeLeft <= 5 ? "animate-pulse" : ""}`}>
            <Timer size={16} />
            {timeLeft}s
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="glass p-10 rounded-[40px] space-y-8"
          >
            <h3 className="text-xl font-black leading-relaxed">{currentQuestion.question}</h3>

            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                let optionStyle = "bg-white/[0.03] border-white/5 hover:bg-white/[0.08] hover:border-white/10";
                if (isAnswered) {
                  if (idx === currentQuestion.correct) {
                    optionStyle = "bg-green-500/10 border-green-500/30 text-green-300";
                  } else if (idx === selectedOption && idx !== currentQuestion.correct) {
                    optionStyle = "bg-red-500/10 border-red-500/30 text-red-300";
                  } else {
                    optionStyle = "bg-white/[0.02] border-white/5 opacity-40";
                  }
                } else if (selectedOption === idx) {
                  optionStyle = "bg-indigo-500/15 border-indigo-500/30 text-white";
                }

                return (
                  <motion.button
                    key={idx}
                    whileHover={!isAnswered ? { scale: 1.01 } : {}}
                    whileTap={!isAnswered ? { scale: 0.99 } : {}}
                    onClick={() => !isAnswered && handleAnswer(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center gap-4 ${optionStyle}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                      isAnswered && idx === currentQuestion.correct
                        ? "bg-green-500 text-white"
                        : isAnswered && idx === selectedOption
                          ? "bg-red-500 text-white"
                          : "bg-white/10 text-gray-400"
                    }`}>
                      {isAnswered && idx === currentQuestion.correct ? (
                        <CheckCircle2 size={16} />
                      ) : isAnswered && idx === selectedOption && idx !== currentQuestion.correct ? (
                        <XCircle size={16} />
                      ) : (
                        String.fromCharCode(65 + idx)
                      )}
                    </div>
                    <span className="text-sm font-medium">{option}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-white/5 pt-6"
                >
                  <div className="flex items-start gap-3 bg-indigo-500/5 rounded-2xl p-5 border border-indigo-500/10">
                    <Lightbulb size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Explanation</p>
                      <p className="text-sm text-gray-300 leading-relaxed">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Next / Submit Button */}
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end"
          >
            <button
              onClick={handleNext}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-600/30 flex items-center gap-2 group"
            >
              {currentIndex < questions.length - 1 ? (
                <>
                  Next Question <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              ) : (
                <>
                  View Results <Trophy size={18} className="group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================
// RESULTS SCREEN COMPONENT
// ============================================================

function ResultsScreen({
  result,
  category,
  onRetry,
  onBack,
}: {
  result: TestResult;
  category: TestCategory;
  onRetry: () => void;
  onBack: () => void;
}) {
  const scoreColor =
    result.percentage >= 80 ? "text-green-400" : result.percentage >= 50 ? "text-yellow-400" : "text-red-400";
  const scoreLabel =
    result.percentage >= 90
      ? "Outstanding!"
      : result.percentage >= 80
        ? "Excellent!"
        : result.percentage >= 60
          ? "Good Effort!"
          : result.percentage >= 40
            ? "Keep Practicing!"
            : "Needs Improvement";

  const correctCount = result.answers.filter((a) => a.isCorrect).length;
  const wrongCount = result.answers.filter((a) => !a.isCorrect).length;

  const pieData = [
    { name: "Correct", value: correctCount, fill: "#22c55e" },
    { name: "Wrong", value: wrongCount, fill: "#ef4444" },
  ];

  // Difficulty breakdown
  const diffBreakdown = ["beginner", "intermediate", "advanced"].map((d) => {
    const qs = category.questions.filter((q) => q.difficulty === d);
    const answered = result.answers.filter((a) => qs.some((q) => q.id === a.questionId));
    const correct = answered.filter((a) => a.isCorrect).length;
    return { difficulty: d, total: answered.length, correct, percentage: answered.length > 0 ? Math.round((correct / answered.length) * 100) : 0 };
  });

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-[#050505]/98 backdrop-blur-2xl z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="w-full max-w-3xl space-y-8 my-8">
        {/* Score Hero */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.3 }}
          className="glass p-12 rounded-[48px] text-center relative overflow-hidden"
        >
          <div className={`absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-[80px] ${
            result.percentage >= 80 ? "bg-green-500/30" : result.percentage >= 50 ? "bg-yellow-500/30" : "bg-red-500/30"
          }`} />
          <div className="relative z-10">
            <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
              result.percentage >= 80 ? "bg-green-500/20" : result.percentage >= 50 ? "bg-yellow-500/20" : "bg-red-500/20"
            }`}>
              {result.percentage >= 80 ? (
                <Trophy size={40} className="text-green-400" />
              ) : result.percentage >= 50 ? (
                <Star size={40} className="text-yellow-400" />
              ) : (
                <RotateCcw size={40} className="text-red-400" />
              )}
            </div>
            <h2 className={`text-6xl font-black ${scoreColor}`}>{result.percentage}%</h2>
            <p className="text-2xl font-bold mt-2">{scoreLabel}</p>
            <p className="text-gray-500 mt-2 text-sm">
              {result.score}/{result.total} correct • {Math.round(result.timeTaken)}s total time • {category.name}
            </p>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass p-6 rounded-[28px] text-center">
            <div className="h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={45}
                    dataKey="value"
                    animationDuration={800}
                    strokeWidth={0}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 font-bold mt-1">Accuracy Split</p>
          </div>
          <div className="glass p-6 rounded-[28px] text-center flex flex-col justify-center">
            <Clock size={24} className="text-indigo-400 mx-auto mb-2" />
            <p className="text-2xl font-black">{Math.round(result.timeTaken)}s</p>
            <p className="text-xs text-gray-500 font-bold mt-1">Time Taken</p>
          </div>
          <div className="glass p-6 rounded-[28px] text-center flex flex-col justify-center">
            <Zap size={24} className="text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-black">{result.total > 0 ? (result.timeTaken / result.total).toFixed(1) : 0}s</p>
            <p className="text-xs text-gray-500 font-bold mt-1">Avg per Question</p>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="glass p-8 rounded-[36px]">
          <h3 className="text-lg font-black mb-6 flex items-center gap-2">
            <TrendingUp className="text-emerald-400" size={20} /> Difficulty Breakdown
          </h3>
          <div className="space-y-4">
            {diffBreakdown.filter((d) => d.total > 0).map((d) => (
              <div key={d.difficulty} className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest w-28 text-center ${
                  d.difficulty === "beginner" ? "text-green-400 bg-green-500/10 border-green-500/20" :
                  d.difficulty === "intermediate" ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" :
                  "text-red-400 bg-red-500/10 border-red-500/20"
                }`}>
                  {d.difficulty}
                </div>
                <div className="flex-grow h-3 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${d.percentage}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-full rounded-full ${
                      d.percentage >= 80 ? "bg-green-500" : d.percentage >= 50 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                  />
                </div>
                <span className="text-sm font-bold w-16 text-right">{d.correct}/{d.total}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onRetry}
            className="px-8 py-4 glass hover:bg-white/10 rounded-2xl font-bold transition-all text-sm border border-white/5 flex items-center gap-2"
          >
            <RotateCcw size={16} /> Retry Test
          </button>
          <button
            onClick={onBack}
            className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-600/30 flex items-center gap-2"
          >
            Back to Lab <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
