import React, { useEffect, useState } from "react";
// import API from "../api/axios";
import API from "../../api/axios";
import { AdminSidebar } from "./AdminLogin";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import Pagination from "../../components/Pagination";

const AllPlans = () => {

    const [plans, setPlans] = useState([]);
    const navigate = useNavigate()
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [subSubCategories, setSubSubCategories] = useState([]);

    const [filters, setFilters] = useState({
        search: "",
        category_id: "",
        subCategory_id: "",
        sub_subCategory_id: "",
    });

    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [pagination, setPagination] = useState({});
    const startIndex = (page - 1) * limit;
    // =========================
    // LOAD CATEGORIES
    // =========================
    const getCategories = async () => {

        try {

            const res = await API.get("/categories");

            setCategories(res.data.categories || []);

        } catch (error) {

            console.log(error);

        }

    };

    // =========================
    // LOAD SUB CATEGORIES
    // =========================
    const getSubCategories = async (categoryId) => {

        try {

            if (!categoryId) {

                setSubCategories([]);
                return;

            }

            const res = await API.get(
                `/categories/${categoryId}/popular-sub`
            );

            setSubCategories(res.data || []);

        } catch (error) {

            console.log(error);

        }

    };

    // =========================
    // LOAD SUB SUB CATEGORIES
    // =========================
    const getSubSubCategories = async (subCategoryId) => {

        try {

            if (!subCategoryId) {

                setSubSubCategories([]);
                return;

            }

            const res = await API.get(
                `/categories/${subCategoryId}/popular-sub`
            );

            setSubSubCategories(res.data || []);

        } catch (error) {

            console.log(error);

        }

    };

    // =========================
    // LOAD PLANS
    // =========================
    const getPlans = async () => {
        try {
            setLoading(true);

            let query = [`page=${page}`, `limit=${limit}`];

            if (filters.category_id) {
                query.push(`category_id=${filters.category_id}`);
            }

            if (filters.subCategory_id) {
                query.push(`subCategory_id=${filters.subCategory_id}`);
            }

            if (filters.sub_subCategory_id) {
                query.push(`sub_subCategory_id=${filters.sub_subCategory_id}`);
            }

            const queryString = query.join("&");

            const res = await API.get(`/plans?${queryString}`);

            setPlans(res.data.plans || []);
            setPagination(res.data.pagination || {});
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    // =========================
    // HANDLE FILTER CHANGE
    // =========================
    const handleChange = async (e) => {

        const { name, value } = e.target;

        // CATEGORY CHANGE
        if (name === "category_id") {

            setFilters({
                ...filters,
                category_id: value,
                subCategory_id: "",
                sub_subCategory_id: "",
            });

            setSubSubCategories([]);

            getSubCategories(value);

            return;

        }

        // SUB CATEGORY CHANGE
        if (name === "subCategory_id") {

            setFilters({
                ...filters,
                subCategory_id: value,
                sub_subCategory_id: "",
            });

            getSubSubCategories(value);

            return;

        }

        setFilters({
            ...filters,
            [name]: value,
        });

    };

    // =========================
    // RESET FILTERS
    // =========================
    const resetFilters = () => {

        setFilters({
            search: "",
            category_id: "",
            subCategory_id: "",
            sub_subCategory_id: "",
        });

        setSubCategories([]);
        setSubSubCategories([]);

    };

    useEffect(() => {

        getCategories();

    }, []);

    useEffect(() => {
        getPlans();
    }, [page, limit, filters]);

    const handleEdit = (plan) => {

        console.log("edit plan", plan);

        // navigate(`/admin/edit-plan/${plan._id}`)
        navigate(`/admin/plans/edit/${plan._id}`)

    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this plan?"
        );

        if (!confirmDelete) return;

        try {
            await API.delete(`/plans/${id}`);

            setPlans((prev) => prev.filter((p) => p._id !== id));

            alert("Plan deleted successfully");
        } catch (error) {
            console.log(error);
            alert("Delete failed");
        }
    };

    return (

        // <div className="container py-5">
        //     <AdminSidebar />
        // <div style={{ minHeight: '80vh', background: '#f5f5f5' }}>
        <>
            <AdminLayout active="/admin/dashboard" >
                {/* <AdminSidebar  active="/admin/dashboard"  /> */}
                <div className="row g-0">
                    {/* <AdminSidebar active="/admin/dashboard" /> */}
                    <div className="col-lg-12 ">
                        {/* HEADING */}
                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <div>

                                <h2 className="fw-bold">
                                    All Plans
                                </h2>

                                <p className="text-muted">
                                    Manage business plans
                                </p>

                            </div>

                        </div>

                        {/* FILTERS */}
                        <div className="card shadow-sm border-0 p-4 mb-4">

                            <div className="row g-3">

                                {/* SEARCH */}
                                <div className="col-md-3">

                                    <label className="form-label fw-semibold">
                                        Search
                                    </label>

                                    <input
                                        type="text"
                                        name="search"
                                        placeholder="Search Plan..."
                                        value={filters.search}
                                        onChange={handleChange}
                                        className="form-control"
                                    />

                                </div>

                                {/* CATEGORY */}
                                <div className="col-md-3">

                                    <label className="form-label fw-semibold">
                                        Category
                                    </label>

                                    <select
                                        name="category_id"
                                        value={filters.category_id}
                                        onChange={handleChange}
                                        className="form-select"
                                    >

                                        <option value="">
                                            All Categories
                                        </option>

                                        {
                                            categories.map((cat) => (

                                                <option
                                                    key={cat._id}
                                                    value={cat._id}
                                                >
                                                    {cat.name}
                                                </option>

                                            ))
                                        }

                                    </select>

                                </div>

                                {/* SUB CATEGORY */}
                                <div className="col-md-3">

                                    <label className="form-label fw-semibold">
                                        Sub Category
                                    </label>

                                    <select
                                        name="subCategory_id"
                                        value={filters.subCategory_id}
                                        onChange={handleChange}
                                        className="form-select"
                                    >

                                        <option value="">
                                            All Sub Categories
                                        </option>

                                        {
                                            subCategories.map((sub) => (

                                                <option
                                                    key={sub._id}
                                                    value={sub._id}
                                                >
                                                    {sub.name}
                                                </option>

                                            ))
                                        }

                                    </select>

                                </div>

                                {/* SUB SUB CATEGORY */}
                                <div className="col-md-3">

                                    <label className="form-label fw-semibold">
                                        Sub Sub Category
                                    </label>

                                    <select
                                        name="sub_subCategory_id"
                                        value={filters.sub_subCategory_id}
                                        onChange={handleChange}
                                        className="form-select"
                                    >

                                        <option value="">
                                            All Sub Sub Categories
                                        </option>

                                        {
                                            subSubCategories.map((sub) => (

                                                <option
                                                    key={sub._id}
                                                    value={sub._id}
                                                >
                                                    {sub.name}
                                                </option>

                                            ))
                                        }

                                    </select>

                                </div>

                            </div>

                            {/* RESET */}
                            <div className="d-flex gap-3">
                                <div className="mt-3">

                                    <button
                                        className="btn btn-dark"
                                        onClick={resetFilters}
                                    >
                                        Reset Filters
                                    </button>

                                </div>

                                {/* add plan */}
                                <div className="mt-3">

                                    <button
                                        className="btn btn-dark"
                                        onClick={() => navigate("/admin/plans/add")}
                                    >
                                        Add Plan
                                    </button>

                                </div>
                            </div>
                        </div>

                        {/* TABLE */}
                        <div className="card border-0 shadow-sm">

                            <div className="table-responsive">

                                <table className="table align-middle mb-0">

                                    <thead className="table-dark">

                                        <tr>

                                            <th>#</th>
                                            <th>Plan</th>
                                            <th>Price</th>
                                            <th>Duration</th>
                                            <th>Category</th>
                                            <th>Sub Category</th>
                                            <th>Sub Sub Category</th>
                                            <th>Features</th>
                                            <th>Action</th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {
                                            loading ? (

                                                <tr>

                                                    <td
                                                        colSpan="8"
                                                        className="text-center py-5"
                                                    >

                                                        <div className="spinner-border text-primary"></div>

                                                    </td>

                                                </tr>

                                            ) : plans.length === 0 ? (

                                                <tr>

                                                    <td
                                                        colSpan="8"
                                                        className="text-center py-5 text-muted"
                                                    >

                                                        No Plans Found

                                                    </td>

                                                </tr>

                                            ) : (

                                                plans.map((plan, index) => (

                                                    <tr key={plan._id}>

                                                        <td>
                                                            {startIndex + index + 1}
                                                        </td>

                                                        <td>
                                                            <span className="badge bg-primary">
                                                                {plan.name}
                                                            </span>
                                                        </td>

                                                        <td className="fw-bold text-success">
                                                            ₹ {plan.price}
                                                        </td>

                                                        <td>
                                                            {
                                                                plan.duration === 12
                                                                    ? "1 Year"
                                                                    : `${plan.duration} Months`
                                                            }
                                                        </td>

                                                        <td>
                                                            {plan?.category_id?.name || "N/A"}
                                                        </td>

                                                        <td>
                                                            {plan?.subCategory_id?.name || "N/A"}
                                                        </td>

                                                        <td>
                                                            {plan?.sub_subCategory_id?.name || "N/A"}
                                                        </td>

                                                        <td>

                                                            <ul className="mb-0 ps-3">

                                                                {
                                                                    plan.features?.map((f, i) => (

                                                                        <li key={i}>
                                                                            {f}
                                                                        </li>

                                                                    ))
                                                                }

                                                            </ul>

                                                        </td>
                                                        <td>

                                                            <button
                                                                className="btn btn-sm btn-warning me-2"
                                                                onClick={() => handleEdit(plan)}
                                                            >
                                                                <i className="fa-solid fa-pen-to-square me-1"></i>
                                                                Edit
                                                            </button>

                                                            <button
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => handleDelete(plan._id)}
                                                            >
                                                                <i className="fa-solid fa-trash me-1"></i>
                                                                Delete
                                                            </button>

                                                        </td>
                                                    </tr>

                                                ))

                                            )
                                        }

                                    </tbody>

                                </table>

                            </div>

                        </div>

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
            </AdminLayout>
        </>
        // </div>
    );

};

export default AllPlans;