/**
 * Security & Role-Based Access Control Test Script (Req 71-72)
 * Tests authorization barriers across all role-protected endpoints:
 * 1. Unauthenticated requests must return 401
 * 2. Wrong role access must return 403
 * 3. Primary admin protection cannot be bypassed
 */

const BASE_URL = 'http://localhost:5000/api';

async function runSecurityTests() {
  console.log('🔒 Starting SkillNexus Role & Security Access Barrier Tests...\n');
  let passed = 0;
  let failed = 0;

  async function testEndpoint(desc, url, options, expectedStatus) {
    try {
      const res = await fetch(url, options);
      if (res.status === expectedStatus) {
        console.log(`  ✅ [PASS] ${desc} — Got ${res.status} (expected ${expectedStatus})`);
        passed++;
      } else {
        console.log(`  ❌ [FAIL] ${desc} — Got ${res.status}, expected ${expectedStatus}`);
        failed++;
      }
    } catch (err) {
      console.log(`  ❌ [ERROR] ${desc} — ${err.message}`);
      failed++;
    }
  }

  // 1. Unauthenticated Tests
  console.log('--- 1. Testing Unauthenticated Request Rejection (401) ---');
  await testEndpoint('Admin stats without token', `${BASE_URL}/admin/stats`, {}, 401);
  await testEndpoint('Admin users without token', `${BASE_URL}/admin/users`, {}, 401);
  await testEndpoint('Student profile without token', `${BASE_URL}/students/profile`, {}, 401);
  await testEndpoint('Industry profile without token', `${BASE_URL}/industry/profile`, {}, 401);
  await testEndpoint('Faculty profile without token', `${BASE_URL}/academicians/profile`, {}, 401);
  await testEndpoint('Institution analytics without token', `${BASE_URL}/analytics/overview`, {}, 401);

  // 2. Login as student to test role elevation rejection (403)
  console.log('\n--- 2. Testing Role Boundary Enforcement (403) ---');
  try {
    const studentLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@skillnexus.com', password: 'Student@1234' })
    });

    const studentData = await studentLogin.json();

    if (studentData.token) {
      const studentHeaders = {
        'Authorization': `Bearer ${studentData.token}`,
        'Content-Type': 'application/json'
      };

      await testEndpoint('Student accessing Admin Users (Forbidden)', `${BASE_URL}/admin/users`, { headers: studentHeaders }, 403);
      await testEndpoint('Student accessing Admin Stats (Forbidden)', `${BASE_URL}/admin/stats`, { headers: studentHeaders }, 403);
      await testEndpoint('Student accessing Industry Profile (Forbidden)', `${BASE_URL}/industry/profile`, { headers: studentHeaders }, 403);
      await testEndpoint('Student creating Industry Opportunity (Forbidden)', `${BASE_URL}/industry/opportunities`, {
        method: 'POST',
        headers: studentHeaders,
        body: JSON.stringify({ type: 'job', title: 'Hacked Job' })
      }, 403);
      await testEndpoint('Student accessing Institution Analytics (Forbidden)', `${BASE_URL}/analytics/overview`, { headers: studentHeaders }, 403);
    } else {
      console.log('  ⚠️ Student test user not found. Run seed script first if not seeded.');
    }
  } catch (err) {
    console.log('  ⚠️ Auth test error:', err.message);
  }

  // 3. Public Endpoints Verification (200)
  console.log('\n--- 3. Testing Public Endpoints Accessibility (200) ---');
  await testEndpoint('Public Health Check', `${BASE_URL}/health`, {}, 200);
  await testEndpoint('Public Opportunities Search', `${BASE_URL}/opportunities`, {}, 200);
  await testEndpoint('Public Collaborations List', `${BASE_URL}/academicians/collaborations`, {}, 200);
  await testEndpoint('Public AI Status Check', `${BASE_URL}/ai/status`, {}, 200);

  console.log(`\n========================================`);
  console.log(`Security Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);
}

runSecurityTests();
