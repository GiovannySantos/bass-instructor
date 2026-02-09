# 01-tech-stack

## Framework / Bundler / Linguagem
- Framework: React (render via react-dom/client). (src/main.jsx, package.json)
- Bundler: Vite (scripts vite, vite build, vite preview). (package.json, vite.config.js)
- Linguagem: JavaScript/JSX no app principal; existe um hook em TypeScript. (src/App.jsx, src/main.jsx, src/hooks/useMusicEngine.ts)
- UI/styling: Tailwind CSS via PostCSS. (tailwind.config.js, postcss.config.js, src/index.css)
- Musica/teoria: tonal (Chord/Interval/Note/Scale). (package.json, src/App.jsx, src/hooks/useMusicEngine.ts)

## Scripts (rodar local)
- npm run dev (Vite dev server). (package.json)
- npm run build (build de producao). (package.json)
- npm run preview (preview local do build). (package.json)
- npm run lint (eslint). (package.json, eslint.config.js)

## Build/Deploy
- Netlify: npm run build, publica dist. (netlify.toml)
- PWA: public/manifest.json e public/sw.js, com registro do service worker no app. (public/manifest.json, public/sw.js, src/App.jsx)

## Evidencias (outputs relevantes)
package.json:
```json
{
  "name": "bass-instructor",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "tonal": "^6.4.3"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@tailwindcss/postcss": "^4.1.18",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "autoprefixer": "^10.4.24",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.18",
    "vite": "^7.3.1"
  }
}
```

vite.config.js:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
```

netlify.toml:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

public/manifest.json:
```json
{
  "name": "Bass Dojo - Mestre do Groove v3",
  "short_name": "Bass Dojo",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#0b0f14",
  "theme_color": "#0b0f14",
  "description": "PWA para baixistas praticarem teoria, ritmo e localização de notas.",
  "icons": [
    {
      "src": "/icon.svg",
      "sizes": "256x256",
      "type": "image/svg+xml"
    }
  ]
}
```

public/sw.js:
```js
const CACHE_NAME = "bass-dojo-v3";
const ASSETS = [
  "/",
  "/manifest.json",
  "/icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
          return Promise.resolve();
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
```
