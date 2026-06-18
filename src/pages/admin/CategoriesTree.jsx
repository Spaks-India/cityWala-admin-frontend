import React from "react";
import { AdminSidebar } from "./AdminLogin";
import { useNavigate } from "react-router-dom";
// import { getCategoryPath } from "../../utils/categoryUtils";
import { handleDelete } from "../../utils/CrudAction";
import API from "../../api/axios";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import AdminLayout from "./AdminLayout";


export default function CategoriesTree() {

  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);


  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =========================
  // HELPERS
  // =========================

  const catIdStr = (v) =>
    typeof v === "object" ? String(v?._id) : String(v);

  const buildTree = (items, parentId = null) => {
    return items
      .filter((i) =>
        parentId
          ? catIdStr(i.parentId) === catIdStr(parentId)
          : !i.parentId
      )
      .map((i) => ({
        ...i,
        children: buildTree(items, i._id),
      }));
  };

  const flattenCategoryTree = (items) => {
    const tree = buildTree(items);

    const rows = [];

    const walk = (nodes, depth = 0) => {
      nodes.forEach((n) => {
        rows.push({
          cat: n,
          depth,
        });

        if (n.children?.length) {
          walk(n.children, depth + 1);
        }
      });
    };

    walk(tree);

    return rows;
  };

  const getCategoryPath = (items, cat) => {
    const path = [];

    let current = cat;

    while (current) {
      path.unshift(current.name);

      current = items.find(
        (i) =>
          catIdStr(i._id) ===
          catIdStr(current.parentId)
      );
    }

    return path.join(" / ");
  };

  const getSelfAndDescendantIds = (
    items,
    rootId
  ) => {
    const ids = new Set();

    const walk = (pid) => {
      ids.add(catIdStr(pid));

      items.forEach((i) => {
        if (
          catIdStr(i.parentId) ===
          catIdStr(pid)
        ) {
          walk(i._id);
        }
      });
    };

    if (rootId) {
      walk(rootId);
    }

    return ids;
  };

  // =========================
  // LOAD ALL
  // =========================

  const loadCats = async () => {
    setLoading(true);

    try {
      const res = await API.get("/categories");

      setCategories(
        res.data.categories || []
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCats();
  }, []);


  const blockedParentIds = useMemo(
    () =>
      getSelfAndDescendantIds(
        categories,
        id
      ),
    [categories, id]
  );


  const tableRows = useMemo(
    () => flattenCategoryTree(categories),
    [categories]
  );
  const [search, setSearch] = useState("");

  const filteredRows = useMemo(() => {
    return tableRows.filter(({ cat }) =>
      cat.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [tableRows, search]);


  return (
    // <div
    //   style={{
    //     minHeight: "100vh",
    //     background: "#f4f7fb",
    //   }}
    // >
    <>
      <AdminLayout active="/admin/dashboard"  >
        <div className="row g-0">
          {/* <AdminSidebar active="/admin/dashboard" /> */}

          <div className="col-lg-12">
            <div
              className="card border-0 shadow-sm"
              style={{
                borderRadius: "24px",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 px-4 py-3"
                style={{
                  background:
                    "linear-gradient(135deg,#111827,#1f2937)",
                  color: "#fff",
                }}
              >
                <div>
                  <h3 className="fw-bold mb-1">
                    Categories Tree
                  </h3>

                  <p
                    className="mb-0"
                    style={{
                      fontSize: "14px",
                      opacity: 0.8,
                    }}
                  >
                    Manage all categories easily
                  </p>
                </div>
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 px-4 py-3 border-bottom">

                  <div style={{ flex: 1, minWidth: "250px" }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search category..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{
                        borderRadius: "12px",
                        padding: "12px 16px",
                        border: "1px solid #d1d5db",
                        boxShadow: "none",
                      }}
                    />
                  </div>

                  <button
                    className="btn btn-light fw-semibold"
                    style={{
                      borderRadius: "12px",
                      padding: "10px 18px",
                      whiteSpace: "nowrap",
                    }}
                    onClick={() => navigate("/admin/categories/add")}
                  >
                    + Add Category
                  </button>

                </div>

              </div>
              {/* Table */}
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-dark"></div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead
                      style={{
                        background: "#f9fafb",
                      }}
                    >
                      <tr>
                        <th className="ps-4">#</th>
                        <th>Category</th>
                        <th>Path</th>
                        <th>Image</th>
                        <th>Status</th>
                        <th className="text-center">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredRows.map(
                        ({ cat, depth }, i) => (
                          <tr
                            key={cat._id}
                            style={{
                              verticalAlign: "middle",
                            }}
                          >
                            {/* Index */}
                            <td className="ps-4 fw-semibold">
                              {i + 1}
                            </td>

                            {/* Category */}
                            <td
                              style={{
                                paddingLeft:
                                  20 + depth * 18,
                              }}
                            >
                              <div className="d-flex align-items-center">
                                <span className="me-2">
                                  {depth === 0
                                    ? "📁"
                                    : "└─"}
                                </span>

                                <span
                                  className="fw-semibold"
                                  style={{
                                    color: "#111827",
                                  }}
                                >
                                  {/* {cat.name} */}
                                  {/* {cat.name?.charAt(0).toUpperCase() + cat.name?.slice(1).toLowerCase()} */}
                                  {cat.name?.charAt(0).toUpperCase() + cat.name.slice(1).toLowerCase()}
                                </span>
                              </div>
                            </td>

                            {/* Path */}
                            <td>
                              {/* <span
                                className="badge"
                                style={{
                                  background: "#eef2ff",
                                  color: "#4338ca",
                                  padding:
                                    "8px 12px",
                                  borderRadius:
                                    "10px",
                                  fontWeight: "500",
                                }}
                              >
                                {getCategoryPath(
                                  categories,
                                  cat
                                )}
                              </span> */}
                              <span
                                className="badge d-inline-block text-truncate"
                                style={{
                                  maxWidth: "250px",
                                  background: "#eef2ff",
                                  color: "#4338ca",
                                  padding: "8px 12px",
                                  borderRadius: "10px",
                                  fontWeight: "500",
                                }}
                                title={getCategoryPath(categories, cat)}
                              >
                                {getCategoryPath(categories, cat)}
                              </span>
                            </td>

                            {/* Image */}
                            <td>
                              {cat.image ? (
                                <img
                                  src={cat.image}
                                  alt={cat.name}
                                  style={{
                                    width: "55px",
                                    height: "55px",
                                    objectFit:
                                      "cover",
                                    borderRadius:
                                      "14px",
                                    border:
                                      "1px solid #eee",
                                  }}
                                />
                              ) : (
                                <div
                                  className="d-flex justify-content-center align-items-center"
                                  style={{
                                    width: "55px",
                                    height: "55px",
                                    borderRadius:
                                      "14px",
                                    background:
                                      "#f3f4f6",
                                    color: "#999",
                                    fontSize:
                                      "12px",
                                  }}
                                >
                                  No Img
                                </div>
                              )}
                            </td>

                            {/* Status */}
                            <td>
                              <span
                                className={`badge px-3 py-2 ${cat.status
                                  ? "bg-success"
                                  : "bg-danger"
                                  }`}
                                style={{
                                  borderRadius:
                                    "30px",
                                  fontWeight:
                                    "500",
                                  fontSize:
                                    "12px",
                                }}
                              >
                                {cat.status
                                  ? "Active"
                                  : "Inactive"}
                              </span>
                            </td>

                            {/* Actions */}
                            <td>
                              <div className="d-flex justify-content-center gap-2">
                                <button
                                  className="btn btn-sm"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius:
                                      "12px",
                                    background:
                                      "#eff6ff",
                                    color: "#2563eb",
                                    border: "none",
                                  }}
                                  onClick={() =>
                                    navigate(
                                      `/admin/categories/edit/${cat._id}`
                                    )
                                  }
                                >
                                  <CiEdit />
                                </button>

                                <button
                                  className="btn btn-sm"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius:
                                      "12px",
                                    background:
                                      "#fef2f2",
                                    color: "#dc2626",
                                    border: "none",
                                  }}
                                  onClick={() =>
                                    handleDelete(
                                      {
                                        id: cat._id,
                                        route: `categories`,
                                        onSuccess: () =>
                                          setCategories(
                                            categories.filter(
                                              c => c._id !== cat._id
                                            )
                                          ),
                                        alertMessage: 'Category deleted'
                                      })
                                  }
                                >
                                  <FaRegTrashAlt />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>

    </>
    // </div>
  );
}