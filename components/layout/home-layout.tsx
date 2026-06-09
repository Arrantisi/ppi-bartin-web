"use client";

import NavMainEvent from "@/components/shared/navigation/nav-main-event";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";

export const HomeLayoutComponent = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const isMobile = useIsMobile();
	const pathname = usePathname();

	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 12)",
				} as React.CSSProperties
			}
		>
			{!isMobile && <NavMainEvent />}

			<SidebarInset className="min-h-svh">
				<AnimatePresence mode="wait">
					<motion.div
						key={pathname}
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.2, ease: "easeInOut" }}
						className={
							isMobile
								? "mt-4 mb-28 flex min-h-[calc(100svh-8rem)] w-full flex-col px-3"
								: "mt-4 mb-6 mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-4xl flex-col px-6"
						}
					>
						{children}
					</motion.div>
				</AnimatePresence>
			</SidebarInset>

			{isMobile && <NavMainEvent />}
		</SidebarProvider>
	);
};
