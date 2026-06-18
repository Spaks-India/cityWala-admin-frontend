import React from "react";

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  limit,
  setLimit
}) {
  // Pages with "..."
  const getPages = () => {
    const pages = [];
    const delta = 2;

    const left = Math.max(1, page - delta);
    const right = Math.min(totalPages, page + delta);

    if (left > 1) {
      pages.push(1);
      if (left > 2) pages.push("...");
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages) {
      if (right < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  // Fixed limits (DON'T depend on total)
  const limits = [10, 25, 50, 100];

  return (
    <div className="d-flex my-5 justify-content-between align-items-center flex-wrap gap-2">

      {/* LIMIT DROPDOWN */}
      <select
        className="form-select w-auto"
        value={limit}
        onChange={(e) => {
          setLimit(Number(e.target.value));
          onPageChange(1); // reset page
        }}
      >
        {limits.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>

      {/* PAGINATION */}
      <div className="d-flex align-items-center gap-2">

        {/* Prev */}
        <button
          className="btn btn-outline-dark"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          Prev
        </button>

        {/* Pages */}
        {getPages().map((p, i) => (
          <button
            key={i}
            className={`btn btn-sm ${
              p === page
                ? "btn-dark"
                : p === "..."
                ? "btn-light disabled"
                : "btn-outline-dark"
            }`}
            disabled={p === "..."}
            onClick={() => typeof p === "number" && onPageChange(p)}
          >
            {p}
          </button>
        ))}

        {/* Next */}
        <button
          className="btn btn-outline-dark"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>

      </div>

      {/* INFO */}
      {/* <div className="text-muted small">
        Total: {total}
      </div> */}

    </div>
  );
}