import React from "react";
import { AdminSidebar } from "./AdminLogin";
import API from "../../api/axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { handleDelete, handleUpdate } from "../../utils/CrudAction";
import AdminLayout from "./AdminLayout";
import Pagination from "../../components/Pagination";

export default function AdminAllCategories() {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const [data, setData] = useState([])
    const [pagination, setPagination] = useState({});
    const startIndex = (page - 1) * limit;

    const navigate = useNavigate();

    const loadCats = async () => {
        setLoading(true)
        try {
            const res = await API.get(`/categories?page=${page}&limit=${limit}&parentId=null`);
            setCategories(res.data.categories);
            setPagination(res.data.pagination);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        loadCats();
    }, [page, limit])

    return (
        <>

            <AdminLayout active="/admin/categories/all" >
                <div className="row g-0">
                    {/* <AdminSidebar active="/admin/categories/all" /> */}

                    <div className="col-lg-12 col-md-9 ">
                        <div
                            className="shadow-sm"
                            style={{
                                background: "#fff",
                                borderRadius: "16px",
                                padding: "25px",
                            }}
                        >
                            {/* Header */}
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                                <div>
                                    <h3
                                        style={{
                                            fontWeight: "700",
                                            marginBottom: "5px",
                                        }}
                                    >
                                        All Categories
                                    </h3>

                                    <p
                                        style={{
                                            color: "#777",
                                            margin: 0,
                                            fontSize: "14px",
                                        }}
                                    >
                                        Manage all categories here
                                    </p>
                                </div>

                                <button className="btn btn-dark px-4" onClick={() => navigate('/admin/categories/add')} >
                                    + Add Category
                                </button>
                            </div>

                            {/* Table */}
                            <div className="table-responsive">
                                <table className="table align-middle">
                                    <thead
                                        style={{
                                            background: "#f8f9fa",
                                        }}
                                    >
                                        <tr>
                                            <th>#</th>
                                            <th>Image</th>
                                            <th>Category</th>
                                            <th>Full Path</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4">
                                                    Loading categories...
                                                </td>
                                            </tr>
                                        ) : categories.length > 0 ? (
                                            categories.map((cat, ind) => (
                                                <tr key={cat._id}>
                                                    <td>{startIndex + ind + 1}</td>

                                                    <td>
                                                        {cat.image ? (
                                                            <img
                                                                src={cat.image}
                                                                alt={cat.name}
                                                                style={{
                                                                    width: "55px",
                                                                    height: "55px",
                                                                    borderRadius: "10px",
                                                                    objectFit: "cover",
                                                                    border: "1px solid #eee",
                                                                }}
                                                            />
                                                        ) : (
                                                            <div
                                                                className="d-flex justify-content-center align-items-center"
                                                                style={{
                                                                    width: "55px",
                                                                    height: "55px",
                                                                    borderRadius: "10px",
                                                                    background: "#eee",
                                                                    fontSize: "12px",
                                                                }}
                                                            >
                                                                No Img
                                                            </div>
                                                        )}
                                                    </td>

                                                    <td
                                                        style={{
                                                            fontWeight: "600",
                                                        }}
                                                    >
                                                        {cat.name}
                                                    </td>

                                                    <td
                                                        style={{
                                                            color: "#666",
                                                            fontSize: "14px",
                                                        }}
                                                    >
                                                        {cat.slug}
                                                    </td>

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

                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <button
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() => navigate(`/admin/categories/edit/${cat._id}`)}
                                                            >
                                                                <CiEdit />
                                                            </button>

                                                            <button
                                                                className="btn btn-sm btn-outline-danger ms-2"

                                                                onClick={() => handleDelete({
                                                                    id: cat._id,
                                                                    route: "categories",
                                                                    loadData: loadCats,
                                                                })}
                                                            >
                                                                <FaRegTrashAlt />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6">
                                                    <div
                                                        className="text-center py-5"
                                                        style={{
                                                            color: "#888",
                                                        }}
                                                    >
                                                        No categories found
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <Pagination
                    page={page}
                    totalPages={pagination?.totalPages || 1}
                    onPageChange={setPage}
                    limit={limit}
                    setLimit={setLimit}
                    setPagination={setPagination}
                />

            </AdminLayout >
        </>
    )
}