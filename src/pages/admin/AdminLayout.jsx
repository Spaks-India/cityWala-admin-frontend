import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({
  children,
  active
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5"
      }}
    >
      <div className="row g-0">

        {/* Mobile Topbar */}
        <div className="d-md-none p-2 bg-dark">
          <button
            className="btn btn-light"
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileSidebar"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>

        {/* Sidebar */}
        <AdminSidebar active={active} />

        {/* Main Content */}
        <div className="col-lg-10 col-md-9 p-4" style={{
          overflowY: "auto"
        }}  >
          {children}
        </div>

      </div>
    </div>
  );
}