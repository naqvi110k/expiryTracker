const nodemailer = require('nodemailer');

// Create transporter with Gmail SMTP
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};

// Test email connection
const testConnection = async () => {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        console.log('✅ Email service is ready to send emails');
        return true;
    } catch (error) {
        console.error('❌ Email service error:', error.message);
        return false;
    }
};

// Send verification email
const sendVerificationEmail = async (email, username, verificationToken) => {
    try {
        const transporter = createTransporter();
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

        const mailOptions = {
            from: `"Expiry Tracker" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '✅ Verify Your Email - Expiry Tracker',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 10px;
              padding: 30px;
              color: white;
            }
            .content {
              background: white;
              border-radius: 8px;
              padding: 30px;
              margin-top: 20px;
              color: #333;
            }
            .button {
              display: inline-block;
              padding: 14px 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #999;
              text-align: center;
            }
            h1 {
              margin: 0 0 10px 0;
              font-size: 28px;
            }
            .highlight {
              color: #667eea;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🎉 Welcome to Expiry Tracker!</h1>
            <p>Hi ${username},</p>
            
            <div class="content">
              <p>Thank you for signing up! We're excited to have you on board.</p>
              
              <p>To get started, please verify your email address by clicking the button below:</p>
              
              <center>
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </center>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
              
              <p><strong>⏰ This link will expire in 24 hours.</strong></p>
              
              <p>If you didn't create an account with Expiry Tracker, you can safely ignore this email.</p>
            </div>
            
            <div class="footer">
              <p>© 2026 Expiry Tracker. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Verification email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('❌ Error sending verification email:', error.message);
        throw new Error('Failed to send verification email');
    }
};

// Send password reset email
const sendPasswordResetEmail = async (email, username, resetToken) => {
    try {
        const transporter = createTransporter();
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const mailOptions = {
            from: `"Expiry Tracker" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '🔒 Reset Your Password - Expiry Tracker',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
              border-radius: 10px;
              padding: 30px;
              color: white;
            }
            .content {
              background: white;
              border-radius: 8px;
              padding: 30px;
              margin-top: 20px;
              color: #333;
            }
            .button {
              display: inline-block;
              padding: 14px 30px;
              background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
            .warning {
              background: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #999;
              text-align: center;
            }
            h1 {
              margin: 0 0 10px 0;
              font-size: 28px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🔒 Password Reset Request</h1>
            <p>Hi ${username},</p>
            
            <div class="content">
              <p>We received a request to reset your password for your Expiry Tracker account.</p>
              
              <p>Click the button below to reset your password:</p>
              
              <center>
                <a href="${resetUrl}" class="button">Reset Password</a>
              </center>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #f5576c;">${resetUrl}</p>
              
              <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul>
                  <li>This link will expire in 1 hour</li>
                  <li>If you didn't request this, please ignore this email</li>
                  <li>Your password won't change until you create a new one</li>
                </ul>
              </div>
              
              <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            </div>
            
            <div class="footer">
              <p>© 2026 Expiry Tracker. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Password reset email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('❌ Error sending password reset email:', error.message);
        throw new Error('Failed to send password reset email');
    }
};

// Send password reset confirmation email
const sendPasswordResetConfirmation = async (email, username) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Expiry Tracker" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '✅ Password Changed Successfully - Expiry Tracker',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
              border-radius: 10px;
              padding: 30px;
              color: white;
            }
            .content {
              background: white;
              border-radius: 8px;
              padding: 30px;
              margin-top: 20px;
              color: #333;
            }
            .success {
              background: #d4edda;
              border-left: 4px solid #28a745;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
              color: #155724;
            }
            .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #999;
              text-align: center;
            }
            h1 {
              margin: 0 0 10px 0;
              font-size: 28px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✅ Password Changed</h1>
            <p>Hi ${username},</p>
            
            <div class="content">
              <div class="success">
                <strong>✅ Success!</strong> Your password has been changed successfully.
              </div>
              
              <p>Your Expiry Tracker account password was recently changed.</p>
              
              <p>If you made this change, no further action is needed.</p>
              
              <p><strong>⚠️ If you didn't make this change:</strong></p>
              <ul>
                <li>Someone may have accessed your account</li>
                <li>Please contact support immediately</li>
                <li>Consider changing your password again</li>
              </ul>
              
              <p>For security reasons, we recommend:</p>
              <ul>
                <li>Using a strong, unique password</li>
                <li>Not sharing your password with anyone</li>
                <li>Changing your password regularly</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>© 2026 Expiry Tracker. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Password reset confirmation sent to ${email}`);
        return true;
    } catch (error) {
        console.error('❌ Error sending confirmation email:', error.message);
        // Don't throw error here, password was already changed
        return false;
    }
};

// Send contact form submission email
const sendContactNotification = async ({ name, email, subject, message }) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            console.warn('⚠️ Email credentials not configured for contact notification.');
            return false;
        }
        const transporter = createTransporter();
        const mailOptions = {
            from: `"Expiry Tracker Support" <${process.env.EMAIL_USER}>`,
            to: process.env.SUPPORT_EMAIL || process.env.EMAIL_USER,
            replyTo: email,
            subject: `[Contact Form] ${subject}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap;">${message}</p>
            `
        };
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('❌ Error sending contact email:', error.message);
        return false;
    }
};

module.exports = {
    testConnection,
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendPasswordResetConfirmation,
    sendContactNotification,
};
