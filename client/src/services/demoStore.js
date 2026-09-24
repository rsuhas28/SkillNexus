/**
 * SkillNexus Client-Side Demo Store
 * Ensures 100% interactive demo functionality on static hosting (e.g. Netlify)
 * when a standalone backend is not connected.
 */

export const DEMO_ACCOUNTS = {
  'student@skillnexus.com': {
    user: {
      _id: 'usr_student_001',
      uid: 'usr_student_001',
      name: 'Alex Rivera',
      email: 'student@skillnexus.com',
      role: 'student',
      emailVerified: true,
      accountStatus: 'active'
    },
    profile: {
      headline: 'Full-Stack Developer & Aspiring AI Engineer | B.Tech CS 2026',
      bio: 'Enthusiastic computer science undergraduate dedicated to building performant cloud systems, responsive web applications, and practical machine learning solutions.',
      institutionName: 'Metropolitan University of Technology',
      degree: 'B.Tech in Computer Science & Engineering',
      graduationYear: '2026',
      skills: ['React', 'Node.js', 'Python', 'Machine Learning', 'TypeScript', 'Docker', 'PostgreSQL', 'AWS'],
      completionPercentage: 92
    }
  },
  'industry@skillnexus.com': {
    user: {
      _id: 'usr_industry_001',
      uid: 'usr_industry_001',
      name: 'Sarah Chen (TechCorp)',
      email: 'industry@skillnexus.com',
      role: 'industry',
      emailVerified: true,
      accountStatus: 'active'
    },
    profile: {
      companyName: 'TechCorp Solutions',
      industrySector: 'Cloud Software & AI Enterprise',
      companySize: '250-1000 Employees',
      website: 'https://techcorp.example.com',
      description: 'Pioneering intelligent enterprise systems, autonomous cloud management, and next-gen collaborative developer tools.',
      completionPercentage: 95
    }
  },
  'academician@skillnexus.com': {
    user: {
      _id: 'usr_academician_001',
      uid: 'usr_academician_001',
      name: 'Dr. Marcus Vance',
      email: 'academician@skillnexus.com',
      role: 'academician',
      emailVerified: true,
      accountStatus: 'active'
    },
    profile: {
      designation: 'Associate Professor & Research Chair',
      department: 'Department of Computer Science & Robotics',
      institutionName: 'Metropolitan University of Technology',
      researchAreas: ['Distributed Systems', 'Applied AI', 'Cyber-Physical Security', 'Edge Computing'],
      completionPercentage: 90
    }
  },
  'institution@skillnexus.com': {
    user: {
      _id: 'usr_institution_001',
      uid: 'usr_institution_001',
      name: 'Dean Robert Sterling',
      email: 'institution@skillnexus.com',
      role: 'institution',
      emailVerified: true,
      accountStatus: 'active'
    },
    profile: {
      institutionName: 'Metropolitan University of Technology',
      institutionType: 'Tier-1 Technical University & Research Center',
      campusLocation: 'Innovation Tech Corridor, Campus North',
      website: 'https://metrotech.edu.example',
      completionPercentage: 92
    }
  },
  'admin@skillnexus.com': {
    user: {
      _id: 'usr_admin_001',
      uid: 'usr_admin_001',
      name: 'Nexus Admin',
      email: 'admin@skillnexus.com',
      role: 'admin',
      emailVerified: true,
      accountStatus: 'active'
    },
    profile: {
      name: 'Nexus Administrator',
      role: 'admin'
    }
  }
};

export const DEMO_OPPORTUNITIES = [
  {
    _id: 'opp_techcorp_001',
    creatorUid: 'usr_industry_001',
    creatorRole: 'industry',
    type: 'internship',
    status: 'published',
    title: 'AI & Machine Learning Engineering Intern',
    description: 'Join our Enterprise Cloud & AI Core engineering unit to build cutting-edge intelligent services, evaluate large language model integrations, and optimize automated inference pipelines.',
    skills: ['Python', 'Machine Learning', 'PyTorch', 'Docker & Containers', 'REST APIs'],
    companyName: 'TechCorp Solutions',
    companyWebsite: 'https://techcorp.example.com',
    contactEmail: 'talent@techcorp.example.com',
    isVerifiedOrg: true,
    location: 'San Francisco, CA / Hybrid',
    workMode: 'hybrid',
    eligibility: 'Penultimate or final-year students in CS, AI, or related fields with solid Python and ML foundations.',
    educationRequired: 'B.Tech / B.S. or M.S. in Computer Science, Data Science or AI',
    experienceRequired: 'Hands-on project work in ML / Deep Learning',
    salary: '',
    stipend: '$4,500 / month (₹45,000 / mo)',
    isFree: true,
    deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
    startDate: new Date(Date.now() + 45 * 86400000).toISOString(),
    duration: '6 Months',
    openings: 4,
    employmentType: 'full-time',
    applicationCount: 14
  },
  {
    _id: 'opp_techcorp_002',
    creatorUid: 'usr_industry_001',
    creatorRole: 'industry',
    type: 'job',
    status: 'published',
    title: 'Full Stack Software Engineer (Graduating 2026)',
    description: 'Looking for high-energy graduate engineers to design high-throughput web architectures, build responsive frontends with React & TypeScript, and power robust distributed backend systems.',
    skills: ['React.js', 'Node.js & Express', 'TypeScript', 'PostgreSQL / SQL', 'Docker & Containers'],
    companyName: 'TechCorp Solutions',
    companyWebsite: 'https://techcorp.example.com',
    contactEmail: 'careers@techcorp.example.com',
    isVerifiedOrg: true,
    location: 'Austin, TX / Remote',
    workMode: 'remote',
    eligibility: 'Graduating batch of 2025/2026 with strong problem-solving and software engineering fundamentals.',
    educationRequired: 'B.Tech / B.E. / B.S. in Computer Science or Software Engineering',
    experienceRequired: '0-1 years (Internships & strong GitHub portfolio considered)',
    salary: '$92,000 - $115,000 / year (₹16 - ₹20 LPA)',
    stipend: '',
    isFree: true,
    deadline: new Date(Date.now() + 45 * 86400000).toISOString(),
    startDate: new Date(Date.now() + 60 * 86400000).toISOString(),
    duration: 'Permanent Full-Time',
    openings: 8,
    employmentType: 'full-time',
    applicationCount: 28
  },
  {
    _id: 'opp_nexusai_001',
    creatorUid: 'usr_industry_002',
    creatorRole: 'industry',
    type: 'internship',
    status: 'published',
    title: 'Generative AI & Agent Systems Intern',
    description: 'Work directly alongside our AI research scientists implementing autonomous agent orchestration, RAG architectures, and fine-tuning lightweight open-weight models.',
    skills: ['Python', 'Machine Learning', 'NLP', 'Vector Databases', 'FastAPI'],
    companyName: 'NexusAI Labs',
    companyWebsite: 'https://nexusai.example.com',
    contactEmail: 'research-interns@nexusai.example.com',
    isVerifiedOrg: true,
    location: 'Palo Alto, CA / Remote',
    workMode: 'remote',
    eligibility: 'Demonstrated proficiency in Python, transformer architectures, and modern agentic frameworks.',
    educationRequired: 'B.Tech / M.Tech in CS or Computational Science',
    experienceRequired: 'Published papers or substantial GitHub AI repositories',
    salary: '',
    stipend: '$5,000 / month (₹55,000 / mo)',
    isFree: true,
    deadline: new Date(Date.now() + 25 * 86400000).toISOString(),
    startDate: new Date(Date.now() + 40 * 86400000).toISOString(),
    duration: '4 - 6 Months',
    openings: 2,
    employmentType: 'full-time',
    applicationCount: 19
  },
  {
    _id: 'opp_cloudscale_001',
    creatorUid: 'usr_industry_003',
    creatorRole: 'industry',
    type: 'internship',
    status: 'published',
    title: 'Cloud Infrastructure & DevOps Intern',
    description: 'Automate multi-region AWS and Kubernetes clusters, write resilient Terraform IaC modules, and configure observability dashboards for enterprise workloads.',
    skills: ['Amazon Web Services (AWS)', 'Docker & Containers', 'Kubernetes', 'Linux', 'Python'],
    companyName: 'CloudScale Systems',
    companyWebsite: 'https://cloudscale.example.com',
    contactEmail: 'talent@cloudscale.example.com',
    isVerifiedOrg: true,
    location: 'Seattle, WA / Hybrid',
    workMode: 'hybrid',
    eligibility: 'Passionate about infrastructure, Linux command line, containers, and site reliability.',
    educationRequired: 'B.Tech in IT / Computer Science',
    experienceRequired: 'Basic cloud experience and containerization knowledge',
    salary: '',
    stipend: '$4,200 / month (₹40,000 / mo)',
    isFree: true,
    deadline: new Date(Date.now() + 20 * 86400000).toISOString(),
    startDate: new Date(Date.now() + 35 * 86400000).toISOString(),
    duration: '3 - 6 Months',
    openings: 3,
    employmentType: 'full-time',
    applicationCount: 9
  },
  {
    _id: 'opp_faculty_001',
    creatorUid: 'usr_industry_001',
    creatorRole: 'industry',
    type: 'fdp',
    status: 'published',
    title: 'Faculty Industry Immersion: Next-Gen Cloud Architecture & GenAI',
    description: 'A 4-week structured professional development residency allowing university professors to engage with real enterprise cloud scale, continuous delivery pipelines, and AI deployments.',
    skills: ['Cloud Computing', 'Enterprise Architecture', 'Applied AI', 'Curriculum Design'],
    companyName: 'TechCorp Solutions',
    companyWebsite: 'https://techcorp.example.com',
    contactEmail: 'university-relations@techcorp.example.com',
    isVerifiedOrg: true,
    location: 'Innovation Tech Center / Hybrid',
    workMode: 'hybrid',
    eligibility: 'Full-time faculty members in Engineering, IT, or Computer Applications departments.',
    educationRequired: 'Ph.D. or Master\'s Degree in Engineering/Science',
    experienceRequired: '3+ years academic teaching experience',
    salary: '',
    stipend: 'Sponsored by TechCorp University Alliance',
    isFree: true,
    deadline: new Date(Date.now() + 40 * 86400000).toISOString(),
    startDate: new Date(Date.now() + 60 * 86400000).toISOString(),
    duration: '4 Weeks',
    openings: 15,
    employmentType: 'part-time',
    applicationCount: 6
  },
  {
    _id: 'opp_collab_001',
    creatorUid: 'usr_academician_001',
    creatorRole: 'academician',
    type: 'live_project',
    status: 'published',
    title: 'Edge AI Sensor Fusion for Sustainable Smart Campus',
    description: 'Collaborative research and implementation project to deploy low-cost solar-powered edge IoT sensors monitoring ambient environmental metrics with predictive AI models.',
    skills: ['Python', 'Machine Learning', 'IoT & Embedded', 'Edge Computing'],
    companyName: 'Apex Robotics Lab & Metropolitan Tech',
    companyWebsite: 'https://metrotech.edu.example',
    contactEmail: 'mvance@metrotech.edu.example',
    isVerifiedOrg: true,
    location: 'Metropolitan University Campus',
    workMode: 'on-site',
    eligibility: 'Undergraduate and postgraduate students with strong microcontroller and machine learning backgrounds.',
    educationRequired: 'B.Tech / M.Tech in CS, ECE, or Robotics',
    experienceRequired: 'Coursework in IoT or ML',
    salary: '',
    stipend: 'Research Fellowship Grant ($1,200 / ₹15,000 / mo)',
    isFree: true,
    deadline: new Date(Date.now() + 28 * 86400000).toISOString(),
    startDate: new Date(Date.now() + 45 * 86400000).toISOString(),
    duration: '6 Months',
    openings: 5,
    employmentType: 'part-time',
    applicationCount: 8
  }
];

export const DEMO_STUDENT_DATA = {
  skills: [
    { _id: 'sk_1', skillName: 'React.js', category: 'Web Development', proficiency: 'Advanced', evidence: 'Built 6 production-grade SPAs with modern hooks and state machines', yearsExperience: 2, monthsExperience: 6, source: 'self-declared' },
    { _id: 'sk_2', skillName: 'JavaScript (ES6+)', category: 'Programming', proficiency: 'Expert', evidence: 'Verified via Technical Assessment score: 94%', yearsExperience: 3, monthsExperience: 0, source: 'assessment' },
    { _id: 'sk_3', skillName: 'Node.js & Express', category: 'Web Development', proficiency: 'Advanced', evidence: 'Designed microservices architecture handling 1k+ concurrent requests', yearsExperience: 2, monthsExperience: 4, source: 'self-declared' },
    { _id: 'sk_4', skillName: 'Python', category: 'Programming', proficiency: 'Advanced', evidence: 'Used for PyTorch models, data analytics pipelines, and FastAPI microservices', yearsExperience: 3, monthsExperience: 0, source: 'self-declared' },
    { _id: 'sk_5', skillName: 'Machine Learning', category: 'AI/ML', proficiency: 'Intermediate', evidence: 'Completed Coursera Deep Learning Specialization and trained CNN vision models', yearsExperience: 1, monthsExperience: 8, source: 'assessment' },
    { _id: 'sk_6', skillName: 'TypeScript', category: 'Programming', proficiency: 'Advanced', evidence: 'Strict typing across frontend and Node.js backend services', yearsExperience: 2, monthsExperience: 0, source: 'self-declared' },
    { _id: 'sk_7', skillName: 'Docker & Containers', category: 'DevOps', proficiency: 'Intermediate', evidence: 'Multi-stage Dockerfiles and compose setups for distributed local dev', yearsExperience: 1, monthsExperience: 6, source: 'self-declared' },
    { _id: 'sk_8', skillName: 'PostgreSQL / SQL', category: 'Databases', proficiency: 'Advanced', evidence: 'Query optimization, indexing strategies, schema migrations', yearsExperience: 2, monthsExperience: 2, source: 'self-declared' },
    { _id: 'sk_9', skillName: 'Amazon Web Services (AWS)', category: 'Cloud', proficiency: 'Intermediate', evidence: 'AWS Certified Solutions Architect Associate (EC2, S3, RDS, Lambda)', yearsExperience: 1, monthsExperience: 2, source: 'self-declared' }
  ],
  education: [
    {
      _id: 'edu_1',
      institution: 'Metropolitan University of Technology',
      degree: 'Bachelor of Technology (B.Tech)',
      specialization: 'Computer Science & Engineering',
      startYear: '2022',
      endYear: '2026',
      isCurrent: true,
      cgpa: '3.88 / 4.0 (Dean\'s Honor List)',
      location: 'Innovation Corridor, East Campus',
      description: 'Specializing in Distributed Systems, Artificial Intelligence, and Modern Software Architecture.'
    }
  ],
  projects: [
    {
      _id: 'proj_1',
      title: 'SkillNexus AI — Intelligent Career & Academia Platform',
      description: 'Full-stack platform connecting university students with industry internships and academic research through AI skill verification and explainable matching algorithms.',
      problemSolved: 'Eliminates traditional resume black-holes by offering verifiable evidence of competencies and direct industry pipelines.',
      technologies: ['React 18', 'Node.js', 'Express', 'MongoDB', 'Gemini AI', 'TailwindCSS'],
      skillsUsed: ['React.js', 'Node.js & Express', 'MongoDB', 'REST APIs', 'Cloudinary'],
      role: 'Lead Architect & Full Stack Developer',
      teamSize: 3,
      startDate: '2025-10',
      endDate: 'Present',
      projectUrl: 'https://skillnexus-demo.example.com',
      githubUrl: 'https://github.com/rsuhas28/SkillNexus',
      demoUrl: 'https://skillnexus-demo.example.com',
      isPortfolioHighlight: true
    },
    {
      _id: 'proj_2',
      title: 'Autonomous Edge Vision Classifier',
      description: 'Real-time multi-class object detection and classification pipeline running on low-power edge devices utilizing PyTorch, TensorRT, and OpenCV.',
      problemSolved: 'Reduced model inference latency from 180ms to 24ms while preserving 98.2% mAP accuracy.',
      technologies: ['Python', 'PyTorch', 'OpenCV', 'TensorRT', 'Docker'],
      skillsUsed: ['Python', 'Machine Learning', 'Docker & Containers'],
      role: 'ML Research Developer',
      teamSize: 2,
      startDate: '2025-03',
      endDate: '2025-08',
      projectUrl: 'https://github.com/alexrivera-dev/edge-vision-ml',
      githubUrl: 'https://github.com/alexrivera-dev/edge-vision-ml',
      demoUrl: 'https://vision-demo.alexrivera.dev',
      isPortfolioHighlight: true
    }
  ],
  certifications: [
    {
      _id: 'cert_1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuingOrg: 'Amazon Web Services (AWS)',
      issueDate: '2025-06-15',
      expiryDate: '2028-06-15',
      credentialId: 'AWS-SAA-982341-NEXUS',
      credentialUrl: 'https://aws.amazon.com/verification',
      skillsCovered: ['Amazon Web Services (AWS)', 'Cloud Architecture', 'Security & VPC', 'Microservices']
    },
    {
      _id: 'cert_2',
      name: 'DeepLearning.AI Machine Learning Specialization',
      issuingOrg: 'Coursera & Stanford Online',
      issueDate: '2025-02-10',
      expiryDate: '',
      credentialId: 'COURSERA-ML-492019',
      credentialUrl: 'https://coursera.org/verify/COURSERA-ML-492019',
      skillsCovered: ['Machine Learning', 'Python', 'Neural Networks', 'Supervised Learning']
    }
  ],
  achievements: [
    {
      _id: 'ach_1',
      title: '1st Place Winner — National Smart AI Hackathon 2025',
      organization: 'Ministry of Higher Education & Innovation Council',
      date: '2025-08-14',
      description: 'Competed against 450+ collegiate teams nationwide; built an autonomous visual accessibility aid for visually impaired pedestrians.',
      category: 'Hackathon',
      link: 'https://hackathon.gov.example/winners-2025'
    }
  ],
  applications: [
    {
      _id: 'app_alex_techcorp_ai',
      studentUid: 'usr_student_001',
      opportunityId: 'opp_techcorp_001',
      creatorUid: 'usr_industry_001',
      status: 'interview',
      coverLetter: 'I have hands-on experience training PyTorch vision models and creating full-stack AI services.',
      resumeUrl: 'https://alexrivera.dev/resume.pdf',
      portfolioUrl: 'https://alexrivera.dev',
      statusHistory: [
        { status: 'applied', changedAt: new Date(Date.now() - 7 * 86400000).toISOString(), note: 'Submitted application' },
        { status: 'shortlisted', changedAt: new Date(Date.now() - 3 * 86400000).toISOString(), note: 'Shortlisted by AI match matrix' },
        { status: 'interview', changedAt: new Date(Date.now() - 1 * 86400000).toISOString(), note: 'Scheduled for Technical Round 2' }
      ]
    },
    {
      _id: 'app_alex_techcorp_eng',
      studentUid: 'usr_student_001',
      opportunityId: 'opp_techcorp_002',
      creatorUid: 'usr_industry_001',
      status: 'shortlisted',
      coverLetter: 'Graduating in 2026 with extensive React and Node.js production experience.',
      resumeUrl: 'https://alexrivera.dev/resume.pdf',
      portfolioUrl: 'https://alexrivera.dev',
      statusHistory: [
        { status: 'applied', changedAt: new Date(Date.now() - 4 * 86400000).toISOString(), note: 'Application received' },
        { status: 'shortlisted', changedAt: new Date(Date.now() - 2 * 86400000).toISOString(), note: 'Shortlisted' }
      ]
    }
  ],
  interviews: [
    {
      _id: 'int_1',
      applicationId: 'app_alex_techcorp_ai',
      studentUid: 'usr_student_001',
      creatorUid: 'usr_industry_001',
      stage: 'Technical Round 2: System Architecture & Coding',
      scheduledAt: new Date(Date.now() + 2 * 86400000).toISOString(),
      durationMinutes: 60,
      mode: 'video',
      meetingLink: 'https://meet.google.com/nex-usai-demo',
      interviewer: 'David Kim (Principal Systems Architect, TechCorp)',
      notes: 'Focus on distributed caching, React performance optimization, and ML inference latency reduction.',
      result: 'pending'
    }
  ],
  placements: [
    {
      _id: 'plc_1',
      studentUid: 'usr_student_002',
      applicationId: 'app_maya_cloudscale',
      opportunityId: 'opp_cloudscale_001',
      companyName: 'CloudScale Systems',
      role: 'Junior Cloud DevOps Engineer',
      selectionDate: new Date(Date.now() - 2 * 86400000).toISOString(),
      joiningDate: new Date(Date.now() + 30 * 86400000).toISOString(),
      status: 'selected',
      packageOffered: '$84,000 / year (₹14.5 LPA)'
    }
  ],
  collaborations: [
    {
      _id: 'collab_1',
      creatorUid: 'usr_academician_001',
      type: 'research',
      title: 'Privacy-Preserving Federated Learning for Distributed Medical Imaging',
      description: 'Joint research project between Metropolitan University and TechCorp Health AI unit to train diagnostic models on decentralized data nodes.',
      skills: ['Federated Learning', 'Python', 'Differential Privacy', 'PyTorch'],
      timeline: '12 Months (2025 - 2026)',
      status: 'in-progress',
      partnerUid: 'usr_industry_001',
      partnerName: 'TechCorp Health & AI Labs',
      funding: '$65,000 Industry Research Grant',
      deliverables: '2 IEEE / ACM Conference Papers + Open Source Framework'
    }
  ],
  analytics: {
    overview: {
      totalStudents: 1420,
      totalCompanies: 48,
      totalFaculty: 86,
      activeOpportunities: 24,
      totalApplications: 680,
      totalPlacements: 312,
      completedAssessments: 890,
      placementRate: 78
    },
    skills: {
      totalSkillsRecorded: 3450,
      topSkills: [
        { name: 'React.js', count: 420 },
        { name: 'Python', count: 395 },
        { name: 'Node.js', count: 310 },
        { name: 'SQL', count: 280 },
        { name: 'Machine Learning', count: 240 },
        { name: 'Docker', count: 190 },
        { name: 'AWS', count: 175 }
      ],
      categoryDistribution: [
        { name: 'Web Development', count: 1100 },
        { name: 'Programming', count: 980 },
        { name: 'AI/ML', count: 540 },
        { name: 'Databases', count: 420 },
        { name: 'DevOps & Cloud', count: 410 }
      ],
      proficiencyDistribution: [
        { level: 'Beginner', count: 850 },
        { level: 'Intermediate', count: 1420 },
        { level: 'Advanced', count: 940 },
        { level: 'Expert', count: 240 }
      ]
    },
    placements: {
      totalPlacements: 312,
      eligibleStudents: 400,
      placementRate: 78,
      topRecruiters: [
        { company: 'TechCorp Solutions', hires: 34 },
        { company: 'CloudScale Systems', hires: 28 },
        { company: 'NexusAI Labs', hires: 19 },
        { company: 'FinTech Innovations', hires: 18 }
      ],
      topRoles: [
        { role: 'Full Stack Engineer', count: 92 },
        { role: 'Data Scientist / ML Engineer', count: 68 },
        { role: 'Cloud / DevOps Engineer', count: 54 },
        { role: 'Frontend Developer', count: 45 }
      ]
    },
    demand: {
      totalAnalyzedOpportunities: 24,
      skillDemandVsSupply: [
        { skill: 'React.js', industryDemand: 45, studentSupply: 42, gapIndex: 3 },
        { skill: 'Python', industryDemand: 52, studentSupply: 39, gapIndex: 13 },
        { skill: 'Docker & Containers', industryDemand: 38, studentSupply: 19, gapIndex: 19 },
        { skill: 'Machine Learning', industryDemand: 34, studentSupply: 24, gapIndex: 10 },
        { skill: 'AWS Cloud', industryDemand: 40, studentSupply: 17, gapIndex: 23 },
        { skill: 'TypeScript', industryDemand: 36, studentSupply: 22, gapIndex: 14 }
      ]
    }
  }
};
