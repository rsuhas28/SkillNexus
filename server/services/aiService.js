import 'dotenv/config';

// ─── Curated Role-Specific Knowledge Repositories ──────────────────────────


function getCuratedInterviewPrep(roleInput = 'Full Stack Developer', skills = []) {
  const r = (roleInput || '').toLowerCase();

  if (r.includes('front') || r.includes('react') || r.includes('ui') || r.includes('web')) {
    return {
      configured: true,
      role: roleInput,
      technicalTopics: [
        'Modern JavaScript (ES6+): Closures, Event Loop, Promises & Async/Await',
        'React 19 Architecture: Concurrent Mode, Hooks, Compiler & Server Components',
        'State Management: Context API, Zustand, Redux Toolkit & Server State (React Query)',
        'CSS Mastery: Flexbox, Grid, Responsive Design & CSS Modules / Tailwind',
        'Web Performance: Core Web Vitals (LCP, FID, CLS), Code Splitting & Tree Shaking',
        'DOM Manipulation, Event Bubbling, Delegation & Virtual DOM Reconciliation',
        'Frontend Security: XSS Prevention, CSRF, CSP Headers & Sanitization',
        'Cross-Browser Compatibility, Accessibility (WCAG 2.1 AA) & Semantic HTML'
      ],
      behavioralTopics: [
        'STAR Method for UI/UX Disagreements with Product Designers',
        'Handling Tight Delivery Timelines for Complex Web Applications',
        'Balancing Pixel-Perfect Design with Rapid Technical Delivery',
        'Cross-Functional Collaboration with Backend and QA Engineers'
      ],
      preparationChecklist: [
        'Complete 15 JavaScript output-prediction & algorithmic coding challenges',
        'Build a responsive component library with dark/light mode and accessible ARIA attributes',
        'Demonstrate client-side caching & debounced search with live API autocomplete',
        'Audit a web application with Chrome Lighthouse and achieve 95+ performance score',
        'Prepare 3 STAR behavioral stories highlighting UI debugging and team alignment',
        'Practice live coding interview simulations under a 45-minute timer'
      ],
      likelyQuestions: [
        {
          question: 'How does React\'s Virtual DOM differ from the real DOM, and how does reconciliation work?',
          type: 'Frontend Architecture',
          framework: 'Explain the lightweight in-memory tree representation, diffing heuristics (O(n)), key prop significance, Fiber batching, and how React minimizes expensive layout thrashing.'
        },
        {
          question: 'What causes re-renders in React, and how do you prevent unnecessary renders?',
          type: 'React Performance',
          framework: 'Break down state/prop changes and parent re-renders. Explain React.memo, useMemo, useCallback, proper state colocation, and avoiding object literals in props.'
        },
        {
          question: 'Explain the JavaScript Event Loop, microtasks, and macrotasks.',
          type: 'JavaScript Core',
          framework: 'Cover the call stack, Web APIs, Macrotask queue (setTimeout, setInterval, setImmediate) vs Microtask queue (Promise callbacks, queueMicrotask), and execution priority.'
        },
        {
          question: 'How do you optimize Core Web Vitals (LCP, FID/INP, CLS) on a slow mobile connection?',
          type: 'Performance Optimization',
          framework: 'LCP: Preload hero images and use SSR/CDN. INP/FID: Break long JavaScript tasks and defer non-critical scripts. CLS: Set explicit image/video dimensions and reserve banner slots.'
        },
        {
          question: 'How do you defend a single-page application against Cross-Site Scripting (XSS)?',
          type: 'Web Security',
          framework: 'Discuss automatic escaping in JSX, avoiding dangerouslySetInnerHTML without DOMPurify, Content Security Policy (CSP) headers, and HttpOnly/SameSite cookies for tokens.'
        }
      ]
    };
  }

  if (r.includes('back') || r.includes('node') || r.includes('python') || r.includes('api')) {
    return {
      configured: true,
      role: roleInput,
      technicalTopics: [
        'Node.js Internals: Libuv, Event Loop Phases, Streams & Buffer Memory',
        'RESTful API Design: Idempotency, Status Codes, Versioning & Rate Limiting',
        'Database Optimization: Indexing (B-Tree/Hash), Normalization vs Denormalization',
        'Authentication & Security: OAuth2, JWT with Refresh Tokens, RBAC & Helmet',
        'Caching Topologies: Redis In-Memory Caching, Cache-Aside & Invalidation Strategies',
        'Microservices Communication: Asynchronous Event Queues (RabbitMQ/Kafka) vs gRPC',
        'Concurrency & Distributed Locks: ACID Transactions, Race Conditions & Mutexes',
        'API Monitoring: Structured Logging, Health Checks, OpenTelemetry & APM'
      ],
      behavioralTopics: [
        'Incident Response: Resolving Severe Production Outages under Pressure',
        'Technical Debt Trade-offs vs Business Roadmap Demands',
        'Leading API Deprecation and Zero-Downtime Migration Strategies',
        'Mentoring Junior Developers and Enforcing Code Quality Standards'
      ],
      preparationChecklist: [
        'Build and test an end-to-end JWT auth flow with refresh token rotation and blacklist',
        'Write raw database queries with EXPLAIN ANALYZE to benchmark compound indexing',
        'Implement distributed rate limiting middleware with Redis token-bucket algorithm',
        'Design an event-driven architecture using pub/sub for order and notification workflows',
        'Formulate 3 STAR stories highlighting root cause analysis during production incidents',
        'Review REST conventions, HTTP response codes, and idempotency guarantees'
      ],
      likelyQuestions: [
        {
          question: 'How does Node.js achieve high concurrency despite being single-threaded?',
          type: 'Node.js Internals',
          framework: 'Detail the libuv non-blocking I/O event loop, worker thread pool for file/crypto ops, and asynchronous kernel delegations via epoll/kqueue.'
        },
        {
          question: 'How do database indexes work, and when can adding an index hurt performance?',
          type: 'Database Architecture',
          framework: 'Explain B-Tree search O(log n), clustered vs non-clustered indexes, write penalty during inserts/updates due to tree rebalancing, and high-cardinality trade-offs.'
        },
        {
          question: 'How do you maintain zero downtime during a breaking database schema migration?',
          type: 'System Reliability',
          framework: 'Outline the expand/contract pattern: add nullable column, write to both, backfill historical data, switch reads, and finally remove the old column.'
        },
        {
          question: 'Explain the difference between optimistic and pessimistic locking.',
          type: 'Concurrency & Transactions',
          framework: 'Optimistic: Version number / timestamp check at commit; ideal for low-contention reads. Pessimistic: SELECT FOR UPDATE lock; ideal for high-conflict financial transactions.'
        }
      ]
    };
  }

  if (r.includes('data') || r.includes('ai') || r.includes('machine') || r.includes('learning') || r.includes('ml')) {
    return {
      configured: true,
      role: roleInput,
      technicalTopics: [
        'Supervised vs Unsupervised Learning: Regression, Classification, Clustering',
        'Deep Learning Foundations: Backpropagation, Gradient Descent, Activation Functions',
        'Transformer Architecture: Self-Attention, Multi-Head Attention, Embeddings',
        'Feature Engineering: Imputation, Encoding, Scaling, PCA & Dimensionality Reduction',
        'Model Evaluation: Precision, Recall, F1-Score, ROC-AUC, Bias-Variance Tradeoff',
        'MLOps & Deployment: Model Serving (FastAPI/Triton), Docker, Monitoring Drift',
        'Data Pipelines: Pandas, NumPy, SQL Aggregations & Apache Spark Basics',
        'LLM Orchestration: RAG (Retrieval-Augmented Generation), Vector DBs & Prompt Tuning'
      ],
      behavioralTopics: [
        'Explaining Complex ML Models to Non-Technical Business Stakeholders',
        'Handling Data Quality Issues, Missing Values, and Historical Bias',
        'Deciding when a Simple Heuristic Outperforms a Deep Neural Network',
        'Ethical Considerations in AI Model Transparency and Fair Lending/Hiring'
      ],
      preparationChecklist: [
        'Implement Linear Regression & Logistic Regression from scratch in NumPy',
        'Fine-tune an open-source HuggingFace model or build a RAG pipeline with ChromaDB',
        'Explain ROC-AUC, Precision-Recall curves, and Confusion Matrix trade-offs',
        'Demonstrate SQL window functions and data transformations for feature tables',
        'Prepare 3 STAR stories detailing an end-to-end ML project from data cleaning to deploy',
        'Review mathematical foundations: Linear Algebra, Calculus, and Bayes Theorem'
      ],
      likelyQuestions: [
        {
          question: 'How do you address the Bias-Variance tradeoff in a machine learning model?',
          type: 'ML Theory',
          framework: 'Define high bias (underfitting) vs high variance (overfitting). Explain remedies: regularization (L1/L2), cross-validation, pruning, ensemble methods, and gathering more data.'
        },
        {
          question: 'Explain how the Transformer Self-Attention mechanism works mathematically.',
          type: 'Deep Learning',
          framework: 'Detail Query, Key, Value matrices, scaled dot-product attention formula: Softmax((Q*K^T)/sqrt(d_k))*V, and why scaling prevents vanishing gradients.'
        },
        {
          question: 'How does a Retrieval-Augmented Generation (RAG) system reduce hallucinations?',
          type: 'Generative AI',
          framework: 'Explain vector embeddings, similarity search (cosine/HNSW), ground truth chunk injection into prompt context, and citation grounding.'
        }
      ]
    };
  }

  // Default: Full Stack Developer / Software Engineer
  return {
    configured: true,
    role: roleInput || 'Full Stack Developer',
    technicalTopics: [
      'Full-Stack Architecture: Decoupling Client, REST/GraphQL API, and Database Layers',
      'Data Structures & Algorithms: Hash Tables, Two Pointers, Trees, Graphs & Dynamic Programming',
      'Frontend Frameworks: React 19 Components, State Management & Modern Build Tooling',
      'Backend Concurrency: Node.js Event Loop, Asynchronous Patterns & Microservices',
      'Database Modeling: Relational Schemas vs NoSQL Documents & Index Optimization',
      'Application Security: OWASP Top 10, JWT Authentication, OAuth2 & CORS Policies',
      'System Design Principles: Horizontal Scaling, Load Balancing, Caching & CDN Edge',
      'DevOps & CI/CD: Containerization with Docker, Automated Testing & Cloud Deployments'
    ],
    behavioralTopics: [
      'STAR Method: Delivering Critical Features on Tight Project Deadlines',
      'Navigating Technical Disagreements in Code Reviews and Architecture RFCs',
      'Root Cause Analysis and Post-Mortems for Production Outages',
      'Balancing Technical Debt with Feature Velocity and Business Value'
    ],
    preparationChecklist: [
      'Solve 20 curated Medium LeetCode problems (Arrays, Two Pointers, Trees, Graphs, DP)',
      'Build and test an end-to-end authentication flow with JWT refresh tokens and role guards',
      'Design a scalable distributed system architecture (e.g., URL Shortener, Chat Platform)',
      'Audit full-stack app for security vulnerabilities (XSS, CSRF, SQLi, and CORS)',
      'Prepare 4 structured STAR-method stories illustrating problem-solving and collaboration',
      'Conduct 3 timed mock interview sessions with the SkillNexus AI Interview Simulator'
    ],
    likelyQuestions: [
      {
        question: 'How does Node.js handle concurrent I/O operations despite being single-threaded?',
        type: 'Backend Architecture',
        framework: 'Explain libuv non-blocking event loop phases (timers, I/O, poll, check), the OS kernel offloading via epoll/kqueue, and worker threads for CPU-bound tasks.'
      },
      {
        question: 'How would you design a real-time collaborative application (like Google Docs or Figma)?',
        type: 'System Design',
        framework: 'Discuss Operational Transformation (OT) vs Conflict-free Replicated Data Types (CRDTs), WebSocket communication layer, persistent message broker (Kafka/Redis), and optimistic UI updates.'
      },
      {
        question: 'Explain how React\'s Virtual DOM and Reconciliation algorithm work.',
        type: 'Frontend Architecture',
        framework: 'Cover the Diffing algorithm heuristics (O(n)), key prop significance, Fiber reconciliation double-buffering, and the transition towards the React 19 Compiler.'
      },
      {
        question: 'Tell me about a time when a production release broke. How did you triage and resolve it?',
        type: 'Behavioral / STAR',
        framework: 'Structure with STAR: describe the critical bug (Situation), your responsibility (Task), immediate mitigation (rollback/hotfix) and log analysis (Action), and post-mortem safeguards (Result).'
      },
      {
        question: 'How do database indexes work under the hood, and when can an index harm performance?',
        type: 'Database Internals',
        framework: 'Explain B-Tree search traversal O(log N), composite indexing ESR rule, write overhead during inserts/updates due to tree rebalancing, and storage considerations.'
      },
      {
        question: 'What strategies do you use to secure a public REST API against unauthorized abuse?',
        type: 'Application Security',
        framework: 'Discuss token-bucket rate limiting (Redis), strict CORS whitelists, HTTP-only SameSite cookies, JWT signature verification, input validation with Joi/Zod, and Helmet HTTP headers.'
      }
    ]
  };
}

function getCuratedPrepPlan(targetRoleInput = 'Full Stack Developer', timeline = 4) {
  const r = (targetRoleInput || '').toLowerCase();

  if (r.includes('front') || r.includes('ui') || r.includes('react')) {
    return {
      configured: true,
      targetRole: targetRoleInput,
      weeks: [
        {
          week: 1,
          focus: 'Advanced JavaScript (ES6+), Asynchronous Mechanics & DOM Fundamentals',
          tasks: [
            'Deep dive into Closures, Prototypal Inheritance, Scopes, and \'this\' binding',
            'Master JavaScript Event Loop, Microtasks (Promises) vs Macrotasks (Timers)',
            'Build 8 interactive vanilla JS components from scratch without libraries',
            'Solve 15 algorithmic challenges focusing on String Manipulation and Array transforms'
          ],
          resources: [
            'MDN Advanced JavaScript Documentation',
            'JavaScript.info Deep Dive Series',
            'You Don\'t Know JS (Yet) Book Collection'
          ]
        },
        {
          week: 2,
          focus: 'React 19 Deep Dive, Component Lifecycle & Modern State Management',
          tasks: [
            'Master React 19 hooks: useTransition, useActionState, useOptimistic & custom hooks',
            'Implement client and server state caching using TanStack React Query and Zustand',
            'Build accessible design system components following WAI-ARIA 1.2 guidelines',
            'Write comprehensive unit tests with Vitest and React Testing Library'
          ],
          resources: [
            'React.dev Official Documentation & Interactive Tutorials',
            'Testing Library Best Practices & Philosophy',
            'Tailwind CSS & Modern Design Systems Handbook'
          ]
        },
        {
          week: 3,
          focus: 'Web Performance Engineering, Core Web Vitals & Frontend Security',
          tasks: [
            'Audit application with Chrome DevTools & Lighthouse to optimize LCP, FID/INP, CLS',
            'Implement route-based code-splitting, dynamic imports, and responsive image formats',
            'Harden SPA against XSS, CSRF, and clickjacking using CSP and DOMPurify',
            'Implement virtualized scrolling for rendering 10,000+ dataset items at 60 FPS'
          ],
          resources: [
            'Web.dev Core Web Vitals Optimization Guide',
            'OWASP Frontend Security Checklist',
            'Browser Rendering Optimization (Google Developers)'
          ]
        },
        {
          week: 4,
          focus: 'Frontend System Design, Live Mock Interviews & Capstone Showcase',
          tasks: [
            'Architect complex frontend systems: Autocomplete, Infinite Feed & Real-time Dashboard',
            'Conduct 3 timed live mock technical interviews on SkillNexus AI Interview Simulator',
            'Prepare 4 structured STAR-method stories for engineering leadership questions',
            'Deploy polished capstone portfolio application to Vercel with automated CI/CD checks'
          ],
          resources: [
            'Frontend System Design Handbook by GreatFrontEnd',
            'Tech Interview Handbook Frontend Prep Guide',
            'SkillNexus AI Voice Interview Simulator'
          ]
        }
      ]
    };
  }

  if (r.includes('back') || r.includes('node') || r.includes('python')) {
    return {
      configured: true,
      targetRole: targetRoleInput,
      weeks: [
        {
          week: 1,
          focus: 'Data Structures, Algorithmic Problem Solving & Computational Complexity',
          tasks: [
            'Master Hash Tables, Two Pointers, Linked Lists, and Binary Search algorithms',
            'Analyze Big-O time and space complexity trade-offs for core data structures',
            'Solve 15 curated LeetCode Medium challenges focusing on Trees and Graphs (DFS/BFS)',
            'Review Object-Oriented and Functional programming paradigms and SOLID principles'
          ],
          resources: [
            'NeetCode 150 Core Roadmap',
            'Grokking Algorithms (Aditya Bhargava)',
            'LeetCode Top Interview Questions Collection'
          ]
        },
        {
          week: 2,
          focus: 'Server Architecture, RESTful API Standards & Database Optimization',
          tasks: [
            'Design production REST APIs with OpenAPI specifications, versioning, and status codes',
            'Benchmark SQL joins and MongoDB aggregation pipelines with compound index strategies',
            'Implement robust JWT authentication with refresh token rotation and RBAC middleware',
            'Build an in-memory cache and distributed rate limiter using Redis'
          ],
          resources: [
            'Designing Data-Intensive Applications (Chapters 1-4)',
            'Node.js Production Best Practices Guide',
            'MongoDB Indexing Strategies & Performance Tuning'
          ]
        },
        {
          week: 3,
          focus: 'Microservices, Message Brokers & Distributed Concurrency',
          tasks: [
            'Implement asynchronous message queue workflows using RabbitMQ or Kafka',
            'Handle race conditions, distributed transactions, and idempotency guarantees',
            'Containerize multi-service backend with Docker and Docker Compose',
            'Write integration tests with Supertest and mock database fixtures'
          ],
          resources: [
            'Microservices Patterns by Chris Richardson',
            'Enterprise Integration Patterns',
            'Docker & Containerization Deep Dive'
          ]
        },
        {
          week: 4,
          focus: 'Large-Scale System Design, Production Resilience & Mock Interviews',
          tasks: [
            'Architect scalable distributed systems (URL shortener, Real-time messaging platform)',
            'Prepare 4 compelling STAR-method behavioral stories for leadership interviews',
            'Set up health checks, structured logging, and automated CI/CD deployment pipelines',
            'Complete 3 full mock interview sessions on the SkillNexus AI simulator'
          ],
          resources: [
            'System Design Primer by Donne Martin',
            'Grokking the System Design Interview',
            'Google SRE Handbook on Reliability'
          ]
        }
      ]
    };
  }

  // Default: Full Stack Developer / Software Engineer
  return {
    configured: true,
    targetRole: targetRoleInput || 'Full Stack Developer',
    weeks: [
      {
        week: 1,
        focus: 'DSA Foundations, Algorithm Patterns & Core Problem Solving',
        tasks: [
          'Master HashMaps, Two-Pointer technique, and Sliding Window algorithmic patterns',
          'Solve 15 curated LeetCode Easy & Medium problems (Arrays, Strings, Linked Lists)',
          'Deep dive into Big-O time/space complexity analysis and memory benchmarks',
          'Review Clean Code guidelines, SOLID principles, and common design patterns'
        ],
        resources: [
          'NeetCode 150 Algorithms Roadmap',
          'Eloquent JavaScript & Clean Code Architecture',
          'LeetCode Curated 75 Problem Set'
        ]
      },
      {
        week: 2,
        focus: 'Scalable Backend APIs, Database Internals & Secure Authentication',
        tasks: [
          'Design production-grade REST APIs adhering to OpenAPI 3.0 specification guidelines',
          'Optimize SQL queries and MongoDB Aggregation Pipelines with Compound Indexes',
          'Implement secure OAuth2 / JWT authentication with token rotation & role guards',
          'Build and benchmark a Redis-backed rate limiter and distributed caching layer'
        ],
        resources: [
          'Designing Data-Intensive Applications by Martin Kleppmann',
          'Node.js Security Best Practices (OWASP)',
          'MongoDB Indexing Strategies & ESR Rule'
        ]
      },
      {
        week: 3,
        focus: 'Modern Frontend Engineering, State Synchronization & Web Performance',
        tasks: [
          'Build responsive, accessible user interfaces compliant with WCAG 2.1 AA standards',
          'Master React state management patterns (Context API, custom hooks, memoization)',
          'Optimize Core Web Vitals (LCP, FID/INP, CLS) using lazy loading and code-splitting',
          'Write comprehensive unit and integration tests using Vitest and React Testing Library'
        ],
        resources: [
          'React Official Documentation & Advanced Guides',
          'Web.dev Core Web Vitals Optimization',
          'Testing JavaScript Applications Handbook'
        ]
      },
      {
        week: 4,
        focus: 'Distributed System Design, Mock Interviews & Live Capstone Showcase',
        tasks: [
          'Architect end-to-end distributed systems (URL shortener, Real-time chat with WebSockets)',
          'Practice 5 timed mock interview sessions on the SkillNexus AI Simulator',
          'Prepare 4 structured STAR-method behavioral stories for engineering leadership interviews',
          'Deploy full-stack capstone application to cloud with automated GitHub Actions CI/CD'
        ],
        resources: [
          'System Design Primer (GitHub / Donne Martin)',
          'Grokking Modern System Design',
          'SkillNexus AI Voice Interview Simulator'
        ]
      }
    ]
  };
}

/**
 * AI Service — Google Gemini API
 * Gracefully degrades to structured placeholder responses when API key is absent.
 * Never invents jobs, companies, certifications or opportunities.
 */
import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;
let aiConfigured = false;

if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  aiConfigured = true;
  console.log('✅ Gemini AI configured');
} else {
  console.log('ℹ️ Gemini AI not configured — AI features will return structured placeholder data');
}

export const isAIConfigured = () => aiConfigured;

const PLACEHOLDER_NOTE = 'AI service is not configured. Configure GEMINI_API_KEY in server/.env to enable live AI responses.';

/**
 * Core Gemini text generation.
 * @param {string} prompt
 * @param {object} options
 */
async function generate(prompt, options = {}) {
  if (!aiConfigured) return null;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (err) {
    console.error('Gemini AI error:', err.message);
    return null;
  }
}

/**
 * Parse AI JSON response safely.
 */
function safeParseJSON(text, fallback) {
  if (!text) return fallback;
  try {
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return fallback;
  }
}

// ─── Req 29: Skill Mapping ────────────────────────────────────────────────────
export const extractSkillMapping = async (studentData) => {
  if (!aiConfigured) {
    return {
      configured: false,
      note: PLACEHOLDER_NOTE,
      extractedSkills: studentData.skills || [],
      normalizedSkills: [],
      roleMappings: [
        { role: 'Full Stack Developer', confidence: 'Requires AI configuration', reasons: [] },
        { role: 'Software Engineer', confidence: 'Requires AI configuration', reasons: [] }
      ]
    };
  }

  const prompt = `
You are a skill mapping engine for a career platform called SkillNexus.
Analyze the following student data and extract, normalize, and map skills to career roles.
Return ONLY valid JSON in this exact format:
{
  "extractedSkills": ["skill1", "skill2"],
  "normalizedSkills": [{"raw": "JS", "normalized": "JavaScript", "category": "Programming"}],
  "roleMappings": [{"role": "Full Stack Developer", "matchStrength": "High", "reasons": ["has React", "has Node.js"]}]
}

Student data:
${JSON.stringify(studentData, null, 2)}
`;

  const text = await generate(prompt);
  return {
    configured: true,
    ...safeParseJSON(text, { extractedSkills: [], normalizedSkills: [], roleMappings: [] })
  };
};

// ─── Req 28: Skill Gap Analysis ──────────────────────────────────────────────
export const analyzeSkillGap = async (targetRole, currentSkills = [], customRequiredSkills = null) => {
  if (!aiConfigured) {
    const defaultRequired = customRequiredSkills && customRequiredSkills.length > 0
      ? customRequiredSkills
      : ['Data Structures', 'System Design', 'Git & CI/CD', 'API Architecture', 'Testing'];
    
    const missing = defaultRequired.filter(req => !currentSkills.some(cur => cur.toLowerCase() === req.toLowerCase()));
    const matched = defaultRequired.filter(req => currentSkills.some(cur => cur.toLowerCase() === req.toLowerCase()));
    const readinessScore = defaultRequired.length > 0 ? Math.round((matched.length / defaultRequired.length) * 100) : 60;

    return {
      configured: false,
      note: PLACEHOLDER_NOTE,
      targetRole,
      requiredSkills: defaultRequired,
      currentSkills,
      missingSkills: missing,
      weakSkills: missing.slice(0, 2),
      readinessScore,
      priorityRecommendations: missing.map((skill, i) => ({
        priority: i + 1,
        skill,
        reason: `Essential requirement for ${targetRole} positions`
      }))
    };
  }

  const prompt = `
You are a career readiness and skill gap analyzer for SkillNexus.
Target Role: ${targetRole}
Student's Current Skills: ${JSON.stringify(currentSkills)}
${customRequiredSkills ? `Custom Required Skills: ${JSON.stringify(customRequiredSkills)}` : ''}

Analyze the readiness for this role, identify missing skills and weaknesses, and prioritize recommendations.
Return ONLY valid JSON:
{
  "targetRole": "${targetRole}",
  "requiredSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "missingSkills": ["missingSkill1", "missingSkill2"],
  "weakSkills": ["weakSkill1"],
  "readinessScore": 75,
  "priorityRecommendations": [
    {"priority": 1, "skill": "skill name", "reason": "why this is high priority"}
  ]
}
`;

  const text = await generate(prompt);
  return {
    configured: true,
    ...safeParseJSON(text, {
      targetRole,
      requiredSkills: ['Problem Solving', 'Communication'],
      missingSkills: [],
      weakSkills: [],
      readinessScore: 50,
      priorityRecommendations: []
    })
  };
};

// ─── Req 30: Career Guidance ─────────────────────────────────────────────────

export const generateCareerGuidance = async (studentProfile) => {
  if (!aiConfigured) {
    return {
      configured: false,
      note: PLACEHOLDER_NOTE,
      disclaimer: 'Career suggestions are AI-generated indicators, not guaranteed advice.',
      suggestions: [
        {
          role: 'Software Engineer',
          suitability: 'Configure Gemini AI key to receive personalized suggestions',
          reasons: [],
          nextSteps: []
        }
      ]
    };
  }

  const prompt = `
You are a career guidance counsellor for SkillNexus, an Academia-Industry platform.
Based on the student profile below, suggest 3-5 relevant career roles.
IMPORTANT: Frame suggestions as indicators only, not guarantees.
Return ONLY valid JSON:
{
  "disclaimer": "These are AI-generated suggestions based on your profile. They are indicators, not guaranteed career advice.",
  "suggestions": [
    {
      "role": "Role Title",
      "suitability": "High/Medium/Low",
      "reasons": ["reason1", "reason2"],
      "nextSteps": ["action1", "action2"]
    }
  ]
}

Student profile:
${JSON.stringify(studentProfile, null, 2)}
`;

  const text = await generate(prompt);
  return {
    configured: true,
    ...safeParseJSON(text, { disclaimer: '', suggestions: [] })
  };
};

// ─── Req 31: Learning Recommendations ────────────────────────────────────────
export const generateLearningRecommendations = async (skillGaps) => {
  if (!aiConfigured) {
    return {
      configured: false,
      note: PLACEHOLDER_NOTE,
      recommendations: skillGaps.map(gap => ({
        skill: gap.skill || gap,
        resources: [
          { type: 'Course', title: 'Configure AI for personalized recommendations', url: null, free: true }
        ]
      }))
    };
  }

  const prompt = `
You are a learning advisor for SkillNexus.
For each skill gap below, recommend 2-3 specific learning resources.
Only recommend real, well-known resources (Coursera, edX, freeCodeCamp, MDN, official docs, etc.)
Do NOT invent or fabricate resources.
Return ONLY valid JSON:
{
  "recommendations": [
    {
      "skill": "skill name",
      "resources": [
        {"type": "Course/Tutorial/Documentation/Video", "title": "Resource Name", "provider": "Provider", "url": "url if known", "free": true}
      ]
    }
  ]
}

Skill gaps:
${JSON.stringify(skillGaps, null, 2)}
`;

  const text = await generate(prompt);
  return {
    configured: true,
    ...safeParseJSON(text, { recommendations: [] })
  };
};

// ─── Req 32: AI Guide (Chat) ─────────────────────────────────────────────────
export const getAIGuideResponse = async (message, context = {}) => {
  if (!aiConfigured) {
    return {
      configured: false,
      note: PLACEHOLDER_NOTE,
      response: `I'm the SkillNexus AI Guide. To activate live AI responses, please configure GEMINI_API_KEY in the server environment. Once configured, I can help you with skill gaps, assessment results, career roles, learning plans, and more.`
    };
  }

  const systemContext = `
You are the SkillNexus AI Guide — a helpful assistant for an Academia-Industry collaboration platform.
You help students with: skill gaps, assessment results, career roles, learning plans, profile improvements, opportunity search.
You MUST NOT invent jobs, companies, certifications, or opportunities.
You MUST clearly distinguish between user data, AI suggestions, and verified platform information.
Keep responses concise, practical, and encouraging.

User context:
${JSON.stringify(context, null, 2)}
`;

  const fullPrompt = `${systemContext}\n\nUser message: ${message}`;
  const text = await generate(fullPrompt);

  return {
    configured: true,
    response: text || 'I was unable to process that request. Please try again.'
  };
};

// ─── Req 33/34: Opportunity Matching (server-side, explainable) ───────────────
export const explainOpportunityMatch = async (student, opportunity) => {
  if (!aiConfigured) {
    return {
      configured: false,
      note: PLACEHOLDER_NOTE,
      explanation: 'Configure Gemini AI to receive detailed match explanations.',
      improvementTips: []
    };
  }

  const prompt = `
You are a recruitment match explainer for SkillNexus.
Given a student profile and a job/internship opportunity, explain why they match or don't match.
Be specific and actionable.
Return ONLY valid JSON:
{
  "explanation": "Plain text explanation of the match",
  "improvementTips": ["tip1", "tip2"]
}

Student:
${JSON.stringify(student, null, 2)}

Opportunity:
${JSON.stringify(opportunity, null, 2)}
`;

  const text = await generate(prompt);
  return {
    configured: true,
    ...safeParseJSON(text, { explanation: '', improvementTips: [] })
  };
};

// ─── Req 65: Interview Preparation ───────────────────────────────────────────
export const generateInterviewPrep = async ({ role, skills, jobDescription, studentProfile }) => {
  if (aiConfigured) {
    try {
      const prompt = `
You are an interview preparation coach for SkillNexus.
Generate a targeted interview preparation guide for the following context.
Return ONLY valid JSON:
{
  "technicalTopics": ["topic1", "topic2"],
  "behavioralTopics": ["topic1"],
  "likelyQuestions": [
    {"question": "Question text", "type": "Technical/Behavioral", "framework": "Suggested approach"}
  ],
  "preparationChecklist": ["item1", "item2"]
}

Target Role: ${role}
Skills: ${JSON.stringify(skills)}
Job Description: ${jobDescription || 'Not provided'}
Student Level: ${studentProfile?.level || 'Entry'}
`;
      const text = await generate(prompt);
      const parsed = safeParseJSON(text, null);
      if (parsed && parsed.technicalTopics && parsed.technicalTopics.length > 0) {
        return { configured: true, ...parsed };
      }
    } catch (err) {
      console.warn('Gemini prep error, falling back to curated:', err.message);
    }
  }

  return getCuratedInterviewPrep(role, skills);
};

// ─── Req 66: Mock Interview ───────────────────────────────────────────────────
export const getMockInterviewQuestion = async (role, previousQA = [], questionIndex = 0) => {
  if (!aiConfigured) {
    const fallbackQuestions = [
      'Tell me about yourself and your background.',
      'What are your strongest technical skills?',
      'Describe a challenging project you worked on.',
      'Where do you see yourself in 5 years?',
      'Do you have any questions for us?'
    ];
    return {
      configured: false,
      question: fallbackQuestions[questionIndex % fallbackQuestions.length],
      type: 'General',
      isLastQuestion: questionIndex >= 4
    };
  }

  const prevContext = previousQA.map(qa => `Q: ${qa.question}\nA: ${qa.answer}`).join('\n\n');
  const prompt = `
You are an interviewer for the role: ${role}.
${prevContext ? `Previous Q&A:\n${prevContext}\n\n` : ''}
Ask interview question #${questionIndex + 1}. ${questionIndex >= 4 ? 'This is the final question — make it a closing question.' : ''}
Return ONLY valid JSON:
{
  "question": "The interview question",
  "type": "Technical/Behavioral/Situational",
  "isLastQuestion": ${questionIndex >= 4}
}
`;

  const text = await generate(prompt);
  return {
    configured: true,
    ...safeParseJSON(text, { question: 'Tell me about yourself.', type: 'General', isLastQuestion: false })
  };
};

export const evaluateMockAnswer = async (question, answer, role) => {
  if (!aiConfigured) {
    return {
      configured: false,
      score: null,
      feedback: 'Configure AI to receive answer evaluation feedback.',
      strengths: [],
      improvements: []
    };
  }

  const prompt = `
You are evaluating a mock interview answer for the role: ${role}.
Question: ${question}
Candidate Answer: ${answer}

Evaluate fairly and constructively. Do NOT claim psychological or personality diagnosis.
Return ONLY valid JSON:
{
  "score": 7,
  "feedback": "Overall feedback",
  "strengths": ["strength1"],
  "improvements": ["improvement1"]
}
`;

  const text = await generate(prompt);
  return {
    configured: true,
    ...safeParseJSON(text, { score: null, feedback: '', strengths: [], improvements: [] })
  };
};

export const generateMockInterviewFinalFeedback = async (role, qaHistory) => {
  if (!aiConfigured) {
    return {
      configured: false,
      overallScore: null,
      summary: 'Configure Gemini AI for detailed interview feedback.',
      strengths: [],
      improvements: [],
      recommendedActions: []
    };
  }

  const prompt = `
You are providing final feedback for a mock interview for role: ${role}.
Interview Q&A: ${JSON.stringify(qaHistory)}

Provide holistic final feedback. Do NOT claim psychological diagnosis.
Return ONLY valid JSON:
{
  "overallScore": 7,
  "summary": "Overall performance summary",
  "strengths": ["strength1"],
  "improvements": ["area1"],
  "recommendedActions": ["action1"]
}
`;

  const text = await generate(prompt);
  return {
    configured: true,
    ...safeParseJSON(text, { overallScore: null, summary: '', strengths: [], improvements: [], recommendedActions: [] })
  };
};

// ─── Req 68: Personalized Preparation Plan ───────────────────────────────────
export const generatePrepPlan = async ({ targetRole, skillGaps, timeline = 4 }) => {
  if (aiConfigured) {
    try {
      const prompt = `
You are a preparation plan creator for SkillNexus.
Create a ${timeline}-week personalized preparation plan.
Target Role: ${targetRole}
Skill Gaps: ${JSON.stringify(skillGaps)}

Return ONLY valid JSON:
{
  "weeks": [
    {
      "week": 1,
      "focus": "Focus topic",
      "tasks": ["task1", "task2"],
      "resources": ["resource1"]
    }
  ]
}
`;
      const text = await generate(prompt);
      const parsed = safeParseJSON(text, null);
      if (parsed && parsed.weeks && parsed.weeks.length > 0) {
        return { configured: true, ...parsed };
      }
    } catch (err) {
      console.warn('Gemini plan error, falling back to curated:', err.message);
    }
  }

  return getCuratedPrepPlan(targetRole, timeline);
};

// ─── Req 70: Opportunity Trust Analysis ──────────────────────────────────────
export const analyzeOpportunityTrust = async (opportunity, companyVerified) => {
  const indicators = [];
  let trustLevel = 'Verified';

  if (!companyVerified) {
    indicators.push({ flag: 'Organization not verified on SkillNexus', severity: 'medium' });
    trustLevel = 'Information Incomplete';
  }

  if (!opportunity.companyWebsite && !opportunity.contactEmail) {
    indicators.push({ flag: 'No contact information provided', severity: 'medium' });
    trustLevel = 'Review Recommended';
  }

  if (opportunity.description && opportunity.description.length < 100) {
    indicators.push({ flag: 'Opportunity description is very brief', severity: 'low' });
  }

  const suspiciousPatterns = ['pay to apply', 'guarantee job', 'no experience required unlimited', 'work from home earn lakhs'];
  const descLower = (opportunity.description || '').toLowerCase();
  const hasRedFlags = suspiciousPatterns.some(p => descLower.includes(p));

  if (hasRedFlags) {
    indicators.push({
      flag: 'Description contains patterns associated with suspicious listings',
      severity: 'high'
    });
    trustLevel = 'Risk Indicators Detected';
  }

  const note = 'This analysis is based on available platform data. SkillNexus does not definitively classify opportunities as fraudulent.';

  return { trustLevel, indicators, note, companyVerified };
};

export default {
  isAIConfigured,
  extractSkillMapping,
  generateCareerGuidance,
  generateLearningRecommendations,
  getAIGuideResponse,
  explainOpportunityMatch,
  generateInterviewPrep,
  getMockInterviewQuestion,
  evaluateMockAnswer,
  generateMockInterviewFinalFeedback,
  generatePrepPlan,
  analyzeOpportunityTrust
};
