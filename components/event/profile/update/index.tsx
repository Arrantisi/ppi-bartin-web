"use client";

import { Button } from "@/components/ui/button";
import { IconArrowNarrowLeft } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { getProfileUser } from "@/server/data/users";
import { UpdateProfileField } from "@/components/field/update-profle";
import { useRouter } from "next/navigation";

export const UpdateProfileComponent = () => {
  const router = useRouter();

  const { data: user } = useQuery({
    queryKey: ["getUpdateProfile"],
    queryFn: () => getProfileUser(),
  });

  if (!user) {
    return null;
  }

  return (
    <div className="mb-16">
      {/* header */}
      <div className="relative flex items-center justify-center m-3">
        <h1 className="title-tiga">Edit Profile</h1>

        <Button
          variant={"outline"}
          onClick={() => router.push("/home/profile")}
          className="absolute left-0 top-0 rounded-full shadow-xl"
        >
          <IconArrowNarrowLeft />
        </Button>
      </div>

      <UpdateProfileField {...user} />
    </div>
  );
};
