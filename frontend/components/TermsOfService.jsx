import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Boxes, ArrowLeft, ScrollText } from 'lucide-react';

const TermsOfService = () => {
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
      title: '1. Acceptance of Terms',
      content: [
        { subtitle: 'Agreement', text: 'By accessing or using Inventa (available at expiry-tracker.live), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the service.' },
        { subtitle: 'Eligibility', text: 'You must be at least 13 years old to use Inventa. By using the service, you confirm that you meet this age requirement. Users under 18 must have parental or guardian consent.' },
      ],
    },
    {
      title: '2. Description of Service',
      content: [
        { subtitle: 'What Inventa Provides', text: 'Inventa is a free inventory and expiry date management platform designed for small businesses and shopkeepers. Features include AI-powered product recognition via WhatsApp, automated expiry alerts, inventory dashboards, PDF report generation, and CSV/Excel bulk import.' },
        { subtitle: 'Service Availability', text: 'We aim to keep Inventa operational at all times, but we do not guarantee uninterrupted access. The service may be temporarily unavailable for maintenance, upgrades, or due to factors outside our control.' },
        { subtitle: 'Free Service', text: 'Inventa is currently offered free of charge. We reserve the right to introduce paid plans or modify the pricing structure in the future with reasonable advance notice to users.' },
      ],
    },
    {
      title: '3. User Accounts',
      content: [
        { subtitle: 'Account Registration', text: 'You must register for an account to use most features of Inventa. You agree to provide accurate, current, and complete information during registration and to keep this information updated.' },
        { subtitle: 'Account Security', text: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately at support@inventa.app if you suspect any unauthorized access to your account.' },
        { subtitle: 'One Account Per User', text: 'You may not create multiple accounts for the same person or organization. We reserve the right to merge or close duplicate accounts.' },
      ],
    },
    {
      title: '4. Acceptable Use',
      content: [
        { subtitle: 'Permitted Use', text: 'You may use Inventa solely for legitimate business inventory management purposes. The service is intended for tracking product expiry dates and managing stock for lawful commercial activities.' },
        { subtitle: 'Prohibited Activities', text: 'You agree not to: (a) use the service for any unlawful purpose; (b) attempt to gain unauthorized access to the system; (c) upload malicious code or files; (d) use automated bots or scripts to abuse the service; (e) resell, sublicense, or redistribute access to the service; (f) use the service to track controlled substances, illegal goods, or prohibited materials.' },
        { subtitle: 'WhatsApp Integration', text: 'When using our WhatsApp integration via Twilio, you must comply with WhatsApp Business Policy and Twilio Acceptable Use Policy. You are responsible for ensuring your use of the WhatsApp channel complies with applicable regulations.' },
      ],
    },
    {
      title: '5. Intellectual Property',
      content: [
        { subtitle: 'Our IP', text: 'All content, features, and functionality of Inventa — including but not limited to the software, design, logos, and documentation — are the exclusive property of Inventa and are protected by applicable intellectual property laws.' },
        { subtitle: 'Your Data', text: 'You retain ownership of all inventory data and content you upload or input into Inventa. By using the service, you grant us a limited license to store, process, and display your data solely for the purpose of providing the service to you.' },
        { subtitle: 'Feedback', text: 'If you provide feedback, suggestions, or feature requests, you grant us an irrevocable, royalty-free license to use that feedback to improve the service without any obligation or compensation to you.' },
      ],
    },
    {
      title: '6. Third-Party Services',
      content: [
        { subtitle: 'Integrated Services', text: 'Inventa integrates with third-party services including Twilio (WhatsApp messaging), Google Gemini AI (image processing), and MongoDB Atlas (data storage). Your use of these integrations is also subject to the respective third-party terms of service.' },
        { subtitle: 'No Endorsement', text: 'References to third-party services do not constitute an endorsement. We are not responsible for the availability, accuracy, or content of third-party services.' },
      ],
    },
    {
      title: '7. Disclaimers & Limitation of Liability',
      content: [
        { subtitle: 'No Warranties', text: 'Inventa is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the service will be error-free, uninterrupted, or free of viruses or other harmful components.' },
        { subtitle: 'AI Accuracy', text: 'Our AI-powered product recognition relies on image quality and may not always produce accurate results. You are responsible for verifying all AI-extracted product details before saving them to your inventory.' },
        { subtitle: 'Limitation of Liability', text: 'To the fullest extent permitted by law, Inventa shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service, including but not limited to financial losses from expired or incorrectly tracked products.' },
        { subtitle: 'Inventory Decisions', text: 'All decisions regarding stock management, product disposal, and regulatory compliance remain your sole responsibility. Inventa is a tool to assist with tracking — it does not replace professional business or legal advice.' },
      ],
    },
    {
      title: '8. Account Termination',
      content: [
        { subtitle: 'Termination by You', text: 'You may stop using Inventa at any time. To permanently delete your account and data, contact us at support@inventa.app.' },
        { subtitle: 'Termination by Us', text: 'We reserve the right to suspend or terminate your account without notice if you violate these Terms of Service, engage in fraudulent activity, or use the service in a way that may harm other users or the platform.' },
        { subtitle: 'Effect of Termination', text: 'Upon termination, your right to use the service will immediately cease. We may delete your data in accordance with our data retention policy and applicable law.' },
      ],
    },
    {
      title: '9. Advertising',
      content: [
        { subtitle: 'Google AdSense', text: 'Inventa may display advertisements served by Google AdSense and other advertising networks. These ads are provided by third parties and we are not responsible for their content. Ad content is governed by the respective advertiser and Google policies.' },
        { subtitle: 'Ad Personalization', text: 'Google may use cookies to display personalized ads based on your browsing history. You can opt out of ad personalization at adssettings.google.com. See our Privacy Policy for more details on how ads work on our site.' },
      ],
    },
    {
      title: '10. Governing Law',
      content: [
        { subtitle: 'Jurisdiction', text: 'These Terms of Service shall be governed by and construed in accordance with the laws of Pakistan. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Pakistan.' },
        { subtitle: 'Dispute Resolution', text: 'We encourage you to contact us at support@inventa.app before initiating any formal legal proceedings. We will make every reasonable effort to resolve disputes informally.' },
      ],
    },
    {
      title: '11. Changes to These Terms',
      content: [
        { subtitle: 'Policy Updates', text: 'We reserve the right to modify these Terms of Service at any time. When we do, we will update the "Last Updated" date at the top of this page. Your continued use of Inventa after any changes constitutes your acceptance of the revised terms.' },
      ],
    },
    {
      title: '12. Contact Us',
      content: [
        { subtitle: 'Get In Touch', text: 'If you have any questions about these Terms of Service, please contact us at: support@inventa.app' },
      ],
    },
  ];

  return (
    <div className={`min-h-screen font-sans ${bg}`}>
      <Helmet>
        <title>Terms of Service | Inventa - Expiry Tracker</title>
        <meta name="description" content="Read Inventa's Terms of Service to understand the rules and guidelines governing your use of our free inventory and expiry tracking platform." />
        <link rel="canonical" href="https://expiry-tracker.live/terms-of-service" />
      </Helmet>

      <nav className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md ${navClass}`}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link to={'/'} className="flex items-center gap-3 text-left">
            <div className={`flex h-9 w-9 items-center justify-center rounded-md border ${darkMode ? 'bg-[#141414] border-[#262626] text-[#F5F5F2]' : 'bg-[#111111] border-[#111111] text-[#FAF9F6]'}`}>
              <Boxes size={18} />
            </div>
            <div>
              <div className={`text-base font-bold tracking-tight leading-none ${headingClass}`}>Inventa</div>
              <div className={`text-[10px] font-mono uppercase tracking-[0.16em] mt-1 ${textClass}`}>Legal & Terms</div>
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
            <ScrollText size={14} />
            Legal Document
          </div>
          <h1
            className={`mb-3 text-3xl sm:text-5xl font-normal tracking-tight ${headingClass}`}
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            Terms of Service
          </h1>
          <p className={`text-xs font-mono uppercase tracking-wider ${textClass}`}>
            Last Updated: <strong>June 23, 2026</strong>
          </p>
          <p className={`mt-4 max-w-2xl text-base leading-relaxed ${textClass}`}>
            Please read these Terms of Service carefully before using Inventa. By using our service, you agree to be bound by these terms.
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

export default TermsOfService;
