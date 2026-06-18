import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import { AdminSidebar } from "./AdminLogin";
import AdminLayout from "./AdminLayout";

function AdminSubcategories() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);


  const fetchCategories = async () => {
    try {
      // NOTE: /location/categories doesn't return parentId, so subcategory filter breaks.
      // For admin "category-wise subcategories", we need full category objects with parentId.
      const res = await API.get("/categories");
      const data = res.data.categories || res.data || [];
      setCategories(data);

      // console.log("API DATA:", data); // debug
    } catch (err) {
      console.log(err);
    }
  };


  const rootCategories = useMemo(
    () => categories.filter((c) => !c.parentId),
    [categories]
  );


  const childrenByParent = useMemo(() => {
    const m = new Map();
    for (const c of categories) {
      const pid = c.parentId ? String(c.parentId) : "";
      if (!m.has(pid)) m.set(pid, []);
      m.get(pid).push(c);
    }
    for (const [, arr] of m) arr.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    return m;
  }, [categories]);


  // Show all descendants (tree) under selected root. Works for deep nesting (20+ levels).
  const subCategories = useMemo(() => {
    if (!selectedCategory) return [];
    const out = [];
    const walk = (pid, depth) => {
      for (const c of childrenByParent.get(String(pid)) || []) {
        out.push({ cat: c, depth });
        walk(c._id, depth + 1);
      }
    };
    walk(selectedCategory, 0);
    return out;
  }, [childrenByParent, selectedCategory]);


  const mainSubs = categories.filter(
    (c) => String(c.parentId) === String(selectedCategory)
  );

  const getChildren = (parentId) => {
    return categories.filter(
      (c) => String(c.parentId) === String(parentId)
    );
  };

  return (
    // <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
    <AdminLayout active="/admin/subcategories" >
      <div className="row g-0">
        {/* <AdminSidebar active="/admin/subcategories" /> */}

        <div className="col-lg-12 ">
          <div className="card border-0 shadow-sm rounded-4 p-4">

            <h4 className="fw-bold mb-4">Subcategories (Category-wise)</h4>

            {/* Category Select */}
            <div className="row mb-4">
              <div className="col-md-4">
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Select Category</option>

                  {rootCategories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>S no</th>
                    <th>Subcategory Name</th>
                    <th>Level</th>
                  </tr>
                </thead>

                {/* <tbody>
                  {!selectedCategory ? (
                    <tr>
                      <td colSpan="3" className="text-center text-muted">
                        Please select a category
                      </td>
                    </tr>
                  ) : subCategories.length > 0 ? (
                    subCategories.map(({ cat: sub, depth }, i) => (
                      <tr key={sub._id || i}>
                        <td>{i + 1}</td>
                        <td style={{ paddingLeft: 8 + depth * 16 }}>
                          {depth > 0 ? "↳ " : ""}
                          {sub.name}
                        </td>
                        <td className="text-muted small">{depth + 1}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center text-muted">
                        No subcategories found
                      </td>
                    </tr>
                  )}
                </tbody> */}

                <tbody>
                  {!selectedCategory ? (
                    <tr>
                      <td colSpan="2" className="text-center text-muted">
                        Please select a category
                      </td>
                    </tr>
                  ) : subCategories.length > 0 ? (
                    subCategories.map(({ cat: sub, depth }, i) => {

                      // ONLY direct children (depth 0) get SNo
                      if (depth !== 0) return null;

                      // get its children
                      const children = subCategories.filter(
                        (c) => String(c.cat.parentId) === String(sub._id)
                      );

                      return (
                        <>
                          {/* Main Subcategory */}
                          <tr key={sub._id}>
                            <td>{i + 1}</td>
                            <td className="fw-semibold">{sub.name}</td>
                          </tr>

                          {/* Sub-sub categories (a, b, c) */}
                          {children.map((child, idx) => (
                            <tr key={child.cat._id}>
                              <td></td>
                              <td style={{ paddingLeft: "30px" }}>
                                {String.fromCharCode(97 + idx)}. {child.cat.name}
                              </td>
                              <td className="text-muted small">{depth + 1}</td>
                            </tr>
                          ))}
                        </>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center text-muted">
                        No subcategories found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
      </AdminLayout>
    // </div>
  );
}

export default AdminSubcategories;