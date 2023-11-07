import { createContext } from "react";

export type OnboardingScreenContextValue = {
  completeOnboarding: () => void;
};

export const OnboardingScreenContext = createContext<OnboardingScreenContextValue>({
  completeOnboarding: () => { },
});
