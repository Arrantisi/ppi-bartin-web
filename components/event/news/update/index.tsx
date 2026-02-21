"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { PostNewsField } from "@/components/field/post-news";
import { formattedDate } from "@/utils/date-format";
import { useQuery } from "@tanstack/react-query";
import { getNewsBySlug } from "@/data/news";

export const PostNewsComoponent = ({ slug }: { slug: string }) => {
  const { data } = useQuery({
    queryKey: ["getUpdateNews"],
    queryFn: () => getNewsBySlug(slug),
  });

  console.log(slug);

  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto bg-background min-h-screen pb-10">
      {/* Sticky Top Navigation */}
      <nav className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-background shadow-2xl"
          onClick={() => router.back()}
        >
          <IconArrowLeft size={24} />
        </Button>
        <span className="font-bold text-lg bg-background shadow-2xl rounded-4xl p-2 px-3">
          Post A News
        </span>
        <div />
      </nav>

      <div className="px-5">
        {/* Author & Meta */}
        <div className="flex items-center gap-3 mt-6">
          <Avatar className="size-10">
            <AvatarImage src={data?.creator.image || ""} />
            <AvatarFallback>DP</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-semibold">{data?.creator.username}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{formattedDate(new Date())}</span>
            </div>
          </div>
        </div>

        <PostNewsField
          urlImage={data?.images[0].url || ""}
          judul={data?.judul || ""}
          slug={slug}
        />
      </div>
    </div>
  );
};
