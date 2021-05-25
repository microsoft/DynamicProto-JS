import nodeResolve from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";
import replace from "@rollup/plugin-replace";

const version = require("./package.json").version;
const inputName = "./out/rollup/src/removeDynamic";
const outputName = "removedynamic";
const distPath = "../tools/rollup/";
const banner = [
  "/*!",
  ` * Microsoft Dynamic Proto Rollup Utility, ${version}`,
  " * Copyright (c) Microsoft and contributors. All rights reserved.",
  " */"
].join("\n");

const nodeUmdRollupConfigFactory = (isProduction) => {
  const nodeRollupConfig = {
    input: `${inputName}.js`,
    output: {
      file: `${distPath}node/${outputName}.js`,
      banner: banner,
      format: "umd",
        name: "Microsoft.DynamicProto-Rollup",
      extend: true,
      sourcemap: false
    },
    plugins: [
      replace({
        delimiters: ["", ""],
        values: {
          "// Copyright (c) Microsoft Corporation. All rights reserved.": "",
          "// Licensed under the MIT License.": ""
        },
        preventAssignment: true
      }),
      nodeResolve()
    ]
  };

  if (isProduction) {
    nodeRollupConfig.plugins.push(
      copy({
        targets: [
          { src: `${inputName}.d.ts`, dest: `${distPath}types/`, rename: `${outputName}.d.ts` }
        ]
      })
    );
  }

  return nodeRollupConfig;
};

const moduleRollupConfigFactory = (format, isProduction) => {
  const moduleRollupConfig = {
    input: `${inputName}.js`,
    output: {
      file: `${distPath}${format}/${outputName}.js`,
      banner: banner,
      format: format,
        name: "Microsoft.DynamicProto-JS",
      extend: true,
      sourcemap: false
    },
    plugins: [
      replace({
        delimiters: ["", ""],
        values: {
          "// Copyright (c) Microsoft Corporation. All rights reserved.": "",
          "// Licensed under the MIT License.": ""
        },
        preventAssignment: true
      }),
      nodeResolve()
    ]
  };

  return moduleRollupConfig;
};

export default [
  nodeUmdRollupConfigFactory(true),
  nodeUmdRollupConfigFactory(false),
  moduleRollupConfigFactory('esm', true),
  moduleRollupConfigFactory('esm', false)
];
