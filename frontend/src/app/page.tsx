'use client';

import { motion } from 'framer-motion';
import { Sparkles, Shield, Zap, Clock, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import SearchForm from '@/components/SearchForm';
import AnimatedDestination from '@/components/AnimatedDestination';
import { useRouter } from 'next/navigation';

const features = [
  {
    icon: Sparkles,
    title: 'Points Optimized',
    description: 'Find the best value for your Chase, Amex, and other credit card points.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Search cash fares and award availability in one unified search.',
  },
  {
    icon: Shield,
    title: 'Expert Guidance',
    description: 'Step-by-step booking guides for even the most complex award bookings.',
  },
  {
    icon: Clock,
    title: 'Real-Time Data',
    description: 'Award availability updated every few hours from airline programs.',
  },
];

const airlines = [
  { name: 'United', logo: '/airlines/united.svg' },
  { name: 'ANA', logo: '/airlines/ana.svg' },
  { name: 'JAL', logo: '/airlines/jal.svg' },
  { name: 'American', logo: '/airlines/american.svg' },
  { name: 'Delta', logo: '/airlines/delta.svg' },
];

// Animation variants for consistent animations
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  const router = useRouter();

  const handleSearch = (data: any) => {
    // Build query string and navigate to results
    const params = new URLSearchParams({
      origin: data.origin,
      departure: data.departureDate,
      return: data.returnDate,
      payment: data.paymentType,
      cabin: data.cabinClass,
      passengers: data.passengers.toString(),
      flexible: data.flexibleDates.toString(),
      programs: data.selectedPrograms.join(','),
    });
    router.push(`/results?${params.toString()}`);
  };

  return (
    <>
      <Header />

      <main>
        {/* Hero Section */}
        <section className="section-hero relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-[var(--color-sakura-500)] opacity-5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[var(--color-ocean-500)] opacity-5 rounded-full blur-3xl" />
          </div>

          <div className="container-main relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="text-eyebrow mb-4 block">Your journey starts here</span>
              <h1 className="text-heading-1 mb-6 max-w-4xl mx-auto">
                Find the <span className="gradient-text">best flights</span> to{' '}
                <br className="hidden md:block" />
                <AnimatedDestination />
              </h1>
              <p className="text-body text-lg max-w-2xl mx-auto">
                Search across all major US airports. Compare award availability from
                United, ANA, JAL, and more. Get personalized recommendations for your points.
              </p>
            </motion.div>

            <SearchForm onSearch={handleSearch} />

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap justify-center gap-6 mt-12 text-[var(--color-indigo-500)] text-sm"
            >
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Free to search
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Updated every 4 hours
              </span>
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                No credit card required
              </span>
            </motion.div>
          </div>
        </section>

        {/* Airlines Section */}
        <section className="py-12 border-y border-[var(--color-indigo-800)]">
          <div className="container-main">
            <p className="text-center text-muted text-sm mb-8">
              Search award availability on major airlines
            </p>
            <motion.div
              className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              {['United', 'ANA', 'JAL', 'American', 'Delta', 'Zipair'].map((airline, i) => (
                <motion.span
                  key={airline}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.4 }}
                  className="text-[var(--color-indigo-400)] text-lg font-medium"
                >
                  {airline}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section">
          <div className="container-main">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-eyebrow mb-4 block">Why Just Get Me There?</span>
              <h2 className="text-heading-2">
                The smartest way to book your trip
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  className="card text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[var(--color-indigo-800)] flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-[var(--color-sakura-400)]" />
                  </div>
                  <h3 className="text-heading-3 text-lg mb-2">{feature.title}</h3>
                  <p className="text-body text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Example Use Case */}
        <section className="section bg-[var(--color-indigo-900)]/50">
          <div className="container-main">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-eyebrow mb-4 block">How it works</span>
                <h2 className="text-heading-2 mb-6">
                  From search to booking in 3 simple steps
                </h2>
                <div className="space-y-6">
                  {[
                    {
                      step: '1',
                      title: 'Search your trip',
                      description: 'Enter your dates, select your points programs, and search.',
                    },
                    {
                      step: '2',
                      title: 'Compare options',
                      description: 'See cash fares and award options side by side with value calculations.',
                    },
                    {
                      step: '3',
                      title: 'Follow the guide',
                      description: 'Get step-by-step instructions for transferring points and booking.',
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={item.step}
                      className="flex gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ delay: 0.15 * i, duration: 0.4 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-[var(--color-sakura-500)] text-[var(--color-indigo-950)] flex items-center justify-center font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="text-display text-lg mb-1">{item.title}</h3>
                        <p className="text-body text-sm">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              <motion.div
                className="card-elevated"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="text-eyebrow mb-2">Example result</div>
                <h4 className="text-display text-xl mb-4">NYC to Tokyo</h4>
                <div className="space-y-4">
                  <div className="card-result recommended">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="badge badge-sakura mb-2">Best Value</div>
                        <div className="font-medium">United Business Class</div>
                        <div className="text-muted text-sm">JFK → NRT • Nonstop</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[var(--color-sakura-400)] font-bold">70,000 pts</div>
                        <div className="text-muted text-sm">+ $50 taxes</div>
                      </div>
                    </div>
                    <div className="value-indicator high">
                      2.8¢/point value (vs $2,000 cash)
                    </div>
                  </div>
                  <div className="card-result">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">ANA Business Class</div>
                        <div className="text-muted text-sm">JFK → HND • Nonstop</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">95,000 pts</div>
                        <div className="text-muted text-sm">+ $150 taxes</div>
                      </div>
                    </div>
                    <div className="value-indicator medium">
                      2.2¢/point value
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="gradient-border p-8 md:p-12 text-center"
            >
              <h2 className="text-heading-2 mb-4">
                Ready to find your flight?
              </h2>
              <p className="text-body max-w-xl mx-auto mb-8">
                Start searching for free. Upgrade to Pro for unlimited searches,
                price alerts, and advanced features.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="btn btn-primary btn-lg"
                >
                  Start Searching
                  <ArrowRight className="w-5 h-5" />
                </button>
                <a href="/pricing" className="btn btn-secondary btn-lg">
                  View Pricing
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-indigo-800)] py-12">
        <div className="container-main">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-display text-sm mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-[var(--color-indigo-400)]">
                <li><a href="/how-it-works" className="hover:text-[var(--color-indigo-200)]">How it Works</a></li>
                <li><a href="/pricing" className="hover:text-[var(--color-indigo-200)]">Pricing</a></li>
                <li><a href="/faq" className="hover:text-[var(--color-indigo-200)]">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-display text-sm mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-[var(--color-indigo-400)]">
                <li><a href="/guides" className="hover:text-[var(--color-indigo-200)]">Travel Guides</a></li>
                <li><a href="/blog" className="hover:text-[var(--color-indigo-200)]">Blog</a></li>
                <li><a href="/points-101" className="hover:text-[var(--color-indigo-200)]">Points 101</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-display text-sm mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-[var(--color-indigo-400)]">
                <li><a href="/about" className="hover:text-[var(--color-indigo-200)]">About</a></li>
                <li><a href="/contact" className="hover:text-[var(--color-indigo-200)]">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-display text-sm mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-[var(--color-indigo-400)]">
                <li><a href="/privacy" className="hover:text-[var(--color-indigo-200)]">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-[var(--color-indigo-200)]">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[var(--color-indigo-800)] text-center text-sm text-[var(--color-indigo-500)]">
            &copy; {new Date().getFullYear()} Just Get Me There. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
