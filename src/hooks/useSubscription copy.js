const MOCK_STATUS = 'free'; 

export function useSubscription() {
  // This hook returns a fake status instantly for UI development.
  return {
    plan: MOCK_STATUS,
    isActive: MOCK_STATUS === 'pro',
    isLoading: false
  };
}
// hooks/useSubscription.js (MOCK VERSION for local development)
 