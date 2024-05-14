import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./extract-gpx-data-delf01.ts"],
  format: ["cjs", "esm"], // Build for commonJS and ESmodules
  dts: true, // Generate declaration file (.d.ts)
  splitting: false,
  sourcemap: true,
  clean: true,
});