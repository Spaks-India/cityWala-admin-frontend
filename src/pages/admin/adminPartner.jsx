import React from "react";
import { AdminSidebar } from "./AdminLogin";
import API from "../../api/axios";
import { useEffect, useState } from "react";
import {
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaUserSlash,
  FaUserCheck
} from "react-icons/fa";
import { handleDelete } from "../../utils/CrudAction";
import AdminLayout from "./AdminLayout";
import Pagination from "../../components/Pagination";

export function AdminPartner() {

  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [limit, setLimit] = useState(10)

  // const limit = pagination?.limit || 10;
  const startIndex = (page - 1) * limit;



  // useEffect(() => {
  //   const fetchPartners = async () => {
  //     try {
  //       const res = await API.get(`/partner/all?page=${page}&limit=10`)

  //       console.log(res.data)

  //       setPartners(res.data.partners || res.data || [])
  //       setPagination(res.data.pagination);

  //     } catch (error) {
  //       console.error('Error fetching partners:', error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchPartners()
  // }, [page])

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);

        const res = await API.get(
          `/partner/all?page=${page}&limit=${limit}`
        );

        setPartners(res.data.partners || []);
        setPagination(res.data.pagination);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [page, limit]);   // 👈 THIS IS THE FIX



  return (
    // <div style={{ minHeight: '80vh', background: '#f5f5f5' }}>
    <>
      <AdminLayout active="/admin/partners" >
        <div className="row g-0">
          {/* <AdminSidebar active="/admin/partners" /> */}
          <div className="container-fluid py-4">

            {/* HEADER */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">

              <div>
                <h3 className="fw-bold mb-1">
                  Partner Management
                </h3>

                <p
                  className="text-muted mb-0"
                  style={{ fontSize: 14 }}
                >
                  Manage all registered partners
                </p>
              </div>

              <div
                className="bg-white shadow-sm border rounded-4 px-4 py-3"
              >
                <small className="text-muted d-block">
                  Total Partners
                </small>

                <h5 className="fw-bold mb-0">
                  {pagination?.total || partners.length}
                </h5>
              </div>

            </div>

            {/* MAIN CARD */}
            <div
              className="card border-0 shadow-sm rounded-4 overflow-hidden"
            >

              {/* CARD TOP */}
              <div
                className="px-4 py-3 border-bottom d-flex flex-wrap justify-content-between align-items-center gap-3"
                style={{
                  background:
                    "linear-gradient(135deg,#111827,#1f2937)",
                  color: "#fff",
                }}
              >

                <div>
                  <h5 className="fw-bold mb-1">
                    Partners List
                  </h5>

                  <p
                    className="mb-0 text-light"
                    style={{ fontSize: 13 }}
                  >
                    Control and manage partner accounts
                  </p>
                </div>

                <div
                  className="px-3 py-2 rounded-pill"
                  style={{
                    background:
                      "rgba(255,255,255,0.12)",
                    fontSize: 13,
                  }}
                >
                  {partners.length} Records
                </div>

              </div>

              {/* LOADING */}
              {loading ? (
                <div className="text-center py-5">

                  <div
                    className="spinner-border text-primary"
                    style={{
                      width: 50,
                      height: 50,
                    }}
                  ></div>

                  <p className="text-muted mt-3 mb-0">
                    Loading partners...
                  </p>

                </div>
              ) : (
                <div className="table-responsive">

                  <table className="table align-middle mb-0">

                    <thead
                      style={{
                        background: "#f8fafc",
                      }}
                    >
                      <tr>
                        <th className="px-4 py-3">S no</th>
                        <th className="py-3">Partner</th>
                        <th className="py-3">Contact</th>
                        <th className="py-3">Status</th>
                        <th className="py-3">Plan</th>
                        <th className="py-3">Joined</th>
                        <th className="py-3 text-center">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>

                      {partners.map((u, i) => (

                        <tr
                          key={u._id}
                          style={{
                            transition: "0.2s",
                          }}
                        >

                          {/* INDEX */}
                          <td className="px-4 fw-semibold text-muted">
                            {startIndex + i + 1}
                          </td>

                          {/* USER */}
                          <td>
                            <div className="d-flex align-items-center gap-3">

                              <div
                                style={{
                                  width: 46,
                                  height: 46,
                                  borderRadius: "50%",
                                  background:
                                    "linear-gradient(135deg,#1075be,#0d9488)",
                                  color: "#fff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: "bold",
                                  fontSize: 16,
                                }}
                              >
                                {u.name?.charAt(0)?.toUpperCase()}
                              </div>

                              <div>

                                <div className="fw-semibold">
                                  {u.name}
                                </div>

                                <small className="text-muted">
                                  ID: {u._id.slice(-6)}
                                </small>

                              </div>

                            </div>
                          </td>

                          {/* CONTACT */}
                          <td>

                            <div
                              className="small text-dark fw-medium"
                            >
                              {u.email}
                            </div>

                            <div
                              className="small text-muted"
                            >
                              {u.mobile || "—"}
                            </div>

                          </td>

                          {/* STATUS */}
                          <td>

                            <span
                              className={`badge rounded-pill px-3 py-2 ${u.status === "approved"
                                ? "bg-success-subtle text-success border border-success-subtle"
                                : u.status === "pending"
                                  ? "bg-warning-subtle text-warning border border-warning-subtle"
                                  : u.status === "rejected"
                                    ? "bg-secondary-subtle text-secondary border border-secondary-subtle"
                                    : u.status === "suspended"
                                      ? "bg-danger-subtle text-danger border border-danger-subtle"
                                      : "bg-light text-dark"
                                }`}
                              style={{
                                fontWeight: 600,
                                textTransform: "capitalize",
                              }}
                            >
                              {u.status || "Unknown"}
                            </span>

                          </td>

                          {/* PLAN */}
                          <td>

                            <span
                              className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2"
                            >
                              {u.plan || "No Plan"}
                            </span>

                          </td>

                          {/* DATE */}
                          <td>

                            <span
                              className="badge rounded-pill text-bg-light border"
                              style={{
                                padding: "8px 12px",
                                fontWeight: 500,
                              }}
                            >
                              {new Date(
                                u.createdAt
                              ).toLocaleDateString("en-IN")}
                            </span>

                          </td>

                          {/* ACTION */}
                          <td>

                            <div className="d-flex justify-content-center gap-2 flex-wrap">

                              {/* APPROVE / BLOCK */}
                              <button
                                className={`btn btn-sm ${u.status === "approved"
                                  ? "btn-outline-warning"
                                  : u.status === "suspended"
                                    ? "btn-outline-success"
                                    : "btn-outline-primary"
                                  }`}
                                onClick={async () => {
                                  try {

                                    let nextStatus =
                                      "approved";

                                    if (
                                      u.status === "approved"
                                    ) {
                                      nextStatus =
                                        "suspended";
                                    } else if (
                                      u.status ===
                                      "suspended"
                                    ) {
                                      nextStatus =
                                        "approved";
                                    } else if (
                                      u.status ===
                                      "pending"
                                    ) {
                                      nextStatus =
                                        "approved";
                                    }

                                    const confirmResult =
                                      window.confirm(
                                        `Are you sure you want to ${nextStatus ===
                                          "approved"
                                          ? "approve"
                                          : nextStatus ===
                                            "suspended"
                                            ? "suspend"
                                            : "update"
                                        } this partner?`
                                      );

                                    if (!confirmResult)
                                      return;

                                    const res =
                                      await API.put(
                                        `/partner/${u._id}`,
                                        {
                                          status:
                                            nextStatus,
                                        }
                                      );

                                    setPartners(prev =>
                                      prev.map(p =>
                                        p._id === u._id
                                          ? {
                                            ...p,
                                            status:
                                              res.data
                                                .partner
                                                ?.status ||
                                              nextStatus,
                                          }
                                          : p
                                      )
                                    );

                                  } catch (err) {

                                    console.log(err);

                                    alert(
                                      err.response
                                        ?.data
                                        ?.message ||
                                      "Status update failed"
                                    );
                                  }
                                }}
                              >
                                {u.status ===
                                  "approved"
                                  ? "Block"
                                  : u.status ===
                                    "suspended"
                                    ? "Unblock"
                                    : "Approve"}
                              </button>

                              {/* DELETE */}
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  handleDelete({
                                    id: u._id,
                                    route: `partner`,
                                    onSuccess: () =>
                                      setPartners(
                                        partners.filter(
                                          p =>
                                            p._id !==
                                            u._id
                                        )
                                      ),
                                    alertMessage:
                                      "Partner deleted",
                                  })
                                }
                              >
                                <FaTrashAlt />
                              </button>

                            </div>

                          </td>

                        </tr>
                      ))}

                      {/* EMPTY */}
                      {partners.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="text-center py-5"
                          >

                            <div className="text-muted">

                              <i
                                className="fa-regular fa-folder-open mb-3"
                                style={{
                                  fontSize: 42,
                                }}
                              ></i>

                              <p className="mb-0">
                                No partners found
                              </p>

                            </div>

                          </td>
                        </tr>
                      )}

                    </tbody>
                  </table>

                </div>
              )}

            </div>
            <Pagination
              page={page}
              totalPages={pagination?.totalPages || 1}
              onPageChange={setPage}
              limit={limit}
              setLimit={setLimit}
              setPage={setPage}
            />
          </div>

        </div>
      </AdminLayout>
    </>
    // </div>
    // </div>
  )
}
