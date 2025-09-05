// src/components/Header.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../hooks/useSubscription'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

// --- Step 1: Import your assets and context ---
// Make sure these paths are correct for your project structure
import { Context } from '../Context'; // Assuming your  file is named Context.jsx
import Logo from '../assets/BeautifulMindAI.svg'; // Example path to your logo
// --- FIX: Import your flag images here ---
import German from '../assets/german_flag.png'; // Example path
import British from '../assets/british_flag.png'; // Example path
// import LanguageSwitcher from './LanguageSwitcher'; //
 
 // ✅ Extracted reusable language switcher
function LanguageSwitcher({ language, changeLanguage }) {
  return (
   
    <div className="language-switcher">
       {/*   */}
      <button 
      style={{backgroundImage:`url(${German})` ,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          width: '30px',
          height: '20px',
          border: 'none',
          cursor: 'pointer',}}
      
          className="button" onClick={() => changeLanguage("de")} disabled={language === "de"}>
       <span style={{color:"white", }} ><b></b>DE</span>
      </button>
  
      <button className="button"
      style={{backgroundImage:`url(${British})` ,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          width: '30px',
          height: '20px',
          border: 'none',
          cursor: 'pointer',
        }}

      onClick={() => changeLanguage("en")} disabled={language === "en"}>
        <span style={{color:"white", }} ><b></b>EN</span>
      </button>
    
    </div>
    
  );
}


export default function Header() {
  // --- Step 2: Get state from your Context ---
  // This assumes your context provides 'language' and 'changeLanguage'
  const { language, changeLanguage } = useContext(Context);

  // --- Step 3: Add state for UI control ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [menuShown, setMenuShown] = useState(false);

  const subscription = useSubscription();
  // --- Step 4: Add logic to handle screen resizing ---
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener when the component unmounts
    return () => window.removeEventListener('resize', handleResize);
  }, []); // The empty array ensures this effect runs only once on mount and unmount

  // Helper function to toggle the mobile menu
  const toggleMenu = () => {
    setMenuShown(!menuShown);
  };

  // Helper function to close the menu when a link is clicked on mobile
  const handleLinkClick = () => {
    if (isMobile) {
      setMenuShown(false);
    }
  };

  return (
    // Use a single <header> element as the main container
    <header id="header" className="main-header">
      <div className="logo-container logo">
        <Link to="/" onClick={handleLinkClick}>
          <img id="logo" src={Logo} alt="DigitalMindAI" />
        </Link>
      </div>

      <nav id="nav1">
        {/* The menu's visibility is controlled by state */}
        <div id="menu" style={{ display: isMobile && !menuShown ? 'none' : 'block' }}>
          <ul>
            <li><Link to="/how-it-works" onClick={handleLinkClick}>
              {language === "de" ? "Wie es geht" : "How it works"}
            </Link></li>
            
            {/* Show Planner/Daily links only when signed in */}
            <SignedIn>
              <li><Link to="/planner" onClick={handleLinkClick}>
                {language === "de" ? "Starte den Planer" : "Start the Planner"}
              </Link></li>
              <li><Link to="/daily" onClick={handleLinkClick}>
                {language === "de" ? "Tägliche Aufgaben" : "Daily Tasks"}
              </Link></li>
            </SignedIn>

            <li><Link to="/about" onClick={handleLinkClick}>
              {language === "de" ? "Über Mich" : "About Me"}
            </Link></li>
          </ul>
        </div>
      </nav>
      
      {/* Mobile-only elements */}
      {isMobile && (
        <>
          <div id="menu-sprachen-2">
            <LanguageSwitcher language={language} changeLanguage={changeLanguage} />
          </div>
          <div id="button1" onClick={toggleMenu} className="menu-icon">
            <div className="menu-format">
              <div id="hamburger" className={menuShown ? 'open' : ''}>
                <div className="hamburger-streifen"></div>
                <div className="hamburger-streifen"></div>
                <div className="hamburger-streifen"></div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Desktop-only language switcher */}
      {!isMobile && (
        <div id="nav2">
          <div id="menu-sprachen-1">
            <LanguageSwitcher language={language} changeLanguage={changeLanguage} />
          </div>
        </div>
      )}

      {/* --- Step 5: Add Clerk User Controls --- */}
      <div className="user-controls">
    
        <SignedOut>
          <SignInButton mode="modal" afterSignInUrl="/planner">
            <button className="my-custom-signin-button">
              {language === "de" ? "Anmelden" : "Sign In"}
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          {!subscription.isLoading && !subscription.isActive && (
            <Link to="/pricing" className="upgrade-link">Upgrade to Pro</Link>
          )}

          
          {!subscription.isLoading && subscription.isActive && (
            <span className="pro-badge">✨ Pro Member</span>
          )}
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}