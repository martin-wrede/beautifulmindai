// src/components/PricingPage.jsx

import React from 'react';
import { useUser } from '@clerk/clerk-react';

// This data structure is perfect.
const plans = [
  {
    name: 'Free',
    price: '$0',
    features: ['Create & Download ICS Plans', 'Save 1 Project', '5 AI Credits'],
    cta: 'You are on this plan',
    isCurrent: true, // This would be dynamic in a real app
    checkoutUrl: null, // Free plans don't have a checkout URL
  },
  {
    name: 'Pro',
    price: '$19 / month',
    features: ['Everything in Free, plus:', 'Unlimited AI Credits', 'Save Unlimited Projects', 'Automatic Calendar Sync'],
    checkoutUrl: 'https://wrede.lemonsqueezy.com/buy/988560', // Your real checkout URL
    cta: 'Upgrade to Pro',
    isCurrent: false,
  }
];

export default function PricingPage() {
  const { user } = useUser();

  // The logic to create the personalized link has been moved inside the return statement.
  // This is cleaner and more scalable.

  return (
    <div className="pricing-container">
      <h1>Choose Your Plan</h1>
      <div className="plans-grid">
        {plans.map(plan => {
          
          // --- THIS IS THE FIX ---
          // For each plan, we check if it has a checkoutUrl and if the user is logged in.
          // Then we construct the unique link for that specific plan's button.
          const personalizedCheckoutLink = (user && plan.checkoutUrl)
            ? `${plan.checkoutUrl}?checkout[custom][clerk_user_id]=${user.id}`
            : plan.checkoutUrl;

          return (
            <div key={plan.name} className="plan-card">
              <h2>{plan.name}</h2>
              <p className="price">{plan.price}</p>
              <ul>
                {plan.features.map(feature => <li key={feature}>{feature}</li>)}
              </ul>
              {plan.isCurrent ? (
                <button disabled>{plan.cta}</button>
              ) : (
                // We use the personalizedCheckoutLink we just created
                <a href={personalizedCheckoutLink}>
                  <button>{plan.cta}</button>
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}