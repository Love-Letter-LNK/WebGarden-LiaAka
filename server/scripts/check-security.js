const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function checkSecurityHeaders() {
    console.log('\n🔍 Checking Security Headers...');
    try {
        const response = await axios.get(`${BASE_URL}/health`);
        const headers = response.headers;

        const expectedHeaders = [
            'x-dns-prefetch-control',
            'x-frame-options',
            'strict-transport-security',
            'x-download-options',
            'x-content-type-options',
            'x-permitted-cross-domain-policies',
            'referrer-policy'
        ];

        let missing = [];
        expectedHeaders.forEach(header => {
            if (headers[header]) {
                console.log(`✅ ${header}: Present`);
            } else {
                // strict-transport-security might not be set on http localhost by default without specific HSTS config or https
                if (header !== 'strict-transport-security') missing.push(header);
            }
        });

        if (missing.length === 0) {
            console.log('✨ All critical security headers are present!');
        } else {
            console.log('⚠️ Missing headers:', missing.join(', '));
        }
    } catch (error) {
        console.error('❌ Failed to connect to server. Make sure it is running!');
    }
}

async function checkRateLimit() {
    console.log('\n🛡️ Checking Login Rate Limit (Max 5 attempts)...');
    try {
        // Attempt 6 requests
        for (let i = 1; i <= 6; i++) {
            try {
                // Use a dummy email to avoid actual login logic, we just want to hit the middleware
                await axios.post(`${BASE_URL}/auth/login`, {
                    email: `test${i}@example.com`,
                    password: 'password'
                });
                console.log(`Request ${i}: ✅ Allowed (Status 200/401)`);
            } catch (error) {
                if (error.response && error.response.status === 429) {
                    console.log(`Request ${i}: 🛑 Rate Limit Hit! (Status 429)`);
                    console.log('✨ Rate Limiting is WORKING!');
                    return;
                } else if (error.response && error.response.status === 401) {
                    console.log(`Request ${i}: ✅ Allowed (Status 401 - Invalid Creds)`);
                } else {
                    console.log(`Request ${i}: ❓ Unexpected status ${error.response ? error.response.status : error.message}`);
                }
            }
        }
        console.log('⚠️ Rate limit did NOT trigger after 6 attempts. Check configuration.');
    } catch (error) {
        console.error('❌ Error during rate limit check:', error.message);
    }
}

async function run() {
    console.log('🚀 Starting Security Validation...');
    await checkSecurityHeaders();
    await checkRateLimit();
}

run();
