"use client";

import UpdateProfileField from "@/components/field/account-related/update-profile";
import { TgetProfileUser } from "@/server/data/users";

export default function CompleteProfileField(props: Partial<TgetProfileUser> = {}) {
  return (
    <div className="w-full">
      <div className="space-y-6">
        <UpdateProfileField {...props} mode="onboarding" />
      </div>
    </div>
  );
}
