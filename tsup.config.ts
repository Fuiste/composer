import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true, // Generate .d.ts files
  sourcemap: true,
  clean: true,
});