import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import vitePluginImp from "vite-plugin-imp";
import path from "path";
import fs from "fs";
// @ts-ignore
// * No declaration file for less-vars-to-js
import lessToJS from "less-vars-to-js";

const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, "./config/variables.less"), "utf8")
);

export default defineConfig({

  base:'/uitestweb/',
 
  plugins: [
    reactRefresh(),
  
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: themeVariables,
      },
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  server:{
    proxy:{
      '/api': {
        target: 'http://talos30364-prelb.o2athena.svc.ht1.n.jd.local/api',
        //target: 'http://localhost:3001/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      
    }
  }
});
