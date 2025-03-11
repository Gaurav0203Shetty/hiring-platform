'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-grow text-center px-4">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">
          Welcome to Hiring Platform
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Connect recruiters with top talent using our intelligent, AI-powered ecosystem.
        </p>
        <Link
          href="/signin"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-colors"
        >
          Get Started
        </Link>
      </section>
      {/* Footer */}
      <footer className="bg-white py-4 shadow mt-auto">
        <div className="container mx-auto text-center text-gray-600">
          © {new Date().getFullYear()} Hiring Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
