import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import {
  UserModel,
  StudentProfileModel,
  IndustryProfileModel,
  AcademicianProfileModel,
  InstitutionProfileModel,
  StudentExtProfileModel,
  PortfolioModel,
  StudentSkillModel,
  StudentEducationModel,
  StudentProjectModel,
  StudentCertificationModel,
  StudentAchievementModel,
  OpportunityModel,
  VerificationModel,
  ApplicationModel,
  InterviewModel,
  PlacementModel,
  CollaborationModel,
  AssessmentAttemptModel,
  SkillGapModel,
  MockInterviewModel
} from '../models/dbAdapter.js';

dotenv.config();

export const seedDemoData = async () => {
  console.log('🌱 [SkillNexus] Seeding comprehensive demo data...');
  await connectDB();

  const salt = await bcrypt.genSalt(10);
  const defaultPassword = await bcrypt.hash('Demo@1234', salt);
  const studentPassword = await bcrypt.hash('Student@1234', salt);
  const industryPassword = await bcrypt.hash('Industry@1234', salt);
  const facultyPassword = await bcrypt.hash('Faculty@1234', salt);
  const adminPassword = await bcrypt.hash('Admin@1234', salt);
  const institutePassword = await bcrypt.hash('Institute@1234', salt);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. DEMO USERS ACROSS ROLES
  // ─────────────────────────────────────────────────────────────────────────────
  const demoUsers = [
    {
      uid: 'usr_admin_001',
      name: 'Nexus Admin',
      email: 'admin@skillnexus.com',
      password: adminPassword,
      role: 'admin',
      emailVerified: true,
      accountStatus: 'active'
    },
    {
      uid: 'usr_student_001',
      name: 'Alex Rivera',
      email: 'student@skillnexus.com',
      password: studentPassword,
      role: 'student',
      emailVerified: true,
      accountStatus: 'active'
    },
    {
      uid: 'usr_student_002',
      name: 'Maya Patel',
      email: 'maya.patel@example.com',
      password: defaultPassword,
      role: 'student',
      emailVerified: true,
      accountStatus: 'active'
    },
    {
      uid: 'usr_student_003',
      name: 'Liam O\'Connor',
      email: 'liam.dev@example.com',
      password: defaultPassword,
      role: 'student',
      emailVerified: true,
      accountStatus: 'active'
    },
    {
      uid: 'usr_student_004',
      name: 'Priya Sharma',
      email: 'priya.ai@example.com',
      password: defaultPassword,
      role: 'student',
      emailVerified: true,
      accountStatus: 'active'
    },
    {
      uid: 'usr_industry_001',
      name: 'Sarah Chen (TechCorp)',
      email: 'industry@skillnexus.com',
      password: industryPassword,
      role: 'industry',
      emailVerified: true,
      accountStatus: 'active'
    },
    {
      uid: 'usr_industry_002',
      name: 'Marcus Brody',
      email: 'nexus.ai@example.com',
      password: defaultPassword,
      role: 'industry',
      emailVerified: true,
      accountStatus: 'active'
    },
    {
      uid: 'usr_industry_003',
      name: 'Elena Rostova',
      email: 'cloudscale@example.com',
      password: defaultPassword,
      role: 'industry',
      emailVerified: true,
      accountStatus: 'active'
    },
    {
      uid: 'usr_academician_001',
      name: 'Dr. Marcus Vance',
      email: 'academician@skillnexus.com',
      password: facultyPassword,
      role: 'academician',
      emailVerified: true,
      accountStatus: 'active'
    },
    {
      uid: 'usr_academician_002',
      name: 'Prof. Aisha Khan',
      email: 'aisha.khan@example.com',
      password: defaultPassword,
      role: 'academician',
      emailVerified: true,
      accountStatus: 'active'
    },
    {
      uid: 'usr_institution_001',
      name: 'Dean Robert Sterling',
      email: 'institution@skillnexus.com',
      password: institutePassword,
      role: 'institution',
      emailVerified: true,
      accountStatus: 'active'
    }
  ];

  for (const u of demoUsers) {
    const existing = await UserModel.findOne({ email: u.email });
    if (!existing) {
      await UserModel.create(u);
    } else {
      await UserModel.updateOne({ email: u.email }, { $set: u });
    }
  }
  console.log(`✅ Seeded ${demoUsers.length} Users`);

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. PRIMARY PROFILES
  // ─────────────────────────────────────────────────────────────────────────────
  const studentProfiles = [
    {
      uid: 'usr_student_001',
      headline: 'Full-Stack Developer & Aspiring AI Engineer | B.Tech CS 2026',
      bio: 'Enthusiastic computer science undergraduate dedicated to building performant cloud systems, responsive web applications, and practical machine learning solutions.',
      institutionName: 'Metropolitan University of Technology',
      degree: 'B.Tech in Computer Science & Engineering',
      graduationYear: '2026',
      skills: ['React', 'Node.js', 'Python', 'Machine Learning', 'TypeScript', 'Docker', 'PostgreSQL', 'AWS'],
      completionPercentage: 92
    },
    {
      uid: 'usr_student_002',
      headline: 'Cloud & DevOps Specialist | Certified Kubernetes Admin Aspirant',
      bio: 'Cloud architecture enthusiast focusing on CI/CD automation, microservices orchestration, and infrastructure as code.',
      institutionName: 'Metropolitan University of Technology',
      degree: 'B.Tech in Information Technology',
      graduationYear: '2026',
      skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Linux', 'Python', 'Go'],
      completionPercentage: 88
    },
    {
      uid: 'usr_student_003',
      headline: 'Frontend Engineer & UI/UX Craftsman',
      bio: 'Creating delightful, accessible, and fast web experiences with React, Next.js, and modern CSS.',
      institutionName: 'Global Institute of Technology',
      degree: 'B.S. in Software Engineering',
      graduationYear: '2025',
      skills: ['React', 'TypeScript', 'TailwindCSS', 'Next.js', 'Figma', 'GraphQL'],
      completionPercentage: 85
    },
    {
      uid: 'usr_student_004',
      headline: 'AI & Data Science Researcher | Deep Learning & NLP',
      bio: 'Passionate about generative AI models, vector search architectures, and conversational agents.',
      institutionName: 'Metropolitan University of Technology',
      degree: 'B.Tech in Data Science & AI',
      graduationYear: '2026',
      skills: ['Python', 'PyTorch', 'TensorFlow', 'NLP', 'Vector Databases', 'LangChain', 'FastAPI'],
      completionPercentage: 90
    }
  ];

  for (const sp of studentProfiles) {
    const existing = await StudentProfileModel.findOne({ uid: sp.uid });
    if (!existing) await StudentProfileModel.create(sp);
    else await StudentProfileModel.updateOne({ uid: sp.uid }, { $set: sp });
  }

  // Extended Student Profile for Alex Rivera
  await StudentExtProfileModel.updateOne(
    { uid: 'usr_student_001' },
    {
      $set: {
        uid: 'usr_student_001',
        headline: 'Full-Stack Developer & Aspiring AI Engineer | B.Tech CS 2026',
        about: 'Passionate software engineering student with practical experience building distributed applications, AI-enabled web platforms, and REST/GraphQL microservices. Active open-source contributor and hackathon enthusiast.',
        careerObjective: 'To join an innovative engineering team as a Software Engineer or AI/ML Intern where I can build scalable systems and make a meaningful impact.',
        phone: '+1 (555) 382-9014',
        location: 'San Francisco Bay Area / Remote',
        linkedin: 'https://linkedin.com/in/alex-rivera-skillnexus',
        github: 'https://github.com/alexrivera-dev',
        portfolio: 'https://alexrivera.dev',
        portfolioSlug: 'alex-rivera',
        portfolioPublic: true,
        preferredRoles: ['Full Stack Developer', 'AI/ML Engineer', 'Software Engineer', 'Frontend Developer'],
        preferredIndustries: ['AI & Cloud Services', 'SaaS', 'FinTech', 'EdTech'],
        preferredLocations: ['Remote', 'San Francisco, CA', 'New York, NY', 'Bangalore, India'],
        availability: 'immediate',
        completionPercentage: 95
      }
    },
    { upsert: true }
  );

  // Digital Portfolio for Alex Rivera
  await PortfolioModel.updateOne(
    { uid: 'usr_student_001' },
    {
      $set: {
        uid: 'usr_student_001',
        slug: 'alex-rivera',
        isPublic: true,
        sections: [
          { id: 'sec-1', type: 'about', visible: true, order: 1 },
          { id: 'sec-2', type: 'skills', visible: true, order: 2 },
          { id: 'sec-3', type: 'projects', visible: true, order: 3 },
          { id: 'sec-4', type: 'certifications', visible: true, order: 4 },
          { id: 'sec-5', type: 'achievements', visible: true, order: 5 },
          { id: 'sec-6', type: 'education', visible: true, order: 6 }
        ],
        customLinks: [
          { label: 'GitHub Profile', url: 'https://github.com/alexrivera-dev' },
          { label: 'Interactive Demos', url: 'https://demo.alexrivera.dev' }
        ]
      }
    },
    { upsert: true }
  );

  // Industry Profiles
  const industryProfiles = [
    {
      uid: 'usr_industry_001',
      companyName: 'TechCorp Solutions',
      industrySector: 'Cloud Software & AI Enterprise',
      companySize: '250-1000 Employees',
      website: 'https://techcorp.example.com',
      description: 'Pioneering intelligent enterprise systems, autonomous cloud management, and next-gen collaborative developer tools.',
      completionPercentage: 95
    },
    {
      uid: 'usr_industry_002',
      companyName: 'NexusAI Labs',
      industrySector: 'Artificial Intelligence & Machine Learning',
      companySize: '50-250 Employees',
      website: 'https://nexusai.example.com',
      description: 'Building multimodal foundation models, agentic workflows, and privacy-preserving inference infrastructure.',
      completionPercentage: 90
    },
    {
      uid: 'usr_industry_003',
      companyName: 'CloudScale Systems',
      industrySector: 'Cloud Infrastructure & DevOps',
      companySize: '1000+ Employees',
      website: 'https://cloudscale.example.com',
      description: 'Global provider of hyperscale container orchestration, observability platforms, and hybrid cloud solutions.',
      completionPercentage: 88
    }
  ];

  for (const ip of industryProfiles) {
    const existing = await IndustryProfileModel.findOne({ uid: ip.uid });
    if (!existing) await IndustryProfileModel.create(ip);
    else await IndustryProfileModel.updateOne({ uid: ip.uid }, { $set: ip });
  }

  // Academician Profiles
  const academicianProfiles = [
    {
      uid: 'usr_academician_001',
      designation: 'Associate Professor & Research Chair',
      department: 'Department of Computer Science & Robotics',
      institutionName: 'Metropolitan University of Technology',
      researchAreas: ['Distributed Systems', 'Applied AI', 'Cyber-Physical Security', 'Edge Computing'],
      completionPercentage: 90
    },
    {
      uid: 'usr_academician_002',
      designation: 'Professor & Head of Data Sciences',
      department: 'Department of Artificial Intelligence & Data Science',
      institutionName: 'Apex Institute of Science & Technology',
      researchAreas: ['Natural Language Processing', 'Deep Reinforcement Learning', 'Bio-inspired Algorithms'],
      completionPercentage: 88
    }
  ];

  for (const ap of academicianProfiles) {
    const existing = await AcademicianProfileModel.findOne({ uid: ap.uid });
    if (!existing) await AcademicianProfileModel.create(ap);
    else await AcademicianProfileModel.updateOne({ uid: ap.uid }, { $set: ap });
  }

  // Institution Profile
  await InstitutionProfileModel.updateOne(
    { uid: 'usr_institution_001' },
    {
      $set: {
        uid: 'usr_institution_001',
        institutionName: 'Metropolitan University of Technology',
        institutionType: 'Tier-1 Technical University & Research Center',
        campusLocation: 'Innovation Tech Corridor, Campus North',
        website: 'https://metrotech.edu.example',
        completionPercentage: 92
      }
    },
    { upsert: true }
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. STUDENT SKILLS (Alex Rivera + Others)
  // ─────────────────────────────────────────────────────────────────────────────
  await StudentSkillModel.deleteMany({ uid: 'usr_student_001' });

  const alexSkills = [
    { uid: 'usr_student_001', skillName: 'React.js', category: 'Web Development', proficiency: 'Advanced', evidence: 'Built 6 production-grade SPAs with modern hooks and state machines', yearsExperience: 2, monthsExperience: 6, source: 'self-declared' },
    { uid: 'usr_student_001', skillName: 'JavaScript (ES6+)', category: 'Programming', proficiency: 'Expert', evidence: 'Verified via Technical Assessment score: 94%', yearsExperience: 3, monthsExperience: 0, source: 'assessment' },
    { uid: 'usr_student_001', skillName: 'Node.js & Express', category: 'Web Development', proficiency: 'Advanced', evidence: 'Designed microservices architecture handling 1k+ concurrent requests', yearsExperience: 2, monthsExperience: 4, source: 'self-declared' },
    { uid: 'usr_student_001', skillName: 'Python', category: 'Programming', proficiency: 'Advanced', evidence: 'Used for PyTorch models, data analytics pipelines, and FastAPI microservices', yearsExperience: 3, monthsExperience: 0, source: 'self-declared' },
    { uid: 'usr_student_001', skillName: 'Machine Learning', category: 'AI/ML', proficiency: 'Intermediate', evidence: 'Completed Coursera Deep Learning Specialization and trained CNN vision models', yearsExperience: 1, monthsExperience: 8, source: 'assessment' },
    { uid: 'usr_student_001', skillName: 'TypeScript', category: 'Programming', proficiency: 'Advanced', evidence: 'Strict typing across frontend and Node.js backend services', yearsExperience: 2, monthsExperience: 0, source: 'self-declared' },
    { uid: 'usr_student_001', skillName: 'Docker & Containers', category: 'DevOps', proficiency: 'Intermediate', evidence: 'Multi-stage Dockerfiles and compose setups for distributed local dev', yearsExperience: 1, monthsExperience: 6, source: 'self-declared' },
    { uid: 'usr_student_001', skillName: 'PostgreSQL / SQL', category: 'Databases', proficiency: 'Advanced', evidence: 'Query optimization, indexing strategies, schema migrations', yearsExperience: 2, monthsExperience: 2, source: 'self-declared' },
    { uid: 'usr_student_001', skillName: 'Amazon Web Services (AWS)', category: 'Cloud', proficiency: 'Intermediate', evidence: 'AWS Certified Solutions Architect Associate (EC2, S3, RDS, Lambda)', yearsExperience: 1, monthsExperience: 2, source: 'self-declared' },
    { uid: 'usr_student_001', skillName: 'Git & GitHub Collaboration', category: 'Tools', proficiency: 'Expert', evidence: 'Branching strategies, CI/CD action workflows, open-source maintainer', yearsExperience: 3, monthsExperience: 0, source: 'self-declared' },
    { uid: 'usr_student_001', skillName: 'Communication & Teamwork', category: 'Soft Skills', proficiency: 'Expert', evidence: 'Led hackathon team of 5 to 1st place in National Smart AI Hackathon', yearsExperience: 3, monthsExperience: 0, source: 'assessment' }
  ];

  for (const s of alexSkills) {
    await StudentSkillModel.create(s);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. STUDENT EDUCATION, PROJECTS, CERTIFICATIONS, ACHIEVEMENTS
  // ─────────────────────────────────────────────────────────────────────────────
  await StudentEducationModel.deleteMany({ uid: 'usr_student_001' });
  await StudentEducationModel.create({
    uid: 'usr_student_001',
    institution: 'Metropolitan University of Technology',
    degree: 'Bachelor of Technology (B.Tech)',
    specialization: 'Computer Science & Engineering',
    startYear: '2022',
    endYear: '2026',
    isCurrent: true,
    cgpa: '3.88 / 4.0 (Dean\'s Honor List)',
    location: 'Innovation Corridor, East Campus',
    description: 'Specializing in Distributed Systems, Artificial Intelligence, and Modern Software Architecture. Active member of ACM Student Chapter.'
  });

  await StudentEducationModel.create({
    uid: 'usr_student_001',
    institution: 'St. Jude International Academy',
    degree: 'High School Diploma (Science & Mathematics)',
    specialization: 'STEM Honors Stream',
    startYear: '2020',
    endYear: '2022',
    isCurrent: false,
    cgpa: '96.4%',
    location: 'West District',
    description: 'Valedictorian nominee, National Science Olympiad regional silver medalist.'
  });

  // Projects
  await StudentProjectModel.deleteMany({ uid: 'usr_student_001' });
  const alexProjects = [
    {
      uid: 'usr_student_001',
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
      uid: 'usr_student_001',
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
    },
    {
      uid: 'usr_student_001',
      title: 'Distributed Key-Value Store with Raft Consensus',
      description: 'Fault-tolerant distributed database implementing the Raft leader election and log replication consensus protocol with linearizable reads.',
      problemSolved: 'Maintains high availability and strong consistency across simulated network partitions and server crashes.',
      technologies: ['Go', 'gRPC', 'Docker', 'Raft Protocol'],
      skillsUsed: ['Distributed Systems', 'Go', 'Docker & Containers'],
      role: 'Systems Engineer',
      teamSize: 1,
      startDate: '2024-09',
      endDate: '2024-12',
      projectUrl: 'https://github.com/alexrivera-dev/raft-kv-store',
      githubUrl: 'https://github.com/alexrivera-dev/raft-kv-store',
      demoUrl: '',
      isPortfolioHighlight: false
    }
  ];

  for (const p of alexProjects) {
    await StudentProjectModel.create(p);
  }

  // Certifications
  await StudentCertificationModel.deleteMany({ uid: 'usr_student_001' });
  const alexCerts = [
    {
      uid: 'usr_student_001',
      name: 'AWS Certified Solutions Architect – Associate',
      issuingOrg: 'Amazon Web Services (AWS)',
      issueDate: '2025-06-15',
      expiryDate: '2028-06-15',
      credentialId: 'AWS-SAA-982341-NEXUS',
      credentialUrl: 'https://aws.amazon.com/verification',
      skillsCovered: ['Amazon Web Services (AWS)', 'Cloud Architecture', 'Security & VPC', 'Microservices']
    },
    {
      uid: 'usr_student_001',
      name: 'DeepLearning.AI Machine Learning Specialization',
      issuingOrg: 'Coursera & Stanford Online',
      issueDate: '2025-02-10',
      expiryDate: '',
      credentialId: 'COURSERA-ML-492019',
      credentialUrl: 'https://coursera.org/verify/COURSERA-ML-492019',
      skillsCovered: ['Machine Learning', 'Python', 'Neural Networks', 'Supervised Learning']
    },
    {
      uid: 'usr_student_001',
      name: 'Meta Certified Front-End Developer',
      issuingOrg: 'Meta',
      issueDate: '2024-11-20',
      expiryDate: '',
      credentialId: 'META-FED-884123',
      credentialUrl: 'https://coursera.org/verify/META-FED-884123',
      skillsCovered: ['React.js', 'JavaScript (ES6+)', 'UI/UX Design', 'TypeScript']
    }
  ];

  for (const c of alexCerts) {
    await StudentCertificationModel.create(c);
  }

  // Achievements
  await StudentAchievementModel.deleteMany({ uid: 'usr_student_001' });
  const alexAchievements = [
    {
      uid: 'usr_student_001',
      title: '1st Place Winner — National Smart AI Hackathon 2025',
      organization: 'Ministry of Higher Education & Innovation Council',
      date: '2025-08-14',
      description: 'Competed against 450+ collegiate teams nationwide; built an autonomous visual accessibility aid for visually impaired pedestrians.',
      category: 'Hackathon',
      link: 'https://hackathon.gov.example/winners-2025'
    },
    {
      uid: 'usr_student_001',
      title: 'Dean\'s List for Outstanding Academic Excellence (Consecutive 4 Semesters)',
      organization: 'Metropolitan University of Technology',
      date: '2025-06-01',
      description: 'Recognized for achieving top 2% GPA in the Department of Computer Science & Engineering.',
      category: 'Award',
      link: ''
    },
    {
      uid: 'usr_student_001',
      title: 'Best Research Paper Award — Collegiate Tech Symposium',
      organization: 'IEEE Student Branch & Apex Research',
      date: '2025-04-20',
      description: 'Authored undergraduate paper on lightweight convolutional neural network optimization for edge robotics.',
      category: 'Publication',
      link: 'https://doi.org/10.example/tech-paper-2025'
    }
  ];

  for (const a of alexAchievements) {
    await StudentAchievementModel.create(a);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. OPPORTUNITIES (Jobs, Internships, Faculty Training, Research)
  // ─────────────────────────────────────────────────────────────────────────────
  await OpportunityModel.deleteMany({});

  const demoOpportunities = [
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
      deadline: new Date(Date.now() + 30 * 86400000),
      startDate: new Date(Date.now() + 45 * 86400000),
      duration: '6 Months (Full-Time / Part-Time negotiable)',
      openings: 4,
      employmentType: 'full-time',
      applicationCount: 14,
      reportCount: 0
    },
    {
      _id: 'opp_techcorp_002',
      creatorUid: 'usr_industry_001',
      creatorRole: 'industry',
      type: 'job',
      status: 'published',
      title: 'Full Stack Software Engineer (Campus Graduate 2026)',
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
      deadline: new Date(Date.now() + 45 * 86400000),
      startDate: new Date(Date.now() + 60 * 86400000),
      duration: 'Permanent Full-Time',
      openings: 8,
      employmentType: 'full-time',
      applicationCount: 28,
      reportCount: 0
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
      deadline: new Date(Date.now() + 25 * 86400000),
      startDate: new Date(Date.now() + 40 * 86400000),
      duration: '4 - 6 Months',
      openings: 2,
      employmentType: 'full-time',
      applicationCount: 19,
      reportCount: 0
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
      deadline: new Date(Date.now() + 20 * 86400000),
      startDate: new Date(Date.now() + 35 * 86400000),
      duration: '3 - 6 Months',
      openings: 3,
      employmentType: 'full-time',
      applicationCount: 9,
      reportCount: 0
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
      deadline: new Date(Date.now() + 40 * 86400000),
      startDate: new Date(Date.now() + 60 * 86400000),
      duration: '4 Weeks',
      openings: 15,
      employmentType: 'part-time',
      applicationCount: 6,
      reportCount: 0
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
      deadline: new Date(Date.now() + 28 * 86400000),
      startDate: new Date(Date.now() + 45 * 86400000),
      duration: '6 Months',
      openings: 5,
      employmentType: 'part-time',
      applicationCount: 8,
      reportCount: 0
    }
  ];

  for (const o of demoOpportunities) {
    await OpportunityModel.create(o);
  }
  console.log(`✅ Seeded ${demoOpportunities.length} Published Opportunities`);

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. APPLICATIONS & RECRUITMENT PIPELINE
  // ─────────────────────────────────────────────────────────────────────────────
  await ApplicationModel.deleteMany({});
  await InterviewModel.deleteMany({});
  await PlacementModel.deleteMany({});

  const demoApplications = [
    {
      _id: 'app_alex_techcorp_ai',
      studentUid: 'usr_student_001',
      opportunityId: 'opp_techcorp_001',
      creatorUid: 'usr_industry_001',
      coverLetter: 'I have hands-on experience training PyTorch vision models and creating full-stack AI services. I would love the chance to apply these skills to TechCorp\'s enterprise cloud platform.',
      resumeUrl: 'https://alexrivera.dev/resume.pdf',
      portfolioUrl: 'https://alexrivera.dev',
      status: 'interview',
      statusHistory: [
        { status: 'applied', changedAt: new Date(Date.now() - 7 * 86400000), note: 'Submitted application with portfolio' },
        { status: 'under-review', changedAt: new Date(Date.now() - 5 * 86400000), note: 'Passed initial screening by AI match matrix' },
        { status: 'shortlisted', changedAt: new Date(Date.now() - 3 * 86400000), note: 'Strong GitHub portfolio and verified assessment score' },
        { status: 'interview', changedAt: new Date(Date.now() - 1 * 86400000), note: 'Scheduled for Technical Round 2' }
      ],
      recruiterNotes: 'Exceptional portfolio projects; high benchmark on assessment test.'
    },
    {
      _id: 'app_alex_techcorp_eng',
      studentUid: 'usr_student_001',
      opportunityId: 'opp_techcorp_002',
      creatorUid: 'usr_industry_001',
      coverLetter: 'Graduating in 2026 with extensive React and Node.js production experience.',
      resumeUrl: 'https://alexrivera.dev/resume.pdf',
      portfolioUrl: 'https://alexrivera.dev',
      status: 'shortlisted',
      statusHistory: [
        { status: 'applied', changedAt: new Date(Date.now() - 4 * 86400000), note: 'Application received' },
        { status: 'shortlisted', changedAt: new Date(Date.now() - 2 * 86400000), note: 'Shortlisted for preliminary round' }
      ],
      recruiterNotes: 'Solid match for React + Node stack.'
    },
    {
      _id: 'app_maya_cloudscale',
      studentUid: 'usr_student_002',
      opportunityId: 'opp_cloudscale_001',
      creatorUid: 'usr_industry_003',
      coverLetter: 'Passionate about Kubernetes container orchestration and AWS infrastructure.',
      resumeUrl: 'https://mayapatel.example/resume.pdf',
      portfolioUrl: 'https://mayapatel.example',
      status: 'selected',
      statusHistory: [
        { status: 'applied', changedAt: new Date(Date.now() - 14 * 86400000), note: 'Applied' },
        { status: 'shortlisted', changedAt: new Date(Date.now() - 10 * 86400000), note: 'Shortlisted' },
        { status: 'interview', changedAt: new Date(Date.now() - 5 * 86400000), note: 'Completed final technical interview' },
        { status: 'selected', changedAt: new Date(Date.now() - 1 * 86400000), note: 'Offer letter extended!' }
      ],
      recruiterNotes: 'Terrific command of Linux and AWS VPC networking.'
    },
    {
      _id: 'app_priya_nexusai',
      studentUid: 'usr_student_004',
      opportunityId: 'opp_nexusai_001',
      creatorUid: 'usr_industry_002',
      coverLetter: 'Specializing in NLP and transformer architectures.',
      resumeUrl: 'https://priyasharma.example/resume.pdf',
      portfolioUrl: 'https://priyasharma.example',
      status: 'interview',
      statusHistory: [
        { status: 'applied', changedAt: new Date(Date.now() - 6 * 86400000), note: 'Applied' },
        { status: 'shortlisted', changedAt: new Date(Date.now() - 3 * 86400000), note: 'Shortlisted' },
        { status: 'interview', changedAt: new Date(Date.now() - 1 * 86400000), note: 'Round 1 AI Theory scheduled' }
      ],
      recruiterNotes: 'Very strong foundation in linear algebra and attention mechanisms.'
    }
  ];

  for (const app of demoApplications) {
    await ApplicationModel.create(app);
  }

  // Scheduled Interviews
  await InterviewModel.create({
    applicationId: 'app_alex_techcorp_ai',
    studentUid: 'usr_student_001',
    creatorUid: 'usr_industry_001',
    stage: 'Technical Round 2: System Architecture & Coding',
    scheduledAt: new Date(Date.now() + 2 * 86400000 + 14400000), // in 2 days at 2 PM
    durationMinutes: 60,
    mode: 'video',
    meetingLink: 'https://meet.google.com/nex-usai-demo',
    interviewer: 'David Kim (Principal Systems Architect, TechCorp)',
    notes: 'Focus on distributed caching, React performance optimization, and ML inference latency reduction.',
    result: 'pending'
  });

  await InterviewModel.create({
    applicationId: 'app_priya_nexusai',
    studentUid: 'usr_student_004',
    creatorUid: 'usr_industry_002',
    stage: 'Round 1: Machine Learning Foundations',
    scheduledAt: new Date(Date.now() + 3 * 86400000 + 18000000),
    durationMinutes: 45,
    mode: 'video',
    meetingLink: 'https://meet.google.com/ai-nexus-interview',
    interviewer: 'Dr. Aris Thorne (Research Lead)',
    notes: 'Discuss attention mechanisms and vector indexing algorithms.',
    result: 'pending'
  });

  // Placements
  await PlacementModel.create({
    studentUid: 'usr_student_002',
    applicationId: 'app_maya_cloudscale',
    opportunityId: 'opp_cloudscale_001',
    companyName: 'CloudScale Systems',
    role: 'Junior Cloud DevOps Engineer',
    selectionDate: new Date(Date.now() - 2 * 86400000),
    joiningDate: new Date(Date.now() + 30 * 86400000),
    status: 'selected',
    packageOffered: '$84,000 / year (₹14.5 LPA)'
  });

  await PlacementModel.create({
    studentUid: 'usr_student_003',
    applicationId: 'app_liam_placed',
    opportunityId: 'opp_techcorp_002',
    companyName: 'TechCorp Solutions',
    role: 'Frontend UI/UX Engineer',
    selectionDate: new Date(Date.now() - 10 * 86400000),
    joiningDate: new Date(Date.now() + 20 * 86400000),
    status: 'joined',
    packageOffered: '$90,000 / year (₹15 LPA)'
  });

  console.log(`✅ Seeded Applications, Interviews & Placements`);

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. INDUSTRY VERIFICATION & COLLABORATIONS
  // ─────────────────────────────────────────────────────────────────────────────
  await VerificationModel.deleteMany({});
  await VerificationModel.create({
    uid: 'usr_industry_001',
    companyName: 'TechCorp Solutions',
    status: 'verified',
    documentsUrls: [{ name: 'Certificate of Incorporation.pdf', url: 'https://example.com/corp.pdf' }],
    registrationInfo: 'REG-US-DEL-98421004',
    contactPerson: 'Sarah Chen (Director of Campus Recruiting)',
    businessEmail: 'industry@skillnexus.com',
    website: 'https://techcorp.example.com',
    adminNotes: 'Verified tier-1 enterprise partner.',
    reviewedBy: 'usr_admin_001',
    reviewedAt: new Date(Date.now() - 15 * 86400000)
  });

  await VerificationModel.create({
    uid: 'usr_industry_002',
    companyName: 'NexusAI Labs',
    status: 'verified',
    documentsUrls: [{ name: 'Business License.pdf', url: 'https://example.com/biz.pdf' }],
    registrationInfo: 'REG-CA-SF-44219',
    contactPerson: 'Marcus Brody',
    businessEmail: 'nexus.ai@example.com',
    website: 'https://nexusai.example.com',
    adminNotes: 'Verified AI research startup partner.',
    reviewedBy: 'usr_admin_001',
    reviewedAt: new Date(Date.now() - 10 * 86400000)
  });

  // Academic Collaborations
  await CollaborationModel.deleteMany({});
  await CollaborationModel.create({
    creatorUid: 'usr_academician_001',
    type: 'research',
    title: 'Privacy-Preserving Federated Learning for Distributed Medical Imaging',
    description: 'Joint research project between Metropolitan University and TechCorp Health AI unit to train diagnostic models on decentralized data nodes without exchanging raw patient data.',
    skills: ['Federated Learning', 'Python', 'Differential Privacy', 'PyTorch'],
    timeline: '12 Months (2025 - 2026)',
    status: 'in-progress',
    partnerUid: 'usr_industry_001',
    partnerName: 'TechCorp Health & AI Labs',
    funding: '$65,000 Industry Research Grant',
    deliverables: '2 IEEE / ACM Conference Papers + Open Source Federated Training Framework',
    outcome: 'Prototype benchmarked with 94.7% diagnostic accuracy on distributed nodes.'
  });

  await CollaborationModel.create({
    creatorUid: 'usr_academician_001',
    type: 'live_project',
    title: 'Autonomous Robotics Fleet Coordination Protocol',
    description: 'Developing low-latency multi-agent collision avoidance protocols for industrial automated guided vehicles (AGVs).',
    skills: ['Robotics', 'ROS 2', 'C++', 'Reinforcement Learning'],
    timeline: '6 Months',
    status: 'open',
    partnerUid: null,
    partnerName: 'Seeking Industry Partner',
    funding: '$25,000 Academic Equipment Grant',
    deliverables: 'Simulation benchmark in Gazebo + Hardware proof-of-concept',
    outcome: 'Currently open for industrial robotics co-sponsorship.'
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. ASSESSMENTS, SKILL GAPS & MOCK INTERVIEWS
  // ─────────────────────────────────────────────────────────────────────────────
  await AssessmentAttemptModel.deleteMany({ uid: 'usr_student_001' });

  await AssessmentAttemptModel.create({
    uid: 'usr_student_001',
    assessmentId: 'tech-001',
    assessmentType: 'technical',
    topic: 'Full-Stack JavaScript & React Development',
    startTime: new Date(Date.now() - 8 * 86400000),
    endTime: new Date(Date.now() - 8 * 86400000 + 1500000),
    timeLimit: 30,
    submitted: true,
    results: {
      totalQuestions: 15,
      attempted: 15,
      correct: 14,
      incorrect: 1,
      skipped: 0,
      score: 14,
      percentage: 93,
      timeTaken: 1350,
      topicClassification: {
        strong: ['React Component Lifecycle', 'Async / Promises', 'State Management', 'REST API Design'],
        moderate: ['WebSockets & Event Streams'],
        weak: []
      }
    }
  });

  await AssessmentAttemptModel.create({
    uid: 'usr_student_001',
    assessmentId: 'soft-001',
    assessmentType: 'soft-skill',
    topic: 'Workplace Communication & Agile Collaboration',
    startTime: new Date(Date.now() - 4 * 86400000),
    endTime: new Date(Date.now() - 4 * 86400000 + 1200000),
    timeLimit: 25,
    submitted: true,
    results: {
      totalQuestions: 12,
      attempted: 12,
      correct: 11,
      incorrect: 1,
      skipped: 0,
      score: 11,
      percentage: 92,
      timeTaken: 1100,
      topicClassification: {
        strong: ['Conflict Resolution', 'Active Listening', 'Cross-Functional Teamwork'],
        moderate: ['Public Speaking'],
        weak: []
      }
    }
  });

  // Skill Gap Analysis for Alex Rivera
  await SkillGapModel.deleteMany({ uid: 'usr_student_001' });
  await SkillGapModel.create({
    uid: 'usr_student_001',
    targetRole: 'Senior Full Stack AI Engineer',
    overallReadiness: 84,
    lastAnalyzed: new Date(Date.now() - 2 * 86400000),
    gaps: [
      {
        skill: 'Vector Databases & Semantic Embeddings (Pinecone / Milvus)',
        currentLevel: 'Beginner',
        requiredLevel: 'Advanced',
        gap: 'Medium Gap',
        priority: 'High',
        action: 'Build a production RAG application indexing 50k+ technical documents with hybrid vector-keyword search.'
      },
      {
        skill: 'Production Kubernetes Cluster Management',
        currentLevel: 'Intermediate',
        requiredLevel: 'Advanced',
        gap: 'Minor Gap',
        priority: 'Medium',
        action: 'Configure Helm charts, ingress controllers, and horizontal pod autoscaling under synthetic load.'
      },
      {
        skill: 'High-Concurrency Distributed Caching (Redis Cluster)',
        currentLevel: 'Intermediate',
        requiredLevel: 'Advanced',
        gap: 'Minor Gap',
        priority: 'Medium',
        action: 'Implement Redis pub/sub and distributed lock mechanisms for multi-instance worker processes.'
      }
    ]
  });

  // AI Mock Interview
  await MockInterviewModel.deleteMany({ uid: 'usr_student_001' });
  await MockInterviewModel.create({
    uid: 'usr_student_001',
    targetRole: 'Full Stack Software Engineer',
    interviewType: 'mixed',
    completed: true,
    voiceEnabled: false,
    qaHistory: [
      {
        question: 'Explain how React virtual DOM reconciles updates and how keys impact performance during array rendering.',
        type: 'technical',
        answer: 'React uses a virtual DOM representation in memory. When state updates occur, a new virtual DOM tree is created and diffed against the previous tree using a heuristic O(n) reconciliation algorithm. Stable keys allow React to identify which items have changed, been added, or removed, preventing unnecessary re-mounts of DOM nodes.',
        evaluation: {
          score: 95,
          feedback: 'Excellent and precise technical explanation covering both the heuristic diffing algorithm and the exact role of keys in preserving DOM component identities.'
        }
      },
      {
        question: 'Tell me about a time you resolved a major bug under tight deadline constraints.',
        type: 'behavioral',
        answer: 'During the National Smart AI Hackathon with 4 hours remaining, our model inference service crashed on GPU memory exhaustion. I used PyTorch profiler to pinpoint uncollected tensors in the loop, implemented torch.no_grad() and batch sizing limits, restoring steady 60 FPS performance before the judging round.',
        evaluation: {
          score: 92,
          feedback: 'Great STAR framework response with specific technical details, disciplined debugging methodology, and a quantifiable outcome.'
        }
      }
    ],
    finalFeedback: {
      overallScore: 94,
      strengths: ['Clear articulate communication', 'Deep grasp of frontend internals and memory profiling', 'Practical problem-solving under stress'],
      areasForImprovement: ['Elaborate further on trade-offs between virtual DOM and compile-time reactive frameworks (e.g. Svelte) when asked in senior rounds.'],
      recommendation: 'Ready for Tier-1 Tech Company On-site Interviews'
    }
  });

  console.log('🎉 [SkillNexus] Comprehensive demo data seeding complete!');
  console.log('\n================ DEMO ACCOUNTS READY ================');
  console.log('1. 🎓 Student:     student@skillnexus.com     / Student@1234');
  console.log('2. 🏢 Industry:    industry@skillnexus.com    / Industry@1234');
  console.log('3. 🔬 Academician: academician@skillnexus.com / Faculty@1234');
  console.log('4. 🏛️ Institution: institution@skillnexus.com / Institute@1234');
  console.log('5. 🛡️ Admin:       admin@skillnexus.com       / Admin@1234');
  console.log('=====================================================\n');
};

// Execute if run directly
if (process.argv[1]?.endsWith('seedDemoData.js')) {
  seedDemoData()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('❌ Error during demo data seeding:', err);
      process.exit(1);
    });
}
