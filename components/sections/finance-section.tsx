import {
	IconCircleCheck,
	IconClock,
	IconFileText,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { FinanceSheetLink } from "@/components/shared/finance-sheet-link";
import { env } from "@/lib/env";

export const FinanceSection = () => {
	const financeSheetUrl = env.NEXT_PUBLIC_FINANCE_SHEET_URL;

	return (
		<section id="finance" className="py-20 bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col lg:flex-row gap-12 items-center">
					<div className="lg:w-1/2">
						<Badge className="mb-4 rounded-full border-success text-success">
							Tersedia
						</Badge>
						<h2 className="title-satu mb-6">
							Transparansi Keuangan
						</h2>
						<p className="body mb-8">
							Laporan keuangan PPI Bartın dapat dibuka langsung
							melalui Google Sheets. Dashboard ringkas sedang
							disiapkan untuk menggantikan tautan ini.
						</p>
						<ul className="space-y-4">
							{[
								"Ringkasan keuangan yang lebih mudah dibaca",
								"Catatan pemasukan dan pengeluaran yang rapi",
								"Akses laporan untuk kebutuhan organisasi",
							].map((item) => (
								<li
									key={item}
									className="flex items-center gap-3 body text-text-primary"
								>
									<IconClock className="text-warning w-5 h-5" /> {item}
								</li>
							))}
						</ul>
						<FinanceSheetLink href={financeSheetUrl} />
					</div>

					<div className="lg:w-1/2 w-full bg-background">
						<div className="bg-background p-6 rounded-3xl border border-dashed border-border">
							<div className="flex justify-between items-start mb-6 gap-4">
								<div>
									<h3 className="title-tiga">
										Status fitur keuangan
									</h3>
									<p className="footnote mt-1">
										Laporan dapat diakses melalui tombol di samping.
									</p>
								</div>
								<Badge
									variant="secondary"
									className="border-success text-success subheadline"
								>
									TERSEDIA
								</Badge>
							</div>

							<div className="space-y-4">
								<div className="p-4 bg-muted/30 rounded-2xl border border-border flex items-center gap-4">
									<div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success">
										<IconCircleCheck className="w-5 h-5" />
									</div>
									<div>
										<p className="body text-text-primary font-semibold">
											Transparansi Keuangan
										</p>
										<p className="footnote">
											Laporan dapat dilihat anggota lewat Google Sheets.
										</p>
									</div>
								</div>

								<div className="p-4 bg-muted/30 rounded-2xl border border-border flex items-center gap-4">
									<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground">
										<IconFileText className="w-5 h-5" />
									</div>
									<div>
										<p className="body text-text-primary font-semibold">
											Laporan yang lebih mudah dibaca
										</p>
										<p className="footnote">
											Dashboard ringkas sedang disiapkan.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
