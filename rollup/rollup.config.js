import nodeResolve from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";
import replace from "@rollup/plugin-replace";
import cleanup from "rollup-plugin-cleanup";

const version = require("./package.json").version;
const inputName = "../lib/tools/rollup/dist-es5/removeDynamic";
const outputName = "removedynamic";
const distPath = "../lib/tools/rollup/dist/";
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
      sourcemap: false,
      exports: "auto"
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
      nodeResolve(),
      cleanup()
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
      sourcemap: false,
      exports: "auto"
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
      nodeResolve(),
      cleanup()
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
