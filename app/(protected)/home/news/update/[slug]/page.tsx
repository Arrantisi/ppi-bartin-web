import { PostNewsComoponent } from "@/components/event/news/update";

const PostNewsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  return (
    <div>
      <PostNewsComoponent slug={slug} />
    </div>
  );
};

export default PostNewsPage;
