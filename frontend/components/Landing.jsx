import React, { useState } from 'react';
import { CheckCircle, Barcode, Bell, Flame, BarChart3, Users, ArrowRight, Menu, X, Shield, Leaf, TrendingUp } from 'lucide-react';
import Button from './ui/Button';

const Landing = ({ onGetStarted }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="font-bold text-xl text-slate-900 hidden sm:inline">Inventa</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('features')} className="text-slate-600 hover:text-slate-900 transition text-sm font-medium">
                Features
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-slate-600 hover:text-slate-900 transition text-sm font-medium">
                How It Works
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="text-slate-600 hover:text-slate-900 transition text-sm font-medium">
                Testimonials
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-slate-600 hover:text-slate-900 transition text-sm font-medium">
                Pricing
              </button>
            </div>

            {/* CTA + Mobile Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onGetStarted}
                className="hidden sm:inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm"
              >
                Get Started
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2 border-t border-slate-200 pt-4">
              <button onClick={() => scrollToSection('features')} className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100 rounded">
                Features
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100 rounded">
                How It Works
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100 rounded">
                Testimonials
              </button>
              <button onClick={() => scrollToSection('pricing')} className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100 rounded">
                Pricing
              </button>
              <button onClick={onGetStarted} className="w-full mt-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm">
                Get Started
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6 text-sm font-medium">
              <CheckCircle size={16} />
              <span>Trusted by 10,000+ shopkeepers</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Never Miss an <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Expiry Date</span> Again
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Smart barcode scanning, AI-powered reminders, and real-time analytics to reduce waste and boost your bottom line.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center space-x-2 transition transform hover:scale-105"
              >
                <span>Get Started Free</span>
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="w-full sm:w-auto px-8 py-4 border-2 border-slate-300 hover:bg-slate-50 text-slate-900 rounded-lg font-semibold transition"
              >
                Learn More
              </button>
            </div>

            {/* Social Proof */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full border-2 border-white" />
                  ))}
                </div>
                <span>Join thousands today</span>
              </div>
              <div>⭐ 4.9/5 rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Powerful Features, Simple Interface
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to manage inventory and reduce waste
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Barcode,
                title: 'Barcode Scanning',
                description: 'Instantly scan product barcodes to add items and track expiry dates with AI recognition.',
                color: 'blue'
              },
              {
                icon: Bell,
                title: 'Smart Reminders',
                description: 'Get timely notifications before products expire. Never let stock go to waste.',
                color: 'cyan'
              },
              {
                icon: Flame,
                title: 'Habit Streaks',
                description: 'Build consistent inventory checking habits with streak tracking and achievements.',
                color: 'orange'
              },
              {
                icon: BarChart3,
                title: 'Advanced Analytics',
                description: 'Track waste reduction, savings, and inventory trends with detailed reports.',
                color: 'purple'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = {
                blue: 'bg-blue-100 text-blue-600',
                cyan: 'bg-cyan-100 text-cyan-600',
                orange: 'bg-orange-100 text-orange-600',
                purple: 'bg-purple-100 text-purple-600'
              };

              return (
                <div key={index} className="bg-white p-8 rounded-xl border border-slate-200 hover:border-blue-300 transition hover:shadow-lg">
                  <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-4 ${colorClasses[feature.color]}`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text */}
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Real Impact on Your Business
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                See measurable results from day one. Our users report significant improvements in operational efficiency.
              </p>

              <div className="space-y-4">
                {[
                  {
                    icon: Leaf,
                    title: 'Reduce Waste by 40%',
                    description: 'Cut food waste and product losses through better inventory visibility'
                  },
                  {
                    icon: TrendingUp,
                    title: 'Save Up to $5,000/Month',
                    description: 'Recover lost revenue by preventing stock spoilage and markdown losses'
                  },
                  {
                    icon: Flame,
                    title: 'Boost Productivity',
                    description: 'Automate manual tracking. Your team focuses on growth, not inventory.'
                  },
                  {
                    icon: Shield,
                    title: 'Stay Compliant',
                    description: 'Maintain audit trails and compliance with food safety regulations'
                  }
                ].map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="flex space-x-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100">
                          <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{benefit.title}</h3>
                        <p className="text-slate-600 text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Side - Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl h-96 flex items-center justify-center shadow-2xl">
                <div className="text-center text-white">
                  <div className="text-5xl font-bold mb-2">40%</div>
                  <div className="text-lg opacity-90">Waste Reduction</div>
                  <div className="mt-6 text-sm opacity-75">Average across all users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Get started in minutes with our simple four-step process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Sign Up', description: 'Create your free account in seconds and set up your inventory.' },
              { step: '2', title: 'Scan Barcodes', description: 'Use your phone camera to scan product barcodes or add items manually.' },
              { step: '3', title: 'Get Alerts', description: 'Receive smart reminders when products are about to expire.' },
              { step: '4', title: 'Track & Save', description: 'Monitor waste reduction and see savings grow with analytics dashboard.' }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-8 rounded-xl border border-slate-200">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-600 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Loved by Shopkeepers
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Hear from business owners who've transformed their inventory management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Rajesh Kumar',
                role: 'Grocery Store Owner',
                image: 'R',
                quote: 'Implemented ExpiryTracker in my store and immediately started saving money. Waste reduced by 35% in the first month!',
                color: 'bg-blue-100'
              },
              {
                name: 'Priya Sharma',
                role: 'Pharmacy Manager',
                image: 'P',
                quote: 'The barcode scanning is so convenient. My team loves the smart reminders - no more expired medicines on the shelf.',
                color: 'bg-cyan-100'
              },
              {
                name: 'Vikram Singh',
                role: 'Restaurant Owner',
                image: 'V',
                quote: 'Best investment for our inventory! The analytics show exactly where we lose money. Game-changer for our business.',
                color: 'bg-purple-100'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-lg transition">
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg text-slate-900 ${testimonial.color}`}>
                    {testimonial.image}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{testimonial.name}</h3>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-slate-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Choose the plan that fits your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Free',
                price: '$0',
                period: 'Forever',
                description: 'Perfect for getting started',
                features: ['Up to 50 products', 'Basic barcode scanning', 'Email reminders', 'Manual reports', 'Community support'],
                cta: 'Get Started',
                highlighted: false
              },
              {
                name: 'Pro',
                price: '$299',
                period: 'Per month',
                description: 'For growing businesses',
                features: ['Unlimited products', 'Advanced barcode scanning', 'SMS & email reminders', 'AI-powered analytics', 'Habit streaks', 'Priority support', 'API access'],
                cta: 'Start Free Trial',
                highlighted: true
              },
              {
                name: 'Business',
                price: '$999',
                period: 'Per month',
                description: 'For large enterprises',
                features: ['Unlimited products & locations', 'Advanced barcode scanning', 'SMS, Email & WhatsApp', 'Custom analytics', 'Team management', 'Dedicated support', 'Custom integrations'],
                cta: 'Contact Sales',
                highlighted: false
              }
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-xl transition transform hover:scale-105 ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-blue-600 to-cyan-500 shadow-2xl ring-2 ring-blue-300 md:scale-105'
                    : 'bg-white border border-slate-200'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-yellow-400 text-slate-900 px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className={`p-8 ${plan.highlighted ? 'text-white' : ''}`}>
                  <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-6 ${plan.highlighted ? 'text-white/80' : 'text-slate-600'}`}>
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm ml-2 ${plan.highlighted ? 'text-white/80' : 'text-slate-600'}`}>
                      {plan.period}
                    </span>
                  </div>

                  <button
                    onClick={onGetStarted}
                    className={`w-full py-3 rounded-lg font-semibold mb-8 transition ${
                      plan.highlighted
                        ? 'bg-white text-blue-600 hover:bg-slate-50'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {plan.cta}
                  </button>

                  <div className={`space-y-4 ${plan.highlighted ? 'text-white' : ''}`}>
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <CheckCircle size={20} className={plan.highlighted ? 'text-white' : 'text-blue-600'} />
                        <span className={plan.highlighted ? 'text-white/90' : 'text-slate-700'}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-600">
              All plans include a 14-day free trial. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your Inventory?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of successful businesses reducing waste and saving money with ExpiryTracker.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-slate-50 transition transform hover:scale-105"
          >
            <span>Start Your Free Trial</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">E</span>
                </div>
                <span className="font-bold text-white text-lg">Inventa</span>
              </div>
              <p className="text-sm text-slate-400">
                Smart inventory management for modern businesses.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition">Features</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-white transition">Pricing</button></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-slate-400">
                © 2026 ExpiryTracker. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
                <a href="#" className="hover:text-white transition">Twitter</a>
                <a href="#" className="hover:text-white transition">LinkedIn</a>
                <a href="#" className="hover:text-white transition">Facebook</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
