import React, { useState, useEffect, useContext } from 'react';

// ✅ Extracted reusable language switcher
export default function LanguageSwitcher({ language, changeLanguage }) {
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
