import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom';
import { ContextProvider } from './Context';
// import App from './App'
import AppClerk from './AppClerk'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider>
   <BrowserRouter    > 
     <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AppClerk />
    </ClerkProvider>
    </BrowserRouter >
  </ContextProvider>
    </StrictMode>,
)
