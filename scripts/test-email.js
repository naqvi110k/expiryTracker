const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const testEmailService = async () => {
    console.log('\n=== Email Service Diagnostic ===\n');

    // Check environment variables
    console.log('1. Checking environment variables:');
    console.log(`   EMAIL_USER: ${process.env.EMAIL_USER ? '✅ Set' : '❌ Missing'}`);
    console.log(`   EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Missing'}`);
    console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL ? '✅ Set: ' + process.env.FRONTEND_URL : '❌ Missing'}`);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.error('\n❌ Missing required environment variables. Cannot proceed.');
        return;
    }

    // Test nodemailer connection
    console.log('\n2. Testing nodemailer connection:');
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    try {
        await transporter.verify();
        console.log('   ✅ Email service connection successful');
    } catch (error) {
        console.error('   ❌ Email service connection failed');
        console.error(`   Error: ${error.message}`);
        console.log('\n   Troubleshooting steps:');
        console.log('   1. If using Gmail, ensure you\'ve enabled 2FA and created an app password:');
        console.log('      - Go to https://myaccount.google.com/');
        console.log('      - Click "Security" in left menu');
        console.log('      - Enable "2-Step Verification"');
        console.log('      - Search for "App passwords"');
        console.log('      - Select Mail and Windows Computer');
        console.log('      - Copy the 16-character password');
        console.log('      - Use that in EMAIL_PASSWORD (without spaces)');
        console.log('   2. Verify EMAIL_USER is correct: ' + process.env.EMAIL_USER);
        console.log('   3. Check that EMAIL_PASSWORD is correct (16 characters without spaces)');
        return;
    }

    // Test sending an email
    console.log('\n3. Attempting to send test email:');
    try {
        const testEmail = 'test-expiry-tracker@example.com';
        await transporter.sendMail({
            from: `"Expiry Tracker Test" <${process.env.EMAIL_USER}>`,
            to: testEmail,
            subject: '🧪 Expiry Tracker - Email Service Test',
            html: '<h1>✅ Email Service is Working!</h1><p>If you received this email, the password reset feature should work correctly.</p>',
        });
        console.log(`   ✅ Test email sent successfully to ${testEmail}`);
    } catch (error) {
        console.error('   ❌ Failed to send test email');
        console.error(`   Error: ${error.message}`);
        return;
    }

    console.log('\n=== Diagnosis Complete ===');
    console.log('\nEmail service is working correctly! ✅');
    console.log('\nPassword reset flow should now work:');
    console.log('1. User clicks "Forgot Password" on login page');
    console.log('2. User enters their email address');
    console.log('3. Reset email is sent automatically');
    console.log('4. User clicks link in email to reset password');
};

testEmailService().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
