"use client";

import NavMainEvent from "@/components/shared/navigation/nav-main-event";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence, motion } from "framer-motion";
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

			<SidebarInset>
				<AnimatePresence mode="wait">
					<motion.div
						key={pathname}
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.2, ease: "easeInOut" }}
						className={isMobile ? "mt-4 mx-3 mb-28" : "mt-4 mb-6"}
					>
						{children}
					</motion.div>
				</AnimatePresence>
			</SidebarInset>

			{isMobile && <NavMainEvent />}
		</SidebarProvider>
	);
};
