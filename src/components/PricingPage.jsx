// src/components/PricingPage.jsx
import React from 'react';

// In a real app, you might get this from a config file or API
const plans = [
  {
    name: 'Free',
    price: '$0',
    features: ['Create & Download ICS Plans', 'Save 1 Project', '5 AI Credits'],
    cta: 'You are on this plan',
    isCurrent: true,
  },
  {
    name: 'Pro',
    price: '$19 / month',
    features: ['Everything in Free, plus:', 'Unlimited AI Credits', 'Save Unlimited Projects', 'Automatic Calendar Sync'],
    // IMPORTANT: This will be your Lemon Squeezy checkout link later
    checkoutUrl: 'https://your-store.lemonsqueezy.com/buy/YOUR-PRODUCT-ID',
    cta: 'Upgrade to Pro',
    isCurrent: false, // We'd make this dynamic later
  }
];

export default function PricingPage() {
  return (
    <div className="pricing-container">
      <h1>Choose Your Plan</h1>
      <div className="plans-grid">
        {plans.map(plan => (
          <div key={plan.name} className="plan-card">
            <h2>{plan.name}</h2>
            <p className="price">{plan.price}</p>
            <ul>
              {plan.features.map(feature => <li key={feature}>{feature}</li>)}
            </ul>
            {plan.isCurrent ? (
              <button disabled>{plan.cta}</button>
            ) : (
              <a href={plan.checkoutUrl}>
                <button>{plan.cta}</button>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}