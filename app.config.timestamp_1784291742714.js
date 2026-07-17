// app.config.ts
import { defineConfig } from "@tanstack/react-start/config";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vinxi/lib/paths";
var app_config_default = defineConfig({
  vite: {
    plugins: [tsConfigPaths(), tailwindcss()]
  }
});
export {
  app_config_default as default
};
