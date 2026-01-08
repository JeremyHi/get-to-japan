import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Just Get Me There | Find the Best Flights with Points & Cash',
  description: 'Search flights using cash, credit card points, or both. Find the optimal booking strategy for your trip with award availability from major airlines.',
  keywords: ['flight search', 'award travel', 'Chase points', 'Amex points', 'Japan flights', 'Tokyo flights'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
