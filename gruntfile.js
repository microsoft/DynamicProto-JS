module.exports = function (grunt) {
    grunt.initConfig({
        "eslint-ts": {
            default: {
                options: {
                    tsconfig: './lib/tsconfig.json'
                }
            },
            dynamicproto: {
                options: {
                    tsconfig: './lib/tsconfig.json'
                }
            },
            "dynamicproto-fix": {
                options: {
                    tsconfig: './lib/tsconfig.json',
                    fix: true
                }
            }
        },
        ts: {
            options: {
                comments: true
            },
            default: {
                tsconfig: './lib/tsconfig.json'
            },
            dynamicproto: {
                tsconfig: './lib/tsconfig.json'
            },
            dynamicprototest: {
                tsconfig: './lib/test/tsconfig.json',
                src: [
                    './lib/test/Selenium/DynamicProtoTests.ts'
                ],
                out: 'lib/test/Selenium/dynamicprototests.js'
            },
            rollup: {
                tsconfig: './rollup/tsconfig.json'
            },
            rolluptest: {
                tsconfig: './rollup/test/tsconfig.json',
                src: [
                    './rollup/test/Selenium/DynamicProtoRollupTests.ts'
                ],
                out: 'rollup/test/Selenium/dynamicprotorolluptests.js'
            }
        },
        qunit: {
            dynamicproto: {
                options: {
                    urls: [
                        './lib/test/Selenium/Tests.html'
                    ],
                    timeout: 300 * 1000, // 5 min
                    console: true,
                    summaryOnly: false,
                    httpBase: ".",
                    puppeteer: {
                        headless: true,
                        timeout: 30000,
                        ignoreHTTPErrors: true,
                        args: [
                            "--enable-precise-memory-info",
                            "--expose-internals-for-testing",
                            "--no-sandbox"
                        ]
                    }
                }
            },
            rollup: {
                options: {
                    urls: [
                        './rollup/test/Selenium/Tests.html'
                    ],
                    timeout: 300 * 1000, // 5 min
                    console: true,
                    summaryOnly: false,
                    httpBase: ".",
                    puppeteer: {
                        headless: true,
                        timeout: 30000,
                        ignoreHTTPErrors: true,
                        args: [
                            "--enable-precise-memory-info",
                            "--expose-internals-for-testing",
                            "--no-sandbox"
                        ]
                    }
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 9005,
                     base: '.',
                     debug: true
                }
            }        
        }
    });

    grunt.event.on('qunit.testStart', function (name) {
        grunt.log.ok('Running test: ' + name);
    });

    grunt.loadNpmTasks("@nevware21/grunt-ts-plugin");
    grunt.loadNpmTasks("@nevware21/grunt-eslint-ts");
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-run');
    grunt.registerTask("default", ["ts:rollup", "ts:rolluptest", "ts:dynamicproto", "ts:dynamicprototest", "qunit:rollup", "qunit:dynamicproto"]);
    grunt.registerTask("dynamicproto", ["eslint-ts:dynamicproto-fix", "ts:dynamicproto"]);
    grunt.registerTask("dynamicprototest", ["ts:dynamicproto", "ts:dynamicprototest", "qunit:dynamicproto"]);
    grunt.registerTask("rollup", ["ts:rollup", "ts:rolluptest", "qunit:rollup"]);
    grunt.registerTask("lint", ["eslint-ts:dynamicproto"]);
    grunt.registerTask("lint-fix", ["eslint-ts:dynamicproto-fix"]);
    grunt.registerTask("serve", ["connect:server:keepalive"]);
};
