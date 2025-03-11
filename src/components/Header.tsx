'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const links = [
    { href: '/', label: 'Home' },
    { href: '/resume', label: 'Resume' },
    { href: '/recruiter/dashboard', label: 'Dashboard' },
    { href: '/signin', label: 'Sign In' },
  ];

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <span className="text-2xl font-bold text-blue-600 cursor-pointer">
            Hiring Platform
          </span>
        </Link>
        <nav>
          <ul className="flex space-x-6">
            {links.map((link) => {
              // Check if the current pathname matches or starts with the link href
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className={`cursor-pointer ${isActive ? 'text-blue-600 font-bold' : 'text-gray-700 hover:text-blue-600'}`}>
                      {link.label}
                    </span>
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
