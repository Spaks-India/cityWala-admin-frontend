import React, { useCallback, useEffect, useState } from "react";
import { AdminSidebar } from "./AdminLogin";
import API from "../../api/axios";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import AdminLayout from "./AdminLayout";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const chartOptions = {
    responsive: true,
    plugins: {
        legend: { position: "top" },
    },
    scales: {
        y: { beginAtZero: true },
    },
};

function revenueMap(rows, nameKey) {
    const m = new Map();
    for (const row of rows || []) {
        const key = row[nameKey] || row._id || "Unknown";
        m.set(String(key), Number(row.total) || 0);
    }
    return m;
}

function matchRevenue(name, id, map, analyticsRows, nameKey, idKey) {
    if (map.has(String(name))) return map.get(String(name));
    if (id && map.has(String(id))) return map.get(String(id));
    const row = (analyticsRows || []).find(
        (r) =>
            r[nameKey] === name ||
            String(r[idKey]) === String(id) ||
            String(r[nameKey]) === String(id)
    );
    return row ? Number(row.total) || 0 : 0;
}

const Analytics = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [categories, setCategories] = useState([])
    const [search, setSearch] = useState({
        country: "",
        state: "",
        city: "",
    });

    const [summary, setSummary] = useState({
        totalRevenue: 0,
        todayRevenue: 0,
        monthlyRevenue: 0,
        pendingRevenue: 0,
    });

    const [countryAnalytics, setCountryAnalytics] = useState([]);
    const [stateAnalytics, setStateAnalytics] = useState([]);
    const [cityAnalytics, setCityAnalytics] = useState([]);
    const [categoryAnalytics, setCategoryAnalytics] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchAnalytics = useCallback(async (country, state) => {
        try {
            const params = {};
            if (country) params.country = country;
            if (state) params.state = state;
            const res = await API.get("/admin/analytics", { params });
            const data = res.data || {};
            setSummary({
                totalRevenue: data.totalRevenue ?? 0,
                todayRevenue: data.todayRevenue ?? 0,
                monthlyRevenue: data.monthlyRevenue ?? 0,
                pendingRevenue: data.pendingRevenue ?? 0,
            });
            setCountryAnalytics(data.countryAnalytics || []);
            setStateAnalytics(data.stateAnalytics || []);
            setCityAnalytics(data.cityAnalytics || []);
            setCategoryAnalytics(data.categoryAnalytics || []);
            console.log(data)
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to load analytics");
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await API.get("/location/countries");
                setCountries(res.data || []);
                await fetchAnalytics();
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || "Failed to load countries");
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [fetchAnalytics]);

    const handleCountryChange = async (countryId) => {
        setSearch({ country: countryId, state: "", city: "" });
        setStates([]);
        setCities([]);
        setStateAnalytics([]);
        setCityAnalytics([]);

        if (!countryId) {
            await fetchAnalytics();
            return;
        }

        setLoading(true);
        try {
            const [statesRes] = await Promise.all([
                API.get(`/location/states/${countryId}`),
                fetchAnalytics(countryId),
            ]);
            setStates(statesRes.data.states || []);
        } catch (err) {
            setStates([]);
            setError(err.response?.data?.message || "Failed to load states");
        } finally {
            setLoading(false);
        }
    };

    const handleStateChange = async (stateId) => {
        const countryId = search.country;
        setSearch((p) => ({ ...p, state: stateId, city: "" }));
        setCities([]);
        setCityAnalytics([]);

        if (!stateId || !countryId) {
            if (countryId) await fetchAnalytics(countryId);
            return;
        }

        setLoading(true);
        try {
            const [citiesRes] = await Promise.all([
                API.get(`/location/cities/${stateId}?country_id=${countryId}`),
                fetchAnalytics(countryId, stateId),
            ]);
            setCities(citiesRes.data.cities || []);
        } catch (err) {
            setCities([]);
            setError(err.response?.data?.message || "Failed to load cities");
        } finally {
            setLoading(false);
        }
    };

    const countryRev = revenueMap(countryAnalytics, "country");
    const stateRev = revenueMap(stateAnalytics, "state");
    const cityRev = revenueMap(cityAnalytics, "city");

    const countryChart = {
        labels: countries.map((c) => c.name),
        datasets: [
            {
                label: "Revenue (₹)",
                data: countries.map((c) =>
                    matchRevenue(c.name, c._id, countryRev, countryAnalytics, "country", "countryId")
                ),
                backgroundColor: "#3b82f6",
                borderRadius: 8,
            },
        ],
    };

    const stateChart = {
        labels: states.map((s) => s.name),
        datasets: [
            {
                label: "Revenue (₹)",
                data: states.map((s) =>
                    matchRevenue(s.name, s._id, stateRev, stateAnalytics, "state", "stateId")
                ),
                backgroundColor: "#10b981",
                borderRadius: 8,
            },
        ],
    };

    const cityChart = {
        labels: cities.map((c) => c.name),
        datasets: [
            {
                label: "Revenue (₹)",
                data: cities.map((c) =>
                    matchRevenue(c.name, c._id, cityRev, cityAnalytics, "city", "cityId")
                ),
                backgroundColor: "#f59e0b",
                borderRadius: 8,
            },
        ],
    };

    const hasCountryRevenue = countryChart.datasets[0].data.some((v) => v > 0);
    const hasStateRevenue = stateChart.datasets[0].data.some((v) => v > 0);
    const hasCityRevenue = cityChart.datasets[0].data.some((v) => v > 0);

    const categoryChart = {
        labels: categoryAnalytics.map((c) => c.category || "Unknown"),
        datasets: [
            {
                label: "Revenue (₹)",
                data: categoryAnalytics.map((c) => Number(c.total) || 0),
                backgroundColor: "#8b5cf6",
                borderRadius: 8,
            },
        ],
    };
    const hasCategoryRevenue = categoryAnalytics.length > 0;


    //     const categoryChart = {
    //   labels: categoryAnalyticsData.map((c) => c.category),

    //   datasets: [
    //     {
    //       label: "Category Revenue",

    //       data: categoryAnalyticsData.map((c) => c.total),

    //       backgroundColor: "#8b5cf6",

    //       borderRadius: 8,
    //     },
    //   ],
    // };

    const [expandedSections, setExpandedSections] = useState({
        country: false,
        state: false,
        city: false,
        category: false,
    });

    const toggleSection = (key) => {
        setExpandedSections((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const getVisibleData = (data, key) => {
        return expandedSections[key] ? data : data.slice(0, 5);
    };

    const visibleCountries = getVisibleData(countryAnalytics, "country");
    const visibleStates = getVisibleData(stateAnalytics, "state");
    const visibleCities = getVisibleData(cityAnalytics, "city");
    const visibleCategories = getVisibleData(categoryAnalytics, "category");

    return (
        // <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
        <>
            <AdminLayout active="/admin/analytics"  >
                <div className="row g-0">
                    {/* <AdminSidebar active="/admin/analytics" /> */}

                    <div className="col-lg-12">
                        <div className="mb-4">
                            <h3 className="fw-bold">Revenue Analytics</h3>
                            <div style={{ color: "#6b7280" }}>
                                Country → State → City — paid plan payments
                            </div>
                        </div>

                        {error && (
                            <div className="alert alert-danger py-2">{error}</div>
                        )}

                        <div className="row g-3 mb-4">
                            <div className="col-md-3">
                                <div className="card border-0 shadow-sm p-3" style={{ borderRadius: 14 }}>
                                    <div className="text-muted small">Total revenue</div>
                                    <div className="fw-bold fs-4">₹{summary.totalRevenue.toLocaleString("en-IN")}</div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card border-0 shadow-sm p-3" style={{ borderRadius: 14 }}>
                                    <div className="text-muted small">Today</div>
                                    <div className="fw-bold fs-4">₹{summary.todayRevenue.toLocaleString("en-IN")}</div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card border-0 shadow-sm p-3" style={{ borderRadius: 14 }}>
                                    <div className="text-muted small">This month</div>
                                    <div className="fw-bold fs-4">₹{summary.monthlyRevenue.toLocaleString("en-IN")}</div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card border-0 shadow-sm p-3" style={{ borderRadius: 14 }}>
                                    <div className="text-muted small">Pending orders</div>
                                    <div className="fw-bold fs-4">{summary.pendingRevenue}</div>
                                </div>
                            </div>
                        </div>

                        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 18 }}>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="fw-semibold mb-2">Select country</label>
                                        <select
                                            className="form-select"
                                            value={search.country}
                                            onChange={(e) => handleCountryChange(e.target.value)}
                                            style={{ height: 52, borderRadius: 12 }}
                                        >
                                            <option value="">All countries (overview)</option>
                                            {countries.map((c) => (
                                                <option key={c._id} value={c._id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="fw-semibold mb-2">Select state</label>
                                        <select
                                            className="form-select"
                                            value={search.state}
                                            disabled={!search.country}
                                            onChange={(e) => handleStateChange(e.target.value)}
                                            style={{ height: 52, borderRadius: 12 }}
                                        >
                                            <option value="">Choose state</option>
                                            {states.map((s) => (
                                                <option key={s._id} value={s._id}>
                                                    {s.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {loading && (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" />
                            </div>
                        )}

                        {!loading && countryAnalytics.length > 0 && (
                            <div className="card shadow-sm mb-4" style={{ borderRadius: 18 }}>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="mb-0">
                                            Revenue by country (from payments)
                                        </h5>

                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => toggleSection("country")}
                                        >
                                            {expandedSections.country ? "Show Less" : "View All"}
                                        </button>
                                    </div>
                                    <div className="table-responsive mb-3">
                                        <table className="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Country</th>
                                                    <th>Revenue</th>
                                                    <th>Payments</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {visibleCountries.map((row, i) => (
                                                    <tr key={i}>
                                                        <td>{row.country || "—"}</td>
                                                        <td>₹{Number(row.total || 0).toLocaleString("en-IN")}</td>
                                                        <td>{row.count || 0}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!loading && countries.length > 0 && (
                            <div className="card shadow-sm mb-4" style={{ borderRadius: 18 }}>
                                <div className="card-body">
                                    <h5>Country revenue chart</h5>
                                    {!hasCountryRevenue && (
                                        <p className="text-muted small">
                                            No paid payments with location yet. Partner profile must have country/state/city and payment must complete as paid.
                                        </p>
                                    )}
                                    <Bar data={countryChart} options={chartOptions} />
                                </div>
                            </div>
                        )}

                        {!loading && search.country && states.length > 0 && (
                            <div className="card shadow-sm mb-4" style={{ borderRadius: 18 }}>
                                <div className="card-body">
                                    {/* <h5>State revenue chart</h5> */}
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="mb-0">
                                            State revenue chart
                                        </h5>

                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => toggleSection("state")}
                                        >
                                            {expandedSections.state ? "Show Less" : "View All"}
                                        </button>
                                    </div>

                                    {stateAnalytics.length > 0 && (
                                        <div className="table-responsive mb-3">
                                            <table className="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>State</th>
                                                        <th>Revenue</th>
                                                        <th>Payments</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {visibleStates.map((row, i) => (
                                                        <tr key={i}>
                                                            <td>{row.state || "—"}</td>
                                                            <td>₹{Number(row.total || 0).toLocaleString("en-IN")}</td>
                                                            <td>{row.count || 0}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    {!hasStateRevenue && (
                                        <p className="text-muted small">No paid payments for this country yet.</p>
                                    )}
                                    <Bar data={stateChart} options={chartOptions} />
                                </div>
                            </div>
                        )}

                        {!loading && search.state && cities.length > 0 && (
                            <div className="card shadow-sm" style={{ borderRadius: 18 }}>
                                <div className="card-body">
                                    {/* <h5>City revenue chart</h5> */}
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="mb-0">
                                            City revenue chart
                                        </h5>

                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => toggleSection("city")}
                                        >
                                            {expandedSections.city ? "Show Less" : "View All"}
                                        </button>
                                    </div>
                                    {cityAnalytics.length > 0 && (
                                        <div className="table-responsive mb-3">
                                            <table className="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>City</th>
                                                        <th>Revenue</th>
                                                        <th>Payments</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {visibleCities.map((row, i) => (
                                                        <tr key={i}>
                                                            <td>{row.city || "—"}</td>
                                                            <td>₹{Number(row.total || 0).toLocaleString("en-IN")}</td>
                                                            <td>{row.count || 0}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    {!hasCityRevenue && (
                                        <p className="text-muted small">No paid payments for this state yet.</p>
                                    )}
                                    <Bar data={cityChart} options={chartOptions} />
                                </div>
                            </div>
                        )}


                        <div className="card shadow-sm my-4" style={{ borderRadius: 18 }}>
                            <div className="card-body">
                                {/* <h5 className="mb-3">Revenue by category</h5> */}
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="mb-0">
                                        Revenue by category
                                    </h5>

                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => toggleSection("category")}
                                    >
                                        {expandedSections.category ? "Show Less" : "View All"}
                                    </button>
                                </div>
                                {hasCategoryRevenue ? (
                                    <>
                                        <div className="table-responsive mb-3">
                                            <table className="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>Category</th>
                                                        <th>Revenue</th>
                                                        <th>Payments</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {visibleCategories.map((row, i) => (
                                                        <tr key={i}>
                                                            <td>{row.category || "—"}</td>
                                                            <td>₹{Number(row.total || 0).toLocaleString("en-IN")}</td>
                                                            <td>{row.count || 0}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <Bar data={categoryChart} options={chartOptions} />
                                    </>
                                ) : (
                                    <p className="text-muted small">
                                        No paid payments with category data yet. Ensure partner profiles have a category assigned and payments are completed.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* category wise (old recharts code — kept for reference) */}
                        {/* {data.length > 0 && (
                <div className="d-flex justify-content-center mt-4">

                  <PieChart width={400} height={300}>

                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >

                      {data.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}

                    </Pie>

                    <Tooltip />
                    <Legend />

                  </PieChart>

                </div>
              )}  */}
                    </div>

                </div>
            </AdminLayout>
        </>
        // </div>
    );
};

export default Analytics;
