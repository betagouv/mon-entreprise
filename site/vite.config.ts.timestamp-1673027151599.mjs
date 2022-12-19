// vite.config.ts
import replace from "file:///home/johan/Projets/mon-entreprise/node_modules/@rollup/plugin-replace/dist/rollup-plugin-replace.cjs.js";
import yaml from "file:///home/johan/Projets/mon-entreprise/node_modules/@rollup/plugin-yaml/dist/index.js";
import legacy from "file:///home/johan/Projets/mon-entreprise/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
import react from "file:///home/johan/Projets/mon-entreprise/node_modules/@vitejs/plugin-react/dist/index.mjs";
import fs from "fs/promises";
import path from "path";
import serveStatic from "file:///home/johan/Projets/mon-entreprise/node_modules/serve-static/index.js";
import { defineConfig, loadEnv } from "file:///home/johan/Projets/mon-entreprise/node_modules/vite/dist/node/index.js";
import { VitePWA } from "file:///home/johan/Projets/mon-entreprise/node_modules/vite-plugin-pwa/dist/index.mjs";

// scripts/runScriptOnFileChange/execOnFileChange.ts
import { getPackageDeps } from "file:///home/johan/Projets/mon-entreprise/node_modules/@rushstack/package-deps-hash/lib/index.js";
import { exec as originalExec } from "child_process";
import { existsSync, lstatSync, readFileSync, writeFileSync } from "fs";
import { relative, resolve } from "path";
import { promisify } from "util";
var exec = promisify(originalExec);
var execOnFileChange = async (config) => {
  const path2 = resolve(config.basePath, config.depsPath);
  const deps = Object.fromEntries(getPackageDeps(config.basePath));
  const depsEntries = Object.entries(deps);
  const existingDeps = existsSync(path2) ? JSON.parse(readFileSync(path2, { encoding: "utf8" })) : {};
  const existingDepsEntries = Object.entries(existingDeps);
  const promises = config.options.map(async (cfg) => {
    let fileChanged = null;
    const index = cfg.paths.map((val) => {
      const isDir = lstatSync(resolve(config.basePath, val)).isDirectory();
      const isFile = lstatSync(resolve(config.basePath, val)).isFile();
      return {
        isDir,
        isFile,
        absolute: resolve(config.basePath, val),
        relative: relative(
          resolve(config.basePath),
          resolve(config.basePath, val)
        )
      };
    }).findIndex(({ absolute, relative: relative2, isFile, isDir }) => {
      if (isFile) {
        if (deps[relative2] !== existingDeps[relative2]) {
          fileChanged = relative2;
        }
        return deps[relative2] !== existingDeps[relative2];
      } else if (isDir) {
        const index2 = depsEntries.findIndex(
          ([a, b], i) => {
            var _a, _b;
            return (relative2.length ? a.startsWith(relative2 + "/") : true) && (((_a = existingDepsEntries == null ? void 0 : existingDepsEntries[i]) == null ? void 0 : _a[0]) !== a || ((_b = existingDepsEntries == null ? void 0 : existingDepsEntries[i]) == null ? void 0 : _b[1]) !== b);
          }
        );
        if (index2 > -1) {
          fileChanged = depsEntries[index2][0];
        }
        return index2 > -1;
      }
      throw new Error("Path is not a directory or a file: " + absolute);
    });
    if (index > -1) {
      const result = await exec(cfg.run);
      return {
        path: cfg.paths[index],
        fileChanged,
        run: cfg.run,
        result
      };
    }
    return null;
  });
  const res = await Promise.all(promises);
  writeFileSync(path2, JSON.stringify(deps, null, 2));
  return res;
};

// scripts/runScriptOnFileChange/index.ts
var runScriptOnFileChange = async () => {
  console.log("Search for changed file...");
  const results = await execOnFileChange({
    basePath: "./",
    depsPath: ".deps.json",
    options: [
      {
        paths: [
          "./source/pages/Simulateurs/EconomieCollaborative/activit\xE9s.yaml",
          "./source/pages/Simulateurs/EconomieCollaborative/activit\xE9s.en.yaml"
        ],
        run: "yarn build:yaml-to-dts"
      }
    ]
  });
  results.filter((x) => !!x).forEach(({ fileChanged, run, result }) => {
    console.log("Changed file detected:", fileChanged);
    console.log("Execute:", run, "\n");
    if (result.stdout) {
      console.log(result.stdout);
    }
    if (result.stderr) {
      console.error(result.stderr);
    }
  });
};

// vite-pwa-options.ts
var pwaOptions = {
  registerType: "prompt",
  strategies: "injectManifest",
  srcDir: "source",
  filename: "sw.ts",
  injectManifest: {
    maximumFileSizeToCacheInBytes: 3e6,
    manifestTransforms: [
      (entries) => {
        const manifest = entries.filter(
          (entry) => !/assets\/.*(-legacy|lazy_)/.test(entry.url) && (entry.url.endsWith(".html") ? /(infrance|mon-entreprise)\.html/.test(entry.url) : true)
        );
        return { manifest };
      }
    ]
  },
  includeAssets: ["logo-*.png"],
  manifest: {
    start_url: "/",
    name: "Mon entreprise",
    short_name: "Mon entreprise",
    description: "L'assistant officiel du cr\xE9ateur d'entreprise",
    lang: "fr",
    orientation: "portrait-primary",
    display: "minimal-ui",
    theme_color: "#2975d1",
    background_color: "#ffffff",
    icons: [
      {
        src: "/favicon/android-chrome-192x192-shadow.png?v=2.0",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/favicon/android-chrome-512x512-shadow.png?v=2.0",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  }
};

// vite.config.ts
var __vite_injected_original_import_meta_url = "file:///home/johan/Projets/mon-entreprise/site/vite.config.ts";
var env = (mode) => loadEnv(mode, process.cwd(), "");
var vite_config_default = defineConfig(({ command, mode }) => ({
  resolve: {
    alias: { "@": path.resolve("./source") },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json"]
  },
  publicDir: "source/public",
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        chunkFileNames: (chunkInfo) => {
          if (chunkInfo.isDynamicEntry) {
            return "assets/lazy_[name].[hash].js";
          }
          return "assets/[name].[hash].js";
        }
      }
    }
  },
  define: {
    BRANCH_NAME: JSON.stringify(getBranch(mode)),
    IS_DEVELOPMENT: mode === "development",
    IS_STAGING: mode === "production" && !isProductionBranch(mode),
    IS_PRODUCTION: mode === "production" && isProductionBranch(mode)
  },
  plugins: [
    {
      name: "run-script-on-file-change",
      apply: "serve",
      buildStart() {
        if (mode === "development") {
          void runScriptOnFileChange();
        }
      }
    },
    command === "build" && replace({
      __SENTRY_DEBUG__: false,
      preventAssignment: false
    }),
    react({
      babel: {
        plugins: [["babel-plugin-styled-components", { pure: true }]]
      }
    }),
    yaml(),
    multipleSPA({
      defaultSite: "mon-entreprise",
      templatePath: "./source/template.html",
      sites: {
        "mon-entreprise": {
          lang: "fr",
          entry: "/source/entry-fr.tsx",
          title: "mon-entreprise.urssaf.fr : L'assistant officiel du cr\xE9ateur d'entreprise",
          description: "Du statut juridique \xE0 la premi\xE8re embauche, en passant par la simulation des cotisations, vous trouverez ici toutes les ressources pour d\xE9marrer votre activit\xE9.",
          shareImage: "/source/images/logo-monentreprise.svg",
          shareImageAlt: "Logo mon-entreprise, site Urssaf"
        },
        infrance: {
          lang: "en",
          entry: "/source/entry-en.tsx",
          title: "My company in France: A step-by-step guide to start a business in France",
          description: "Find the type of company that suits you and follow the steps to register your company. Discover the French social security system by simulating your hiring costs. Discover the procedures to hire in France and learn the basics of French labour law.",
          shareImage: "/logo-mycompany-share.png",
          shareImageAlt: "Logo My company in France by Urssaf"
        }
      }
    }),
    VitePWA(pwaOptions),
    legacy({
      targets: ["defaults", "not IE 11"]
    })
  ],
  server: {
    port: 3e3,
    hmr: {
      clientPort: typeof env(mode).HMR_CLIENT_PORT !== "undefined" ? parseInt(env(mode).HMR_CLIENT_PORT) : void 0
    },
    watch: {
      ignored: [
        "!**/node_modules/publicodes/**",
        "!**/node_modules/publicodes-react/**"
      ]
    },
    proxy: {
      "/api": "http://localhost:3004",
      "/twemoji": {
        target: "https://twemoji.maxcdn.com",
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/twemoji/, ""),
        timeout: 3 * 1e3
      }
    }
  },
  optimizeDeps: {
    entries: ["./source/entry-fr.tsx", "./source/entry-en.tsx"],
    exclude: ["publicodes-react", "publicodes"],
    include: ["publicodes > moo", "publicodes > nearley"]
  },
  ssr: {
    noExternal: [
      /react-aria|react-stately|internationalized/,
      /markdown-to-jsx/,
      /styled-components|emotion/,
      /publicodes-react/
    ]
  }
}));
function multipleSPA(options) {
  const fillTemplate = async (siteName) => {
    const siteData = options.sites[siteName];
    const template = await fs.readFile(options.templatePath, "utf-8");
    const filledTemplate = template.toString().replace(/\{\{(.+)\}\}/g, (_match, p1) => siteData[p1.trim()]);
    return filledTemplate;
  };
  return {
    name: "multiple-spa",
    enforce: "pre",
    configureServer(vite) {
      vite.middlewares.use(
        "/simulateur-iframe-integration.js",
        serveStatic(new URL("./dist", __vite_injected_original_import_meta_url).pathname, {
          index: "simulateur-iframe-integration.js"
        })
      );
      vite.middlewares.use(async (req, res, next) => {
        var _a;
        const url = (_a = req.originalUrl) == null ? void 0 : _a.replace(/^\/%2F/, "/");
        const firstLevelDir = url == null ? void 0 : url.slice(1).split("/")[0];
        if (url && /\?.*html-proxy/.test(url)) {
          return next();
        }
        if (url && ["/", "/index.html"].includes(url)) {
          res.writeHead(302, { Location: "/" + options.defaultSite }).end();
        } else if (firstLevelDir && url && Object.keys(options.sites).map((site) => `/${site}.html`).includes(url)) {
          const siteName = firstLevelDir.replace(".html", "");
          const content = await vite.transformIndexHtml(
            "/" + siteName,
            await fillTemplate(siteName)
          );
          res.end(content);
        } else if (firstLevelDir && Object.keys(options.sites).some((name) => firstLevelDir === name)) {
          const siteName = firstLevelDir;
          const content = await vite.transformIndexHtml(
            url,
            await fillTemplate(siteName)
          );
          res.end(content);
        } else {
          next();
        }
      });
    },
    config(config, { command }) {
      var _a, _b;
      if (command === "build" && !((_a = config.build) == null ? void 0 : _a.ssr)) {
        config.build = {
          ...config.build,
          rollupOptions: {
            ...(_b = config.build) == null ? void 0 : _b.rollupOptions,
            input: Object.fromEntries(
              Object.keys(options.sites).map((name) => [
                name,
                `virtual:${name}.html`
              ])
            )
          }
        };
      }
    },
    resolveId(id) {
      const pathname = id.split("/").slice(-1)[0];
      if (pathname == null ? void 0 : pathname.startsWith("virtual:")) {
        return pathname.replace("virtual:", "");
      }
      return null;
    },
    async load(id) {
      if (Object.keys(options.sites).some((name) => id.endsWith(name + ".html"))) {
        return await fillTemplate(id.replace(/\.html$/, ""));
      }
    }
  };
}
var getBranch = (mode) => {
  var _a, _b, _c;
  let branch = (_c = (_b = (_a = env(mode).VITE_GITHUB_REF) == null ? void 0 : _a.split("/")) == null ? void 0 : _b.slice(-1)) == null ? void 0 : _c[0];
  if (branch === "merge") {
    branch = env(mode).VITE_GITHUB_HEAD_REF;
  }
  return branch ?? "";
};
var isProductionBranch = (mode) => {
  return ["master", "next"].includes(getBranch(mode));
};
export {
  vite_config_default as default,
  getBranch,
  isProductionBranch
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic2NyaXB0cy9ydW5TY3JpcHRPbkZpbGVDaGFuZ2UvZXhlY09uRmlsZUNoYW5nZS50cyIsICJzY3JpcHRzL3J1blNjcmlwdE9uRmlsZUNoYW5nZS9pbmRleC50cyIsICJ2aXRlLXB3YS1vcHRpb25zLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvam9oYW4vUHJvamV0cy9tb24tZW50cmVwcmlzZS9zaXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9qb2hhbi9Qcm9qZXRzL21vbi1lbnRyZXByaXNlL3NpdGUvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvam9oYW4vUHJvamV0cy9tb24tZW50cmVwcmlzZS9zaXRlL3ZpdGUuY29uZmlnLnRzXCI7LyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuaW1wb3J0IHJlcGxhY2UgZnJvbSAnQHJvbGx1cC9wbHVnaW4tcmVwbGFjZSdcbmltcG9ydCB5YW1sIGZyb20gJ0Byb2xsdXAvcGx1Z2luLXlhbWwnXG5pbXBvcnQgbGVnYWN5IGZyb20gJ0B2aXRlanMvcGx1Z2luLWxlZ2FjeSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBmcyBmcm9tICdmcy9wcm9taXNlcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgc2VydmVTdGF0aWMgZnJvbSAnc2VydmUtc3RhdGljJ1xuaW1wb3J0IHsgUGx1Z2luLCBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSdcblxuaW1wb3J0IHsgcnVuU2NyaXB0T25GaWxlQ2hhbmdlIH0gZnJvbSAnLi9zY3JpcHRzL3J1blNjcmlwdE9uRmlsZUNoYW5nZSdcbmltcG9ydCB7IHB3YU9wdGlvbnMgfSBmcm9tICcuL3ZpdGUtcHdhLW9wdGlvbnMnXG5cbmNvbnN0IGVudiA9IChtb2RlOiBzdHJpbmcpID0+IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kLCBtb2RlIH0pID0+ICh7XG5cdHJlc29sdmU6IHtcblx0XHRhbGlhczogeyAnQCc6IHBhdGgucmVzb2x2ZSgnLi9zb3VyY2UnKSB9LFxuXHRcdGV4dGVuc2lvbnM6IFsnLmpzJywgJy50cycsICcuanN4JywgJy50c3gnLCAnLmpzb24nXSxcblx0fSxcblx0cHVibGljRGlyOiAnc291cmNlL3B1YmxpYycsXG5cdGJ1aWxkOiB7XG5cdFx0c291cmNlbWFwOiB0cnVlLFxuXHRcdHJvbGx1cE9wdGlvbnM6IHtcblx0XHRcdG91dHB1dDoge1xuXHRcdFx0XHRjaHVua0ZpbGVOYW1lczogKGNodW5rSW5mbykgPT4ge1xuXHRcdFx0XHRcdGlmIChjaHVua0luZm8uaXNEeW5hbWljRW50cnkpIHtcblx0XHRcdFx0XHRcdHJldHVybiAnYXNzZXRzL2xhenlfW25hbWVdLltoYXNoXS5qcydcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gJ2Fzc2V0cy9bbmFtZV0uW2hhc2hdLmpzJ1xuXHRcdFx0XHR9LFxuXHRcdFx0fSxcblx0XHR9LFxuXHR9LFxuXHRkZWZpbmU6IHtcblx0XHRCUkFOQ0hfTkFNRTogSlNPTi5zdHJpbmdpZnkoZ2V0QnJhbmNoKG1vZGUpKSxcblx0XHRJU19ERVZFTE9QTUVOVDogbW9kZSA9PT0gJ2RldmVsb3BtZW50Jyxcblx0XHRJU19TVEFHSU5HOiBtb2RlID09PSAncHJvZHVjdGlvbicgJiYgIWlzUHJvZHVjdGlvbkJyYW5jaChtb2RlKSxcblx0XHRJU19QUk9EVUNUSU9OOiBtb2RlID09PSAncHJvZHVjdGlvbicgJiYgaXNQcm9kdWN0aW9uQnJhbmNoKG1vZGUpLFxuXHR9LFxuXHRwbHVnaW5zOiBbXG5cdFx0e1xuXHRcdFx0bmFtZTogJ3J1bi1zY3JpcHQtb24tZmlsZS1jaGFuZ2UnLFxuXHRcdFx0YXBwbHk6ICdzZXJ2ZScsXG5cdFx0XHRidWlsZFN0YXJ0KCkge1xuXHRcdFx0XHRpZiAobW9kZSA9PT0gJ2RldmVsb3BtZW50Jykge1xuXHRcdFx0XHRcdHZvaWQgcnVuU2NyaXB0T25GaWxlQ2hhbmdlKClcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHR9LFxuXHRcdGNvbW1hbmQgPT09ICdidWlsZCcgJiZcblx0XHRcdHJlcGxhY2Uoe1xuXHRcdFx0XHRfX1NFTlRSWV9ERUJVR19fOiBmYWxzZSxcblx0XHRcdFx0cHJldmVudEFzc2lnbm1lbnQ6IGZhbHNlLFxuXHRcdFx0fSksXG5cdFx0cmVhY3Qoe1xuXHRcdFx0YmFiZWw6IHtcblx0XHRcdFx0cGx1Z2luczogW1snYmFiZWwtcGx1Z2luLXN0eWxlZC1jb21wb25lbnRzJywgeyBwdXJlOiB0cnVlIH1dXSxcblx0XHRcdH0sXG5cdFx0fSksXG5cdFx0eWFtbCgpLFxuXHRcdG11bHRpcGxlU1BBKHtcblx0XHRcdGRlZmF1bHRTaXRlOiAnbW9uLWVudHJlcHJpc2UnLFxuXHRcdFx0dGVtcGxhdGVQYXRoOiAnLi9zb3VyY2UvdGVtcGxhdGUuaHRtbCcsXG5cdFx0XHRzaXRlczoge1xuXHRcdFx0XHQnbW9uLWVudHJlcHJpc2UnOiB7XG5cdFx0XHRcdFx0bGFuZzogJ2ZyJyxcblx0XHRcdFx0XHRlbnRyeTogJy9zb3VyY2UvZW50cnktZnIudHN4Jyxcblx0XHRcdFx0XHR0aXRsZTpcblx0XHRcdFx0XHRcdFwibW9uLWVudHJlcHJpc2UudXJzc2FmLmZyIDogTCdhc3Npc3RhbnQgb2ZmaWNpZWwgZHUgY3JcdTAwRTlhdGV1ciBkJ2VudHJlcHJpc2VcIixcblx0XHRcdFx0XHRkZXNjcmlwdGlvbjpcblx0XHRcdFx0XHRcdCdEdSBzdGF0dXQganVyaWRpcXVlIFx1MDBFMCBsYSBwcmVtaVx1MDBFOHJlIGVtYmF1Y2hlLCBlbiBwYXNzYW50IHBhciBsYSBzaW11bGF0aW9uIGRlcyBjb3Rpc2F0aW9ucywgdm91cyB0cm91dmVyZXogaWNpIHRvdXRlcyBsZXMgcmVzc291cmNlcyBwb3VyIGRcdTAwRTltYXJyZXIgdm90cmUgYWN0aXZpdFx1MDBFOS4nLFxuXHRcdFx0XHRcdHNoYXJlSW1hZ2U6ICcvc291cmNlL2ltYWdlcy9sb2dvLW1vbmVudHJlcHJpc2Uuc3ZnJyxcblx0XHRcdFx0XHRzaGFyZUltYWdlQWx0OiAnTG9nbyBtb24tZW50cmVwcmlzZSwgc2l0ZSBVcnNzYWYnLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRpbmZyYW5jZToge1xuXHRcdFx0XHRcdGxhbmc6ICdlbicsXG5cdFx0XHRcdFx0ZW50cnk6ICcvc291cmNlL2VudHJ5LWVuLnRzeCcsXG5cdFx0XHRcdFx0dGl0bGU6XG5cdFx0XHRcdFx0XHQnTXkgY29tcGFueSBpbiBGcmFuY2U6IEEgc3RlcC1ieS1zdGVwIGd1aWRlIHRvIHN0YXJ0IGEgYnVzaW5lc3MgaW4gRnJhbmNlJyxcblx0XHRcdFx0XHRkZXNjcmlwdGlvbjpcblx0XHRcdFx0XHRcdCdGaW5kIHRoZSB0eXBlIG9mIGNvbXBhbnkgdGhhdCBzdWl0cyB5b3UgYW5kIGZvbGxvdyB0aGUgc3RlcHMgdG8gcmVnaXN0ZXIgeW91ciBjb21wYW55LiBEaXNjb3ZlciB0aGUgRnJlbmNoIHNvY2lhbCBzZWN1cml0eSBzeXN0ZW0gYnkgc2ltdWxhdGluZyB5b3VyIGhpcmluZyBjb3N0cy4gRGlzY292ZXIgdGhlIHByb2NlZHVyZXMgdG8gaGlyZSBpbiBGcmFuY2UgYW5kIGxlYXJuIHRoZSBiYXNpY3Mgb2YgRnJlbmNoIGxhYm91ciBsYXcuJyxcblx0XHRcdFx0XHRzaGFyZUltYWdlOiAnL2xvZ28tbXljb21wYW55LXNoYXJlLnBuZycsXG5cdFx0XHRcdFx0c2hhcmVJbWFnZUFsdDogJ0xvZ28gTXkgY29tcGFueSBpbiBGcmFuY2UgYnkgVXJzc2FmJyxcblx0XHRcdFx0fSxcblx0XHRcdH0sXG5cdFx0fSksXG5cdFx0Vml0ZVBXQShwd2FPcHRpb25zKSxcblx0XHRsZWdhY3koe1xuXHRcdFx0dGFyZ2V0czogWydkZWZhdWx0cycsICdub3QgSUUgMTEnXSxcblx0XHR9KSxcblx0XSxcblx0c2VydmVyOiB7XG5cdFx0cG9ydDogMzAwMCxcblx0XHRobXI6IHtcblx0XHRcdGNsaWVudFBvcnQ6XG5cdFx0XHRcdHR5cGVvZiBlbnYobW9kZSkuSE1SX0NMSUVOVF9QT1JUICE9PSAndW5kZWZpbmVkJ1xuXHRcdFx0XHRcdD8gcGFyc2VJbnQoZW52KG1vZGUpLkhNUl9DTElFTlRfUE9SVClcblx0XHRcdFx0XHQ6IHVuZGVmaW5lZCxcblx0XHR9LFxuXHRcdC8vIEtlZXAgd2F0Y2hpbmcgY2hhbmdlcyBpbiB0aGUgcHVibGljb2RlcyBwYWNrYWdlIHRvIHN1cHBvcnQgbGl2ZSByZWxvYWRcblx0XHQvLyB3aGVuIHdlIGl0ZXJhdGUgb24gcHVibGljb2RlcyBsb2dpYy5cblx0XHQvLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnLyNzZXJ2ZXItd2F0Y2hcblx0XHR3YXRjaDoge1xuXHRcdFx0aWdub3JlZDogW1xuXHRcdFx0XHQnISoqL25vZGVfbW9kdWxlcy9wdWJsaWNvZGVzLyoqJyxcblx0XHRcdFx0JyEqKi9ub2RlX21vZHVsZXMvcHVibGljb2Rlcy1yZWFjdC8qKicsXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0cHJveHk6IHtcblx0XHRcdCcvYXBpJzogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwNCcsXG5cdFx0XHQnL3R3ZW1vamknOiB7XG5cdFx0XHRcdHRhcmdldDogJ2h0dHBzOi8vdHdlbW9qaS5tYXhjZG4uY29tJyxcblx0XHRcdFx0Y2hhbmdlT3JpZ2luOiB0cnVlLFxuXHRcdFx0XHRyZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvdHdlbW9qaS8sICcnKSxcblx0XHRcdFx0dGltZW91dDogMyAqIDEwMDAsXG5cdFx0XHR9LFxuXHRcdH0sXG5cdH0sXG5cdG9wdGltaXplRGVwczoge1xuXHRcdGVudHJpZXM6IFsnLi9zb3VyY2UvZW50cnktZnIudHN4JywgJy4vc291cmNlL2VudHJ5LWVuLnRzeCddLFxuXHRcdGV4Y2x1ZGU6IFsncHVibGljb2Rlcy1yZWFjdCcsICdwdWJsaWNvZGVzJ10sXG5cdFx0Ly8gT3B0aW1pemUgY2pzIGRlcHMgZnJvbSBwdWJsaWNvZGVzXG5cdFx0aW5jbHVkZTogWydwdWJsaWNvZGVzID4gbW9vJywgJ3B1YmxpY29kZXMgPiBuZWFybGV5J10sXG5cdH0sXG5cdHNzcjoge1xuXHRcdC8qKlxuXHRcdCAqIFByZXZlbnQgbGlzdGVkIGRlcGVuZGVuY2llcyBmcm9tIGJlaW5nIGV4dGVybmFsaXplZCBmb3IgU1NSIGJ1aWxkIGNhdXNlIHNvbWVcblx0XHQgKiBwYWNrYWdlcyBhcmUgbm90IGVzbSByZWFkeSBvciBwYWNrYWdlLmpzb24gc2V0dXAgc2VlbXMgd3JvbmcsIHdhaXQgdGhpcyBwciB0byBiZSBtZXJnZTpcblx0XHQgKiByZWFjdC1zcGVjdHJ1bTogaHR0cHM6Ly9naXRodWIuY29tL2Fkb2JlL3JlYWN0LXNwZWN0cnVtL3B1bGwvMzYzMFxuXHRcdCAqIG1hcmtkb3duLXRvLWpzeDogaHR0cHM6Ly9naXRodWIuY29tL3Byb2JhYmx5dXAvbWFya2Rvd24tdG8tanN4L3B1bGwvNDE0XG5cdFx0ICogc3R5bGVkLWNvbXBvbmVudHM6IGh0dHBzOi8vZ2l0aHViLmNvbS9zdHlsZWQtY29tcG9uZW50cy9zdHlsZWQtY29tcG9uZW50cy9pc3N1ZXMvMzYwMVxuXHRcdCAqIHB1YmxpY29kZXMtcmVhY3Q6IEFkZCB0eXBlIG1vZHVsZVxuXHRcdCAqL1xuXHRcdG5vRXh0ZXJuYWw6IFtcblx0XHRcdC9yZWFjdC1hcmlhfHJlYWN0LXN0YXRlbHl8aW50ZXJuYXRpb25hbGl6ZWQvLFxuXHRcdFx0L21hcmtkb3duLXRvLWpzeC8sXG5cdFx0XHQvc3R5bGVkLWNvbXBvbmVudHN8ZW1vdGlvbi8sXG5cdFx0XHQvcHVibGljb2Rlcy1yZWFjdC8sIC8vIFRPRE8gcmVtb3ZlIHRoaXMgYWZ0ZXIgcHVibGljb2Rlcy1yZWFjdCB1cGdyYWRlXG5cdFx0XSxcblx0fSxcbn0pKVxuXG50eXBlIE11bHRpcGxlU1BBT3B0aW9ucyA9IHtcblx0ZGVmYXVsdFNpdGU6IHN0cmluZ1xuXHR0ZW1wbGF0ZVBhdGg6IHN0cmluZ1xuXHRzaXRlczogUmVjb3JkPHN0cmluZywgUmVjb3JkPHN0cmluZywgc3RyaW5nPj5cbn1cblxuLyoqXG4gKiBBIGN1c3RvbSBwbHVnaW4gdG8gY3JlYXRlIG11bHRpcGxlIHZpcnR1YWwgaHRtbCBmaWxlcyBmcm9tIGEgdGVtcGxhdGUuIFdpbGxcbiAqIGdlbmVyYXRlIGRpc3RpbmN0IGVudHJ5IHBvaW50cyBhbmQgc2luZ2xlLXBhZ2UgYXBwbGljYXRpb24gb3V0cHV0cy5cbiAqL1xuZnVuY3Rpb24gbXVsdGlwbGVTUEEob3B0aW9uczogTXVsdGlwbGVTUEFPcHRpb25zKTogUGx1Z2luIHtcblx0Y29uc3QgZmlsbFRlbXBsYXRlID0gYXN5bmMgKHNpdGVOYW1lOiBzdHJpbmcpID0+IHtcblx0XHRjb25zdCBzaXRlRGF0YSA9IG9wdGlvbnMuc2l0ZXNbc2l0ZU5hbWVdXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSBhd2FpdCBmcy5yZWFkRmlsZShvcHRpb25zLnRlbXBsYXRlUGF0aCwgJ3V0Zi04Jylcblx0XHRjb25zdCBmaWxsZWRUZW1wbGF0ZSA9IHRlbXBsYXRlXG5cdFx0XHQudG9TdHJpbmcoKVxuXHRcdFx0LnJlcGxhY2UoL1xce1xceyguKylcXH1cXH0vZywgKF9tYXRjaCwgcDEpID0+IHNpdGVEYXRhWyhwMSBhcyBzdHJpbmcpLnRyaW0oKV0pXG5cblx0XHRyZXR1cm4gZmlsbGVkVGVtcGxhdGVcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0bmFtZTogJ211bHRpcGxlLXNwYScsXG5cdFx0ZW5mb3JjZTogJ3ByZScsXG5cblx0XHRjb25maWd1cmVTZXJ2ZXIodml0ZSkge1xuXHRcdFx0Ly8gVE9ETzogdGhpcyBtaWRkbGV3YXJlIGlzIHNwZWNpZmljIHRvIHRoZSBcIm1vbi1lbnRyZXByaXNlXCIgYXBwIGFuZFxuXHRcdFx0Ly8gc2hvdWxkbid0IGJlIGluIHRoZSBcIm11bHRpcGxlU1BBXCIgcGx1Z2luXG5cdFx0XHR2aXRlLm1pZGRsZXdhcmVzLnVzZShcblx0XHRcdFx0Jy9zaW11bGF0ZXVyLWlmcmFtZS1pbnRlZ3JhdGlvbi5qcycsXG5cdFx0XHRcdHNlcnZlU3RhdGljKG5ldyBVUkwoJy4vZGlzdCcsIGltcG9ydC5tZXRhLnVybCkucGF0aG5hbWUsIHtcblx0XHRcdFx0XHRpbmRleDogJ3NpbXVsYXRldXItaWZyYW1lLWludGVncmF0aW9uLmpzJyxcblx0XHRcdFx0fSlcblx0XHRcdClcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbWlzdXNlZC1wcm9taXNlc1xuXHRcdFx0dml0ZS5taWRkbGV3YXJlcy51c2UoYXN5bmMgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHVybCA9IHJlcS5vcmlnaW5hbFVybD8ucmVwbGFjZSgvXlxcLyUyRi8sICcvJylcblxuXHRcdFx0XHRjb25zdCBmaXJzdExldmVsRGlyID0gdXJsPy5zbGljZSgxKS5zcGxpdCgnLycpWzBdXG5cblx0XHRcdFx0aWYgKHVybCAmJiAvXFw/LipodG1sLXByb3h5Ly50ZXN0KHVybCkpIHtcblx0XHRcdFx0XHRyZXR1cm4gbmV4dCgpXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodXJsICYmIFsnLycsICcvaW5kZXguaHRtbCddLmluY2x1ZGVzKHVybCkpIHtcblx0XHRcdFx0XHRyZXMud3JpdGVIZWFkKDMwMiwgeyBMb2NhdGlvbjogJy8nICsgb3B0aW9ucy5kZWZhdWx0U2l0ZSB9KS5lbmQoKVxuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIHRoaXMgY29uZGl0aW9uIGlzIGZvciB0aGUgc3RhcnQ6bmV0bGlmeSBzY3JpcHQgdG8gbWF0Y2ggL21vbi1lbnRyZXByaXNlIG9yIC9pbmZyYW5jZVxuXHRcdFx0XHRlbHNlIGlmIChcblx0XHRcdFx0XHRmaXJzdExldmVsRGlyICYmXG5cdFx0XHRcdFx0dXJsICYmXG5cdFx0XHRcdFx0T2JqZWN0LmtleXMob3B0aW9ucy5zaXRlcylcblx0XHRcdFx0XHRcdC5tYXAoKHNpdGUpID0+IGAvJHtzaXRlfS5odG1sYClcblx0XHRcdFx0XHRcdC5pbmNsdWRlcyh1cmwpXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdGNvbnN0IHNpdGVOYW1lID0gZmlyc3RMZXZlbERpci5yZXBsYWNlKCcuaHRtbCcsICcnKVxuXHRcdFx0XHRcdGNvbnN0IGNvbnRlbnQgPSBhd2FpdCB2aXRlLnRyYW5zZm9ybUluZGV4SHRtbChcblx0XHRcdFx0XHRcdCcvJyArIHNpdGVOYW1lLFxuXHRcdFx0XHRcdFx0YXdhaXQgZmlsbFRlbXBsYXRlKHNpdGVOYW1lKVxuXHRcdFx0XHRcdClcblx0XHRcdFx0XHRyZXMuZW5kKGNvbnRlbnQpXG5cdFx0XHRcdH0gZWxzZSBpZiAoXG5cdFx0XHRcdFx0Zmlyc3RMZXZlbERpciAmJlxuXHRcdFx0XHRcdE9iamVjdC5rZXlzKG9wdGlvbnMuc2l0ZXMpLnNvbWUoKG5hbWUpID0+IGZpcnN0TGV2ZWxEaXIgPT09IG5hbWUpXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdGNvbnN0IHNpdGVOYW1lID0gZmlyc3RMZXZlbERpclxuXHRcdFx0XHRcdGNvbnN0IGNvbnRlbnQgPSBhd2FpdCB2aXRlLnRyYW5zZm9ybUluZGV4SHRtbChcblx0XHRcdFx0XHRcdHVybCxcblx0XHRcdFx0XHRcdGF3YWl0IGZpbGxUZW1wbGF0ZShzaXRlTmFtZSlcblx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0cmVzLmVuZChjb250ZW50KVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG5leHQoKVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdH0sXG5cblx0XHRjb25maWcoY29uZmlnLCB7IGNvbW1hbmQgfSkge1xuXHRcdFx0aWYgKGNvbW1hbmQgPT09ICdidWlsZCcgJiYgIWNvbmZpZy5idWlsZD8uc3NyKSB7XG5cdFx0XHRcdGNvbmZpZy5idWlsZCA9IHtcblx0XHRcdFx0XHQuLi5jb25maWcuYnVpbGQsXG5cdFx0XHRcdFx0cm9sbHVwT3B0aW9uczoge1xuXHRcdFx0XHRcdFx0Li4uY29uZmlnLmJ1aWxkPy5yb2xsdXBPcHRpb25zLFxuXHRcdFx0XHRcdFx0aW5wdXQ6IE9iamVjdC5mcm9tRW50cmllcyhcblx0XHRcdFx0XHRcdFx0T2JqZWN0LmtleXMob3B0aW9ucy5zaXRlcykubWFwKChuYW1lKSA9PiBbXG5cdFx0XHRcdFx0XHRcdFx0bmFtZSxcblx0XHRcdFx0XHRcdFx0XHRgdmlydHVhbDoke25hbWV9Lmh0bWxgLFxuXHRcdFx0XHRcdFx0XHRdKVxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdHJlc29sdmVJZChpZCkge1xuXHRcdFx0Y29uc3QgcGF0aG5hbWUgPSBpZC5zcGxpdCgnLycpLnNsaWNlKC0xKVswXVxuXHRcdFx0aWYgKHBhdGhuYW1lPy5zdGFydHNXaXRoKCd2aXJ0dWFsOicpKSB7XG5cdFx0XHRcdHJldHVybiBwYXRobmFtZS5yZXBsYWNlKCd2aXJ0dWFsOicsICcnKVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbnVsbFxuXHRcdH0sXG5cblx0XHRhc3luYyBsb2FkKGlkKSB7XG5cdFx0XHRpZiAoXG5cdFx0XHRcdE9iamVjdC5rZXlzKG9wdGlvbnMuc2l0ZXMpLnNvbWUoKG5hbWUpID0+IGlkLmVuZHNXaXRoKG5hbWUgKyAnLmh0bWwnKSlcblx0XHRcdCkge1xuXHRcdFx0XHRyZXR1cm4gYXdhaXQgZmlsbFRlbXBsYXRlKGlkLnJlcGxhY2UoL1xcLmh0bWwkLywgJycpKVxuXHRcdFx0fVxuXHRcdH0sXG5cdH1cbn1cblxuLyoqXG4gKiBHaXQgYnJhbmNoIG5hbWVcbiAqL1xuZXhwb3J0IGNvbnN0IGdldEJyYW5jaCA9IChtb2RlOiBzdHJpbmcpID0+IHtcblx0bGV0IGJyYW5jaDogc3RyaW5nIHwgdW5kZWZpbmVkID0gZW52KG1vZGUpXG5cdFx0LlZJVEVfR0lUSFVCX1JFRj8uc3BsaXQoJy8nKVxuXHRcdD8uc2xpY2UoLTEpPy5bMF1cblxuXHRpZiAoYnJhbmNoID09PSAnbWVyZ2UnKSB7XG5cdFx0YnJhbmNoID0gZW52KG1vZGUpLlZJVEVfR0lUSFVCX0hFQURfUkVGXG5cdH1cblxuXHRyZXR1cm4gYnJhbmNoID8/ICcnXG59XG5cbi8qKlxuICogV2UgdXNlIHRoaXMgZnVuY3Rpb24gdG8gaGlkZSBzb21lIGZlYXR1cmVzIGluIHByb2R1Y3Rpb24gd2hpbGUga2VlcGluZyB0aGVtXG4gKiBpbiBmZWF0dXJlLWJyYW5jaGVzLiBJbiBjYXNlIHdlIGRvIEEvQiB0ZXN0aW5nIHdpdGggc2V2ZXJhbCBicmFuY2hlcyBzZXJ2ZWRcbiAqIGluIHByb2R1Y3Rpb24sIHdlIHNob3VsZCBhZGQgdGhlIHB1YmxpYyBmYWNlZCBicmFuY2ggbmFtZXMgaW4gdGhlIHRlc3QgYmVsb3cuXG4gKiBUaGlzIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBpbXBvcnQubWV0YS5lbnYuTU9ERSBpbiB0aGF0IGEgZmVhdHVyZSBicmFuY2ggbWF5XG4gKiBiZSBidWlsZCBpbiBwcm9kdWN0aW9uIG1vZGUgKHdpdGggdGhlIE5PREVfRU5WKSBidXQgd2UgbWF5IHN0aWxsIHdhbnQgdG8gc2hvd1xuICogb3IgaGlkZSBzb21lIGZlYXR1cmVzLlxuICovXG5leHBvcnQgY29uc3QgaXNQcm9kdWN0aW9uQnJhbmNoID0gKG1vZGU6IHN0cmluZykgPT4ge1xuXHRyZXR1cm4gWydtYXN0ZXInLCAnbmV4dCddLmluY2x1ZGVzKGdldEJyYW5jaChtb2RlKSlcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvam9oYW4vUHJvamV0cy9tb24tZW50cmVwcmlzZS9zaXRlL3NjcmlwdHMvcnVuU2NyaXB0T25GaWxlQ2hhbmdlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9qb2hhbi9Qcm9qZXRzL21vbi1lbnRyZXByaXNlL3NpdGUvc2NyaXB0cy9ydW5TY3JpcHRPbkZpbGVDaGFuZ2UvZXhlY09uRmlsZUNoYW5nZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9qb2hhbi9Qcm9qZXRzL21vbi1lbnRyZXByaXNlL3NpdGUvc2NyaXB0cy9ydW5TY3JpcHRPbkZpbGVDaGFuZ2UvZXhlY09uRmlsZUNoYW5nZS50c1wiO2ltcG9ydCB7IGdldFBhY2thZ2VEZXBzIH0gZnJvbSAnQHJ1c2hzdGFjay9wYWNrYWdlLWRlcHMtaGFzaCdcbmltcG9ydCB7IGV4ZWMgYXMgb3JpZ2luYWxFeGVjIH0gZnJvbSAnY2hpbGRfcHJvY2VzcydcbmltcG9ydCB7IGV4aXN0c1N5bmMsIGxzdGF0U3luYywgcmVhZEZpbGVTeW5jLCB3cml0ZUZpbGVTeW5jIH0gZnJvbSAnZnMnXG5pbXBvcnQgeyByZWxhdGl2ZSwgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBwcm9taXNpZnkgfSBmcm9tICd1dGlsJ1xuXG5jb25zdCBleGVjID0gcHJvbWlzaWZ5KG9yaWdpbmFsRXhlYylcblxudHlwZSBEaXJQYXRoID0gc3RyaW5nXG50eXBlIEZpbGVQYXRoID0gc3RyaW5nXG5cbmludGVyZmFjZSBPcHRpb24ge1xuXHRwYXRoczogKERpclBhdGggfCBGaWxlUGF0aClbXVxuXHRydW46IHN0cmluZ1xufVxuXG5pbnRlcmZhY2UgQ29uZmlnIHtcblx0YmFzZVBhdGg6IHN0cmluZ1xuXHRkZXBzUGF0aDogc3RyaW5nXG5cdG9wdGlvbnM6IE9wdGlvbltdXG59XG5cbnR5cGUgRGVwcyA9IFJlY29yZDxzdHJpbmcsIHN0cmluZz5cblxuLyoqXG4gKiBFeGVjdXRlIGEgY29tbWFuZCB3aGVuIGEgZmlsZSBvciBhIGZpbGUgaW4gdGhlIGRpcmVjdG9yeSBjaGFuZ2VzXG4gKi9cbmV4cG9ydCBjb25zdCBleGVjT25GaWxlQ2hhbmdlID0gYXN5bmMgKGNvbmZpZzogQ29uZmlnKSA9PiB7XG5cdGNvbnN0IHBhdGggPSByZXNvbHZlKGNvbmZpZy5iYXNlUGF0aCwgY29uZmlnLmRlcHNQYXRoKVxuXG5cdGNvbnN0IGRlcHM6IERlcHMgPSBPYmplY3QuZnJvbUVudHJpZXMoZ2V0UGFja2FnZURlcHMoY29uZmlnLmJhc2VQYXRoKSlcblx0Y29uc3QgZGVwc0VudHJpZXMgPSBPYmplY3QuZW50cmllcyhkZXBzKVxuXG5cdGNvbnN0IGV4aXN0aW5nRGVwcyA9IGV4aXN0c1N5bmMocGF0aClcblx0XHQ/IChKU09OLnBhcnNlKHJlYWRGaWxlU3luYyhwYXRoLCB7IGVuY29kaW5nOiAndXRmOCcgfSkpIGFzIERlcHMpXG5cdFx0OiB7fVxuXHRjb25zdCBleGlzdGluZ0RlcHNFbnRyaWVzID0gT2JqZWN0LmVudHJpZXMoZXhpc3RpbmdEZXBzKVxuXG5cdGNvbnN0IHByb21pc2VzID0gY29uZmlnLm9wdGlvbnMubWFwKGFzeW5jIChjZmcpID0+IHtcblx0XHRsZXQgZmlsZUNoYW5nZWQ6IG51bGwgfCBzdHJpbmcgPSBudWxsXG5cdFx0Y29uc3QgaW5kZXggPSBjZmcucGF0aHNcblx0XHRcdC5tYXAoKHZhbCkgPT4ge1xuXHRcdFx0XHRjb25zdCBpc0RpciA9IGxzdGF0U3luYyhyZXNvbHZlKGNvbmZpZy5iYXNlUGF0aCwgdmFsKSkuaXNEaXJlY3RvcnkoKVxuXHRcdFx0XHRjb25zdCBpc0ZpbGUgPSBsc3RhdFN5bmMocmVzb2x2ZShjb25maWcuYmFzZVBhdGgsIHZhbCkpLmlzRmlsZSgpXG5cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRpc0Rpcixcblx0XHRcdFx0XHRpc0ZpbGUsXG5cdFx0XHRcdFx0YWJzb2x1dGU6IHJlc29sdmUoY29uZmlnLmJhc2VQYXRoLCB2YWwpLFxuXHRcdFx0XHRcdHJlbGF0aXZlOiByZWxhdGl2ZShcblx0XHRcdFx0XHRcdHJlc29sdmUoY29uZmlnLmJhc2VQYXRoKSxcblx0XHRcdFx0XHRcdHJlc29sdmUoY29uZmlnLmJhc2VQYXRoLCB2YWwpXG5cdFx0XHRcdFx0KSxcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5maW5kSW5kZXgoKHsgYWJzb2x1dGUsIHJlbGF0aXZlLCBpc0ZpbGUsIGlzRGlyIH0pID0+IHtcblx0XHRcdFx0aWYgKGlzRmlsZSkge1xuXHRcdFx0XHRcdGlmIChkZXBzW3JlbGF0aXZlXSAhPT0gZXhpc3RpbmdEZXBzW3JlbGF0aXZlXSkge1xuXHRcdFx0XHRcdFx0ZmlsZUNoYW5nZWQgPSByZWxhdGl2ZVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBkZXBzW3JlbGF0aXZlXSAhPT0gZXhpc3RpbmdEZXBzW3JlbGF0aXZlXVxuXHRcdFx0XHR9IGVsc2UgaWYgKGlzRGlyKSB7XG5cdFx0XHRcdFx0Y29uc3QgaW5kZXggPSBkZXBzRW50cmllcy5maW5kSW5kZXgoXG5cdFx0XHRcdFx0XHQoW2EsIGJdLCBpKSA9PlxuXHRcdFx0XHRcdFx0XHQocmVsYXRpdmUubGVuZ3RoID8gYS5zdGFydHNXaXRoKHJlbGF0aXZlICsgJy8nKSA6IHRydWUpICYmXG5cdFx0XHRcdFx0XHRcdChleGlzdGluZ0RlcHNFbnRyaWVzPy5baV0/LlswXSAhPT0gYSB8fFxuXHRcdFx0XHRcdFx0XHRcdGV4aXN0aW5nRGVwc0VudHJpZXM/LltpXT8uWzFdICE9PSBiKVxuXHRcdFx0XHRcdClcblxuXHRcdFx0XHRcdGlmIChpbmRleCA+IC0xKSB7XG5cdFx0XHRcdFx0XHRmaWxlQ2hhbmdlZCA9IGRlcHNFbnRyaWVzW2luZGV4XVswXVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBpbmRleCA+IC0xXG5cdFx0XHRcdH1cblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdQYXRoIGlzIG5vdCBhIGRpcmVjdG9yeSBvciBhIGZpbGU6ICcgKyBhYnNvbHV0ZSlcblx0XHRcdH0pXG5cblx0XHRpZiAoaW5kZXggPiAtMSkge1xuXHRcdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgZXhlYyhjZmcucnVuKVxuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRwYXRoOiBjZmcucGF0aHNbaW5kZXhdLFxuXHRcdFx0XHRmaWxlQ2hhbmdlZCxcblx0XHRcdFx0cnVuOiBjZmcucnVuLFxuXHRcdFx0XHRyZXN1bHQsXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGxcblx0fSlcblxuXHRjb25zdCByZXMgPSBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcylcblxuXHR3cml0ZUZpbGVTeW5jKHBhdGgsIEpTT04uc3RyaW5naWZ5KGRlcHMsIG51bGwsIDIpKVxuXG5cdHJldHVybiByZXNcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvam9oYW4vUHJvamV0cy9tb24tZW50cmVwcmlzZS9zaXRlL3NjcmlwdHMvcnVuU2NyaXB0T25GaWxlQ2hhbmdlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9qb2hhbi9Qcm9qZXRzL21vbi1lbnRyZXByaXNlL3NpdGUvc2NyaXB0cy9ydW5TY3JpcHRPbkZpbGVDaGFuZ2UvaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvam9oYW4vUHJvamV0cy9tb24tZW50cmVwcmlzZS9zaXRlL3NjcmlwdHMvcnVuU2NyaXB0T25GaWxlQ2hhbmdlL2luZGV4LnRzXCI7aW1wb3J0IHsgZXhlY09uRmlsZUNoYW5nZSB9IGZyb20gJy4vZXhlY09uRmlsZUNoYW5nZS5qcydcblxuZXhwb3J0IGNvbnN0IHJ1blNjcmlwdE9uRmlsZUNoYW5nZSA9IGFzeW5jICgpID0+IHtcblx0Y29uc29sZS5sb2coJ1NlYXJjaCBmb3IgY2hhbmdlZCBmaWxlLi4uJylcblxuXHRjb25zdCByZXN1bHRzID0gYXdhaXQgZXhlY09uRmlsZUNoYW5nZSh7XG5cdFx0YmFzZVBhdGg6ICcuLycsXG5cdFx0ZGVwc1BhdGg6ICcuZGVwcy5qc29uJyxcblx0XHRvcHRpb25zOiBbXG5cdFx0XHR7XG5cdFx0XHRcdHBhdGhzOiBbXG5cdFx0XHRcdFx0Jy4vc291cmNlL3BhZ2VzL1NpbXVsYXRldXJzL0Vjb25vbWllQ29sbGFib3JhdGl2ZS9hY3Rpdml0XHUwMEU5cy55YW1sJyxcblx0XHRcdFx0XHQnLi9zb3VyY2UvcGFnZXMvU2ltdWxhdGV1cnMvRWNvbm9taWVDb2xsYWJvcmF0aXZlL2FjdGl2aXRcdTAwRTlzLmVuLnlhbWwnLFxuXHRcdFx0XHRdLFxuXHRcdFx0XHRydW46ICd5YXJuIGJ1aWxkOnlhbWwtdG8tZHRzJyxcblx0XHRcdH0sXG5cdFx0XSxcblx0fSlcblxuXHRyZXN1bHRzXG5cdFx0LmZpbHRlcig8VD4oeDogbnVsbCB8IFQpOiB4IGlzIFQgPT4gISF4KVxuXHRcdC5mb3JFYWNoKCh7IGZpbGVDaGFuZ2VkLCBydW4sIHJlc3VsdCB9KSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnQ2hhbmdlZCBmaWxlIGRldGVjdGVkOicsIGZpbGVDaGFuZ2VkKVxuXHRcdFx0Y29uc29sZS5sb2coJ0V4ZWN1dGU6JywgcnVuLCAnXFxuJylcblxuXHRcdFx0aWYgKHJlc3VsdC5zdGRvdXQpIHtcblx0XHRcdFx0Y29uc29sZS5sb2cocmVzdWx0LnN0ZG91dClcblx0XHRcdH1cblx0XHRcdGlmIChyZXN1bHQuc3RkZXJyKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IocmVzdWx0LnN0ZGVycilcblx0XHRcdH1cblx0XHR9KVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9qb2hhbi9Qcm9qZXRzL21vbi1lbnRyZXByaXNlL3NpdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2pvaGFuL1Byb2pldHMvbW9uLWVudHJlcHJpc2Uvc2l0ZS92aXRlLXB3YS1vcHRpb25zLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2pvaGFuL1Byb2pldHMvbW9uLWVudHJlcHJpc2Uvc2l0ZS92aXRlLXB3YS1vcHRpb25zLnRzXCI7aW1wb3J0IHsgT3B0aW9ucyB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSdcblxuZXhwb3J0IGNvbnN0IHB3YU9wdGlvbnM6IFBhcnRpYWw8T3B0aW9ucz4gPSB7XG5cdC8vIHNlbGZEZXN0cm95aW5nOiB0cnVlLCAvLyBVbnJlZ2lzdGVyIFBXQVxuXHRyZWdpc3RlclR5cGU6ICdwcm9tcHQnLFxuXHRzdHJhdGVnaWVzOiAnaW5qZWN0TWFuaWZlc3QnLFxuXHRzcmNEaXI6ICdzb3VyY2UnLFxuXHRmaWxlbmFtZTogJ3N3LnRzJyxcblx0aW5qZWN0TWFuaWZlc3Q6IHtcblx0XHRtYXhpbXVtRmlsZVNpemVUb0NhY2hlSW5CeXRlczogMzAwMDAwMCxcblx0XHRtYW5pZmVzdFRyYW5zZm9ybXM6IFtcblx0XHRcdChlbnRyaWVzKSA9PiB7XG5cdFx0XHRcdGNvbnN0IG1hbmlmZXN0ID0gZW50cmllcy5maWx0ZXIoXG5cdFx0XHRcdFx0KGVudHJ5KSA9PlxuXHRcdFx0XHRcdFx0IS9hc3NldHNcXC8uKigtbGVnYWN5fGxhenlfKS8udGVzdChlbnRyeS51cmwpICYmXG5cdFx0XHRcdFx0XHQoZW50cnkudXJsLmVuZHNXaXRoKCcuaHRtbCcpXG5cdFx0XHRcdFx0XHRcdD8gLyhpbmZyYW5jZXxtb24tZW50cmVwcmlzZSlcXC5odG1sLy50ZXN0KGVudHJ5LnVybClcblx0XHRcdFx0XHRcdFx0OiB0cnVlKVxuXHRcdFx0XHQpXG5cblx0XHRcdFx0cmV0dXJuIHsgbWFuaWZlc3QgfVxuXHRcdFx0fSxcblx0XHRdLFxuXHR9LFxuXHRpbmNsdWRlQXNzZXRzOiBbJ2xvZ28tKi5wbmcnXSxcblx0bWFuaWZlc3Q6IHtcblx0XHRzdGFydF91cmw6ICcvJyxcblx0XHRuYW1lOiAnTW9uIGVudHJlcHJpc2UnLFxuXHRcdHNob3J0X25hbWU6ICdNb24gZW50cmVwcmlzZScsXG5cdFx0ZGVzY3JpcHRpb246IFwiTCdhc3Npc3RhbnQgb2ZmaWNpZWwgZHUgY3JcdTAwRTlhdGV1ciBkJ2VudHJlcHJpc2VcIixcblx0XHRsYW5nOiAnZnInLFxuXHRcdG9yaWVudGF0aW9uOiAncG9ydHJhaXQtcHJpbWFyeScsXG5cdFx0ZGlzcGxheTogJ21pbmltYWwtdWknLFxuXHRcdHRoZW1lX2NvbG9yOiAnIzI5NzVkMScsXG5cdFx0YmFja2dyb3VuZF9jb2xvcjogJyNmZmZmZmYnLFxuXHRcdGljb25zOiBbXG5cdFx0XHR7XG5cdFx0XHRcdHNyYzogJy9mYXZpY29uL2FuZHJvaWQtY2hyb21lLTE5MngxOTItc2hhZG93LnBuZz92PTIuMCcsXG5cdFx0XHRcdHNpemVzOiAnMTkyeDE5MicsXG5cdFx0XHRcdHR5cGU6ICdpbWFnZS9wbmcnLFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0c3JjOiAnL2Zhdmljb24vYW5kcm9pZC1jaHJvbWUtNTEyeDUxMi1zaGFkb3cucG5nP3Y9Mi4wJyxcblx0XHRcdFx0c2l6ZXM6ICc1MTJ4NTEyJyxcblx0XHRcdFx0dHlwZTogJ2ltYWdlL3BuZycsXG5cdFx0XHR9LFxuXHRcdF0sXG5cdH0sXG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sVUFBVTtBQUNqQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sUUFBUTtBQUNmLE9BQU8sVUFBVTtBQUNqQixPQUFPLGlCQUFpQjtBQUN4QixTQUFpQixjQUFjLGVBQWU7QUFDOUMsU0FBUyxlQUFlOzs7QUNUbVgsU0FBUyxzQkFBc0I7QUFDMWEsU0FBUyxRQUFRLG9CQUFvQjtBQUNyQyxTQUFTLFlBQVksV0FBVyxjQUFjLHFCQUFxQjtBQUNuRSxTQUFTLFVBQVUsZUFBZTtBQUNsQyxTQUFTLGlCQUFpQjtBQUUxQixJQUFNLE9BQU8sVUFBVSxZQUFZO0FBcUI1QixJQUFNLG1CQUFtQixPQUFPLFdBQW1CO0FBQ3pELFFBQU1BLFFBQU8sUUFBUSxPQUFPLFVBQVUsT0FBTyxRQUFRO0FBRXJELFFBQU0sT0FBYSxPQUFPLFlBQVksZUFBZSxPQUFPLFFBQVEsQ0FBQztBQUNyRSxRQUFNLGNBQWMsT0FBTyxRQUFRLElBQUk7QUFFdkMsUUFBTSxlQUFlLFdBQVdBLEtBQUksSUFDaEMsS0FBSyxNQUFNLGFBQWFBLE9BQU0sRUFBRSxVQUFVLE9BQU8sQ0FBQyxDQUFDLElBQ3BELENBQUM7QUFDSixRQUFNLHNCQUFzQixPQUFPLFFBQVEsWUFBWTtBQUV2RCxRQUFNLFdBQVcsT0FBTyxRQUFRLElBQUksT0FBTyxRQUFRO0FBQ2xELFFBQUksY0FBNkI7QUFDakMsVUFBTSxRQUFRLElBQUksTUFDaEIsSUFBSSxDQUFDLFFBQVE7QUFDYixZQUFNLFFBQVEsVUFBVSxRQUFRLE9BQU8sVUFBVSxHQUFHLENBQUMsRUFBRSxZQUFZO0FBQ25FLFlBQU0sU0FBUyxVQUFVLFFBQVEsT0FBTyxVQUFVLEdBQUcsQ0FBQyxFQUFFLE9BQU87QUFFL0QsYUFBTztBQUFBLFFBQ047QUFBQSxRQUNBO0FBQUEsUUFDQSxVQUFVLFFBQVEsT0FBTyxVQUFVLEdBQUc7QUFBQSxRQUN0QyxVQUFVO0FBQUEsVUFDVCxRQUFRLE9BQU8sUUFBUTtBQUFBLFVBQ3ZCLFFBQVEsT0FBTyxVQUFVLEdBQUc7QUFBQSxRQUM3QjtBQUFBLE1BQ0Q7QUFBQSxJQUNELENBQUMsRUFDQSxVQUFVLENBQUMsRUFBRSxVQUFVLFVBQUFDLFdBQVUsUUFBUSxNQUFNLE1BQU07QUFDckQsVUFBSSxRQUFRO0FBQ1gsWUFBSSxLQUFLQSxlQUFjLGFBQWFBLFlBQVc7QUFDOUMsd0JBQWNBO0FBQUEsUUFDZjtBQUVBLGVBQU8sS0FBS0EsZUFBYyxhQUFhQTtBQUFBLE1BQ3hDLFdBQVcsT0FBTztBQUNqQixjQUFNQyxTQUFRLFlBQVk7QUFBQSxVQUN6QixDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBRztBQWhFbEI7QUFpRVEsb0JBQUFELFVBQVMsU0FBUyxFQUFFLFdBQVdBLFlBQVcsR0FBRyxJQUFJLFlBQ2pELGdFQUFzQixPQUF0QixtQkFBMkIsUUFBTyxPQUNsQyxnRUFBc0IsT0FBdEIsbUJBQTJCLFFBQU87QUFBQTtBQUFBLFFBQ3JDO0FBRUEsWUFBSUMsU0FBUSxJQUFJO0FBQ2Ysd0JBQWMsWUFBWUEsUUFBTztBQUFBLFFBQ2xDO0FBRUEsZUFBT0EsU0FBUTtBQUFBLE1BQ2hCO0FBQ0EsWUFBTSxJQUFJLE1BQU0sd0NBQXdDLFFBQVE7QUFBQSxJQUNqRSxDQUFDO0FBRUYsUUFBSSxRQUFRLElBQUk7QUFDZixZQUFNLFNBQVMsTUFBTSxLQUFLLElBQUksR0FBRztBQUVqQyxhQUFPO0FBQUEsUUFDTixNQUFNLElBQUksTUFBTTtBQUFBLFFBQ2hCO0FBQUEsUUFDQSxLQUFLLElBQUk7QUFBQSxRQUNUO0FBQUEsTUFDRDtBQUFBLElBQ0Q7QUFFQSxXQUFPO0FBQUEsRUFDUixDQUFDO0FBRUQsUUFBTSxNQUFNLE1BQU0sUUFBUSxJQUFJLFFBQVE7QUFFdEMsZ0JBQWNGLE9BQU0sS0FBSyxVQUFVLE1BQU0sTUFBTSxDQUFDLENBQUM7QUFFakQsU0FBTztBQUNSOzs7QUNoR08sSUFBTSx3QkFBd0IsWUFBWTtBQUNoRCxVQUFRLElBQUksNEJBQTRCO0FBRXhDLFFBQU0sVUFBVSxNQUFNLGlCQUFpQjtBQUFBLElBQ3RDLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFNBQVM7QUFBQSxNQUNSO0FBQUEsUUFDQyxPQUFPO0FBQUEsVUFDTjtBQUFBLFVBQ0E7QUFBQSxRQUNEO0FBQUEsUUFDQSxLQUFLO0FBQUEsTUFDTjtBQUFBLElBQ0Q7QUFBQSxFQUNELENBQUM7QUFFRCxVQUNFLE9BQU8sQ0FBSSxNQUF3QixDQUFDLENBQUMsQ0FBQyxFQUN0QyxRQUFRLENBQUMsRUFBRSxhQUFhLEtBQUssT0FBTyxNQUFNO0FBQzFDLFlBQVEsSUFBSSwwQkFBMEIsV0FBVztBQUNqRCxZQUFRLElBQUksWUFBWSxLQUFLLElBQUk7QUFFakMsUUFBSSxPQUFPLFFBQVE7QUFDbEIsY0FBUSxJQUFJLE9BQU8sTUFBTTtBQUFBLElBQzFCO0FBQ0EsUUFBSSxPQUFPLFFBQVE7QUFDbEIsY0FBUSxNQUFNLE9BQU8sTUFBTTtBQUFBLElBQzVCO0FBQUEsRUFDRCxDQUFDO0FBQ0g7OztBQzlCTyxJQUFNLGFBQStCO0FBQUEsRUFFM0MsY0FBYztBQUFBLEVBQ2QsWUFBWTtBQUFBLEVBQ1osUUFBUTtBQUFBLEVBQ1IsVUFBVTtBQUFBLEVBQ1YsZ0JBQWdCO0FBQUEsSUFDZiwrQkFBK0I7QUFBQSxJQUMvQixvQkFBb0I7QUFBQSxNQUNuQixDQUFDLFlBQVk7QUFDWixjQUFNLFdBQVcsUUFBUTtBQUFBLFVBQ3hCLENBQUMsVUFDQSxDQUFDLDRCQUE0QixLQUFLLE1BQU0sR0FBRyxNQUMxQyxNQUFNLElBQUksU0FBUyxPQUFPLElBQ3hCLGtDQUFrQyxLQUFLLE1BQU0sR0FBRyxJQUNoRDtBQUFBLFFBQ0w7QUFFQSxlQUFPLEVBQUUsU0FBUztBQUFBLE1BQ25CO0FBQUEsSUFDRDtBQUFBLEVBQ0Q7QUFBQSxFQUNBLGVBQWUsQ0FBQyxZQUFZO0FBQUEsRUFDNUIsVUFBVTtBQUFBLElBQ1QsV0FBVztBQUFBLElBQ1gsTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLElBQ1osYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLElBQ04sYUFBYTtBQUFBLElBQ2IsU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2Isa0JBQWtCO0FBQUEsSUFDbEIsT0FBTztBQUFBLE1BQ047QUFBQSxRQUNDLEtBQUs7QUFBQSxRQUNMLE9BQU87QUFBQSxRQUNQLE1BQU07QUFBQSxNQUNQO0FBQUEsTUFDQTtBQUFBLFFBQ0MsS0FBSztBQUFBLFFBQ0wsT0FBTztBQUFBLFFBQ1AsTUFBTTtBQUFBLE1BQ1A7QUFBQSxJQUNEO0FBQUEsRUFDRDtBQUNEOzs7QUhoRHNMLElBQU0sMkNBQTJDO0FBY3ZPLElBQU0sTUFBTSxDQUFDLFNBQWlCLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBRTdELElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsU0FBUyxLQUFLLE9BQU87QUFBQSxFQUNuRCxTQUFTO0FBQUEsSUFDUixPQUFPLEVBQUUsS0FBSyxLQUFLLFFBQVEsVUFBVSxFQUFFO0FBQUEsSUFDdkMsWUFBWSxDQUFDLE9BQU8sT0FBTyxRQUFRLFFBQVEsT0FBTztBQUFBLEVBQ25EO0FBQUEsRUFDQSxXQUFXO0FBQUEsRUFDWCxPQUFPO0FBQUEsSUFDTixXQUFXO0FBQUEsSUFDWCxlQUFlO0FBQUEsTUFDZCxRQUFRO0FBQUEsUUFDUCxnQkFBZ0IsQ0FBQyxjQUFjO0FBQzlCLGNBQUksVUFBVSxnQkFBZ0I7QUFDN0IsbUJBQU87QUFBQSxVQUNSO0FBRUEsaUJBQU87QUFBQSxRQUNSO0FBQUEsTUFDRDtBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDUCxhQUFhLEtBQUssVUFBVSxVQUFVLElBQUksQ0FBQztBQUFBLElBQzNDLGdCQUFnQixTQUFTO0FBQUEsSUFDekIsWUFBWSxTQUFTLGdCQUFnQixDQUFDLG1CQUFtQixJQUFJO0FBQUEsSUFDN0QsZUFBZSxTQUFTLGdCQUFnQixtQkFBbUIsSUFBSTtBQUFBLEVBQ2hFO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUjtBQUFBLE1BQ0MsTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBLE1BQ1AsYUFBYTtBQUNaLFlBQUksU0FBUyxlQUFlO0FBQzNCLGVBQUssc0JBQXNCO0FBQUEsUUFDNUI7QUFBQSxNQUNEO0FBQUEsSUFDRDtBQUFBLElBQ0EsWUFBWSxXQUNYLFFBQVE7QUFBQSxNQUNQLGtCQUFrQjtBQUFBLE1BQ2xCLG1CQUFtQjtBQUFBLElBQ3BCLENBQUM7QUFBQSxJQUNGLE1BQU07QUFBQSxNQUNMLE9BQU87QUFBQSxRQUNOLFNBQVMsQ0FBQyxDQUFDLGtDQUFrQyxFQUFFLE1BQU0sS0FBSyxDQUFDLENBQUM7QUFBQSxNQUM3RDtBQUFBLElBQ0QsQ0FBQztBQUFBLElBQ0QsS0FBSztBQUFBLElBQ0wsWUFBWTtBQUFBLE1BQ1gsYUFBYTtBQUFBLE1BQ2IsY0FBYztBQUFBLE1BQ2QsT0FBTztBQUFBLFFBQ04sa0JBQWtCO0FBQUEsVUFDakIsTUFBTTtBQUFBLFVBQ04sT0FBTztBQUFBLFVBQ1AsT0FDQztBQUFBLFVBQ0QsYUFDQztBQUFBLFVBQ0QsWUFBWTtBQUFBLFVBQ1osZUFBZTtBQUFBLFFBQ2hCO0FBQUEsUUFDQSxVQUFVO0FBQUEsVUFDVCxNQUFNO0FBQUEsVUFDTixPQUFPO0FBQUEsVUFDUCxPQUNDO0FBQUEsVUFDRCxhQUNDO0FBQUEsVUFDRCxZQUFZO0FBQUEsVUFDWixlQUFlO0FBQUEsUUFDaEI7QUFBQSxNQUNEO0FBQUEsSUFDRCxDQUFDO0FBQUEsSUFDRCxRQUFRLFVBQVU7QUFBQSxJQUNsQixPQUFPO0FBQUEsTUFDTixTQUFTLENBQUMsWUFBWSxXQUFXO0FBQUEsSUFDbEMsQ0FBQztBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLEtBQUs7QUFBQSxNQUNKLFlBQ0MsT0FBTyxJQUFJLElBQUksRUFBRSxvQkFBb0IsY0FDbEMsU0FBUyxJQUFJLElBQUksRUFBRSxlQUFlLElBQ2xDO0FBQUEsSUFDTDtBQUFBLElBSUEsT0FBTztBQUFBLE1BQ04sU0FBUztBQUFBLFFBQ1I7QUFBQSxRQUNBO0FBQUEsTUFDRDtBQUFBLElBQ0Q7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLFlBQVk7QUFBQSxRQUNYLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQ0csVUFBU0EsTUFBSyxRQUFRLGNBQWMsRUFBRTtBQUFBLFFBQ2hELFNBQVMsSUFBSTtBQUFBLE1BQ2Q7QUFBQSxJQUNEO0FBQUEsRUFDRDtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ2IsU0FBUyxDQUFDLHlCQUF5Qix1QkFBdUI7QUFBQSxJQUMxRCxTQUFTLENBQUMsb0JBQW9CLFlBQVk7QUFBQSxJQUUxQyxTQUFTLENBQUMsb0JBQW9CLHNCQUFzQjtBQUFBLEVBQ3JEO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFTSixZQUFZO0FBQUEsTUFDWDtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBQ0QsRUFBRTtBQVlGLFNBQVMsWUFBWSxTQUFxQztBQUN6RCxRQUFNLGVBQWUsT0FBTyxhQUFxQjtBQUNoRCxVQUFNLFdBQVcsUUFBUSxNQUFNO0FBQy9CLFVBQU0sV0FBVyxNQUFNLEdBQUcsU0FBUyxRQUFRLGNBQWMsT0FBTztBQUNoRSxVQUFNLGlCQUFpQixTQUNyQixTQUFTLEVBQ1QsUUFBUSxpQkFBaUIsQ0FBQyxRQUFRLE9BQU8sU0FBVSxHQUFjLEtBQUssRUFBRTtBQUUxRSxXQUFPO0FBQUEsRUFDUjtBQUVBLFNBQU87QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFNBQVM7QUFBQSxJQUVULGdCQUFnQixNQUFNO0FBR3JCLFdBQUssWUFBWTtBQUFBLFFBQ2hCO0FBQUEsUUFDQSxZQUFZLElBQUksSUFBSSxVQUFVLHdDQUFlLEVBQUUsVUFBVTtBQUFBLFVBQ3hELE9BQU87QUFBQSxRQUNSLENBQUM7QUFBQSxNQUNGO0FBRUEsV0FBSyxZQUFZLElBQUksT0FBTyxLQUFLLEtBQUssU0FBUztBQXBMbEQ7QUFxTEksY0FBTSxPQUFNLFNBQUksZ0JBQUosbUJBQWlCLFFBQVEsVUFBVTtBQUUvQyxjQUFNLGdCQUFnQiwyQkFBSyxNQUFNLEdBQUcsTUFBTSxLQUFLO0FBRS9DLFlBQUksT0FBTyxpQkFBaUIsS0FBSyxHQUFHLEdBQUc7QUFDdEMsaUJBQU8sS0FBSztBQUFBLFFBQ2I7QUFFQSxZQUFJLE9BQU8sQ0FBQyxLQUFLLGFBQWEsRUFBRSxTQUFTLEdBQUcsR0FBRztBQUM5QyxjQUFJLFVBQVUsS0FBSyxFQUFFLFVBQVUsTUFBTSxRQUFRLFlBQVksQ0FBQyxFQUFFLElBQUk7QUFBQSxRQUNqRSxXQUdDLGlCQUNBLE9BQ0EsT0FBTyxLQUFLLFFBQVEsS0FBSyxFQUN2QixJQUFJLENBQUMsU0FBUyxJQUFJLFdBQVcsRUFDN0IsU0FBUyxHQUFHLEdBQ2I7QUFDRCxnQkFBTSxXQUFXLGNBQWMsUUFBUSxTQUFTLEVBQUU7QUFDbEQsZ0JBQU0sVUFBVSxNQUFNLEtBQUs7QUFBQSxZQUMxQixNQUFNO0FBQUEsWUFDTixNQUFNLGFBQWEsUUFBUTtBQUFBLFVBQzVCO0FBQ0EsY0FBSSxJQUFJLE9BQU87QUFBQSxRQUNoQixXQUNDLGlCQUNBLE9BQU8sS0FBSyxRQUFRLEtBQUssRUFBRSxLQUFLLENBQUMsU0FBUyxrQkFBa0IsSUFBSSxHQUMvRDtBQUNELGdCQUFNLFdBQVc7QUFDakIsZ0JBQU0sVUFBVSxNQUFNLEtBQUs7QUFBQSxZQUMxQjtBQUFBLFlBQ0EsTUFBTSxhQUFhLFFBQVE7QUFBQSxVQUM1QjtBQUNBLGNBQUksSUFBSSxPQUFPO0FBQUEsUUFDaEIsT0FBTztBQUNOLGVBQUs7QUFBQSxRQUNOO0FBQUEsTUFDRCxDQUFDO0FBQUEsSUFDRjtBQUFBLElBRUEsT0FBTyxRQUFRLEVBQUUsUUFBUSxHQUFHO0FBOU45QjtBQStORyxVQUFJLFlBQVksV0FBVyxHQUFDLFlBQU8sVUFBUCxtQkFBYyxNQUFLO0FBQzlDLGVBQU8sUUFBUTtBQUFBLFVBQ2QsR0FBRyxPQUFPO0FBQUEsVUFDVixlQUFlO0FBQUEsWUFDZCxJQUFHLFlBQU8sVUFBUCxtQkFBYztBQUFBLFlBQ2pCLE9BQU8sT0FBTztBQUFBLGNBQ2IsT0FBTyxLQUFLLFFBQVEsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTO0FBQUEsZ0JBQ3hDO0FBQUEsZ0JBQ0EsV0FBVztBQUFBLGNBQ1osQ0FBQztBQUFBLFlBQ0Y7QUFBQSxVQUNEO0FBQUEsUUFDRDtBQUFBLE1BQ0Q7QUFBQSxJQUNEO0FBQUEsSUFFQSxVQUFVLElBQUk7QUFDYixZQUFNLFdBQVcsR0FBRyxNQUFNLEdBQUcsRUFBRSxNQUFNLEVBQUUsRUFBRTtBQUN6QyxVQUFJLHFDQUFVLFdBQVcsYUFBYTtBQUNyQyxlQUFPLFNBQVMsUUFBUSxZQUFZLEVBQUU7QUFBQSxNQUN2QztBQUVBLGFBQU87QUFBQSxJQUNSO0FBQUEsSUFFQSxNQUFNLEtBQUssSUFBSTtBQUNkLFVBQ0MsT0FBTyxLQUFLLFFBQVEsS0FBSyxFQUFFLEtBQUssQ0FBQyxTQUFTLEdBQUcsU0FBUyxPQUFPLE9BQU8sQ0FBQyxHQUNwRTtBQUNELGVBQU8sTUFBTSxhQUFhLEdBQUcsUUFBUSxXQUFXLEVBQUUsQ0FBQztBQUFBLE1BQ3BEO0FBQUEsSUFDRDtBQUFBLEVBQ0Q7QUFDRDtBQUtPLElBQU0sWUFBWSxDQUFDLFNBQWlCO0FBclEzQztBQXNRQyxNQUFJLFVBQTZCLHFCQUFJLElBQUksRUFDdkMsb0JBRCtCLG1CQUNkLE1BQU0sU0FEUSxtQkFFOUIsTUFBTSxRQUZ3QixtQkFFbEI7QUFFZixNQUFJLFdBQVcsU0FBUztBQUN2QixhQUFTLElBQUksSUFBSSxFQUFFO0FBQUEsRUFDcEI7QUFFQSxTQUFPLFVBQVU7QUFDbEI7QUFVTyxJQUFNLHFCQUFxQixDQUFDLFNBQWlCO0FBQ25ELFNBQU8sQ0FBQyxVQUFVLE1BQU0sRUFBRSxTQUFTLFVBQVUsSUFBSSxDQUFDO0FBQ25EOyIsCiAgIm5hbWVzIjogWyJwYXRoIiwgInJlbGF0aXZlIiwgImluZGV4IiwgInBhdGgiXQp9Cg==
