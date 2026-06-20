> ⚠️ **DEPRECATED — migrated into the main frontend.**
> This admin app now lives inside `cityWala-Frontend` under the `/admin/*` routes,
> so the whole product ships from a **single origin** (one CORS entry on the backend).
> This standalone project is kept **only as a fallback**: if the in-app admin breaks,
> you can redeploy this app — but doing so temporarily requires re-adding this app's
> origin to the backend's CORS allow-list. Do not add new features here; change the
> admin pages in `cityWala-Frontend/src/pages/admin/` instead.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
