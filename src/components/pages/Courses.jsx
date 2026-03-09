import { useState, useEffect, useCallback } from "react";
import CourseCard from "../ui/CourseCard";
import { courses as coursesApi } from "../../api/api";
import "./Courses.css";

const ALL = "All";

export default function Courses() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [active, setActive] = useState(ALL);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [cats, setCats] = useState([ALL]);

  const SIZE = 12;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: SIZE };
      if (active !== ALL) params.category = active;
      if (search.trim()) params.search = search.trim();
      const data = await coursesApi.list(params);
      setItems(data.items || []);
      setTotal(data.total || 0);
      // Always refresh category list when unfiltered
      if (active === ALL && !search) {
        const uniq = [
          ...new Set((data.items || []).map((c) => c.category).filter(Boolean)),
        ];
        if (uniq.length > 0) setCats([ALL, ...uniq]);
      }
    } catch (e) {
      console.error("Failed to load courses", e);
    } finally {
      setLoading(false);
    }
  }, [page, active, search]);

  useEffect(() => {
    load();
  }, [load]);

  // Reset page when filters change
  const changeCategory = (cat) => {
    setActive(cat);
    setPage(1);
  };
  const changeSearch = (val) => {
    setSearch(val);
    setPage(1);
  };

  const pages = Math.ceil(total / SIZE);

  return (
    <div className="page-enter">
      <section className="crs-hero">
        <div className="container">
          <span className="badge badge-dark">All Courses</span>
          <h1 className="crs-hero__h1">
            Explore <span>Our Courses</span>
          </h1>
          <p className="crs-hero__sub">
            Industry-aligned courses taught by working professionals.
          </p>
          <input
            className="crs-search"
            placeholder="🔍  Search courses…"
            value={search}
            onChange={(e) => changeSearch(e.target.value)}
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="crs-filter">
            {cats.map((c) => (
              <button
                key={c}
                className={`crs-btn ${active === c ? "crs-btn--on" : ""}`}
                onClick={() => changeCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="crs-empty">
              <div className="cf-spinner" />
              <p>Loading courses…</p>
            </div>
          ) : items.length ? (
            <>
              <div className="crs-grid">
                {items.map((c) => (
                  <CourseCard key={c.id} course={c} />
                ))}
              </div>
              {pages > 1 && (
                <div className="crs-pagination">
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    ← Prev
                  </button>
                  <span style={{ fontSize: ".85rem", color: "var(--ink-2)" }}>
                    Page {page} of {pages}
                  </span>
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={page === pages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="crs-empty">
              <p>
                No courses match your search. Try a different keyword or
                category.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
