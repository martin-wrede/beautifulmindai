import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'

export default function AppClerk () {
  return (
    <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <App />
        <UserButton />
      </SignedIn>
    </header>
  )
}