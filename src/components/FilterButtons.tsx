interface FilterButtonsProps {
  value: string;
  onChange: (value: string) => void;
}

const filters = [
  { label: "All", value: "all" },
  { label: "Rent", value: "rent" },
  { label: "Sale", value: "sale" },
];

export default function FilterButtons({ value, onChange }: FilterButtonsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChange(filter.value)}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
            value === filter.value
              ? "bg-brand-600 text-white shadow-soft"
              : "bg-white text-slate-600 shadow-sm hover:bg-slate-50"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
