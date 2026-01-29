const nodemailer = require('nodemailer');

// Helper to create transporter
// We default to Zekk's credentials if Lia's are missing or generic
const getTransporter = (preferLia = false) => {
    // Check if Lia's password is valid (i.e., not a placeholder and not empty)
    const isLiaConfigured = process.env.EMAIL_PASS_LIA &&
        process.env.EMAIL_PASS_LIA !== 'lia-app-password' &&
        process.env.EMAIL_PASS_LIA !== 'your-app-password';

    const useLia = preferLia && isLiaConfigured;

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: useLia ? process.env.EMAIL_USER_LIA : process.env.EMAIL_USER_ZEKK,
            pass: useLia ? process.env.EMAIL_PASS_LIA : process.env.EMAIL_PASS_ZEKK
        }
    });
};

const sendNotification = async (subject, text, html, to = null) => {
    // 1. Determine Recipients
    let recipients = [
        process.env.EMAIL_USER_ZEKK || 'zakariamujur6@gmail.com',
        process.env.EMAIL_USER_LIA || 'lianurkhasanah200506@gmail.com'
    ];

    if (to === 'aka') {
        recipients = [process.env.EMAIL_USER_ZEKK || 'zakariamujur6@gmail.com'];
    } else if (to === 'lia') {
        recipients = [process.env.EMAIL_USER_LIA || 'lianurkhasanah200506@gmail.com'];
    } else if (to && to.includes('@')) {
        recipients = [to];
    }

    // 2. Define Send Helper
    const attemptSend = async (fromEmail, fromPass, label) => {
        if (!fromPass || fromPass.includes('app-password')) {
            throw new Error(`Invalid credentials for ${label}`);
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: fromEmail, pass: fromPass }
        });

        const info = await transporter.sendMail({
            from: `"Lia & Zekk Bot" <${fromEmail}>`,
            to: recipients.join(', '),
            subject: subject,
            text: text,
            html: html || text
        });
        console.log(`Email sent successfully via ${label} to ${recipients.join(', ')}: ${info.messageId}`);
        return true;
    };

    // 3. Try Primary Choice (Based on recipient), then Fallback
    const zekkCreds = {
        user: process.env.EMAIL_USER_ZEKK,
        pass: process.env.EMAIL_PASS_ZEKK,
        label: "ZEKK"
    };
    const liaCreds = {
        user: process.env.EMAIL_USER_LIA,
        pass: process.env.EMAIL_PASS_LIA,
        label: "LIA"
    };

    // Always try Zekk first (more reliable), then fallback to Lia
    const firstChoice = zekkCreds;
    const secondChoice = liaCreds;

    try {
        await attemptSend(firstChoice.user, firstChoice.pass, firstChoice.label);
        return true;
    } catch (error1) {
        console.warn(`Primary email attempt (${firstChoice.label}) failed:`, error1.message);

        try {
            console.log(`Retrying with ${secondChoice.label} account...`);
            await attemptSend(secondChoice.user, secondChoice.pass, secondChoice.label);
            return true;
        } catch (error2) {
            console.error("All email attempts failed.");
            console.error("Error 1:", error1);
            console.error("Error 2:", error2);
            return false;
        }
    }
};

module.exports = { sendNotification };
