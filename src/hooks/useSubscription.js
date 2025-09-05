
// hooks/useSubscription.js (MOCK VERSION for local development)

// Set this to 'pro' to test the paid experience!
const MOCK_STATUS = 'free'; 

export function useSubscription() {
  // This hook returns a fake status instantly.
  // No database calls, no loading states. Purely for UI development.
  
  const isActive = MOCK_STATUS === 'pro';
  
  return {
    plan: MOCK_STATUS,
    isActive: isActive,
    isLoading: false,
    // Zusätzliche Properties die nützlich sein könnten:
    isPro: isActive,
    isFree: !isActive,
    canAccessFeature: (feature) => isActive, // Beispiel für Feature-Check
  };
}
