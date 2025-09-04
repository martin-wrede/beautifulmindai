// components/Header.jsx (Corrected)

import React from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

export default function Header() {
  return (
    <header className="main-header">
      {/* ... other nav links ... */}
      <div className="user-controls">
        <SignedOut>
          {/* You can also specify a redirect URL after sign-in here if needed */}
          <SignInButton mode="modal" afterSignInUrl="/planner" />
        </SignedOut>
        <SignedIn>
          {/* No afterSignOutUrl needed! Clerk will use the dashboard setting. */}
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}