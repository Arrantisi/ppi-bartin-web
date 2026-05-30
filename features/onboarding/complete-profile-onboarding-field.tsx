"use client";

import UpdateProfileField from "@/components/field/update-profile";
import { TgetProfileUser } from "@/server/data/users";

export const CompleteProfileOnboardingField = (
  props: Partial<TgetProfileUser> = {}
) => {
  return <UpdateProfileField {...props} mode="onboarding" />;
};
