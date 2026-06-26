// Defines the tracker limits based on tier
export const getCustomizationLimit = (tier: string | null): number => {
  if (!tier || tier === 'free') return 2;
  return 5; // Applies to 'supporter', 'premium', etc.
};

export const isPremiumUser = (tier: string | null): boolean => {
  return tier !== 'free' && tier !== null;
};