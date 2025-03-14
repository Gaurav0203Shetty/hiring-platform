'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Default navigation links always include Home.
  let links = [{ href: '/', label: 'Home' }];

  // Show dashboard based on role.
  if (session?.user?.role === 'CANDIDATE') {
    links.push({ href: '/candidate/dashboard', label: 'Dashboard' });
    links.push({ href: '/candidate/jobs', label: 'Jobs' });
    links.push({ href: '/candidate/applications', label: 'My Applications' });
    links.push({ href: '/candidate/profile', label: 'My Profile' });
    links.push({ href: '/candidate/interviews', label: 'My Interviews' });
    links.push({ href: '/candidate/favorites', label: 'Favorites' });
    links.push({ href: '/candidate/resume-improvement', label: 'Resume Improvement' });
    links.push({ href: '/candidate/interview-questions', label: 'Interview Qs' });
    links.push({ href: '/messaging', label: 'Messaging' });
  } else if (session?.user?.role === 'RECRUITER') {
    links.push({ href: '/recruiter/dashboard', label: 'Dashboard' });
    links.push({ href: '/recruiter/jobs/new', label: 'Post Job' });
    links.push({ href: '/recruiter/applications', label: 'Applications' });
    links.push({ href: '/recruiter/analytics', label: 'Analytics' });
    links.push({ href: '/recruiter/interviews', label: 'Interviews' });
    links.push({ href: '/messaging', label: 'Messaging' });
  }

  // Auth link changes based on session.
  links.push({ href: '/signin', label: session ? 'Sign Out' : 'Sign In' });

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Hiring Platform
        </Link>
        <nav>
          <ul className="flex space-x-6">
            {links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`cursor-pointer ${isActive ? 'text-blue-600 font-bold' : 'text-gray-700 hover:text-blue-600'}`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
