import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../../api/axios";
import { AdminSidebar } from "./AdminLogin";
import { useParams } from "react-router-dom";
import AdminLayout from "./AdminLayout";

const AddPlans = () => {

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category_id: "",
        subCategory_id: "",
        sub_subCategory_id: "",
        duration: "",
        features: [""]
    });

    const [users, setUsers] = useState([])
    const [partners, setPartners] = useState([])
    const [tab, setTab] = useState('users')
    const [loading, setLoading] = useState(true)
    const [sub_category, setSub_category] = useState([]);
    const [sub_subCategory, setSub_subCategory] = useState([]);
    const { id } = useParams();

    const isEdit = Boolean(id);

    const fetchSinglePlan = async () => {
        try {
            const res = await API.get(`/plans/${id}`);
            const plan = res.data.plan;
            console.log(plan, "plan")
            setFormData({
                name: plan.name || "",
                price: plan.price || "",
                category_id: plan.category_id?._id || plan.category_id || "",
                subCategory_id: plan.subCategory_id?._id || plan.subCategory_id || "",
                sub_subCategory_id: plan.sub_subCategory_id?._id || plan.sub_subCategory_id || "",
                duration: plan.duration || "",
                features: plan.features || [""]
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (isEdit) {
            fetchSinglePlan();
        }
    }, [id]);

    useEffect(() => {
        Promise.all([
            // API.get('/admin/users'),
            // FIX: correct endpoint is /partner/all
            // API.get('/partner/all'),
        ])
            .then(([u, p]) => {
                // FIX: backend returns { users: [] } and { partners: [] }
                setUsers(u.data.users || u.data || [])
                setPartners(p.data.partners || p.data || [])
            })
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    const list = tab === 'users' ? users : partners


    const [categories, setCategories] = useState([]);
    const [allCategories, setAllCategories] = useState([]);

    // get categories
    const getCategories = async () => {
        try {
            const res = await API.get("/categories");
            const allCats = res.data.categories || [];
            setAllCategories(allCats);
            setCategories(allCats.filter((cat) => !cat.parentId));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    useEffect(() => {
        if (!formData.category_id) {
            setSub_category([]);
            setSub_subCategory([]);
            return;
        }

        const filteredSubCats = allCategories.filter(
            (cat) => cat.parentId === formData.category_id
        );

        setSub_category(filteredSubCats);
    }, [allCategories, formData.category_id]);

    useEffect(() => {
        if (!formData.subCategory_id) {
            setSub_subCategory([]);
            return;
        }

        const filteredSubSubCats = allCategories.filter(
            (cat) => cat.parentId === formData.subCategory_id
        );

        setSub_subCategory(filteredSubSubCats);
    }, [allCategories, formData.subCategory_id]);

    // handle change

    const handleChange = (e) => {

        const { name, value } = e.target;
        const nextFormData = {
            ...formData,
            [name]: value,
        };

        if (name === "category_id") {
            nextFormData.subCategory_id = "";
            nextFormData.sub_subCategory_id = "";
        }

        if (name === "subCategory_id") {
            nextFormData.sub_subCategory_id = "";
        }

        setFormData(nextFormData);
    };

    // handlesubmit
    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     try {

    //         // ✅ Check values before sending
    //         console.log("FORM DATA", formData);

    //         // ✅ Prevent same hierarchy ids
    //         if (
    //             formData.category_id === formData.subCategory_id ||
    //             formData.subCategory_id === formData.sub_subCategory_id ||
    //             formData.category_id === formData.sub_subCategory_id
    //         ) {
    //             return alert("Category hierarchy cannot be same");
    //         }

    //         // ✅ Clean payload
    //         const payload = {
    //             name: formData.name,
    //             price: formData.price,
    //             duration: formData.duration,
    //             features: formData.features,
    //             category_id: formData.category_id,
    //         };

    //         // optional sub category
    //         if (formData.subCategory_id) {
    //             payload.subCategory_id = formData.subCategory_id;
    //         }

    //         // optional sub sub category
    //         if (formData.sub_subCategory_id) {
    //             payload.sub_subCategory_id = formData.sub_subCategory_id;
    //         }

    //         console.log("FINAL PAYLOAD", payload);

    //         // ✅ API call
    //         const res = await API.post(
    //             "/plans/create",
    //             payload
    //         );

    //         console.log(res.data);

    //         alert("Plan Added Successfully");

    //         // ✅ Reset form
    //         setFormData({
    //             name: "",
    //             price: "",
    //             duration: "",
    //             features: [],
    //             category_id: "",
    //             subCategory_id: "",
    //             sub_subCategory_id: "",
    //         });

    //     } catch (error) {

    //         console.log(error);

    //         alert(
    //             error?.response?.data?.message ||
    //             "Something went wrong"
    //         );

    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            if (
                formData.category_id === formData.subCategory_id ||
                formData.subCategory_id === formData.sub_subCategory_id ||
                formData.category_id === formData.sub_subCategory_id
            ) {
                return alert("Category hierarchy cannot be same");
            }

            if (isEdit) {

                await API.put(`/plans/${id}`, formData);

                alert("Plan Updated");

                setFormData({
                    name: "",
                    price: "",
                    category_id: "",
                    subCategory_id: "",
                    sub_subCategory_id: "",
                    duration: "",
                    features: [""]
                });

            } else {

                // await API.post("/plans/create", formData);
                const res = await API.post("/plans/create", formData);
                console.log("SUCCESS RESPONSE:", res.data);
                alert("Plan Added");
                setFormData({
                    name: "",
                    price: "",
                    category_id: "",
                    subCategory_id: "",
                    sub_subCategory_id: "",
                    duration: "",
                    features: [""]
                });
            }

        }
        catch (error) {

            console.log(error);
            alert(
                error?.response?.data?.message ||
                "Plan creation/updation failed"
            );
        }

    };

    const addFeature = () => {
        setFormData({
            ...formData,
            features: [...formData.features, ""]
        });
    };

    // handlefeaturs
    const handleFeatureChange = (index, value) => {
        const updatedFeatures = [...formData.features];
        updatedFeatures[index] = value;

        setFormData({
            ...formData,
            features: updatedFeatures
        });
    };

    // remove features
    const removeFeature = (index) => {

        const updatedFeatures = formData.features.filter(
            (_, i) => i !== index
        );

        setFormData({
            ...formData,
            features: updatedFeatures
        });
    };

    return (

        // <div style={{ minHeight: '80vh', background: '#f5f5f5' }}>
        <>
            <AdminLayout active="/admin/dashboard" >
                <div className="row g-0">
                    {/* <AdminSidebar active="/admin/dashboard" /> */}

                    <div className="col-lg-12  align-item-center justify-content-center d-flex my-5">

                        <div className="">

                            <div
                                className="card border-0 shadow-lg"
                                style={{
                                    borderRadius: "20px"
                                }}
                            >

                                <div className="card-body p-4 p-md-5">

                                    {/* Heading */}
                                    <div className="mb-4">

                                        <h2 className="fw-bold mb-2">
                                            Add Business Plan
                                        </h2>

                                        <p className="text-muted mb-0">
                                            Create pricing plans for categories and business listings.
                                        </p>

                                    </div>

                                    <form onSubmit={handleSubmit}>

                                        {/* Plan Name */}
                                        <div className="mb-4">

                                            <label className="form-label fw-semibold">
                                                Plan Type
                                            </label>

                                            <select
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="form-select form-select-lg"
                                            >
                                                <option value="">
                                                    Select Plan
                                                </option>

                                                <option value="Diamond">
                                                    Diamond
                                                </option>

                                                <option value="Ruby">
                                                    Ruby
                                                </option>

                                                <option value="Emerald">
                                                    Emerald
                                                </option>

                                            </select>

                                        </div>

                                        {/* Price */}
                                        <div className="mb-4">

                                            <label className="form-label fw-semibold">
                                                Price
                                            </label>

                                            <input
                                                type="number"
                                                name="price"
                                                placeholder="Enter plan price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                className="form-control form-control-lg"
                                            />

                                        </div>

                                        {/* Categories */}
                                        <div className="row">

                                            {/* Category */}
                                            <div className="col-md-4 mb-4">

                                                <label className="form-label fw-semibold">
                                                    Category
                                                </label>

                                                <select
                                                    name="category_id"
                                                    value={formData.category_id}
                                                    onChange={handleChange}
                                                    className="form-select form-select-lg"
                                                >

                                                    <option value="">
                                                        Select Category
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

                                            {/* Sub Category */}
                                            <div className="col-md-4 mb-4">

                                                <label className="form-label fw-semibold">
                                                    Sub Category
                                                </label>

                                                <select
                                                    name="subCategory_id"
                                                    value={formData.subCategory_id}
                                                    onChange={handleChange}
                                                    className="form-select form-select-lg"
                                                >

                                                    <option value="">
                                                        Select Subcategory
                                                    </option>

                                                    {
                                                        sub_category.map((sub) => (

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

                                            {/* Sub Sub Category */}
                                            <div className="col-md-4 mb-4">

                                                <label className="form-label fw-semibold">
                                                    Sub Sub Category
                                                </label>

                                                <select
                                                    name="sub_subCategory_id"
                                                    value={formData.sub_subCategory_id}
                                                    onChange={handleChange}
                                                    className="form-select form-select-lg"
                                                >

                                                    <option value="">
                                                        Select Sub Subcategory
                                                    </option>

                                                    {
                                                        sub_subCategory.map((sub) => (

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

                                        {/* Duration */}
                                        <div className="mb-4">

                                            <label className="form-label fw-semibold">
                                                Duration
                                            </label>

                                            <select
                                                name="duration"
                                                value={formData.duration}
                                                onChange={handleChange}
                                                className="form-select form-select-lg"
                                            >

                                                <option value="">
                                                    Select Duration
                                                </option>

                                                <option value={3}>
                                                    3 Months
                                                </option>

                                                <option value={6}>
                                                    6 Months
                                                </option>

                                                <option value={12}>
                                                    1 Year
                                                </option>

                                            </select>

                                        </div>

                                        {/* Features */}
                                        <div className="mb-4">

                                            <div className="d-flex justify-content-between align-items-center mb-3">

                                                <label className="form-label fw-semibold mb-0">
                                                    Plan Features
                                                </label>

                                                <button
                                                    type="button"
                                                    onClick={addFeature}
                                                    className="btn btn-primary"
                                                >
                                                    + Add Feature
                                                </button>

                                            </div>

                                            {
                                                formData.features.map((feature, index) => (

                                                    <div
                                                        key={index}
                                                        className="d-flex gap-2 mb-3"
                                                    >

                                                        <input
                                                            type="text"
                                                            placeholder={`Feature ${index + 1}`}
                                                            value={feature}
                                                            onChange={(e) =>
                                                                handleFeatureChange(index, e.target.value)
                                                            }
                                                            className="form-control form-control-lg"
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() => removeFeature(index)}
                                                            className="btn btn-danger"
                                                        >
                                                            ✕
                                                        </button>

                                                    </div>

                                                ))
                                            }

                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            className="btn btn-dark btn-lg "
                                            style={{
                                                borderRadius: "12px"
                                            }}
                                        >
                                            {isEdit ? "Update Plan" : "Add Plan"}
                                        </button>
                                        {/* <button type="submit">
                                            {isEdit ? "Update Plan" : "Add Plan"}
                                        </button> */}
                                    </form>

                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            </AdminLayout>
        </>

    );
};

export default AddPlans;