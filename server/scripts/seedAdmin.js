import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import {
  UserModel,
  StudentProfileModel,
  IndustryProfileModel,
  AcademicianProfileModel,
  InstitutionProfileModel
} from '../models/dbAdapter.js';

dotenv.config();

const seed = async () => {
  console.log('🌱 Starting SkillNexus seed process...');
  await connectDB();

  const salt = await bcrypt.genSalt(10);

  const testAccounts = [
    {
      uid: 'usr_admin_001',
      name: 'Nexus Admin',
      email: 'admin@skillnexus.com',
      passwordPlain: 'Admin@1234',
      role: 'admin',
      emailVerified: true,
      accountStatus: 'active'
    },
    {
      uid: 'usr_student_001',
      name: 'Alex Rivera',
      email: 'student@skillnexus.com',
      passwordPlain: 'Student@1234',
      role: 'student',
      emailVerified: true,
      accountStatus: 'active',
      profile: {
        headline: 'Computer Science Undergrad | Aspiring AI Engineer',
        institutionName: 'Global Institute of Technology',
        degree: 'B.Tech in Computer Science',
        graduationYear: '2026',
        skills: ['Python', 'React', 'Data Structures', 'Machine Learning', 'SQL'],
        completionPercentage: 75
      }
    },
    {
      uid: 'usr_industry_001',
      name: 'Sarah Chen (TechCorp)',
      email: 'industry@skillnexus.com',
      passwordPlain: 'Industry@1234',
      role: 'industry',
      emailVerified: true,
      accountStatus: 'active',
      profile: {
        companyName: 'TechCorp Solutions',
        industrySector: 'Cloud Software & AI Enterprise',
        companySize: '250-1000 Employees',
        website: 'https://techcorp.example.com',
        description: 'Pioneering intelligent enterprise systems and next-gen cloud platforms.',
        completionPercentage: 80
      }
    },
    {
      uid: 'usr_academician_001',
      name: 'Dr. Marcus Vance',
      email: 'academician@skillnexus.com',
      passwordPlain: 'Faculty@1234',
      role: 'academician',
      emailVerified: true,
      accountStatus: 'active',
      profile: {
        designation: 'Associate Professor & Research Chair',
        department: 'Department of Computer Science & Robotics',
        institutionName: 'Apex Institute of Science',
        researchAreas: ['Distributed Systems', 'Applied AI', 'Cyber-Physical Security'],
        completionPercentage: 85
      }
    },
    {
      uid: 'usr_institution_001',
      name: 'Dean Robert Sterling',
      email: 'institution@skillnexus.com',
      passwordPlain: 'Institute@1234',
      role: 'institution',
      emailVerified: true,
      accountStatus: 'active',
      profile: {
        institutionName: 'Metropolitan University of Technology',
        institutionType: 'Tier-1 Technical University',
        campusLocation: 'Innovation Park, East Campus',
        website: 'https://metrotech.edu.example',
        completionPercentage: 90
      }
    },
    {
      uid: 'usr_unverified_001',
      name: 'Jordan Lee',
      email: 'unverified@skillnexus.com',
      passwordPlain: 'Unverified@1234',
      role: 'student',
      emailVerified: false,
      verificationToken: 'demo_token_verify_jordan',
      accountStatus: 'active'
    }
  ];

  for (const acc of testAccounts) {
    const existing = await UserModel.findOne({ email: acc.email });
    const hashedPassword = await bcrypt.hash(acc.passwordPlain, salt);

    if (!existing) {
      console.log(`Creating test account: [${acc.role.toUpperCase()}] ${acc.email}`);
      await UserModel.create({
        uid: acc.uid,
        name: acc.name,
        email: acc.email,
        password: hashedPassword,
        role: acc.role,
        emailVerified: acc.emailVerified,
        verificationToken: acc.verificationToken || null,
        verificationTokenExpires: acc.emailVerified ? null : new Date(Date.now() + 86400000),
        verificationLastSent: new Date(),
        accountStatus: acc.accountStatus
      });

      if (acc.role === 'student') {
        await StudentProfileModel.create({
          uid: acc.uid,
          ...(acc.profile || { headline: 'Student' })
        });
      } else if (acc.role === 'industry') {
        await IndustryProfileModel.create({
          uid: acc.uid,
          ...(acc.profile || { companyName: 'Enterprise Partner' })
        });
      } else if (acc.role === 'academician') {
        await AcademicianProfileModel.create({
          uid: acc.uid,
          ...(acc.profile || { designation: 'Faculty' })
        });
      } else if (acc.role === 'institution') {
        await InstitutionProfileModel.create({
          uid: acc.uid,
          ...(acc.profile || { institutionName: 'Partner University' })
        });
      }
    } else {
      console.log(`Account ${acc.email} already exists. Updating password & state...`);
      await UserModel.updateOne(
        { email: acc.email },
        {
          $set: {
            password: hashedPassword,
            emailVerified: acc.emailVerified,
            accountStatus: acc.accountStatus
          }
        }
      );
    }
  }

  console.log('✅ SkillNexus seed complete!');
  console.log('\n--- TEST ACCOUNTS AVAILABLE ---');
  console.log('1. Admin:       admin@skillnexus.com       / Admin@1234');
  console.log('2. Student:     student@skillnexus.com     / Student@1234');
  console.log('3. Industry:    industry@skillnexus.com    / Industry@1234');
  console.log('4. Academician: academician@skillnexus.com / Faculty@1234');
  console.log('5. Institution: institution@skillnexus.com / Institute@1234');
  console.log('6. Unverified:  unverified@skillnexus.com  / Unverified@1234');
  console.log('-------------------------------\n');
};

seed().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
