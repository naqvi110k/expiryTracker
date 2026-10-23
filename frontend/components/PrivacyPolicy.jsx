import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Boxes, ArrowLeft, Shield } from 'lucide-react';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
    window.scrollTo(0, 0);
  }, []);

  const bg = darkMode ? 'bg-[#0A0A0A] text-[#F5F5F2]' : 'bg-[#FAF9F6] text-[#111111]';
  const headingClass = darkMode ? 'text-[#F5F5F2]' : 'text-[#111111]';
  const textClass = darkMode ? 'text-[#A1A19A]' : 'text-[#52524E]';
  const surfaceClass = darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0] shadow-xs';
  const navClass = darkMode ? 'bg-[#0A0A0A]/95 border-[#262626]' : 'bg-[#FAF9F6]/95 border-[#E4E4E0]';

  const sections = [
    {
      title: '1. Information We Collect',
      content: [
        { subtitle: 'Account Information', text: 'When you register, we collect your name, email address, and a securely hashed password. This information is required to create and manage your Inventa account.' },
        { subtitle: 'Product & Inventory Data', text: 'We store the product details you add to your inventory, including product names, batch numbers, expiry dates, categories, and quantities.' },
        { subtitle: 'WhatsApp & Phone Number', text: 'If you use our WhatsApp integration, we collect and store your WhatsApp phone number in order to send you automated expiry alerts and process product images you send to the system.' },
        { subtitle: 'Images', text: 'Product images you send via WhatsApp are temporarily processed by our AI system (Google Gemini) to extract product details. Images are not permanently stored after processing.' },
        { subtitle: 'Usage Data', text: 'We may collect basic technical information such as your browser type, device type, pages visited, and access timestamps in order to improve our service and troubleshoot issues.' },
      ],
    },
    {
      title: '2. How We Use Your Information',
      content: [
        { subtitle: 'Service Delivery', text: 'We use your information to operate Inventa, including managing your inventory, sending automated WhatsApp alerts, generating PDF reports, and providing AI-powered product recognition.' },
        { subtitle: 'Communications', text: 'We use your email address to send account-related communications such as verification emails, password reset links, and important service updates. We do not send marketing emails without your consent.' },
        { subtitle: 'Service Improvement', text: 'Aggregated, anonymized usage data may be used to improve our features, fix bugs, and enhance overall user experience.' },
      ],
    },
    {
      title: '3. Third-Party Services',
      content: [
        { subtitle: 'Twilio', text: "We use Twilio to deliver WhatsApp messages and alerts. Your phone number is shared with Twilio solely for this purpose. Twilio's privacy policy is available at twilio.com/legal/privacy." },
        { subtitle: 'Google Gemini AI', text: "Product images you send via WhatsApp are processed by Google's Gemini AI to extract product information. Image data is sent to Google's API and governed by Google's AI usage policies." },
        { subtitle: 'MongoDB Atlas', text: 'Your data is stored securely on MongoDB Atlas cloud infrastructure. Data is encrypted at rest and in transit.' },
        { subtitle: 'Vercel', text: 'Our frontend application is hosted on Vercel. Vercel may collect basic server logs and usage metrics as described in their privacy policy at vercel.com/legal/privacy-policy.' },
      ],
    },
    {
      title: '4. Cookies & Tracking',
      content: [
        { subtitle: 'Authentication Tokens', text: "We store a JWT (JSON Web Token) in your browser's local storage to keep you logged in between sessions. This token does not contain sensitive personal information." },
        { subtitle: 'Theme Preferences', text: 'We store your dark/light mode preference in local storage to remember your display settings.' },
        { subtitle: 'Analytics', text: 'We may use privacy-respecting analytics tools to understand how users interact with the service. This helps us improve features and fix issues. No personally identifiable information is included in analytics data.' },
        { subtitle: 'Advertising', text: "We may display advertisements provided by Google AdSense. Google may use cookies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting Google's Ad Settings at adssettings.google.com." },
      ],
    },
    {
      title: '5. Data Retention',
      content: [
        { subtitle: 'Account Data', text: 'We retain your account and inventory data for as long as your account is active. You may request deletion of your account and data at any time by contacting us at support@inventa.app.' },
        { subtitle: 'Product Images', text: 'Product images sent via WhatsApp are processed transiently and are not stored permanently in our system.' },
      ],
    },
    {
      title: '6. Data Security',
      content: [
        { subtitle: 'Encryption', text: 'All data transmitted between your device and our servers is encrypted using HTTPS/TLS. Passwords are hashed using industry-standard bcrypt hashing before storage.' },
        { subtitle: 'Access Controls', text: 'Access to your account and inventory data is protected by JWT-based authentication. We do not share your personal data with other users.' },
      ],
    },
    {
      title: '7. Your Rights',
      content: [
        { subtitle: 'Access & Correction', text: 'You have the right to access the personal information we hold about you and to request corrections if any details are inaccurate.' },
        { subtitle: 'Data Deletion', text: 'You may request that we delete your account and all associated personal data. Please contact support@inventa.app to submit a deletion request.' },
        { subtitle: 'Opt-Out', text: "You may opt out of WhatsApp notifications at any time by contacting us. You can also manage Google Ad personalization through Google's Ad Settings." },
      ],
    },
    {
      title: "8. Children's Privacy",
      content: [
        { subtitle: 'Age Restriction', text: 'Inventa is not intended for use by individuals under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately.' },
      ],
    },
    {
      title: '9. Changes to This Policy',
      content: [
        { subtitle: 'Policy Updates', text: 'We may update this Privacy Policy from time to time. When we do, we will update the "Last Updated" date at the top of this page. Continued use of Inventa after any changes constitutes your acceptance of the updated policy.' },
      ],
    },
    {
      title: '10. Contact Us',
      content: [
        { subtitle: 'Get In Touch', text: 'If you have any questions, concerns, or requests regarding this Privacy Policy or the way we handle your data, please contact us at: support@inventa.app' },
      ],
    },
  ];

  return (
    <div className={`min-h-screen font-sans ${bg}`}>
      <Helmet>
        <title>Privacy Policy | Inventa - Expiry Tracker</title>
        <meta name="description" content="Read Inventa's Privacy Policy to understand how we collect, use, and protect your personal data when you use our inventory and expiry tracking service." />
        <link rel="canonical" href="https://expiry-tracker.live/privacy-policy" />
      </Helmet>

      <nav className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md ${navClass}`}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link to={'/'} className="flex items-center gap-3 text-left">
            <div className={`flex h-9 w-9 items-center justify-center rounded-md border ${darkMode ? 'bg-[#141414] border-[#262626] text-[#F5F5F2]' : 'bg-[#111111] border-[#111111] text-[#FAF9F6]'}`}>
              <Boxes size={18} />
            </div>
            <div>
              <div className={`text-base font-bold tracking-tight leading-none ${headingClass}`}>Inventa</div>
              <div className={`text-[10px] font-mono uppercase tracking-[0.16em] mt-1 ${textClass}`}>Legal & Privacy</div>
            </div>
          </Link>
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-1.5 rounded-md border px-3.5 py-1.5 text-xs font-medium transition-colors ${darkMode ? 'border-[#262626] text-[#A1A19A] hover:text-[#F5F5F2]' : 'border-[#E4E4E0] text-[#52524E] hover:text-[#111111]'}`}
          >
            <ArrowLeft size={14} />
            Back
          </button>
        </div>
      </nav>

      <div className="pt-28 pb-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-[#E4E4E0] dark:border-[#262626] bg-white dark:bg-[#141414] px-3 py-1 text-xs font-mono uppercase tracking-wider text-[#15803D] dark:text-[#4ADE80]">
            <Shield size={14} />
            Legal Document
          </div>
          <h1
            className={`mb-3 text-3xl sm:text-5xl font-normal tracking-tight ${headingClass}`}
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            Privacy Policy
          </h1>
          <p className={`text-xs font-mono uppercase tracking-wider ${textClass}`}>
            Last Updated: <strong>June 23, 2026</strong>
          </p>
          <p className={`mt-4 max-w-2xl text-base leading-relaxed ${textClass}`}>
            At Inventa, your privacy is important to us. This policy explains what data we collect, how we use it, and what rights you have over your information.
          </p>
        </div>
      </div>

      <div className="pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className={`rounded-lg border ${surfaceClass} overflow-hidden`}>
            <div className="divide-y divide-[#E4E4E0] dark:divide-[#262626]">
              {sections.map((section, sIdx) => (
                <div key={sIdx} className="p-6 sm:p-8">
                  <h2 className={`mb-5 text-lg font-bold tracking-tight ${headingClass}`}>{section.title}</h2>
                  <div className="space-y-5">
                    {section.content.map((item, iIdx) => (
                      <div key={iIdx}>
                        <h3 className="mb-1 text-xs font-mono font-semibold uppercase tracking-wider text-[#15803D] dark:text-[#4ADE80]">
                          {item.subtitle}
                        </h3>
                        <p className={`text-sm sm:text-base leading-relaxed ${textClass}`}>{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className={`text-sm ${textClass}`}>
              Questions? Contact us at{' '}
              <a href="mailto:support@inventa.app" className="font-semibold text-[#15803D] dark:text-[#4ADE80] underline-offset-4 hover:underline">
                support@inventa.app
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
