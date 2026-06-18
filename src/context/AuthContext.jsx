import { createContext, useContext, useState, useEffect } from 'react'
import API from '../api/axios'

const AuthContext = createContext(null)

// const safeStorage = {
//   getItem(key) {
//     if (typeof window === 'undefined') return null
//     try {
//       return window.localStorage?.getItem(key) ?? null
//     } catch {
//       return null
//     }
//   },
//   setItem(key, value) {
//     if (typeof window === 'undefined') return
//     try {
//       window.localStorage?.setItem(key, value)
//     } catch {
//       // ignore storage errors (blocked/quota)
//     }
//   },
//   removeItem(key) {
//     if (typeof window === 'undefined') return
//     try {
//       window.localStorage?.removeItem(key)
//     } catch {
//       // ignore storage errors (blocked)
//     }
//   },
// }

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(() => JSON.parse(safeStorage.getItem('user') || 'null'))
//   const [partner, setPartner] = useState(() => JSON.parse(safeStorage.getItem('partner') || 'null'))
//   const [admin, setAdmin] = useState(() => JSON.parse(safeStorage.getItem('admin') || 'null'))

//   // ── User ─────────────────────────────────────────────────────────────────────
//   // const login = async (loginId, password) => {
//   //   const { data } = await API.post('/auth/login', { login: loginId, password })
//   //   if (!data?.token) throw new Error('Token missing from login response')
//   //   safeStorage.setItem('token', data.token)
//   //   safeStorage.setItem('user', JSON.stringify(data.user))
//   //   setUser(data.user)
//   //   return data
//   // }
//   const login = async (loginId, password) => {
//     const { data } = await API.post('/auth/login', {
//       login: loginId,
//       password
//     });

//     if (!data?.token) {
//       throw new Error("Token missing from login response");
//     }

//     // common token
//     safeStorage.setItem("token", data.token);

//     // backend agar user bheje
//     if (data.user) {
//       safeStorage.setItem(
//         "user",
//         JSON.stringify(data.user)
//       );
//       setUser(data.user);
//     }

//     // backend agar partner bheje
//     if (data.partner) {
//       safeStorage.setItem(
//         "partner",
//         JSON.stringify(data.partner)
//       );
//       setPartner(data.partner);
//     }

//     return data;
//   };
//   // forgot password
//   //  const forgotPassword = async (email) => {  
//   //   const { data } = await API.post('/auth/forgot-password', { email });
//   //   return data;
//   // };

//   //  const forgotPassword = async (emailOrPhone) => {  
//   //   const { data } = await API.post('/auth/forgot-password', { emailOrPhone });
//   //   return data;
//   // };
//   // const forgotPassword = async (emailOrPhone) => {
//   //   try {
//   //     const { data } = await API.post('/auth/forgot-password', { emailOrPhone });
//   //     return data;
//   //   } catch (error) {
//   //     console.log(error.response?.data || error.message);
//   //     throw error;
//   //   }
//   // };

//   // const register = async (form) => {
//   //   const { data } = await API.post('/auth/register', form)
//   //   if (!data?.token) throw new Error('Token missing from register response')
//   //   safeStorage.setItem('token', data.token)
//   //   safeStorage.setItem('user', JSON.stringify(data.user))
//   //   setUser(data.user)
//   //   return data
//   // }

//   // ── Partner ──────────────────────────────────────────────────────────────────
//   // const partnerLogin = async (email, password) => {
//   //   const { data } = await API.post('/auth/partner/login', { email, password })
//   //   if (!data?.token) throw new Error('Token missing from partner login response')
//   //   safeStorage.setItem('partnerToken', data.token)
//   //   safeStorage.setItem('partner', JSON.stringify(data.partner))
//   //   setPartner(data.partner)
//   //   return data
//   // }

//   // const partnerRegister = async (form) => {
//   //   const isFormData = typeof FormData !== 'undefined' && form instanceof FormData
//   //   const { data } = await API.post('/auth/partner/register', form, isFormData
//   //     ? { headers: { 'Content-Type': 'multipart/form-data' } }
//   //     : undefined
//   //   )
//   //   if (!data?.token) throw new Error('Token missing from partner register response')
//   //   safeStorage.setItem('partnerToken', data.token)
//   //   safeStorage.setItem('partner', JSON.stringify(data.partner))
//   //   setPartner(data.partner)
//   //   return data
//   // }


//   // ── Admin ────────────────────────────────────────────────────────────────────
//   const adminLogin = async (email, password) => {
//     const { data } = await API.post('/auth/admin/login', { email, password })
//     if (!data?.token) throw new Error('Token missing from admin login response')
//     safeStorage.setItem('adminToken', data.token)
//     safeStorage.setItem('admin', JSON.stringify(data.admin))
//     setAdmin(data.admin)
//     API.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
//     return data
//   }

//   // ── Logout (all) ─────────────────────────────────────────────────────────────
//   const logout = () => {
//     ;['token', 'user', 'partnerToken', 'partner', 'adminToken', 'admin'].forEach((k) => safeStorage.removeItem(k))
//     delete API.defaults.headers.common['Authorization']
//     setUser(null); setPartner(null); setAdmin(null)
//   }

//   // Keep API interceptor in sync when tokens change
//   useEffect(() => {
//     const token = safeStorage.getItem('adminToken') || safeStorage.getItem('partnerToken') || safeStorage.getItem('token')
//     if (token) {
//       API.defaults.headers.common['Authorization'] = `Bearer ${token}`
//     } else {
//       delete API.defaults.headers.common['Authorization']
//     }
//   }, [admin])

//   return (
//     <AuthContext.Provider value={{ admin, adminLogin, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }
export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(undefined) // IMPORTANT
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/auth/admin/me')
      .then(({ data }) => setAdmin(data.admin))
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false))
  }, [])

  const adminLogin = async (email, password) => {
    const { data } = await API.post('/auth/admin/login', { email, password })
    setAdmin(data.admin)
    return data
  }

  const logout = async () => {
    await API.post('/auth/logout')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, loading, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}


export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export default AuthContext
