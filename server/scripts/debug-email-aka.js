require('dotenv').config();
const { sendNotification } = require('../services/emailService');

async function testEmail() {
    console.log("🚀 Testing Email to 'aka'...");

    // Force debug logs to be visible
    const result = await sendNotification(
        "TEST EMAIL: Debugging Aka Recipient",
        "This is a test email to verify if 'aka' recipient works.",
        null, // no HTML
        'aka' // recipient
    );

    if (result) {
        console.log("✅ Email service reported SUCCESS.");
    } else {
        console.error("❌ Email service reported FAILURE.");
    }
}

testEmail();
