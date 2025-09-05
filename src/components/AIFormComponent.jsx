// src/components/AIFormComponent.jsx (Refined and Cleaner)

import React from 'react';
import Form from './chatbot/Form';
import ChatInterface from './chatbot/ChatInterface';

// We receive grouped props now, which is much cleaner
export default function AIFormComponent({ formProps, chatProps }) {

  return (
    // We use a React Fragment <> because we don't need an extra div
    <>
      {/* Headline at the top to introduce the Pro section */}
      <div className="pro-features-header">
        <h3>✨ Pro AI Planner</h3>
        <p>Use the form and chat below to generate and refine your project plan automatically.</p>
      </div>

      <div id="part1" style={{ display: "block" }}>
        <div id="form-all-id">
          {/* Spread the formProps object onto the Form component */}
          <Form {...formProps} />
        </div>
        
        {/* The active prompt display is part of the form logic */}
        {formProps.gesamtPrompt && (
          <div className="active-prompt-display">
            <strong>{formProps.aiData?.chat_activePromptLabel || 'Aktiver Prompt'}:</strong> Ready to generate plan.
          </div>
        )}
        
        {/* Spread the chatProps object onto the ChatInterface component */}
        <ChatInterface {...chatProps} />
      </div>

      {/* The "Today's Tasks" view (part2) should be visible to ALL users, 
          so we will move it back to PlannerApp.jsx */}
    </>
  );
}