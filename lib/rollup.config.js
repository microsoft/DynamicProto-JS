import nodeResolve from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";
import replace from "@rollup/plugin-replace";
import minify from 'rollup-plugin-minify-es';
import dynamicRemove from "../tools/rollup/esm/removedynamic";
import { es3Check, es3Poly } from "@microsoft/applicationinsights-rollup-es3";

const UglifyJs = require('uglify-js');

const version = require("./package.json").version;
const inputName = "./out/lib/src/DynamicProto";
const outputName = "dynamicproto-js";
const banner = [
  "/*!",
  ` * Microsoft Dynamic Proto Utility, ${version}`,
  " * Copyright (c) Microsoft and contributors. All rights reserved.",
  " */"
].join("\n");

function isSourceMapEnabled(options) {
    if (options) {
        return options.sourceMap !== false && options.sourcemap !== false;
    }

    return false;
} 

function _doMinify(code, filename, options, chunkOptions) {
    var theCode = {};
    theCode[filename] = code;

    let theOptions = Object.assign({}, options);
    if (theOptions.hasOwnProperty("sourcemap")) {
        delete theOptions.sourcemap;
    }

    if (isSourceMapEnabled(options)) {
        theOptions.sourceMap = {
            filename: filename
        }
        if (filename) {
            theOptions.sourceMap.url = filename + ".map";
        }
    }

    var result = UglifyJs.minify(theCode, theOptions);

    if (result.error) {
        throw new Error(JSON.stringify(result.error));
    }

    var transform = {
        code: result.code
    };

    if (isSourceMapEnabled(options) && result.map) {
        transform.map = result.map;
    }

    return transform;
}

export function uglify(options = {}) {

    return {
        name: 'ms-rollup-uglify-js',
        renderChunk(code, chunk, chkOpt) {
            return _doMinify(code, chunk.filename, options, chkOpt);
        }
    }
}


const nodeUmdRollupConfigFactory = (isProduction) => {
  const nodeRollupConfig = {
    input: `${inputName}.js`,
    output: {
      file: `./dist/node/${outputName}.js`,
      banner: banner,
      format: "umd",
        name: "Microsoft.DynamicProto-JS",
      extend: true,
      sourcemap: true
    },
    plugins: [
      dynamicRemove(),
      replace({
        delimiters: ["", ""],
        values: {
          "// Copyright (c) Microsoft Corporation. All rights reserved.": "",
          "// Licensed under the MIT License.": ""
        },
        preventAssignment: true
      }),
      nodeResolve(),
      es3Poly(),
      es3Check()
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
      extend: true,
      sourcemap: true
    },
    plugins: [
      dynamicRemove(),
      replace({
        delimiters: ["", ""],
        values: {
          "// Copyright (c) Microsoft Corporation. All rights reserved.": "",
          "// Licensed under the MIT License.": ""
        },
        preventAssignment: true
      }),
      nodeResolve(),
      es3Poly(),
      es3Check()
    ]
  };

  if (isProduction) {
    moduleRollupConfig.output.file = `./dist/${format}/${outputName}.min.js`;
    if (format != "esm") {
      moduleRollupConfig.plugins.push(
        uglify({
          ie8: true,
          toplevel: true,
          compress: {
            passes:3,
            unsafe: true,
          },
          output: {
            preamble: banner,
            webkit:true
          }
        })
      );
    } else {
      moduleRollupConfig.plugins.push(
        minify({
          ie8: true,
          toplevel: true,
          compress: {
            passes:3,
            unsafe: true,
          },
          output: {
            preamble: banner,
            webkit:true
          }
        })
      );
    }
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
