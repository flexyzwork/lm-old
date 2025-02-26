'use client';

import { useAuth } from '@/hooks/useAuth';
// import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
// import { dark } from '@clerk/themes';
import { Bell, BookOpen } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const NonDashboardNavbar = () => {
  // const { user } = useUser();
  const { user, handleLogout } = useAuth();
  const userRole = (user as { role: 'student' | 'teacher' } | null)?.role;

  // const userRole = user?.publicMetadata?.userType as 'student' | 'teacher';

  return (
    <nav className="nondashboard-navbar">
      <div className="nondashboard-navbar__container">
        <div className="nondashboard-navbar__search">
          <Link href="/" className="nondashboard-navbar__brand" scroll={false}>
            FLEXYZ
          </Link>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Link href="/search" className="nondashboard-navbar__search-input" scroll={false}>
                <span className="hidden sm:inline">Search Courses</span>
                <span className="sm:hidden">Search</span>
              </Link>
              <BookOpen className="nondashboard-navbar__search-icon" size={18} />
            </div>
          </div>
        </div>
        <div className="nondashboard-navbar__actions">
          <button className="nondashboard-navbar__notification-button">
            <span className="nondashboard-navbar__notification-indicator"></span>
            <Bell className="nondashboard-navbar__notification-icon" />
          </button>

          {user ? (
            <>
              <Link href="/profile">Profile</Link>
              <button onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link href="/signin">Sign In</Link>
              <Link href="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NonDashboardNavbar;
