'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Sparkles, Zap, Crown, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const PLANS = [
  {
    id: 'free',
    name: 'Explorer',
    tagline: 'Get started free',
    price: 0,
    period: 'forever',
    description: 'Perfect for occasional travelers planning their first points redemption trip to Japan.',
    features: [
      { text: '5 searches per day', included: true },
      { text: 'Basic award availability', included: true },
      { text: 'Cash fare comparisons', included: true },
      { text: '2 points programs', included: true },
      { text: 'Email support', included: true },
      { text: 'Price alerts', included: false },
      { text: 'Premium cabin search', included: false },
      { text: 'Historical pricing data', included: false },
    ],
    cta: 'Get Started Free',
    popular: false,
    icon: Sparkles,
    gradient: 'from-[var(--color-indigo-600)] to-[var(--color-indigo-500)]',
  },
  {
    id: 'pro',
    name: 'Pathfinder',
    tagline: 'Most popular',
    price: 9.99,
    period: 'month',
    yearlyPrice: 99.90,
    yearlySavings: '2 months free',
    description: 'For frequent travelers who want the best deals and premium cabin access.',
    features: [
      { text: 'Unlimited searches', included: true },
      { text: 'Real-time award availability', included: true },
      { text: 'Cash fare comparisons', included: true },
      { text: 'All points programs', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Unlimited price alerts', included: true },
      { text: 'Premium cabin search', included: true },
      { text: 'Historical pricing data', included: false },
    ],
    cta: 'Start Free Trial',
    popular: true,
    icon: Zap,
    gradient: 'from-[var(--color-sakura-500)] to-[var(--color-sakura-400)]',
  },
  {
    id: 'business',
    name: 'Navigator',
    tagline: 'For power users',
    price: 40,
    period: 'month',
    description: 'For travel hackers and points enthusiasts who maximize every redemption.',
    features: [
      { text: 'Everything in Pathfinder', included: true },
      { text: 'API access', included: true },
      { text: 'Historical pricing data', included: true },
      { text: 'Multi-city search', included: true },
      { text: 'Family account sharing', included: true },
      { text: 'Dedicated support', included: true },
      { text: 'Custom alerts', included: true },
      { text: 'Early feature access', included: true },
    ],
    cta: 'Contact Sales',
    popular: false,
    icon: Crown,
    gradient: 'from-[var(--color-ocean-500)] to-[var(--color-ocean-400)]',
  },
];

const FAQ = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes! You can cancel your subscription at any time. Your access will continue until the end of your billing period.',
  },
  {
    q: 'What points programs do you support?',
    a: 'We support Chase Ultimate Rewards, Amex Membership Rewards, Capital One Miles, and Citi ThankYou Points, with more coming soon.',
  },
  {
    q: 'Do you book flights for me?',
    a: 'We help you find the best options and provide step-by-step booking guides, but you complete the booking directly with the airline to ensure you earn elite qualifying miles.',
  },
  {
    q: 'How accurate is the award availability?',
    a: 'Our data is updated every 4 hours from airline programs. Pro and Business plans get near real-time updates.',
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const handleSelectPlan = (planId: string) => {
    if (planId === 'free') {
      router.push('/signup');
    } else if (planId === 'business') {
      window.location.href = 'mailto:hello@getmetojapan.com?subject=Navigator%20Plan%20Inquiry';
    } else {
      router.push(`/signup?plan=${planId}`);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="section-hero relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-40 left-1/3 w-[500px] h-[500px] bg-[var(--color-sakura-500)] opacity-5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-[var(--color-ocean-500)] opacity-5 rounded-full blur-3xl" />
          </div>

          <div className="container-main relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="text-eyebrow mb-4 block">Simple, transparent pricing</span>
              <h1 className="text-heading-1 mb-6">
                Find your <span className="gradient-text">perfect plan</span>
              </h1>
              <p className="text-body text-lg max-w-2xl mx-auto mb-8">
                Start free and upgrade when you're ready. All plans include our core search features.
              </p>

              {/* Billing Toggle */}
              <div className="inline-flex items-center gap-3 bg-[var(--color-indigo-900)] p-1.5 rounded-full border border-[var(--color-indigo-700)]">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-sm font-medium transition-all",
                    billingCycle === 'monthly'
                      ? "bg-[var(--color-indigo-700)] text-[var(--color-indigo-100)] shadow-lg"
                      : "text-[var(--color-indigo-400)] hover:text-[var(--color-indigo-200)]"
                  )}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                    billingCycle === 'yearly'
                      ? "bg-[var(--color-indigo-700)] text-[var(--color-indigo-100)] shadow-lg"
                      : "text-[var(--color-indigo-400)] hover:text-[var(--color-indigo-200)]"
                  )}
                >
                  Yearly
                  <span className="text-xs bg-gradient-to-r from-[var(--color-sakura-500)] to-[var(--color-sakura-400)] text-[var(--color-indigo-950)] px-2.5 py-1 rounded-full font-bold shadow-sm">
                    2 months free
                  </span>
                </button>
              </div>
            </motion.div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {PLANS.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={cn(
                    "relative rounded-2xl overflow-hidden",
                    plan.popular
                      ? "bg-gradient-to-b from-[var(--color-sakura-500)]/10 to-transparent border-2 border-[var(--color-sakura-500)]"
                      : "bg-[var(--color-indigo-900)] border border-[var(--color-indigo-700)]"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[var(--color-sakura-500)] to-[var(--color-sakura-400)] text-center py-1 text-xs font-semibold text-[var(--color-indigo-950)]">
                      MOST POPULAR
                    </div>
                  )}

                  <div className={cn("p-6", plan.popular && "pt-10")}>
                    {/* Plan Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br",
                        plan.gradient
                      )}>
                        <plan.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-lg text-[var(--color-indigo-100)]">
                          {plan.name}
                        </h3>
                        <p className="text-xs text-[var(--color-indigo-500)]">{plan.tagline}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-display font-bold text-[var(--color-indigo-100)]">
                          ${billingCycle === 'yearly' && plan.yearlyPrice
                            ? (plan.yearlyPrice / 12).toFixed(2).replace(/\.00$/, '')
                            : plan.price % 1 === 0 ? plan.price : plan.price.toFixed(2)}
                        </span>
                        {plan.price > 0 && (
                          <span className="text-[var(--color-indigo-500)]">/month</span>
                        )}
                      </div>
                      {plan.id === 'business' ? (
                        <p className="text-sm text-[var(--color-indigo-500)] mt-1">
                          Custom pricing available
                        </p>
                      ) : billingCycle === 'yearly' && plan.yearlyPrice ? (
                        <div className="mt-2">
                          <p className="text-sm text-[var(--color-indigo-400)]">
                            ${plan.yearlyPrice.toFixed(2).replace(/\.00$/, '')} billed annually
                          </p>
                          {plan.yearlySavings && (
                            <span className="inline-block mt-1.5 text-xs bg-[var(--color-success)]/20 text-[var(--color-success)] px-2.5 py-1 rounded-full font-semibold">
                              {plan.yearlySavings}
                            </span>
                          )}
                        </div>
                      ) : null}
                    </div>

                    <p className="text-sm text-[var(--color-indigo-400)] mb-6">
                      {plan.description}
                    </p>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleSelectPlan(plan.id)}
                      className={cn(
                        "w-full py-3 rounded-lg font-display font-medium transition-all mb-6",
                        plan.popular
                          ? "bg-gradient-to-r from-[var(--color-sakura-500)] to-[var(--color-sakura-400)] text-[var(--color-indigo-950)] hover:shadow-[var(--shadow-glow)]"
                          : "bg-[var(--color-indigo-800)] text-[var(--color-indigo-100)] hover:bg-[var(--color-indigo-700)]"
                      )}
                    >
                      {plan.cta}
                    </button>

                    {/* Features */}
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="w-5 h-5 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="w-5 h-5 text-[var(--color-indigo-700)] flex-shrink-0 mt-0.5" />
                          )}
                          <span className={cn(
                            "text-sm",
                            feature.included
                              ? "text-[var(--color-indigo-300)]"
                              : "text-[var(--color-indigo-600)]"
                          )}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section bg-[var(--color-indigo-900)]/50">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <span className="text-eyebrow mb-4 block">Questions?</span>
              <h2 className="text-heading-2">Frequently asked questions</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {FAQ.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="card"
                >
                  <h3 className="font-display font-semibold text-[var(--color-indigo-100)] mb-2">
                    {item.q}
                  </h3>
                  <p className="text-sm text-[var(--color-indigo-400)]">{item.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="gradient-border p-8 md:p-12 text-center"
            >
              <h2 className="text-heading-2 mb-4">
                Ready to find your dream flight?
              </h2>
              <p className="text-body max-w-xl mx-auto mb-8">
                Join thousands of travelers who've found their perfect trip to Japan using points.
              </p>
              <button
                onClick={() => router.push('/signup')}
                className="btn btn-primary btn-lg"
              >
                Start Searching Free
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-indigo-800)] py-12">
        <div className="container-main">
          <div className="text-center text-sm text-[var(--color-indigo-500)]">
            &copy; {new Date().getFullYear()} Just Get Me There. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
