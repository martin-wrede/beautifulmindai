// components/ProtectedRoute.jsx (NEW FILE)

import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute  = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    // Show a loading spinner or a blank page while Clerk is checking auth
    return <div>Loading...</div>;
  }

  if (isLoaded && !isSignedIn) {
    // If the user is not signed in, redirect them to the home page
    return <Navigate to="/" />;
  }

  // If the user is signed in, render the page content
  return <Outlet />;
};