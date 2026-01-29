const nodemailer = require('nodemailer');

/**
 * Send email notification
 * @param {string} subject - Email subject
 * @param {string} text - Email body text
 * @param {string|null} html - Optional HTML body
 * @param {string|null} to - 'aka', 'lia', or email address. null = both
 */
const sendNotification = async (subject, text, html, to = null) => {
    console.log(`📧 sendNotification called: to=${to}, subject=${subject}`);

    // 1. Determine recipient email
    let recipientEmail;
    if (to === 'aka') {
        recipientEmail = process.env.EMAIL_USER_ZEKK || 'zakariamujur6@gmail.com';
    } else if (to === 'lia') {
        recipientEmail = process.env.EMAIL_USER_LIA || 'lianurkhasanah200506@gmail.com';
    } else if (to && to.includes('@')) {
        recipientEmail = to;
    } else {
        // Default: send to both
        recipientEmail = `${process.env.EMAIL_USER_ZEKK}, ${process.env.EMAIL_USER_LIA}`;
    }
    console.log(`📧 Recipient: ${recipientEmail}`);

    // 2. Use Zekk's credentials to send (since App Password is configured)
    const senderEmail = process.env.EMAIL_USER_ZEKK;
    const senderPass = process.env.EMAIL_PASS_ZEKK;

    console.log(`📧 Sender: ${senderEmail}`);
    console.log(`📧 Password configured: ${senderPass ? 'YES (' + senderPass.length + ' chars)' : 'NO'}`);

    if (!senderPass || senderPass.includes('your-app-password')) {
        console.error('❌ EMAIL_PASS_ZEKK not configured properly');
        return false;
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: senderEmail,
                pass: senderPass
            }
        });

        const info = await transporter.sendMail({
            from: `"Aka & Lia Bot" <${senderEmail}>`,
            to: recipientEmail,
            subject: subject,
            text: text,
            html: html || text
        });

        console.log(`✅ Email sent successfully to ${recipientEmail}: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error(`❌ Email failed:`, error.message);
        console.error(error);
        return false;
    }
};

module.exports = { sendNotification };
