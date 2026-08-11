import { Routes, Route } from 'react-router-dom'
import { SignIn, SignUp, SignedIn, SignedOut } from '@clerk/clerk-react'
import { SplashScreen } from './pages/SplashScreen'
import { CountrySelect } from './pages/CountrySelect'
import { OnboardingStep1 } from './pages/OnboardingStep1'
import { OnboardingStep2 } from './pages/OnboardingStep2'
import { Dashboard } from './pages/Dashboard'
import { NotificationSettings } from './pages/NotificationSettings'
import './App.css'

function App() {

  return (
    <Routes>
      <Route path="/sign-in/*" element={
        <div className="auth-container">
          <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" afterSignInUrl="/onboarding/step-1" />
        </div>
      } />
      <Route path="/sign-up/*" element={
        <div className="auth-container">
          <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" afterSignUpUrl="/onboarding/country" />
        </div>
      } />
      <Route path="/onboarding/country" element={
        <SignedIn>
          <CountrySelect />
        </SignedIn>
      } />
      <Route path="/onboarding/step-1" element={
        <SignedIn>
          <OnboardingStep1 />
        </SignedIn>
      } />
      <Route path="/onboarding/step-2" element={
        <SignedIn>
          <OnboardingStep2 />
        </SignedIn>
      } />
      <Route path="/profile" element={
        <SignedIn>
          <NotificationSettings />
        </SignedIn>
      } />
      <Route path="/dashboard" element={
        <SignedIn>
          <Dashboard />
        </SignedIn>
      } />
      <Route path="/" element={
        <>
          <SignedIn>
            <Dashboard />
          </SignedIn>
          <SignedOut>
            <SplashScreen />
          </SignedOut>
        </>
      } />
    </Routes>
  )
}

export default App
