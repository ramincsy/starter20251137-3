# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`

## Deploy to GitHub Pages (automatic)

This repository is configured to deploy to GitHub Pages. There are two options:

- Automatic via GitHub Actions (recommended) — this workflow builds the site and pushes the static files to the `gh-pages` branch:

  - The workflow file is at `.github/workflows/gh-pages.yml` and runs on pushes to `main` branch.
  - Vite base path is configured in `vite.config.ts` to `"/starter20251137-3/"` for production builds — change it if your repository name differs.

- Manual deploy from your machine (you can use the npm script):

  ```powershell
  npm run build
  npm run deploy
  ```

  The above uses the `gh-pages` package and pushes `dist` to the `gh-pages` branch.

Notes:
- The `homepage` field in `package.json` is already set to `https://ramincsy.github.io/starter20251137-3/` — update it to your user/org repo if needed.
- After the first successful deploy, enable GitHub Pages in your repository settings or set the pages branch to `gh-pages` (should be auto-detected after the action creates the branch).
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
