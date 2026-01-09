'use client';

import { motion } from 'framer-motion';
import {
  Search,
  GitCompare,
  BookOpen,
  ArrowRight,
  Plane,
  CreditCard,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Clock,
  Shield
} from 'lucide-react';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';

const STEPS = [
  {
    number: '01',
    title: 'Search Your Trip',
    subtitle: 'Tell us where and when',
    description: 'Enter your departure city, travel dates, and which points programs you have. We support all major US airports and transferable points currencies.',
    icon: Search,
    color: 'sakura',
    details: [
      'Search from any major US airport',
      'Flexible date options for better availability',
      'Select one or multiple points programs',
      'Filter by cabin class preference',
    ],
  },
  {
    number: '02',
    title: 'Compare Your Options',
    subtitle: 'See the full picture',
    description: 'View cash fares alongside award options. Our value calculator shows you exactly what your points are worth for each flight.',
    icon: GitCompare,
    color: 'ocean',
    details: [
      'Side-by-side cash vs points comparison',
      'Real-time cents-per-point value',
      'Multiple airline options at once',
      'Tax and fee transparency',
    ],
  },
  {
    number: '03',
    title: 'Book with Guidance',
    subtitle: 'Step-by-step instructions',
    description: 'Get detailed booking guides for every option. We walk you through point transfers, timing, and the exact steps to complete your booking.',
    icon: BookOpen,
    color: 'indigo',
    details: [
      'Transfer partner recommendations',
      'Estimated transfer times',
      'Direct booking links',
      'Alternative backup options',
    ],
  },
];

const POINT_PROGRAMS = [
  { name: 'Chase Ultimate Rewards', partners: ['United', 'Hyatt', 'Southwest'] },
  { name: 'Amex Membership Rewards', partners: ['ANA', 'Delta', 'Singapore'] },
  { name: 'Capital One Miles', partners: ['Air Canada', 'Emirates', 'Turkish'] },
  { name: 'Citi ThankYou', partners: ['JetBlue', 'Virgin Atlantic', 'Avianca'] },
];

const VALUE_EXAMPLES = [
  { route: 'NYC → Tokyo', cabin: 'Business', cash: 4500, points: 70000, value: 6.4 },
  { route: 'LAX → Osaka', cabin: 'First', cash: 12000, points: 110000, value: 10.9 },
  { route: 'SFO → Tokyo', cabin: 'Economy', cash: 900, points: 35000, value: 2.6 },
];

export default function HowItWorksPage() {
  const router = useRouter();

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="section-hero relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-1/3 w-[600px] h-[600px] bg-[var(--color-ocean-500)] opacity-5 rounded-full blur-3xl" />
            <div className="absolute bottom-40 left-1/4 w-[400px] h-[400px] bg-[var(--color-sakura-500)] opacity-5 rounded-full blur-3xl" />
          </div>

          <div className="container-main relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-eyebrow mb-4 block">Simple & Transparent</span>
              <h1 className="text-heading-1 mb-6">
                How <span className="gradient-text">Just Get Me There</span> works
              </h1>
              <p className="text-body text-lg max-w-2xl mx-auto">
                Finding award flights to Japan doesn't have to be complicated.
                Our platform simplifies the search process so you can focus on planning your adventure.
              </p>
            </motion.div>

            {/* Steps Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              {STEPS.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="text-center"
                >
                  <div className={`
                    w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center
                    ${step.color === 'sakura' ? 'bg-[var(--color-sakura-500)]/20 text-[var(--color-sakura-400)]' : ''}
                    ${step.color === 'ocean' ? 'bg-[var(--color-ocean-500)]/20 text-[var(--color-ocean-400)]' : ''}
                    ${step.color === 'indigo' ? 'bg-[var(--color-indigo-600)] text-[var(--color-indigo-200)]' : ''}
                  `}>
                    <step.icon className="w-7 h-7" />
                  </div>
                  <div className="text-sm font-bold text-[var(--color-indigo-500)] mb-2">{step.number}</div>
                  <h3 className="font-display font-semibold text-lg text-[var(--color-indigo-100)]">
                    {step.title}
                  </h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Steps */}
        {STEPS.map((step, index) => (
          <section
            key={step.number}
            className={`section ${index % 2 === 1 ? 'bg-[var(--color-indigo-900)]/50' : ''}`}
          >
            <div className="container-main">
              <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6 }}
                  className={index % 2 === 1 ? 'lg:order-2' : ''}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`
                      text-5xl font-display font-bold
                      ${step.color === 'sakura' ? 'text-[var(--color-sakura-500)]' : ''}
                      ${step.color === 'ocean' ? 'text-[var(--color-ocean-400)]' : ''}
                      ${step.color === 'indigo' ? 'text-[var(--color-indigo-400)]' : ''}
                    `}>
                      {step.number}
                    </span>
                    <div>
                      <p className="text-sm text-[var(--color-indigo-500)]">{step.subtitle}</p>
                      <h2 className="text-heading-2 text-2xl">{step.title}</h2>
                    </div>
                  </div>
                  <p className="text-body mb-6">{step.description}</p>
                  <ul className="space-y-3">
                    {step.details.map((detail, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * i, duration: 0.3 }}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle2 className={`
                          w-5 h-5 flex-shrink-0
                          ${step.color === 'sakura' ? 'text-[var(--color-sakura-400)]' : ''}
                          ${step.color === 'ocean' ? 'text-[var(--color-ocean-400)]' : ''}
                          ${step.color === 'indigo' ? 'text-[var(--color-indigo-400)]' : ''}
                        `} />
                        <span className="text-[var(--color-indigo-300)]">{detail}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className={`card-elevated ${index % 2 === 1 ? 'lg:order-1' : ''}`}
                >
                  {/* Step 1: Search Preview */}
                  {step.number === '01' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[var(--color-indigo-400)] text-sm mb-4">
                        <Plane className="w-4 h-4" />
                        <span>Search preview</span>
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 bg-[var(--color-indigo-800)] rounded-lg">
                          <div className="text-xs text-[var(--color-indigo-500)] mb-1">From</div>
                          <div className="font-medium text-[var(--color-indigo-100)]">New York (JFK)</div>
                        </div>
                        <div className="p-3 bg-[var(--color-indigo-800)] rounded-lg">
                          <div className="text-xs text-[var(--color-indigo-500)] mb-1">To</div>
                          <div className="font-medium text-[var(--color-indigo-100)]">Tokyo, Japan</div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-[var(--color-indigo-800)] rounded-lg">
                            <div className="text-xs text-[var(--color-indigo-500)] mb-1">Depart</div>
                            <div className="font-medium text-[var(--color-indigo-100)]">Mar 15</div>
                          </div>
                          <div className="p-3 bg-[var(--color-indigo-800)] rounded-lg">
                            <div className="text-xs text-[var(--color-indigo-500)] mb-1">Return</div>
                            <div className="font-medium text-[var(--color-indigo-100)]">Mar 28</div>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <span className="px-3 py-1 bg-[var(--color-sakura-500)]/20 text-[var(--color-sakura-400)] text-xs rounded-full">
                            Chase UR
                          </span>
                          <span className="px-3 py-1 bg-[var(--color-ocean-500)]/20 text-[var(--color-ocean-400)] text-xs rounded-full">
                            Amex MR
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Comparison Preview */}
                  {step.number === '02' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[var(--color-indigo-400)] text-sm mb-4">
                        <TrendingUp className="w-4 h-4" />
                        <span>Value comparison</span>
                      </div>
                      {VALUE_EXAMPLES.map((example, i) => (
                        <div
                          key={i}
                          className={`p-4 rounded-lg ${i === 0 ? 'bg-[var(--color-sakura-500)]/10 border border-[var(--color-sakura-500)]/30' : 'bg-[var(--color-indigo-800)]'}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              {i === 0 && (
                                <span className="text-xs bg-[var(--color-sakura-500)] text-[var(--color-indigo-950)] px-2 py-0.5 rounded-full font-medium mb-1 inline-block">
                                  Best Value
                                </span>
                              )}
                              <div className="font-medium text-[var(--color-indigo-100)]">{example.route}</div>
                              <div className="text-xs text-[var(--color-indigo-500)]">{example.cabin} Class</div>
                            </div>
                            <div className="text-right">
                              <div className="text-[var(--color-sakura-400)] font-bold">{example.points.toLocaleString()} pts</div>
                              <div className="text-xs text-[var(--color-indigo-500)]">vs ${example.cash.toLocaleString()} cash</div>
                            </div>
                          </div>
                          <div className={`text-xs font-medium ${example.value >= 5 ? 'text-[var(--color-success)]' : example.value >= 2 ? 'text-[var(--color-warning)]' : 'text-[var(--color-indigo-400)]'}`}>
                            {example.value}¢/point value
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Step 3: Booking Guide Preview */}
                  {step.number === '03' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[var(--color-indigo-400)] text-sm mb-4">
                        <CreditCard className="w-4 h-4" />
                        <span>Booking guide preview</span>
                      </div>
                      <div className="space-y-3">
                        {[
                          { step: 1, text: 'Transfer 70,000 Chase UR to United', time: 'Instant' },
                          { step: 2, text: 'Search United.com for award space', time: '—' },
                          { step: 3, text: 'Select flight and book with miles', time: '—' },
                          { step: 4, text: 'Pay $50 taxes and fees', time: '—' },
                        ].map((item) => (
                          <div key={item.step} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-[var(--color-indigo-700)] flex items-center justify-center flex-shrink-0 text-xs font-bold text-[var(--color-indigo-300)]">
                              {item.step}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm text-[var(--color-indigo-200)]">{item.text}</div>
                              {item.time !== '—' && (
                                <div className="text-xs text-[var(--color-ocean-400)]">{item.time}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-[var(--color-ocean-500)]/10 border border-[var(--color-ocean-500)]/30 rounded-lg">
                        <div className="flex items-center gap-2 text-[var(--color-ocean-400)] text-sm">
                          <Sparkles className="w-4 h-4" />
                          <span className="font-medium">Pro tip</span>
                        </div>
                        <p className="text-xs text-[var(--color-indigo-400)] mt-1">
                          Book at least 2 weeks in advance for best business class availability.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </section>
        ))}

        {/* Points Programs Section */}
        <section className="section">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <span className="text-eyebrow mb-4 block">Supported Programs</span>
              <h2 className="text-heading-2">Your points, your choice</h2>
              <p className="text-body mt-4 max-w-xl mx-auto">
                We support all major transferable points programs with access to dozens of airline partners.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {POINT_PROGRAMS.map((program, index) => (
                <motion.div
                  key={program.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="card"
                >
                  <h3 className="font-display font-semibold text-[var(--color-indigo-100)] mb-3">
                    {program.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {program.partners.map((partner) => (
                      <span
                        key={partner}
                        className="text-xs px-2 py-1 bg-[var(--color-indigo-800)] text-[var(--color-indigo-400)] rounded"
                      >
                        {partner}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="section bg-[var(--color-indigo-900)]/50">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <span className="text-eyebrow mb-4 block">Why use us?</span>
              <h2 className="text-heading-2">Save time and maximize value</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  icon: Clock,
                  title: 'Hours Saved',
                  description: 'No more checking multiple airline websites. See all your options in one search.',
                },
                {
                  icon: TrendingUp,
                  title: 'Better Value',
                  description: 'Our calculator shows exactly what your points are worth for each flight.',
                },
                {
                  icon: Shield,
                  title: 'Expert Guidance',
                  description: 'Step-by-step instructions ensure you never miss a step in the booking process.',
                },
              ].map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[var(--color-indigo-800)] flex items-center justify-center">
                    <benefit.icon className="w-7 h-7 text-[var(--color-sakura-400)]" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-[var(--color-indigo-100)] mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-[var(--color-indigo-400)]">{benefit.description}</p>
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
                Ready to find your flight to Japan?
              </h2>
              <p className="text-body max-w-xl mx-auto mb-8">
                Start searching for free. No credit card required.
              </p>
              <button
                onClick={() => router.push('/')}
                className="btn btn-primary btn-lg"
              >
                Start Searching
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
