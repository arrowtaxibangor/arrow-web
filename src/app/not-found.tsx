import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found — Arrow Taxi',
  description: 'The page you were looking for could not be found.',
  robots: { index: false, follow: false },
};

const links: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'Book a ride', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-24 text-center">
      <p className="text-primary_color text-6xl font-extrabold">404</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 tablet:text-2xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-base text-gray-500">
        Sorry, the page you were looking for doesn&apos;t exist. Try one of these:
      </p>
      <nav className="mt-10 flex flex-wrap justify-center gap-4" aria-label="Helpful links">
        {links.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-primary_color rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary_color focus:ring-offset-2"
          >
            {label}
          </Link>
        ))}
      </nav>
      <p className="mt-12 text-sm text-gray-400">
        Need help?{' '}
        <Link href="/contact" className="text-primary_color font-medium hover:underline">
          Contact Arrow Taxi
        </Link>
      </p>
    </main>
  );
}
