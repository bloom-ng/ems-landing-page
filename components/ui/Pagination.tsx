interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // Build visible page numbers with ellipsis
  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 pt-4 pb-1 select-none">
      <p className="text-[11px] font-bold text-muted tracking-widest uppercase">
        Showing{" "}
        <span className="text-foreground">{from}–{to}</span>{" "}
        of{" "}
        <span className="text-foreground">{total}</span>
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:text-primary hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Previous page"
        >
          <span className="material-icons-outlined text-[18px]">chevron_left</span>
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="h-8 w-8 flex items-center justify-center text-xs text-muted"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`h-8 min-w-[2rem] px-2 rounded-lg text-xs font-black transition-all ${
                p === page
                  ? "bg-primary text-white shadow-sm shadow-primary/30"
                  : "text-muted hover:text-primary hover:bg-primary/10"
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:text-primary hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Next page"
        >
          <span className="material-icons-outlined text-[18px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
