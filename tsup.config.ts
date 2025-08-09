import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true, // generate .d.ts files
    clean: true,
    sourcemap: true,
    minify: false,
    target: "es2020"
});
