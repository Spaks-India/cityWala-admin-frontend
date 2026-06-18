import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
// import './index.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
// import AdminLogin, { AdminBanners, AdminCategories,  AdminUsers } from './pages/admin/AdminLogin'
// import AdminLogin, {  AdminCategories,  AdminUsers } from './pages/admin/AdminLogin'
import AdminLogin from './pages/admin/AdminLogin'
import { AdminCategories, AdminUsers } from './pages/admin/AdminLogin'
// import AdminSubcategories from '../../frontend/src/pages/admin/AdminSubcategories'
import AdminSubcategories from './pages/admin/AdminSubcategories'
import AddPlans from './pages/admin/AddPlans'
import AllPlans from './pages/admin/AllPlans'
import { AdminPartner } from './pages/admin/adminPartner'
import AdminAllCategories from './pages/admin/AdminAllCategories'
import CategoriesTree from './pages/admin/CategoriesTree'
import AdminDashboard from './pages/admin/AdminDashboard'
import Analytics from './pages/admin/Analytics'
import TermsCondition from './pages/admin/TermsCondition'
import { Navigate } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  const ProtectedUser = ({ children }) => {
    const { user } = useAuth()
    return user ? children : <Navigate to="/account/login" />
  }

const ProtectedAdmin = ({ children }) => {
  const { admin, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  return admin ? children : <Navigate to="/admin/login" />
}

  const ProtectedPartner = ({ children }) => {
    const { partner } = useAuth()
    // return partner ? children : <Navigate to="/partner/login" />
    // return partner ? children : <Navigate to="/partner/login" />
    return partner ? children : <Navigate to="/login" />
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedAdmin> <AdminDashboard /> </ProtectedAdmin>} />
          <Route path="/admin/users" element={<ProtectedAdmin> <AdminUsers /> </ProtectedAdmin>} />
          <Route path="/admin/partners" element={<ProtectedAdmin> <AdminPartner /> </ProtectedAdmin>} />
          <Route path='/admin/plans/add' element={<ProtectedAdmin> <AddPlans /> </ProtectedAdmin>} />
          <Route path="/admin/plans/edit/:id" element={<ProtectedAdmin> <AddPlans /> </ProtectedAdmin>} />
          {/* <Route path="/admin/categories/add" element={<ProtectedAdmin><AdminCategories /></ProtectedAdmin>} /> */}
          <Route
            path="/admin/categories/add"
            element={
              <ProtectedAdmin>
                <AdminCategories />
              </ProtectedAdmin>
            }
          />

          <Route
            path="/admin/categories/edit/:id"
            element={
              <ProtectedAdmin>
                <AdminCategories />
              </ProtectedAdmin>
            }
          />
          <Route
            path="/admin/categories-tree"
            element={
              <ProtectedAdmin>
                <CategoriesTree />
              </ProtectedAdmin>
            }
          />
          <Route path='/admin/term-and-condition' element={<ProtectedAdmin > <TermsCondition />   </ProtectedAdmin>} />
          {/* <Route path="/admin/categories/add/:id" element={<ProtectedAdmin><AdminCategories /></ProtectedAdmin>} /> */}
          <Route path="/admin/categories/all" element={<ProtectedAdmin> <AdminAllCategories /> </ProtectedAdmin>} />
          {/* <Route path="/admin/plans" element={<ProtectedAdmin> <AllPlans /> </ProtectedAdmin>} /> */}
          <Route path="/admin/plans" element={<ProtectedAdmin> <AllPlans /> </ProtectedAdmin>} />

          {/* <Route path="/admin/plans/add" element={<AddPlan />} /> */}

          {/* <Route path="/admin/plans/edit/:id" element={<AddPlan />} /> */}

          {/* <Route path="/admin/categories" element={<ProtectedAdmin><AdminCategoriesAdd /></ProtectedAdmin>} /> */}
          <Route path="/admin/subcategories" element={<ProtectedAdmin> <AdminSubcategories /> </ProtectedAdmin>} />
          {/* <Route path="/admin/banners" element={<ProtectedAdmin><AdminBanners /></ProtectedAdmin>} /> */}
          <Route path="/admin/analytics" element={<ProtectedAdmin><Analytics /></ProtectedAdmin>} />
          {/* <Route path="/admin/matrimonial" element={<ProtectedAdmin><AdminMatrimonial /></ProtectedAdmin>} /> */}
          {/* <Route path="/admin/advertise" element={<ProtectedAdmin><AdminAdvertise /></ProtectedAdmin>} /> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App


// import { useState } from 'react'
// import './App.css'

// import { AuthProvider, useAuth } from './context/AuthContext'
// import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'

// // Admin pages
// import AdminLogin from './pages/admin/AdminLogin'
// import { AdminCategories, AdminUsers } from './pages/admin/AdminLogin'
// import AdminSubcategories from './pages/admin/AdminSubcategories'
// import AddPlans from './pages/admin/AddPlans'
// import AllPlans from './pages/admin/AllPlans'
// import { AdminPartner } from './pages/admin/adminPartner'
// import AdminAllCategories from './pages/admin/AdminAllCategories'
// import CategoriesTree from './pages/admin/CategoriesTree'
// import AdminDashboard from './pages/admin/AdminDashboard'
// import Analytics from './pages/admin/Analytics'
// import TermsCondition from './pages/admin/termsCondition'

// // ───────── Protected Routes ─────────

// const ProtectedAdmin = ({ children }) => {
//   const { admin } = useAuth()
//   return admin ? children : <Navigate to="/admin/login" />
// }


// // ───────── App ─────────

// function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>

//           {/* Admin Login */}
//           <Route path="/admin/login" element={<AdminLogin />} />

//           {/* Admin Protected Routes */}
//           <Route path="/admin/dashboard" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
//           <Route path="/admin/users" element={<ProtectedAdmin><AdminUsers /></ProtectedAdmin>} />
//           <Route path="/admin/partners" element={<ProtectedAdmin><AdminPartner /></ProtectedAdmin>} />

//           <Route path="/admin/plans" element={<ProtectedAdmin><AllPlans /></ProtectedAdmin>} />
//           <Route path="/admin/plans/add" element={<ProtectedAdmin><AddPlans /></ProtectedAdmin>} />
//           <Route path="/admin/plans/edit/:id" element={<ProtectedAdmin><AddPlans /></ProtectedAdmin>} />

//           <Route path="/admin/categories/add" element={<ProtectedAdmin><AdminCategories /></ProtectedAdmin>} />
//           <Route path="/admin/categories/edit/:id" element={<ProtectedAdmin><AdminCategories /></ProtectedAdmin>} />
//           <Route path="/admin/categories/all" element={<ProtectedAdmin><AdminAllCategories /></ProtectedAdmin>} />

//           <Route path="/admin/categories-tree" element={<ProtectedAdmin><CategoriesTree /></ProtectedAdmin>} />
//           <Route path="/admin/subcategories" element={<ProtectedAdmin><AdminSubcategories /></ProtectedAdmin>} />
//           <Route path="/admin/analytics" element={<ProtectedAdmin><Analytics /></ProtectedAdmin>} />
//           <Route path="/admin/term-and-condition" element={<ProtectedAdmin><TermsCondition /></ProtectedAdmin>} />

//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   )
// }

// export default App