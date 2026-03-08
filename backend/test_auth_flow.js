const authService = require('./src/services/auth.service');

async function testSignFlow() {
  try {
    const email = `test_${Date.now()}@example.com`;
    console.log(`Registering ${email}...`);
    const regRes = await authService.registerUser({
      email,
      password: 'password123',
      fullName: 'Test User'
    });
    console.log('Register Result:', regRes);

    console.log(`\nLogging in ${email}...`);
    const loginRes = await authService.loginUser({
      email,
      password: 'password123'
    });
    console.log('Login Result:', loginRes);
  } catch (err) {
    console.error('\nError Caught:', err.message);
  } finally {
    process.exit(0);
  }
}

testSignFlow();
