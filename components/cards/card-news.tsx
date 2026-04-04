"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { formattedDateNews } from "@/utils/date-format";
import { imageUrl } from "@/utils/image-url";
import { TgetNews } from "@/server/data/news";
import { Badge } from "../ui/badge";

export const FrameNews = ({ ...news }: TgetNews) => {
  return (
    <Link
      href={`/home/news/${news.slug}`}
      key={news.slug}
      className="w-full relative flex items-center p-[7px] box-border gap-[0.937rem] text-left text-[0.688rem] text-gray font-sf-pro bg-card shadow rounded-3xl my-1"
    >
      <Image
        src={imageUrl(news.fileKey)}
        className="h-[8.438rem] w-37.5 relative rounded-[18px] object-cover shrink-0"
        width={150}
        height={135}
        sizes="100vw"
        alt=""
      />
      <div className="w-full flex flex-col items-start gap-1.5 justify-between h-full pb-2 pr-2">
        <div className="flex flex-col gap-1.5">
          <Badge className="rounded-[10px] w-28">{news.catagory}</Badge>
          <div className="max-w-52 self-stretch relative text-[0.938rem] tracking-[-0.23px] leading-5 font-semibold text-foreground">
            {news.judul} Lorem ipsum dolor sit.
          </div>
        </div>
        <div className="flex items-center gap-2 text-[0.75rem] w-full">
          <Avatar className="size-6 ">
            <AvatarImage src={news.creator.image || ""} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="w-full ">{news.creator.username}</div>
          <div className="h-1 w-1 rounded-[50%] bg-gray" />
          <div className="w-full text-right">
            {formattedDateNews(news.createdAt)}
          </div>
        </div>
      </div>
    </Link>
  );
};

// export const CardNewsRender = ({ ...news }: TgetNews) => {
//   return (
//     <div className="items-start gap-3">
//       <Link
//         href={`/home/news/${news.slug}`}
//         key={news.slug}
//         className="grid grid-cols-4 items-center w-full hover:bg-card active:bg-card rounded-4xl ring ring-muted-foreground/20 bg-background"
//       >
//         <Image
//           src={imageUrl(news.fileKey)}
//           alt="berita"
//           height={200}
//           width={200}
//           className="h-26 w-32 rounded-l-4xl col-span-1"
//         />

//         <div className="flex flex-col items-start justify-between h-24 w-full col-span-3 px-3">
//           <div className="space-y-1">
//             <Badge size={"sm"} className="text-xs rounded-2xl capitalize">
//               <span className="size-2 rounded-full bg-primary-foreground" />
//               {news.catagory}
//             </Badge>
//             <h1 className="text-lg/6 font-semibold line-clamp-2">
//               {news.judul}
//             </h1>
//           </div>
//           <div className="flex items-center justify-between w-full px-3">
//             <div className="flex items-center gap-1">
//               <Avatar className="size-6">
//                 <AvatarImage src={news.creator.image || ""} />
//                 <AvatarFallback>CN</AvatarFallback>
//               </Avatar>
//               <span className="text-xs">{news.creator.username || ""}</span>
//             </div>
//             <div className="flex items-center gap-1 mx-2">
//               <span className="size-2 bg-muted-foreground rounded-full" />
//               <span className="text-xs text-muted-foreground">
//                 {formattedDate(news.createdAt)}
//               </span>
//             </div>
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// };
