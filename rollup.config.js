const ts = require("rollup-plugin-ts");
const terser = require("@rollup/plugin-terser");

const pkg = require("./package.json");
const config = require("./tsconfig.json");

module.exports = {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "umd",
      name: "wtfJson",
      sourcemap: true,
    },
  ],
  plugins: [ts(config), terser()],
};
