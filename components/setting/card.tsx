"use client";

import { Separator } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { ThemeToggle } from "../buttons";

export const GantiTema = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="font-2xl">Tema</CardTitle>
				<CardDescription>Ganti tema kamu disini</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3">
				<ThemeToggle />
			</CardContent>
			<Separator />
			<CardFooter className="flex justify-between">
				<div className="flex items-center">
					<p className="font-sm text-sm flex items-center">
						Ada masalah tanya admin &nbsp;
						<span className="font-medium text-primary hover:underline underline-offset-4 cursor-pointer">
							<Link href={""}>@ppi_bartin</Link>
						</span>
					</p>
				</div>
			</CardFooter>
		</Card>
	);
};
