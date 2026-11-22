"use client";

import { IconSearch, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export function ContentSearch({
  value,
  onChange,
  placeholder,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}) {
  return (
    <InputGroup className="h-10.5 min-w-0 flex-1 bg-card">
      <InputGroupAddon>
        <IconSearch aria-hidden className="size-4.5 text-text-secondary" />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="bg-transparent [&::-webkit-search-cancel-button]:hidden"
      />
      {value.length > 0 && (
        <InputGroupAddon align="inline-end" className="pr-2">
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Hapus pencarian"
            className="rounded-full p-1 text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary focus-visible:outline-2 focus-visible:outline-ring"
          >
            <IconX aria-hidden className="size-4" />
          </button>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}

export function ContentSearchEmpty({
  query,
  label,
  onReset,
}: {
  query: string;
  label: string;
  onReset: () => void;
}) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-[10px] border border-border bg-surface px-4 py-10 text-center animate-in fade-in duration-200">
      <div className="flex size-14 items-center justify-center rounded-full border border-border bg-surface-hover text-text-secondary">
        <IconSearch aria-hidden className="size-6" />
      </div>
      <p className="body text-text-secondary">
        Tidak ada {label} yang cocok dengan &ldquo;{query}&rdquo;.
      </p>
      <Button variant="outline" size="sm" onClick={onReset}>
        Hapus pencarian
      </Button>
    </div>
  );
}
