import nodeResolve from "rollup-plugin-node-resolve";
import copy from "rollup-plugin-copy";
import {uglify} from "rollup-plugin-uglify";
import replace from "rollup-plugin-replace";

const version = require("./package.json").version;
const inputName = "./out/lib/src/DynamicProto";
const outputName = "dynamicproto-js";
const banner = [
  "/*!",
  ` * Microsoft Dynamic Proto Utility, ${version}`,
  " * Copyright (c) Microsoft and contributors. All rights reserved.",
  " */"
].join("\n");

const nodeUmdRollupConfigFactory = (isProduction) => {
  const nodeRollupConfig = {
    input: `${inputName}.js`,
    output: {
      file: `./dist/node/${outputName}.js`,
      banner: banner,
      format: "umd",
      name: "Microsoft.DynamicProto-JS",
      sourcemap: true
    },
    plugins: [
      replace({
        delimiters: ["", ""],
        values: {
          "// Copyright (c) Microsoft Corporation. All rights reserved.": "",
          "// Licensed under the MIT License.": ""
        }
      }),
      nodeResolve()
    ]
  };

  if (isProduction) {
    nodeRollupConfig.output.file = `./dist/node/${outputName}.min.js`;
    nodeRollupConfig.plugins.push(
      uglify({
        ie8: true,
        toplevel: true,
        compress: {
          passes:3,
          unsafe: true
        },
        output: {
          preamble: banner,
          webkit:true
        }
      })
    );

    nodeRollupConfig.plugins.push(
      copy({
        targets: [
          { src: `${inputName}.d.ts`, dest: "./types/", rename: `${outputName}.d.ts` }
        ]
      })
    );
  }

  return nodeRollupConfig;
}

const moduleRollupConfigFactory = (format, isProduction) => {
  const moduleRollupConfig = {
    input: `${inputName}.js`,
    output: {
      file: `./dist/${format}/${outputName}.js`,
      banner: banner,
      format: format,
      name: "Microsoft.DynamicProto-JS",
      sourcemap: true
    },
    plugins: [
      replace({
        delimiters: ["", ""],
        values: {
          "// Copyright (c) Microsoft Corporation. All rights reserved.": "",
          "// Licensed under the MIT License.": ""
        }
      })
    ]
  };

  if (isProduction) {
    moduleRollupConfig.output.file = `./dist/${format}/${outputName}.min.js`;
    moduleRollupConfig.plugins.push(
      uglify({
        ie8: true,
        toplevel: true,
        compress: {
          passes:3,
          unsafe: true
        },
        output: {
          preamble: banner,
          webkit:true
        }
      })
    );
  }

  return moduleRollupConfig;
};

export default [
  nodeUmdRollupConfigFactory(true),
  nodeUmdRollupConfigFactory(false),
  moduleRollupConfigFactory('esm', true),
  moduleRollupConfigFactory('esm', false),
  moduleRollupConfigFactory('amd', true),
  moduleRollupConfigFactory('amd', false),
  moduleRollupConfigFactory('cjs', true),
  moduleRollupConfigFactory('cjs', false),
  moduleRollupConfigFactory('iife', true),
  moduleRollupConfigFactory('iife', false),
  moduleRollupConfigFactory('umd', true),
  moduleRollupConfigFactory('umd', false),
  moduleRollupConfigFactory('system', true),
  moduleRollupConfigFactory('system', false)
];
