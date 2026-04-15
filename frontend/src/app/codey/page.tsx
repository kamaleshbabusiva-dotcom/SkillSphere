"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
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
  Code2,
  Play,
  CheckCircle2,
  XCircle,
  Trophy,
  Zap,
  ArrowRight,
  RotateCcw,
  Star,
  Brain,
  Terminal,
  FileCode,
  Flame,
  BarChart3,
  GraduationCap,
  Lightbulb,
  Clock,
  X,
  ChevronRight,
  Sparkles,
  Bug,
  Cpu,
  Hash,
  Braces,
  ListOrdered,
  Timer,
  Award,
  TrendingUp,
  AlertTriangle,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// ============================================================
// TYPE DEFINITIONS
// ============================================================

interface TestCase {
  input: string;
  expected: string;
  description: string;
}

interface CodingChallenge {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  starterCode: string;
  solution: string;
  testCases: TestCase[];
  hints: string[];
  timeLimit: number; // seconds
  xpReward: number;
}

interface ChallengeResult {
  challengeId: string;
  passed: boolean;
  passedTests: number;
  totalTests: number;
  timeTaken: number;
  code: string;
  date: string;
}

interface TestCaseResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  description: string;
  error?: string;
}

// ============================================================
// CHALLENGE BANK
// ============================================================

const challenges: CodingChallenge[] = [
  // --- EASY ---
  {
    id: "reverse-string",
    title: "Reverse a String",
    difficulty: "easy",
    category: "Strings",
    description: "Write a function `reverseString(str)` that takes a string and returns it reversed.\n\nDo not use the built-in `.reverse()` method on arrays.",
    examples: [
      { input: '"hello"', output: '"olleh"' },
      { input: '"JavaScript"', output: '"tpircSavaJ"' },
      { input: '""', output: '""', explanation: "Empty string returns empty" },
    ],
    starterCode: `function reverseString(str) {\n  // Write your code here\n  \n}`,
    solution: `function reverseString(str) {\n  let result = "";\n  for (let i = str.length - 1; i >= 0; i--) {\n    result += str[i];\n  }\n  return result;\n}`,
    testCases: [
      { input: '"hello"', expected: '"olleh"', description: "Basic word" },
      { input: '"JavaScript"', expected: '"tpircSavaJ"', description: "Mixed case" },
      { input: '""', expected: '""', description: "Empty string" },
      { input: '"a"', expected: '"a"', description: "Single character" },
      { input: '"racecar"', expected: '"racecar"', description: "Palindrome" },
    ],
    hints: ["Try iterating from the end of the string to the beginning", "Build a new string character by character"],
    timeLimit: 300,
    xpReward: 50,
  },
  {
    id: "fizzbuzz",
    title: "FizzBuzz",
    difficulty: "easy",
    category: "Logic",
    description: "Write a function `fizzBuzz(n)` that returns an array of strings from 1 to n where:\n\n- Multiples of 3 → `\"Fizz\"`\n- Multiples of 5 → `\"Buzz\"`\n- Multiples of both 3 and 5 → `\"FizzBuzz\"`\n- Otherwise → the number as a string",
    examples: [
      { input: "5", output: '["1","2","Fizz","4","Buzz"]' },
      { input: "15", output: '[...,"FizzBuzz"]', explanation: "15 is divisible by both 3 and 5" },
    ],
    starterCode: `function fizzBuzz(n) {\n  // Write your code here\n  \n}`,
    solution: `function fizzBuzz(n) {\n  const result = [];\n  for (let i = 1; i <= n; i++) {\n    if (i % 15 === 0) result.push("FizzBuzz");\n    else if (i % 3 === 0) result.push("Fizz");\n    else if (i % 5 === 0) result.push("Buzz");\n    else result.push(String(i));\n  }\n  return result;\n}`,
    testCases: [
      { input: "1", expected: '["1"]', description: "Single element" },
      { input: "3", expected: '["1","2","Fizz"]', description: "First Fizz" },
      { input: "5", expected: '["1","2","Fizz","4","Buzz"]', description: "First Buzz" },
      { input: "15", expected: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]', description: "First FizzBuzz" },
    ],
    hints: ["Check divisibility by 15 first (both 3 and 5)", "Use the modulo operator %"],
    timeLimit: 300,
    xpReward: 50,
  },
  {
    id: "palindrome-check",
    title: "Palindrome Checker",
    difficulty: "easy",
    category: "Strings",
    description: "Write a function `isPalindrome(str)` that checks whether a given string is a palindrome.\n\nIgnore case sensitivity. Consider only alphanumeric characters.",
    examples: [
      { input: '"racecar"', output: "true" },
      { input: '"hello"', output: "false" },
      { input: '"A man a plan a canal Panama"', output: "true", explanation: "Ignore spaces and case" },
    ],
    starterCode: `function isPalindrome(str) {\n  // Write your code here\n  \n}`,
    solution: `function isPalindrome(str) {\n  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");\n  let left = 0, right = cleaned.length - 1;\n  while (left < right) {\n    if (cleaned[left] !== cleaned[right]) return false;\n    left++;\n    right--;\n  }\n  return true;\n}`,
    testCases: [
      { input: '"racecar"', expected: "true", description: "Simple palindrome" },
      { input: '"hello"', expected: "false", description: "Not a palindrome" },
      { input: '"A man a plan a canal Panama"', expected: "true", description: "Sentence palindrome" },
      { input: '""', expected: "true", description: "Empty string" },
      { input: '"a"', expected: "true", description: "Single char" },
    ],
    hints: ["Clean the string first — lowercase and remove non-alphanumeric", "Use two pointers from both ends"],
    timeLimit: 300,
    xpReward: 50,
  },
  {
    id: "count-vowels",
    title: "Count the Vowels",
    difficulty: "easy",
    category: "Strings",
    description: "Write a function `countVowels(str)` that returns the count of vowels (a, e, i, o, u) in a string.\n\nCount both uppercase and lowercase vowels.",
    examples: [
      { input: '"hello"', output: "2" },
      { input: '"AEIOU"', output: "5" },
      { input: '"xyz"', output: "0" },
    ],
    starterCode: `function countVowels(str) {\n  // Write your code here\n  \n}`,
    solution: `function countVowels(str) {\n  let count = 0;\n  const vowels = "aeiouAEIOU";\n  for (const ch of str) {\n    if (vowels.includes(ch)) count++;\n  }\n  return count;\n}`,
    testCases: [
      { input: '"hello"', expected: "2", description: "Basic word" },
      { input: '"AEIOU"', expected: "5", description: "All uppercase vowels" },
      { input: '"xyz"', expected: "0", description: "No vowels" },
      { input: '"Programming"', expected: "3", description: "Mixed case word" },
      { input: '""', expected: "0", description: "Empty string" },
    ],
    hints: ["Create a set of vowels and check each character", "Remember to handle both cases"],
    timeLimit: 240,
    xpReward: 40,
  },

  // --- MEDIUM ---
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "medium",
    category: "Arrays",
    description: "Write a function `twoSum(nums, target)` that returns the indices of two numbers in the array that add up to the target.\n\nYou may assume there is exactly one solution, and you may not use the same element twice.\n\nReturn the indices as an array `[i, j]` where `i < j`.",
    examples: [
      { input: "[2,7,11,15], 9", output: "[0,1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9" },
      { input: "[3,2,4], 6", output: "[1,2]" },
    ],
    starterCode: `function twoSum(nums, target) {\n  // Write your code here\n  \n}`,
    solution: `function twoSum(nums, target) {\n  const map = {};\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map[complement] !== undefined) {\n      return [map[complement], i];\n    }\n    map[nums[i]] = i;\n  }\n  return [];\n}`,
    testCases: [
      { input: "[2,7,11,15], 9", expected: "[0,1]", description: "Basic case" },
      { input: "[3,2,4], 6", expected: "[1,2]", description: "Middle elements" },
      { input: "[3,3], 6", expected: "[0,1]", description: "Duplicate values" },
      { input: "[1,5,3,7], 8", expected: "[1,2]", description: "Non-adjacent" },
    ],
    hints: ["Use a hash map to store values you've seen", "For each number, check if (target - number) exists in the map"],
    timeLimit: 420,
    xpReward: 100,
  },
  {
    id: "max-subarray",
    title: "Maximum Subarray Sum",
    difficulty: "medium",
    category: "Arrays",
    description: "Write a function `maxSubarraySum(arr)` that finds the contiguous subarray with the largest sum and returns that sum.\n\nThe array will have at least one element.",
    examples: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "Subarray [4,-1,2,1] has the largest sum = 6" },
      { input: "[1]", output: "1" },
      { input: "[-1]", output: "-1" },
    ],
    starterCode: `function maxSubarraySum(arr) {\n  // Write your code here\n  \n}`,
    solution: `function maxSubarraySum(arr) {\n  let maxSoFar = arr[0];\n  let maxEndingHere = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);\n    maxSoFar = Math.max(maxSoFar, maxEndingHere);\n  }\n  return maxSoFar;\n}`,
    testCases: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", expected: "6", description: "Classic Kadane's" },
      { input: "[1]", expected: "1", description: "Single element" },
      { input: "[-1]", expected: "-1", description: "Single negative" },
      { input: "[5,4,-1,7,8]", expected: "23", description: "Mostly positive" },
      { input: "[-2,-3,-1,-5]", expected: "-1", description: "All negative" },
    ],
    hints: ["This is Kadane's Algorithm", "Track the max sum ending at current position", "If adding current element makes sum smaller than element itself, start fresh"],
    timeLimit: 420,
    xpReward: 100,
  },
  {
    id: "anagram-check",
    title: "Valid Anagram",
    difficulty: "medium",
    category: "Strings",
    description: "Write a function `isAnagram(s, t)` that determines if string `t` is an anagram of string `s`.\n\nAn anagram uses the exact same characters the exact same number of times.",
    examples: [
      { input: '"anagram", "nagaram"', output: "true" },
      { input: '"rat", "car"', output: "false" },
    ],
    starterCode: `function isAnagram(s, t) {\n  // Write your code here\n  \n}`,
    solution: `function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const count = {};\n  for (const ch of s) count[ch] = (count[ch] || 0) + 1;\n  for (const ch of t) {\n    if (!count[ch]) return false;\n    count[ch]--;\n  }\n  return true;\n}`,
    testCases: [
      { input: '"anagram", "nagaram"', expected: "true", description: "Valid anagram" },
      { input: '"rat", "car"', expected: "false", description: "Not anagram" },
      { input: '"a", "ab"', expected: "false", description: "Different lengths" },
      { input: '"listen", "silent"', expected: "true", description: "Classic anagram" },
      { input: '"", ""', expected: "true", description: "Empty strings" },
    ],
    hints: ["Count character frequencies in both strings", "A hash map makes this efficient"],
    timeLimit: 360,
    xpReward: 80,
  },
  {
    id: "flatten-array",
    title: "Flatten Nested Array",
    difficulty: "medium",
    category: "Arrays",
    description: "Write a function `flattenArray(arr)` that takes a nested array and returns a single flat array with all values.\n\nDo not use the built-in `.flat()` method.",
    examples: [
      { input: "[[1,2],[3,[4,5]]]", output: "[1,2,3,4,5]" },
      { input: "[1,[2,[3,[4]]]]", output: "[1,2,3,4]" },
    ],
    starterCode: `function flattenArray(arr) {\n  // Write your code here\n  \n}`,
    solution: `function flattenArray(arr) {\n  const result = [];\n  function helper(item) {\n    if (Array.isArray(item)) {\n      for (const el of item) helper(el);\n    } else {\n      result.push(item);\n    }\n  }\n  helper(arr);\n  return result;\n}`,
    testCases: [
      { input: "[[1,2],[3,[4,5]]]", expected: "[1,2,3,4,5]", description: "Two levels deep" },
      { input: "[1,[2,[3,[4]]]]", expected: "[1,2,3,4]", description: "Deeply nested" },
      { input: "[1,2,3]", expected: "[1,2,3]", description: "Already flat" },
      { input: "[[[[1]]]]", expected: "[1]", description: "Very deep single value" },
    ],
    hints: ["Use recursion — if element is an array, recurse", "Check Array.isArray() for each element"],
    timeLimit: 360,
    xpReward: 90,
  },

  // --- HARD ---
  {
    id: "debounce",
    title: "Implement Debounce",
    difficulty: "hard",
    category: "Functional",
    description: "Write a function `debounce(fn, delay)` that returns a debounced version of `fn`.\n\nThe debounced function should only execute `fn` after `delay` milliseconds have passed since the last invocation.\n\nFor this challenge, the test will check the logic pattern. Return a function that:\n- Stores the latest arguments\n- Clears any pending timeout\n- Sets a new timeout",
    examples: [
      { input: "fn, 300", output: "A debounced function", explanation: "Calls fn only after 300ms of inactivity" },
    ],
    starterCode: `function debounce(fn, delay) {\n  // Write your code here\n  // Return a new function that delays calling fn\n  \n}`,
    solution: `function debounce(fn, delay) {\n  let timeoutId = null;\n  return function(...args) {\n    if (timeoutId) clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => fn.apply(this, args), delay);\n  };\n}`,
    testCases: [
      { input: '"debounce-check"', expected: "function", description: "Returns a function" },
    ],
    hints: ["Use clearTimeout and setTimeout", "Store timeoutId in a closure variable", "Use ...args to forward arguments"],
    timeLimit: 600,
    xpReward: 150,
  },
  {
    id: "deep-clone",
    title: "Deep Clone Object",
    difficulty: "hard",
    category: "Objects",
    description: "Write a function `deepClone(obj)` that creates a deep copy of a JavaScript object.\n\nHandle nested objects and arrays. You do NOT need to handle Date, RegExp, or functions.",
    examples: [
      { input: '{ a: 1, b: { c: 2 } }', output: '{ a: 1, b: { c: 2 } }', explanation: "Nested object is a new reference" },
    ],
    starterCode: `function deepClone(obj) {\n  // Write your code here\n  \n}`,
    solution: `function deepClone(obj) {\n  if (obj === null || typeof obj !== "object") return obj;\n  if (Array.isArray(obj)) return obj.map(item => deepClone(item));\n  const cloned = {};\n  for (const key in obj) {\n    if (obj.hasOwnProperty(key)) {\n      cloned[key] = deepClone(obj[key]);\n    }\n  }\n  return cloned;\n}`,
    testCases: [
      { input: '{"a":1,"b":{"c":2}}', expected: '{"a":1,"b":{"c":2}}', description: "Nested object" },
      { input: '[1,[2,3]]', expected: '[1,[2,3]]', description: "Nested array" },
      { input: '{"x":[1,{"y":2}]}', expected: '{"x":[1,{"y":2}]}', description: "Mixed nesting" },
      { input: "null", expected: "null", description: "Null value" },
      { input: "42", expected: "42", description: "Primitive" },
    ],
    hints: ["Use recursion for nested structures", "Check typeof and Array.isArray", "Handle null as a special case since typeof null === 'object'"],
    timeLimit: 480,
    xpReward: 130,
  },
  {
    id: "group-anagrams",
    title: "Group Anagrams",
    difficulty: "hard",
    category: "Strings",
    description: "Write a function `groupAnagrams(strs)` that groups anagrams together from an array of strings.\n\nReturn an array of arrays where each inner array contains strings that are anagrams of each other. Order within groups and order of groups does not matter.",
    examples: [
      { input: '["eat","tea","tan","ate","nat","bat"]', output: '[["eat","tea","ate"],["tan","nat"],["bat"]]' },
    ],
    starterCode: `function groupAnagrams(strs) {\n  // Write your code here\n  \n}`,
    solution: `function groupAnagrams(strs) {\n  const map = {};\n  for (const s of strs) {\n    const key = s.split("").sort().join("");\n    if (!map[key]) map[key] = [];\n    map[key].push(s);\n  }\n  return Object.values(map);\n}`,
    testCases: [
      { input: '["eat","tea","tan","ate","nat","bat"]', expected: '[["eat","tea","ate"],["tan","nat"],["bat"]]', description: "Mixed anagram groups" },
      { input: '[""]', expected: '[[""]]', description: "Single empty string" },
      { input: '["a"]', expected: '[["a"]]', description: "Single char" },
    ],
    hints: ["Sort each string's characters to create a key", "Use a hash map with sorted-string keys", "Group strings with the same sorted key"],
    timeLimit: 600,
    xpReward: 150,
  },
  {
    id: "memoize",
    title: "Implement Memoize",
    difficulty: "hard",
    category: "Functional",
    description: "Write a function `memoize(fn)` that returns a memoized version of `fn`.\n\nThe memoized function should cache results based on the arguments. For simplicity, assume all arguments are primitives and use `JSON.stringify(args)` as the cache key.",
    examples: [
      { input: "expensiveFn", output: "A memoized function", explanation: "Subsequent calls with same args return cached result" },
    ],
    starterCode: `function memoize(fn) {\n  // Write your code here\n  // Return a new function that caches results\n  \n}`,
    solution: `function memoize(fn) {\n  const cache = {};\n  return function(...args) {\n    const key = JSON.stringify(args);\n    if (key in cache) return cache[key];\n    const result = fn.apply(this, args);\n    cache[key] = result;\n    return result;\n  };\n}`,
    testCases: [
      { input: '"memoize-check"', expected: "function", description: "Returns a function" },
    ],
    hints: ["Use a cache object in a closure", "JSON.stringify(args) makes a good cache key", "Check cache before calling original function"],
    timeLimit: 480,
    xpReward: 140,
  },
];

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function loadCodeyProgress(): Record<string, { bestResult: ChallengeResult | null; attempts: number; solved: boolean }> {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem("ss_codey_progress");
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveCodeyProgress(progress: Record<string, { bestResult: ChallengeResult | null; attempts: number; solved: boolean }>) {
  if (typeof window === "undefined") return;
  localStorage.setItem("ss_codey_progress", JSON.stringify(progress));
}

// Safe code executor
function executeCode(userCode: string, challenge: CodingChallenge): TestCaseResult[] {
  const results: TestCaseResult[] = [];
  const fnName = challenge.starterCode.match(/function\s+(\w+)/)?.[1] || "solution";

  for (const tc of challenge.testCases) {
    try {
      // Special handling for debounce/memoize (returns function)
      if (challenge.id === "debounce") {
        // Check if user code returns a function
        const testFn = new Function(`
          ${userCode}
          const dummyFn = () => {};
          const result = typeof ${fnName}(dummyFn, 100);
          return result;
        `);
        const resultType = testFn();
        results.push({
          input: tc.input,
          expected: tc.expected,
          actual: resultType,
          passed: resultType === tc.expected,
          description: tc.description,
        });
        continue;
      }

      if (challenge.id === "memoize") {
        const testFn = new Function(`
          ${userCode}
          const dummyFn = (x) => x * 2;
          const result = typeof ${fnName}(dummyFn);
          return result;
        `);
        const resultType = testFn();
        results.push({
          input: tc.input,
          expected: tc.expected,
          actual: resultType,
          passed: resultType === tc.expected,
          description: tc.description,
        });
        continue;
      }

      // Standard execution
      const wrappedCode = `
        ${userCode}
        return JSON.stringify(${fnName}(${tc.input}));
      `;
      const fn = new Function(wrappedCode);
      const actual = fn();
      const expected = JSON.stringify(JSON.parse(tc.expected));
      const actualNormalized = JSON.stringify(JSON.parse(actual));

      // Special handling for group-anagrams: order doesn't matter
      let passed = false;
      if (challenge.id === "group-anagrams") {
        try {
          const actualArr = JSON.parse(actual) as string[][];
          const expectedArr = JSON.parse(tc.expected) as string[][];
          const sortGroup = (groups: string[][]) =>
            groups.map((g) => [...g].sort()).sort((a, b) => a.join(",").localeCompare(b.join(",")));
          passed = JSON.stringify(sortGroup(actualArr)) === JSON.stringify(sortGroup(expectedArr));
        } catch {
          passed = false;
        }
      } else {
        passed = actualNormalized === expected;
      }

      results.push({
        input: tc.input,
        expected: tc.expected,
        actual: actual,
        passed,
        description: tc.description,
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      results.push({
        input: tc.input,
        expected: tc.expected,
        actual: "Error",
        passed: false,
        description: tc.description,
        error: errorMsg,
      });
    }
  }

  return results;
}

// ============================================================
// MAIN CODEY DASHBOARD
// ============================================================

export default function CodeyDashboard() {
  const { user } = useAuth();

  const [progress, setProgress] = useState<Record<string, { bestResult: ChallengeResult | null; attempts: number; solved: boolean }>>(loadCodeyProgress);
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<"all" | "easy" | "medium" | "hard">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const activeChallenge = challenges.find((c) => c.id === activeChallengeId);

  // Filtered challenges
  const filteredChallenges = challenges.filter((c) => {
    if (difficultyFilter !== "all" && c.difficulty !== difficultyFilter) return false;
    if (categoryFilter !== "all" && c.category !== categoryFilter) return false;
    return true;
  });

  const allCategories = [...new Set(challenges.map((c) => c.category))];

  // Aggregate stats
  const totalChallenges = challenges.length;
  const solvedCount = Object.values(progress).filter((p) => p.solved).length;
  const totalAttempts = Object.values(progress).reduce((s, p) => s + p.attempts, 0);
  const totalXP = challenges.reduce((xp, c) => {
    if (progress[c.id]?.solved) return xp + c.xpReward;
    return xp;
  }, 0);
  const maxXP = challenges.reduce((xp, c) => xp + c.xpReward, 0);

  // Bar data
  const difficultyStats = [
    { name: "Easy", total: challenges.filter((c) => c.difficulty === "easy").length, solved: challenges.filter((c) => c.difficulty === "easy" && progress[c.id]?.solved).length, color: "#22c55e" },
    { name: "Medium", total: challenges.filter((c) => c.difficulty === "medium").length, solved: challenges.filter((c) => c.difficulty === "medium" && progress[c.id]?.solved).length, color: "#f59e0b" },
    { name: "Hard", total: challenges.filter((c) => c.difficulty === "hard").length, solved: challenges.filter((c) => c.difficulty === "hard" && progress[c.id]?.solved).length, color: "#ef4444" },
  ];

  const handleChallengeComplete = (result: ChallengeResult) => {
    const newProgress = { ...progress };
    const existing = newProgress[result.challengeId] || { bestResult: null, attempts: 0, solved: false };
    existing.attempts += 1;
    if (result.passed) existing.solved = true;
    if (!existing.bestResult || result.passedTests > existing.bestResult.passedTests) {
      existing.bestResult = result;
    }
    newProgress[result.challengeId] = existing;
    setProgress(newProgress);
    saveCodeyProgress(newProgress);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 mb-20 px-6">
      <AnimatePresence>
        {activeChallengeId && activeChallenge && (
          <CodingArena
            challenge={activeChallenge}
            progress={progress[activeChallenge.id]}
            onComplete={handleChallengeComplete}
            onExit={() => setActiveChallengeId(null)}
          />
        )}
      </AnimatePresence>

      {!activeChallengeId && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 bg-violet-500/10 rounded-full border border-violet-500/20 text-[10px] uppercase font-bold text-violet-400 tracking-widest flex items-center gap-1.5">
                  <Terminal size={12} /> Codey Engine: LIVE
                </div>
                <div className="px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20 text-[10px] uppercase font-bold text-amber-400 tracking-widest flex items-center gap-1.5">
                  <Zap size={12} /> {totalXP} / {maxXP} XP
                </div>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl font-black tracking-tighter"
              >
                <span className="text-violet-500">Codey</span> Arena
              </motion.h1>
              <p className="text-gray-500 mt-2 font-medium italic text-lg">
                Interactive coding challenges • Write code, run tests, level up your skills
              </p>
            </div>
          </header>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Challenges", value: totalChallenges.toString(), icon: Code2, color: "text-violet-400", sub: "Available Problems", gradient: "from-violet-600/20 to-transparent" },
              { label: "Solved", value: `${solvedCount}/${totalChallenges}`, icon: CheckCircle2, color: "text-green-400", sub: "All Tests Passed", gradient: "from-green-600/20 to-transparent" },
              { label: "Attempts", value: totalAttempts.toString(), icon: Flame, color: "text-orange-400", sub: "Total Submissions", gradient: "from-orange-600/20 to-transparent" },
              { label: "XP Earned", value: totalXP.toString(), icon: Trophy, color: "text-amber-400", sub: `of ${maxXP} total`, gradient: "from-amber-600/20 to-transparent" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`glass p-7 rounded-[32px] flex items-center gap-5 group hover:border-violet-500/30 transition-all bg-gradient-to-br ${stat.gradient}`}
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

          {/* Progress Chart + XP bar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Difficulty Distribution */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 rounded-[40px]">
              <h2 className="text-xl font-black mb-2 flex items-center gap-2">
                <BarChart3 className="text-violet-400" size={20} /> Completion by Difficulty
              </h2>
              <p className="text-gray-500 text-xs mb-6">Solved / total per difficulty tier</p>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={difficultyStats} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                    <XAxis dataKey="name" tick={{ fill: "#666", fontSize: 12, fontWeight: "bold" }} />
                    <YAxis tick={{ fill: "#555", fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#050505", border: "1px solid #333", borderRadius: "16px", padding: "12px" }}
                      formatter={(value: any, name: string) => [value, name === "solved" ? "Solved" : "Total"]}
                    />
                    <Bar dataKey="total" fill="#222" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="solved" radius={[6, 6, 0, 0]}>
                      {difficultyStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* XP Progress & Level */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 glass p-8 rounded-[40px]">
              <h2 className="text-xl font-black mb-2 flex items-center gap-2">
                <Award className="text-amber-400" size={20} /> Developer Level
              </h2>
              <p className="text-gray-500 text-xs mb-6">Earn XP by solving challenges — unlock higher ranks</p>

              {/* XP Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-amber-400">
                    {totalXP >= 800 ? "🏆 Grandmaster" : totalXP >= 500 ? "⚡ Expert" : totalXP >= 200 ? "🔥 Rising Star" : "🌱 Beginner"}
                  </span>
                  <span className="text-xs text-gray-500">{totalXP} / {maxXP} XP</span>
                </div>
                <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(totalXP / maxXP) * 100}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                  </motion.div>
                </div>
              </div>

              {/* Level tiers */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { name: "Beginner", min: 0, emoji: "🌱", color: "border-gray-600" },
                  { name: "Rising Star", min: 200, emoji: "🔥", color: "border-orange-600" },
                  { name: "Expert", min: 500, emoji: "⚡", color: "border-yellow-600" },
                  { name: "Grandmaster", min: 800, emoji: "🏆", color: "border-amber-500" },
                ].map((tier) => (
                  <div key={tier.name} className={`p-4 rounded-2xl border ${totalXP >= tier.min ? `${tier.color} bg-white/5` : "border-white/5 bg-white/[0.01] opacity-40"} text-center transition-all`}>
                    <p className="text-2xl mb-1">{tier.emoji}</p>
                    <p className="text-xs font-bold">{tier.name}</p>
                    <p className="text-[10px] text-gray-500">{tier.min}+ XP</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <FileCode className="text-violet-400" /> Challenges
            </h2>
            <div className="flex gap-2 flex-wrap">
              <div className="flex gap-1 bg-white/5 rounded-xl p-1">
                {(["all", "easy", "medium", "hard"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficultyFilter(d)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all relative ${
                      difficultyFilter === d ? "text-white" : "text-gray-500 hover:text-white"
                    }`}
                  >
                    {difficultyFilter === d && (
                      <motion.div
                        layoutId="codey-diff"
                        className="absolute inset-0 bg-violet-600/30 rounded-lg border border-violet-500/30"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">{d}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-1 bg-white/5 rounded-xl p-1">
                <button
                  onClick={() => setCategoryFilter("all")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${categoryFilter === "all" ? "bg-white/10 text-white" : "text-gray-500 hover:text-white"}`}
                >
                  All Topics
                </button>
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${categoryFilter === cat ? "bg-white/10 text-white" : "text-gray-500 hover:text-white"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Challenge Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge, i) => {
              const p = progress[challenge.id];
              const solved = p?.solved;

              const diffColors: Record<string, { bg: string; text: string; border: string }> = {
                easy: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20" },
                medium: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" },
                hard: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
              };
              const dc = diffColors[challenge.difficulty];

              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setActiveChallengeId(challenge.id)}
                  className={`glass p-6 rounded-[28px] group hover:border-violet-500/30 transition-all cursor-pointer relative overflow-hidden ${
                    solved ? "border-green-500/20" : ""
                  }`}
                >
                  {/* Solved badge overlay */}
                  {solved && (
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 size={16} className="text-green-400" />
                    </div>
                  )}

                  {/* Decorative glow */}
                  <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity ${
                    challenge.difficulty === "easy" ? "bg-green-500" : challenge.difficulty === "medium" ? "bg-yellow-500" : "bg-red-500"
                  }`} />

                  <div className="relative z-10 space-y-4">
                    {/* Top row */}
                    <div className="flex items-center gap-3">
                      <div className={`px-2.5 py-1 rounded-full ${dc.bg} ${dc.border} border text-[10px] font-bold uppercase tracking-widest ${dc.text}`}>
                        {challenge.difficulty}
                      </div>
                      <div className="px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-gray-400">
                        {challenge.category}
                      </div>
                      <div className="ml-auto text-[10px] font-bold text-amber-400 flex items-center gap-1">
                        <Zap size={10} /> {challenge.xpReward} XP
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-black text-base">{challenge.title}</h3>

                    {/* Starter preview */}
                    <div className="bg-[#0a0a0a] rounded-xl p-3 border border-white/5 font-mono text-[11px] text-gray-400 leading-relaxed overflow-hidden max-h-[60px]">
                      {challenge.starterCode.split("\n").slice(0, 2).join("\n")}
                      <span className="text-gray-600">...</span>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div className="flex items-center gap-3 text-[11px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <Bug size={12} /> {challenge.testCases.length} Tests
                        </span>
                        {p && (
                          <span className="flex items-center gap-1">
                            <Flame size={12} /> {p.attempts} Runs
                          </span>
                        )}
                      </div>
                      <div className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-violet-600/20 text-violet-400 border border-violet-500/20 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1">
                        Solve <ChevronRight size={12} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredChallenges.length === 0 && (
            <div className="text-center py-16">
              <Code2 size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 font-bold">No challenges match your filters</p>
              <p className="text-gray-600 text-sm mt-1">Try adjusting difficulty or category</p>
            </div>
          )}

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="glass p-12 rounded-[56px] bg-gradient-to-br from-violet-600/15 via-transparent to-purple-600/5 border-violet-500/20 relative overflow-hidden"
          >
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 shadow-2xl shadow-violet-500/20 shrink-0">
                <Terminal size={40} />
              </div>
              <div className="flex-grow">
                <h2 className="text-2xl font-black mb-2">How Codey Works</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Each challenge gives you a function stub and test cases. Write your solution in the built-in code editor,
                  hit <span className="text-violet-400 font-bold">Run Tests</span> to validate against all test cases in real-time.
                  Earn <span className="text-amber-400 font-bold">XP</span> for each solved challenge and unlock higher developer ranks.
                  All code runs safely in your browser — no server needed.
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[120px] rounded-full" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

// ============================================================
// CODING ARENA — The Editor + Test Runner
// ============================================================

function CodingArena({
  challenge,
  progress,
  onComplete,
  onExit,
}: {
  challenge: CodingChallenge;
  progress?: { bestResult: ChallengeResult | null; attempts: number; solved: boolean };
  onComplete: (result: ChallengeResult) => void;
  onExit: () => void;
}) {
  const [code, setCode] = useState(challenge.starterCode);
  const [testResults, setTestResults] = useState<TestCaseResult[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "tests" | "results">("description");
  const [copied, setCopied] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed((p) => p + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleRun = () => {
    setIsRunning(true);
    setActiveTab("results");

    // Simulate small delay for realism
    setTimeout(() => {
      const results = executeCode(code, challenge);
      setTestResults(results);
      setIsRunning(false);

      const passedTests = results.filter((r) => r.passed).length;
      const allPassed = passedTests === results.length;

      onComplete({
        challengeId: challenge.id,
        passed: allPassed,
        passedTests,
        totalTests: results.length,
        timeTaken: elapsed,
        code,
        date: new Date().toISOString(),
      });
    }, 600);
  };

  const handleReset = () => {
    setCode(challenge.starterCode);
    setTestResults(null);
    setActiveTab("description");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      setCode(newCode);
      // Move cursor
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      });
    }
    // Ctrl+Enter to Run
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleRun();
    }
  };

  const passedCount = testResults?.filter((r) => r.passed).length || 0;
  const totalTests = testResults?.length || challenge.testCases.length;
  const allPassed = testResults ? passedCount === totalTests : false;

  const diffColors: Record<string, string> = {
    easy: "text-green-400 bg-green-500/10 border-green-500/20",
    medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    hard: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  const lineCount = code.split("\n").length;

  return (
    <motion.div
      key="coding-arena"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#050505] z-50 flex flex-col overflow-hidden"
    >
      {/* Top Bar */}
      <div className="border-b border-white/10 bg-black/80 backdrop-blur-xl px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            className="p-2 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-600/30 flex items-center justify-center">
              <Code2 size={16} className="text-violet-400" />
            </div>
            <div>
              <h2 className="font-black text-sm">{challenge.title}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-widest ${diffColors[challenge.difficulty]}`}>
                  {challenge.difficulty}
                </span>
                <span className="text-[10px] text-gray-500">{challenge.category}</span>
                <span className="text-[10px] text-amber-400 flex items-center gap-1"><Zap size={9} />{challenge.xpReward} XP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
            <Clock size={14} />
            <span className="font-mono font-bold">{formatTime(elapsed)}</span>
          </div>
          {progress?.solved && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-500/10 px-3 py-2 rounded-xl border border-green-500/20">
              <CheckCircle2 size={14} /> Solved
            </div>
          )}
        </div>
      </div>

      {/* Main Split Pane */}
      <div className="flex-grow flex overflow-hidden">
        {/* Left Panel: Description + Tests */}
        <div className="w-[45%] border-r border-white/10 flex flex-col overflow-hidden">
          {/* Panel Tabs */}
          <div className="border-b border-white/10 px-4 py-2 flex gap-1 bg-white/[0.02] shrink-0">
            {(["description", "tests", "results"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all relative ${
                  activeTab === tab ? "text-white" : "text-gray-500 hover:text-white"
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="arena-tab"
                    className="absolute inset-0 bg-violet-600/20 rounded-lg border border-violet-500/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {tab === "description" && <FileCode size={12} />}
                  {tab === "tests" && <Bug size={12} />}
                  {tab === "results" && <CheckCircle2 size={12} />}
                  {tab}
                  {tab === "results" && testResults && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${allPassed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {passedCount}/{totalTests}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>

          {/* Panel Content */}
          <div className="flex-grow overflow-y-auto p-6">
            {activeTab === "description" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {/* Problem description */}
                <div>
                  <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                    <Lightbulb size={18} className="text-violet-400" /> Problem
                  </h3>
                  <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {challenge.description}
                  </div>
                </div>

                {/* Examples */}
                <div>
                  <h4 className="text-sm font-black mb-3 text-gray-400 uppercase tracking-widest">Examples</h4>
                  <div className="space-y-3">
                    {challenge.examples.map((ex, i) => (
                      <div key={i} className="bg-[#0a0a0a] rounded-xl p-4 border border-white/5 space-y-2">
                        <div className="flex items-start gap-2 text-sm">
                          <span className="text-gray-500 font-bold shrink-0">Input:</span>
                          <code className="font-mono text-violet-300">{ex.input}</code>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <span className="text-gray-500 font-bold shrink-0">Output:</span>
                          <code className="font-mono text-green-300">{ex.output}</code>
                        </div>
                        {ex.explanation && (
                          <p className="text-xs text-gray-500 italic mt-1">💡 {ex.explanation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hints */}
                <div>
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-violet-400 transition-colors"
                  >
                    <Lightbulb size={14} />
                    {showHints ? "Hide Hints" : `Show Hints (${challenge.hints.length})`}
                  </button>
                  <AnimatePresence>
                    {showHints && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 space-y-2 overflow-hidden"
                      >
                        {challenge.hints.map((hint, i) => (
                          <div key={i} className="flex items-start gap-2 bg-violet-500/5 rounded-xl p-3 border border-violet-500/10">
                            <span className="text-violet-400 text-xs font-bold shrink-0 mt-0.5">💡 {i + 1}.</span>
                            <p className="text-xs text-gray-400">{hint}</p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Show Solution (after at least 1 attempt) */}
                {(progress?.attempts || 0) > 0 && (
                  <div>
                    <button
                      onClick={() => setShowSolution(!showSolution)}
                      className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-amber-400 transition-colors"
                    >
                      <Star size={14} />
                      {showSolution ? "Hide Solution" : "Show Solution"}
                    </button>
                    <AnimatePresence>
                      {showSolution && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 overflow-hidden"
                        >
                          <div className="bg-[#0a0a0a] rounded-xl p-4 border border-amber-500/20">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Reference Solution</span>
                            </div>
                            <pre className="font-mono text-xs text-green-300 whitespace-pre-wrap leading-relaxed">{challenge.solution}</pre>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "tests" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                  <Bug size={18} className="text-violet-400" /> Test Cases ({challenge.testCases.length})
                </h3>
                {challenge.testCases.map((tc, i) => (
                  <div key={i} className="bg-[#0a0a0a] rounded-xl p-4 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400">Test {i + 1}: {tc.description}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-gray-500 font-bold shrink-0 text-xs">Input:</span>
                      <code className="font-mono text-xs text-violet-300">{tc.input}</code>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-gray-500 font-bold shrink-0 text-xs">Expected:</span>
                      <code className="font-mono text-xs text-green-300">{tc.expected}</code>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "results" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {isRunning ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-sm font-bold text-gray-400">Running test cases...</p>
                  </div>
                ) : testResults ? (
                  <>
                    {/* Summary */}
                    <div className={`p-5 rounded-2xl border ${allPassed ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}`}>
                      <div className="flex items-center gap-3">
                        {allPassed ? (
                          <CheckCircle2 size={24} className="text-green-400" />
                        ) : (
                          <XCircle size={24} className="text-red-400" />
                        )}
                        <div>
                          <p className={`font-black text-lg ${allPassed ? "text-green-400" : "text-red-400"}`}>
                            {allPassed ? "All Tests Passed! 🎉" : `${passedCount}/${totalTests} Tests Passed`}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {allPassed ? `+${challenge.xpReward} XP earned` : "Fix your code and try again"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Individual results */}
                    {testResults.map((tr, i) => (
                      <div key={i} className={`bg-[#0a0a0a] rounded-xl p-4 border ${tr.passed ? "border-green-500/20" : "border-red-500/20"}`}>
                        <div className="flex items-center gap-2 mb-3">
                          {tr.passed ? (
                            <CheckCircle2 size={14} className="text-green-400" />
                          ) : (
                            <XCircle size={14} className="text-red-400" />
                          )}
                          <span className="text-xs font-bold">{tr.description}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tr.passed ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                            {tr.passed ? "PASS" : "FAIL"}
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-start gap-2">
                            <span className="text-[10px] text-gray-500 font-bold w-16 shrink-0">Input:</span>
                            <code className="font-mono text-[11px] text-violet-300 break-all">{tr.input}</code>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-[10px] text-gray-500 font-bold w-16 shrink-0">Expected:</span>
                            <code className="font-mono text-[11px] text-green-300 break-all">{tr.expected}</code>
                          </div>
                          {!tr.passed && (
                            <div className="flex items-start gap-2">
                              <span className="text-[10px] text-gray-500 font-bold w-16 shrink-0">Actual:</span>
                              <code className="font-mono text-[11px] text-red-300 break-all">{tr.error ? `Error: ${tr.error}` : tr.actual}</code>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Terminal size={40} className="text-gray-600 mb-4" />
                    <p className="text-sm font-bold text-gray-400">No results yet</p>
                    <p className="text-xs text-gray-600 mt-1">Write your solution and click Run Tests</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Panel: Code Editor */}
        <div className="flex-grow flex flex-col overflow-hidden">
          {/* Editor toolbar */}
          <div className="border-b border-white/10 px-4 py-2 flex items-center justify-between bg-white/[0.02] shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-xs text-gray-500 font-mono ml-2">solution.js</span>
              <span className="text-[10px] text-gray-600 font-mono">— JavaScript</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="p-2 hover:bg-white/10 rounded-lg transition-all text-gray-400 hover:text-white"
                title="Copy code"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
              <button
                onClick={handleReset}
                className="p-2 hover:bg-white/10 rounded-lg transition-all text-gray-400 hover:text-white"
                title="Reset code"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* The Editor */}
          <div className="flex-grow relative overflow-hidden bg-[#0a0a0a]">
            <div className="absolute inset-0 flex overflow-auto">
              {/* Line Numbers */}
              <div className="w-12 bg-[#080808] border-r border-white/5 text-right py-4 select-none shrink-0 sticky left-0">
                {Array.from({ length: lineCount }, (_, i) => (
                  <div key={i} className="px-3 text-[11px] text-gray-600 font-mono leading-[20px]">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Code Area */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                className="flex-grow bg-transparent text-[13px] font-mono text-gray-200 p-4 outline-none resize-none leading-[20px] whitespace-pre tab-size-2 caret-violet-400"
                style={{ tabSize: 2, fontFamily: "var(--font-geist-mono), 'Fira Code', 'Cascadia Code', Consolas, monospace" }}
              />
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="border-t border-white/10 px-6 py-3 flex items-center justify-between bg-black/80 backdrop-blur-xl shrink-0">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Hash size={12} /> {lineCount} lines</span>
              <span className="text-gray-700">|</span>
              <span className="flex items-center gap-1 text-gray-600">Ctrl+Enter to Run</span>
            </div>
            <button
              onClick={handleRun}
              disabled={isRunning}
              className={`px-8 py-3 font-black rounded-xl transition-all flex items-center gap-2 text-sm ${
                isRunning
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-xl shadow-violet-600/30"
              }`}
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play size={16} /> Run Tests
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
