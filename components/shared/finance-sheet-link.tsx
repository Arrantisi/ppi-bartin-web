"use client";

import { IconExternalLink } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

const defaultClassName = "mt-8 h-12 rounded-xl px-6 font-semibold";

export function FinanceSheetLink({
	href,
	className = defaultClassName,
}: {
	href?: string;
	className?: string;
}) {
	if (!href) {
		return (
			<Button className={className} disabled>
				Menunggu Peluncuran
			</Button>
		);
	}

	return (
		<Button
			render={
				<a
					href={href}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Lihat Laporan Keuangan (buka di tab baru)"
				/>
			}
			className={className}
		>
			Lihat Laporan Keuangan
			<IconExternalLink aria-hidden />
		</Button>
	);
}
