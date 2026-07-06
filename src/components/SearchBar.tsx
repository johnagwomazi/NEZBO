import { Search } from "lucide-react";
import type { FormEvent } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  autoFocus?: boolean;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  autoFocus,
  placeholder = "Search by title or location",
}: SearchBarProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit?.();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-teal-300 focus-within:ring-4 focus-within:ring-teal-100"
    >
      <Search size={18} className="shrink-0 text-slate-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
      />
      {onSubmit ? (
        <button
          type="submit"
          className="rounded-full bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-800"
        >
          Search
        </button>
      ) : null}
    </form>
  );
}
