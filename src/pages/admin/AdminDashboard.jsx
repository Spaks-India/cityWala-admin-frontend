import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminSidebar } from './AdminLogin';
import API from '../../api/axios';

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
import AdminLayout from './AdminLayout';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const AdminDashboard = () => {

  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({});

  // ---------------- FETCH ANALYTICS ----------------
  const fetchAnalytics = async () => {
    try {
      const res = await API.get('/admin/analytics');
      setAnalyticsData(res.data?.analytics || res.data || {});
      console.log('Analytics Data:', res.data);
      // console.log('Analytics Data:', analyticsData.gatewayAnalytics[0]._id);
      console.log('Analytics Data:', res.data);
      console.log('Gateway Analytics:', res.data?.analytics?.gatewayAnalytics);
    } catch (err) {
      console.error('Analytics error:', err);
    }
  };

  // ---------------- FETCH DASHBOARD ----------------
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashboardRes, categoriesRes] = await Promise.all([
          API.get('/admin/dashboard'),
          API.get('/categories')
        ]);

        const statsData =
          dashboardRes.data?.stats ||
          dashboardRes.data?.data?.stats ||
          {};

        setStats(statsData);

        const catData = categoriesRes.data?.categories || [];
        setCategories(catData.filter(c => !c.parentId));

        await fetchAnalytics();

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ---------------- CARDS ----------------
  const cards = [
    { label: 'Total Users', val: stats.users ?? 0, icon: 'fa-users', color: '#1075be', link: '/admin/users' },
    { label: 'Partners', val: stats.partners ?? 0, icon: 'fa-handshake', color: '#f46f26', link: '/admin/partners' },
    { label: 'Categories', val: categories.length ?? 0, icon: 'fa-th-large', color: '#f59e0b', link: '/admin/categories/all' },
  ];

  const analyticsCards = [
    {
      label: 'Total Revenue',
      val: `₹${analyticsData.totalRevenue || 0}`,
      icon: 'fa-indian-rupee-sign',
      color: '#10b981'
    },
    {
      label: 'Today Revenue',
      val: `₹${analyticsData.todayRevenue || 0}`,
      icon: 'fa-wallet',
      color: '#3b82f6'
    },
    {
      label: 'Monthly Revenue',
      val: `₹${analyticsData.monthlyRevenue || 0}`,
      icon: 'fa-chart-line',
      color: '#8b5cf6'
    },
    {
      label: 'Pending Payments',
      val: analyticsData.pendingPayments || 0,
      icon: 'fa-clock',
      color: '#ef4444'
    }
  ];

  // ---------------- PIE DATA ----------------
  // const gatewayMap = Object.fromEntries(
  //   (analyticsData.gatewayAnalytics || []).map(g => [g._id, g.total])
  // );
  const gatewayMap = Object.fromEntries(
  (analyticsData?.gatewayAnalytics ?? []).map(g => [g._id, g.total])
);

  const chartData = {
    labels: ["Razorpay", "PayPal"],
    datasets: [
      {
        label: "Revenue",
        data: [
          gatewayMap["razorpay"] || 0,
          gatewayMap["paypal"] || 0,
        ],
        backgroundColor: ["#3b82f6", "#ef4444"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  };


  return (

    <>
      <AdminLayout active="admin/dashboard" >
        <div className="row g-0">

          <div className="col-lg-12 ">

            <h4 className="fw-bold mb-4">Admin Dashboard</h4>

            {loading ? (
              <div className="text-center py-5">

                <div className="spinner-border text-primary"></div>
              </div>
            ) : (

              <>

                {/* ---------------- ANALYTICS CARDS ---------------- */}
                <div className="row g-3 mb-4">
                  {analyticsCards.map(card => (
                    <div key={card.label} className="col-xl-3 col-md-4 col-sm-6">

                      <div className="card border-0 shadow-sm h-100"
                        style={{ borderRadius: 16 }}>

                        <div style={{
                          height: 5,
                          background: `linear-gradient(90deg, ${card.color}, ${card.color}99)`
                        }} />

                        <div className="card-body d-flex justify-content-between align-items-center">

                          <div>
                            <div style={{
                              fontSize: 14,
                              color: '#6c757d',
                              fontWeight: 600
                            }}>
                              {card.label}
                            </div>

                            <div style={{
                              fontSize: 26,
                              fontWeight: 800
                            }}>
                              {card.val}
                            </div>
                          </div>

                          <div style={{
                            width: 50,
                            height: 50,
                            borderRadius: 12,
                            background: `${card.color}15`,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}>
                            <i className={`fa-solid ${card.icon}`}
                              style={{ color: card.color }} />
                          </div>

                        </div>

                      </div>

                    </div>
                  ))}
                </div>

                {/* ---------------- STATS CARDS ---------------- */}
                <div className="row g-3 mb-4">
                  {cards.map(c => (
                    <div key={c.label} className="col-xl-3 col-md-4 col-sm-6">

                      <Link to={c.link} style={{ textDecoration: 'none' }}>

                        <div className="card border-0 shadow-sm h-100"
                          style={{ borderRadius: 16 }}>

                          <div style={{
                            height: 6,
                            background: `linear-gradient(90deg, ${c.color}, ${c.color}99)`
                          }} />

                          <div className="card-body d-flex justify-content-between align-items-center">

                            <div>
                              <div style={{
                                fontSize: 14,
                                color: '#6c757d',
                                fontWeight: 600
                              }}>
                                {c.label}
                              </div>

                              <div style={{
                                fontSize: 28,
                                fontWeight: 800
                              }}>
                                {c.val}
                              </div>
                            </div>

                            <div style={{
                              width: 50,
                              height: 50,
                              borderRadius: '50%',
                              background: `${c.color}15`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <i className={`fa-solid ${c.icon}`}
                                style={{ color: c.color }} />
                            </div>

                          </div>

                        </div>

                      </Link>

                    </div>
                  ))}
                </div>

                {/* ---------------- PIE CHART ---------------- */}
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
              )} */}
                <div className="card w-100 p-3 shadow-sm mt-4" style={{ borderRadius: 16 }}>
                  <h5 className="mb-3">Payment Gateway Comparison</h5>

                  <Bar data={chartData} options={options} />
                </div>
              </>

            )}

          </div>
        </div>
      </AdminLayout>
    </>

  );
};

export default AdminDashboard;