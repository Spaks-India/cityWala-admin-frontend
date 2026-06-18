import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../assets/headerLogo.png'


export default function AdminSidebar({ active }) {
    const { logout } = useAuth()
    const navigate = useNavigate()
    const menus = [
        {
            name: "Dashboard",
            link: "/admin/dashboard",
            icon: "fa-gauge-high"
        },
        {
            name: "Users",
            link: "/admin/users",
            icon: "fa-users"
        },
        {
            name: "Partners",
            icon: "fa-handshake",
            link: "/admin/partners",
        },
        {
            name: "Analytics",
            link: "/admin/analytics",
            icon: "fa-table-cells-large"
        },
        {
            name: "Subcategories",
            icon: "fa-layer-group",
            link: "/admin/subcategories",
        },
        {
            name: "Categories",
            icon: "fa-table-cells-large",
            children: [
                { name: "All Categories", link: "/admin/categories/all" },
                { name: "Add Category", link: "/admin/categories/add" },
                { name: "Category Tree", link: "/admin/categories-tree" }
            ]
        },
        {
            name: "Plans",
            icon: "fa-layer-group",
            children: [
                {
                    name: "All Plans",
                    link: "/admin/plans",
                    icon: "fa-list"
                },
                {
                    name: "Add Plan",
                    link: "/admin/plans/add",
                    icon: "fa-plus"
                }
            ]
        },
        {
            name: "Term and Condition",
            link: "/admin/term-and-condition",
            icon: "fa-table-cells-large"
        }
    ];

    return (
        <>
            <div
                className="col-lg-2 col-md-3 d-none d-md-block p-0"
                style={{
                    height: "100vh",
                    position: "sticky",
                    top: 0,
                    background: "#0f172a",
                    overflowY: "auto"
                }}
            >
                <div className="text-center py-4 border-bottom border-secondary">
                    {/* <i
                        className="fa-solid fa-shield-halved fa-2x text-white mb-2"
                    ></i> */}
                    <img
                        src={Logo}
                        alt="img"
                        className="mb-2"
                        style={{ maxWidth: "150px", height: "auto", objectFit: "contain" }}
                    />
                    {/* <h6 className="text-white mb-0 fw-bold">
                        Admin Panel
                    </h6> */}
                </div>

                <ul className="list-unstyled m-0 p-0">

                    {menus.map((item) => (
                        <li key={item.name}>

                            {!item.children ? (
                                <Link
                                    to={item.link}
                                    className="d-flex align-items-center gap-2 px-4 py-3 text-decoration-none"
                                    style={{
                                        color:
                                            active === item.link
                                                ? "#fff"
                                                : "#cbd5e1",

                                        background:
                                            active === item.link
                                                ? "#1e293b"
                                                : "transparent",

                                        borderLeft:
                                            active === item.link
                                                ? "4px solid #1075be"
                                                : "4px solid transparent",

                                        transition: "0.3s"
                                    }}
                                >
                                    <i className={`fa-solid ${item.icon}`}></i>
                                    <span>{item.name}</span>
                                </Link>
                            ) : (
                                <>
                                    <div
                                        className="d-flex align-items-center justify-content-between px-4 py-3"
                                        style={{
                                            color: "#cbd5e1",
                                            cursor: "pointer"
                                        }}
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#menu-${item.name}`}
                                    >
                                        <div className="d-flex align-items-center gap-2">
                                            <i className={`fa-solid ${item.icon}`}></i>
                                            <span>{item.name}</span>
                                        </div>

                                        <i className="fa-solid fa-angle-down"></i>
                                    </div>

                                    <div
                                        className="collapse"
                                        id={`menu-${item.name}`}
                                    >
                                        {item.children.map((sub) => (
                                            <Link
                                                key={sub.name}
                                                to={sub.link}
                                                className="d-flex align-items-center gap-2 px-5 py-2 text-decoration-none"
                                                style={{
                                                    color:
                                                        active === sub.link
                                                            ? "#fff"
                                                            : "#94a3b8",
                                                    background:
                                                        active === sub.link
                                                            ? "#1e293b"
                                                            : "transparent",

                                                    fontSize: "14px"
                                                }}
                                            >
                                                <i className={`fa-solid ${sub.icon}`}></i>
                                                <span>{sub.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            )}
                        </li>
                    ))}

                    <li>
                        <Link
                            to="/admin/login"
                            className="d-flex align-items-center gap-2 px-4 py-3 text-decoration-none text-danger"
                        >
                            <i className="fa-solid fa-right-from-bracket"></i>
                            <span>Logout</span>
                        </Link>
                    </li>

                </ul>

            </div>
            <div
                className="offcanvas offcanvas-start d-md-none"
                tabIndex="-1"
                id="mobileSidebar"
                style={{
                    background: "#0f172a",
                    width: "260px"
                }}
            >
                <div className="offcanvas-header border-bottom border-secondary">
                    <h5 className="text-white mb-0">
                        Admin Panel
                    </h5>

                    <button
                        type="button"
                        className="btn-close btn-close-white"
                        data-bs-dismiss="offcanvas"
                    ></button>
                </div>

                <div className="offcanvas-body p-0">
                    <ul className="list-unstyled m-0 p-0">

                        {menus.map((item) => (
                            <li key={item.name}>

                                {!item.children ? (
                                    <Link
                                        to={item.link}
                                        className="d-flex align-items-center gap-2 px-4 py-3 text-decoration-none"
                                        style={{
                                            color:
                                                active === item.link
                                                    ? "#fff"
                                                    : "#cbd5e1",

                                            background:
                                                active === item.link
                                                    ? "#1e293b"
                                                    : "transparent",

                                            borderLeft:
                                                active === item.link
                                                    ? "4px solid #1075be"
                                                    : "4px solid transparent",

                                            transition: "0.3s"
                                        }}
                                    >
                                        <i className={`fa-solid ${item.icon}`}></i>
                                        <span>{item.name}</span>
                                    </Link>
                                ) : (
                                    <>
                                        <div
                                            className="d-flex align-items-center justify-content-between px-4 py-3"
                                            style={{
                                                color: "#cbd5e1",
                                                cursor: "pointer"
                                            }}
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#menu-${item.name}`}
                                        >
                                            <div className="d-flex align-items-center gap-2">
                                                <i className={`fa-solid ${item.icon}`}></i>
                                                <span>{item.name}</span>
                                            </div>

                                            <i className="fa-solid fa-angle-down"></i>
                                        </div>

                                        <div
                                            className="collapse"
                                            id={`menu-${item.name}`}
                                        >
                                            {item.children.map((sub) => (
                                                <Link
                                                    key={sub.name}
                                                    to={sub.link}
                                                    className="d-flex align-items-center gap-2 px-5 py-2 text-decoration-none"
                                                    style={{
                                                        color:
                                                            active === sub.link
                                                                ? "#fff"
                                                                : "#94a3b8",
                                                        background:
                                                            active === sub.link
                                                                ? "#1e293b"
                                                                : "transparent",

                                                        fontSize: "14px"
                                                    }}
                                                >
                                                    <i className={`fa-solid ${sub.icon}`}></i>
                                                    <span>{sub.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}

                    </ul>
                </div>
            </div>
        </>
    )
}
