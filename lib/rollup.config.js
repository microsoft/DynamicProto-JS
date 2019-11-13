import nodeResolve from "rollup-plugin-node-resolve";
import copy from "rollup-plugin-copy";
import {uglify} from "rollup-plugin-uglify";
import replace from "rollup-plugin-replace";

const version = require("./package.json").version;
const inputName = "dynamicproto-js";
const outputName = "dynamicproto-js";
const banner = [
  "/*!",
  ` * Microsoft Dynamic Proto Utility, ${version}`,
  " * Copyright (c) Microsoft and contributors. All rights reserved.",
  " */"
].join("\n");

const bundleRollupConfigFactory = isProduction => {
  const bundleRollupConfig = {
    input: `./dist-esm/${inputName}.js`,
    output: {
      file: `./bundle/${outputName}.js`,
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
      nodeResolve({
        module: true,
        browser: true,
        preferBuiltins: false
      })
    ]
  };

  if (isProduction) {
    bundleRollupConfig.output.file = `./bundle/${outputName}.min.js`;
    bundleRollupConfig.plugins.push(
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

  return bundleRollupConfig;
};

const nodeUmdRollupConfigFactory = (isProduction) => {
  const nodeRollupConfig = {
    input: `./dist-esm/${inputName}.js`,
    output: {
      file: `./dist/${outputName}.js`,
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
    nodeRollupConfig.output.file = `./dist/${outputName}.min.js`;
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
          { src: `./dist-esm/${inputName}.d.ts`, dest: "./types/", rename: `${outputName}.d.ts` }
        ]
      })
    );
  }

  return nodeRollupConfig;
}

export default [
  nodeUmdRollupConfigFactory(true),
  nodeUmdRollupConfigFactory(false),
  bundleRollupConfigFactory(true),
  bundleRollupConfigFactory(false)
];
