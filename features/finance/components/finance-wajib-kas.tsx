"use client";

import { IconCheck, IconMinus, IconSearch } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TWajibKasReport } from "@/types/finance";

const ALL = "all";

type TStatusFilter = "all" | "lunas" | "tunggakan";

const QUARTERS = ["KUARTAL I", "KUARTAL II", "KUARTAL III", "KUARTAL IV"];

function KasSummary({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number;
  tone?: "neutral" | "success" | "danger";
}) {
  const toneClass = {
    neutral: "text-text-primary",
    success: "text-success",
    danger: "text-danger",
  }[tone];

  return (
    <div className="rounded-2xl border border-border p-4">
      <p className="footnote text-text-secondary">{label}</p>
      <p className={`font-mono text-2xl font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}

/** Blok D: status pembayaran kas anggota dari tab `WAJIB KAS` bendahara. */
export function FinanceWajibKas({
  report,
}: {
  report: TWajibKasReport | null;
}) {
  const [search, setSearch] = useState("");
  const [angkatan, setAngkatan] = useState(ALL);
  const [status, setStatus] = useState<TStatusFilter>("all");

  const angkatanOptions = useMemo(() => {
    const years = new Set<number>();
    report?.blocks.forEach((block) =>
      block.members.forEach((member) => years.add(member.angkatan)),
    );
    return Array.from(years).sort((a, b) => b - a);
  }, [report]);

  const blocks = useMemo(() => {
    if (!report) return [];
    const query = search.trim().toLowerCase();

    return report.blocks
      .map((block) => ({
        ...block,
        members: block.members.filter((member) => {
          const matchesName =
            !query || member.nama.toLowerCase().includes(query);
          const matchesAngkatan =
            angkatan === ALL || String(member.angkatan) === angkatan;
          const matchesStatus = status === "all" || member.status === status;
          return matchesName && matchesAngkatan && matchesStatus;
        }),
      }))
      .filter((block) => block.members.length > 0);
  }, [report, search, angkatan, status]);

  if (!report) {
    return (
      <p className="footnote text-text-secondary">
        Data WAJIB KAS belum tersedia di spreadsheet bendahara.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="footnote text-text-secondary">
        {report.department} · {report.period} · Sumber: tab WAJIB KAS
        (read-only)
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KasSummary label="Total anggota" value={report.summary.total} />
        <KasSummary label="Lunas" value={report.summary.lunas} tone="success" />
        <KasSummary
          label="Tunggakan"
          value={report.summary.tunggakan}
          tone="danger"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-[200px] flex-1">
          <IconSearch
            aria-hidden
            className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-disabled"
          />
          <Input
            type="search"
            aria-label="Cari nama anggota"
            placeholder="Cari nama anggota..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={angkatan} onValueChange={setAngkatan}>
          <SelectTrigger size="sm" aria-label="Filter angkatan" className="w-[170px]">
            <SelectValue placeholder="Semua angkatan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Semua angkatan</SelectItem>
            {angkatanOptions.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as TStatusFilter)}
        >
          <SelectTrigger size="sm" aria-label="Filter status kas" className="w-[170px]">
            <SelectValue placeholder="Semua status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua status</SelectItem>
            <SelectItem value="lunas">Lunas</SelectItem>
            <SelectItem value="tunggakan">Tunggakan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {blocks.length === 0 ? (
        <p className="footnote text-text-secondary">
          Tidak ada anggota yang cocok dengan filter saat ini.
        </p>
      ) : (
        blocks.map((block, blockIndex) => (
          // Penanggung jawab bisa dipakai lebih dari satu blok angkatan, jadi
          // kuncinya memakai angkatan + posisi blok hasil filter.
          <Card key={`${block.members[0].angkatan}-${blockIndex}`}>
            <CardHeader className="pb-3">
              <CardTitle className="subheadline">
                Angkatan {block.members[0].angkatan}
              </CardTitle>
              <CardDescription className="footnote">
                Penanggung jawab: {block.penanggungJawab || "-"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1040px] border-collapse text-left">
                  <caption className="sr-only">
                    Status pembayaran kas anggota — penanggung jawab{" "}
                    {block.penanggungJawab || "tidak diketahui"}
                  </caption>
                  <thead>
                    <tr className="border-y border-border bg-surface">
                      <th
                        scope="col"
                        rowSpan={2}
                        className="subheadline px-3 py-2"
                      >
                        No
                      </th>
                      <th
                        scope="col"
                        rowSpan={2}
                        className="subheadline px-3 py-2"
                      >
                        Angkatan
                      </th>
                      <th
                        scope="col"
                        rowSpan={2}
                        className="subheadline px-3 py-2"
                      >
                        Nama
                      </th>
                      {QUARTERS.map((quarter) => (
                        <th
                          key={quarter}
                          scope="colgroup"
                          colSpan={3}
                          className="subheadline border-x border-border px-3 py-2 text-center"
                        >
                          {quarter}
                        </th>
                      ))}
                      <th
                        scope="col"
                        rowSpan={2}
                        className="subheadline px-3 py-2 text-right"
                      >
                        Tunggakan
                      </th>
                      <th
                        scope="col"
                        rowSpan={2}
                        className="subheadline px-3 py-2 text-right"
                      >
                        Status
                      </th>
                    </tr>
                    <tr className="border-b border-border bg-surface">
                      {block.members[0].months.map((month) => (
                        <th
                          key={month.label}
                          scope="col"
                          className="footnote px-2 py-2 text-center"
                        >
                          {month.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.members.map((member) => (
                      <tr
                        key={`${member.angkatan}-${member.no}-${member.nama}`}
                        className="border-b border-border last:border-0"
                      >
                        <td className="px-3 py-3 font-mono text-text-secondary">
                          {member.no}
                        </td>
                        <td className="px-3 py-3 font-mono text-text-primary">
                          {member.angkatan}
                        </td>
                        <td className="px-3 py-3">
                          <p className="body text-text-primary">{member.nama}</p>
                        </td>
                        {member.months.map((month) => (
                          <td
                            key={month.label}
                            className="px-2 py-3 text-center"
                          >
                            {month.paid ? (
                              <IconCheck
                                aria-hidden
                                className="size-4 text-success"
                              />
                            ) : (
                              <IconMinus
                                aria-hidden
                                className="size-4 text-text-disabled"
                              />
                            )}
                            <span className="sr-only">
                              {month.paid ? "Lunas" : "Belum bayar"}{" "}
                              {month.label}
                            </span>
                          </td>
                        ))}
                        <td className="px-3 py-3 text-right font-mono text-text-primary">
                          {member.tunggakan}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <Badge
                            variant="outline"
                            className={
                              member.status === "lunas"
                                ? "text-success"
                                : "text-danger"
                            }
                          >
                            {member.status === "lunas" ? "Lunas" : "Tunggakan"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
