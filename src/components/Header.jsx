import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

export default function Header() {
  // const { user, partner, logout } = useAuth()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  // const currentUser = partner || user;


  const { user, partner, logout } = useAuth();

  // Detect current logged account
  const currentUser = partner || user;
  const currentRole = partner ? "partner" : user ? "user" : null;

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    // API.get('/categories').then(r => setCategories(r.data)).catch(() => { })
    API.get('/categories').then(r => setCategories(r.data.categories.filter(c => !c.parentId) || [])).catch(() => { })
   
    // API.get('/location/categories').then(r => setCategories(r.data.categories || [])).catch(() => { })

    console.log("categories data: ", categories)
    API.get('/admin/dashboard').then(r => setTotalUsers(r.data.totalUsers)).catch(() => { })
  }, [])

  // const handleLogout = () => { logout(); navigate('/') }

  return (
    <>
      {/* Top Bar */}
      <div className="header-top">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <ul className="d-flex gap-4 mb-0" style={{ listStyle: 'none' }}>
                <li><i className="fa-solid fa-phone me-1"></i> +91 836 874 1739</li>
                <li><i className="fa-solid fa-envelope me-1"></i>
                  <a href="mailto:citywala1959@gmail.com">citywala1959@gmail.com</a>
                </li>
              </ul>
            </div>
            <div className="col-md-4 text-end">
              <select className="form-select form-select-sm d-inline-block w-auto bg-transparent text-white border-secondary">
                <option>Select Currency</option>
                <option>INR</option>
                <option>USD</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="header">
        <div className="container">
          <nav className="navbar navbar-expand-lg py-2">
            <Link to="/" className="navbar-brand">
              <img src="https://citywala.com/assets/images/city-wala-logo.png"
                alt="CityWala" style={{ height: 50 }} />
            </Link>

            <button className="navbar-toggler border-0" onClick={() => setMenuOpen(!menuOpen)}>
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
              {/* Category Dropdown */}
              <div className="me-auto ms-3">
                <select
                  className="form-select form-select-sm"
                  onChange={(e) => {
                    const selected = categories.find(c => c._id === e.target.value);
                    if (selected) navigate(`/${selected.slug}`);
                  }}
                >
                  <option value="">📂 All Categories</option>

                  {categories.map(c => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>

              </div>

              {/* <ul className="navbar-nav ms-auto align-items-center gap-2">
                <li className="nav-item">
                  <Link to="/plan" className="nav-link fw-semibold" style={{ color: '#1075be' }}>
                    Business Plan
                  </Link>
                </li>

             
                <li className="nav-item">
                  <span className="badge bg-primary">
                    <i className="fa-solid fa-users me-1"></i> {totalUsers} Users
                  </span>
                </li>

            
                {!user && !partner && !admin ? (
                  <>
                    <li className="nav-item">
                      <Link to="/account/login" className="btn btn-outline-primary btn-sm">
                        <i className="fa-solid fa-user me-1"></i> Customer Login
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/partner/login" className="btn btn-primary btn-sm">
                        <i className="fa-solid fa-handshake me-1"></i> Partner Login
                      </Link>
                    </li>
                  </>
                ) : user ? (
                  <li className="nav-item dropdown">
                    <button className="btn btn-sm btn-outline-success dropdown-toggle" data-bs-toggle="dropdown">
                      <i className="fa-solid fa-user me-1"></i> {currentUser.name}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li><Link className="dropdown-item" to="/account/dashboard">Dashboard</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                    </ul>
                  </li>
                ) : partner ? (
                  <li className="nav-item dropdown">
                    <button className="btn btn-sm btn-outline-success dropdown-toggle" data-bs-toggle="dropdown">
                      <i className="fa-solid fa-handshake me-1"></i> {partner.name}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li><Link className="dropdown-item" to="/partner/dashboard">Dashboard</Link></li>
                      <li><Link className="dropdown-item" to="/partner/add-profile">Add Profile</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                    </ul>
                  </li>
                ) : admin ? (
                  <li className="nav-item dropdown">
                    <button className="btn btn-sm btn-danger dropdown-toggle" data-bs-toggle="dropdown">
                      <i className="fa-solid fa-shield me-1"></i> Admin
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li><Link className="dropdown-item" to="/admin/dashboard">Dashboard</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                    </ul>
                  </li>
                ) : null}
              </ul> */}

              {/* <ul className="d-flex gap-2 list-unstyled mb-0">

                <li className="nav-item dropdown">
                  {user ? (
                    <div className="dropdown">
                      <button
                        className="btn btn-primary fw-semibold dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                      >
                        {currentUser.name}
                      </button>

                      <ul className="dropdown-menu dropdown-menu-end">
                       
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={handleLogout}
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className="btn btn-primary fw-semibold"
                    >
                      Login
                    </Link>
                  )}
                </li>

                <li>
                  <Link
                    to="/register-business"
                    className="btn btn-success fw-semibold"
                  >
                    List Your Business
                  </Link>
                </li>

              </ul> */}
               <ul className="d-flex align-items-center gap-2 list-unstyled mb-0">

{/* Partner Dashboard Button */}
{currentRole === "partner" && (
  <li>
    <Link
      to="/partner/dashboard"
      className="btn btn-outline-primary fw-semibold px-3"
    >
      Dashboard
    </Link>
  </li>
)}

{/* Login / User Dropdown */}
<li>
  {currentUser ? (
    <div className="dropdown">

      <button
        className="btn btn-primary dropdown-toggle d-flex align-items-center gap-2 px-3 fw-semibold"
        type="button"
        data-bs-toggle="dropdown"
      >
        {/* Avatar */}
        <span
          className="rounded-circle bg-white text-primary d-flex justify-content-center align-items-center fw-bold"
          style={{
            width: "28px",
            height: "28px",
            fontSize: "14px"
          }}
        >
          {currentUser?.name?.charAt(0)?.toUpperCase()}
        </span>

        {/* Name */}
        <span className="d-none d-md-inline">
          {currentUser?.name}
        </span>

        {/* Role Badge */}
        <span className="badge bg-light text-primary text-capitalize">
          {currentRole}
        </span>
      </button>

      {/* Dropdown */}
      <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3">

        <li>
          <div className="px-3 py-2 border-bottom">
            <div className="fw-semibold">
              {currentUser?.name}
            </div>

            <small className="text-muted">
              {currentUser?.email}
            </small>
          </div>
        </li>

        {/* Partner Dashboard */}
        {currentRole === "partner" && (
          <li>
            <Link
              to="/partner/dashboard"
              className="dropdown-item py-2"
            >
              Dashboard
            </Link>
          </li>
        )}

        <li>
          <hr className="dropdown-divider my-1" />
        </li>

        <li>
          <button
            className="dropdown-item text-danger py-2"
            onClick={handleLogout}
          >
            Logout
          </button>
        </li>

      </ul>
    </div>
  ) : (
    <Link
      to="/login"
      className="btn btn-primary fw-semibold px-4"
    >
      Login
    </Link>
  )}
</li>

{/* Register Business */}
<li>
  <Link
    to="/register-business"
    className="btn btn-success fw-semibold px-3"
  >
    List Your Business
  </Link>
</li>

</ul>
            </div>
          </nav>
        </div>
      </header>
    </>
  )
}
