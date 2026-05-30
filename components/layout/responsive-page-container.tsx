import { useIsMobile } from "@/hooks/use-mobile";

type ResponsivePageContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export const ResponsivePageContainer = ({
  children,
  className = "",
}: ResponsivePageContainerProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <>{children}</>;
  }

  return (
    <div className={`mx-auto max-w-4xl px-6 ${className}`}>
      {children}
    </div>
  );
};
