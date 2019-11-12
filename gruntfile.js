module.exports = function (grunt) {
    grunt.initConfig({
        tslint: {
            options: {
                rulesDirectory: 'node_modules/tslint-microsoft-contrib',
            },
            files: {
                src: [
                    './lib/src/**/*.ts',
                    '!./**/node_modules/**',
                    '!./**/Tests/**',
                    '!./**/dist-esm/**',
                    '!./**/Generated/**'
                ],
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
            }
        },
        qunit: {
            dynamicproto: {
                options: {
                    urls: [
                        './lib/test/Selenium/Tests.html'
                    ],
                    timeout: 300 * 1000, // 5 min
                    console: false,
                    summaryOnly: true,
                    '--web-security': 'false' // we need this to allow CORS requests in PhantomJS
                }
            }
        }
    });

    grunt.event.on('qunit.testStart', function (name) {
        grunt.log.ok('Running test: ' + name);
    });

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-tslint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-run');
    grunt.registerTask("default", ["ts:dynamicproto", "ts:dynamicprototest", "qunit:dynamicproto"])
    grunt.registerTask("dynamicproto", ["ts:dynamicproto"]);
    grunt.registerTask("dynamicprototest", ["ts:dynamicproto", "ts:dynamicprototest", "qunit:dynamicproto"]);
};
