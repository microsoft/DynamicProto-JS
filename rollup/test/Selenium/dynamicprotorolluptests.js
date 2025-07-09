"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/// <reference path="../External/qunit.d.ts" />
/**
 * Wrapper around QUnit asserts. This class has two purposes:
 * - Make Assertion methods easy to discover.
 * - Make them consistent with XUnit assertions in the order of the actual and expected parameter values.
 */
var Assert = /** @class */ (function () {
    function Assert() {
    }
    /**
     * A deep recursive comparison assertion, working on primitive types, arrays, objects,
     * regular expressions, dates and functions.
     *
     * The deepEqual() assertion can be used just like equal() when comparing the value of
     * objects, such that { key: value } is equal to { key: value }. For non-scalar values,
     * identity will be disregarded by deepEqual.
     *
     * @param expected Known comparison value
     * @param actual Object or Expression being tested
     * @param message A short description of the assertion
     */
    Assert.deepEqual = function (expected, actual, message) {
        return deepEqual(actual, expected, message);
    };
    /**
     * A non-strict comparison assertion, roughly equivalent to JUnit assertEquals.
     *
     * The equal assertion uses the simple comparison operator (==) to compare the actual
     * and expected arguments. When they are equal, the assertion passes: any; otherwise, it fails.
     * When it fails, both actual and expected values are displayed in the test result,
     * in addition to a given message.
     *
     * @param expected Known comparison value
     * @param actual Expression being tested
     * @param message A short description of the assertion
     */
    Assert.equal = function (expected, actual, message) {
        return equal(actual, expected, message);
    };
    /**
     * An inverted deep recursive comparison assertion, working on primitive types,
     * arrays, objects, regular expressions, dates and functions.
     *
     * The notDeepEqual() assertion can be used just like equal() when comparing the
     * value of objects, such that { key: value } is equal to { key: value }. For non-scalar
     * values, identity will be disregarded by notDeepEqual.
     *
     * @param expected Known comparison value
     * @param actual Object or Expression being tested
     * @param message A short description of the assertion
     */
    Assert.notDeepEqual = function (expected, actual, message) {
        return notDeepEqual(actual, expected, message);
    };
    /**
     * A non-strict comparison assertion, checking for inequality.
     *
     * The notEqual assertion uses the simple inverted comparison operator (!=) to compare
     * the actual and expected arguments. When they aren't equal, the assertion passes: any;
     * otherwise, it fails. When it fails, both actual and expected values are displayed
     * in the test result, in addition to a given message.
     *
     * @param expected Known comparison value
     * @param actual Expression being tested
     * @param message A short description of the assertion
     */
    Assert.notEqual = function (expected, actual, message) {
        return notEqual(actual, expected, message);
    };
    Assert.notPropEqual = function (expected, actual, message) {
        return notPropEqual(actual, expected, message);
    };
    Assert.propEqual = function (expected, actual, message) {
        return propEqual(actual, expected, message);
    };
    /**
     * A non-strict comparison assertion, checking for inequality.
     *
     * The notStrictEqual assertion uses the strict inverted comparison operator (!==)
     * to compare the actual and expected arguments. When they aren't equal, the assertion
     * passes: any; otherwise, it fails. When it fails, both actual and expected values are
     * displayed in the test result, in addition to a given message.
     *
     * @param expected Known comparison value
     * @param actual Expression being tested
     * @param message A short description of the assertion
     */
    Assert.notStrictEqual = function (expected, actual, message) {
        return notStrictEqual(actual, expected, message);
    };
    /**
     * A boolean assertion, equivalent to CommonJS's assert.ok() and JUnit's assertTrue().
     * Passes if the first argument is truthy.
     *
     * The most basic assertion in QUnit, ok() requires just one argument. If the argument
     * evaluates to true, the assertion passes; otherwise, it fails. If a second message
     * argument is provided, it will be displayed in place of the result.
     *
     * @param state Expression being tested
     * @param message A short description of the assertion
     */
    Assert.ok = function (state, message) {
        return ok(state, message);
    };
    /**
     * A strict type and value comparison assertion.
     *
     * The strictEqual() assertion provides the most rigid comparison of type and value with
     * the strict equality operator (===)
     *
     * @param expected Known comparison value
     * @param actual Expression being tested
     * @param message A short description of the assertion
     */
    Assert.strictEqual = function (expected, actual, message) {
        return strictEqual(actual, expected, message);
    };
    Assert.throws = function (block, expected, message) {
        return throws(block, expected, message);
    };
    return Assert;
}());
/** Defines a test case */
var TestCase = /** @class */ (function () {
    function TestCase() {
    }
    return TestCase;
}());
/// <reference path="../External/sinon.d.ts" />
/// <reference path="../External/qunit.d.ts" />
/// <reference path="Assert.ts" />
/// <reference path="./TestCase.ts"/>
var TestClass = /** @class */ (function () {
    function TestClass(name) {
        /** Turns on/off sinon's syncronous implementation of setTimeout. On by default. */
        this.useFakeTimers = true;
        /** Turns on/off sinon's fake implementation of XMLHttpRequest. On by default. */
        this.useFakeServer = true;
        QUnit.module(name);
    }
    /** Method called before the start of each test method */
    TestClass.prototype.testInitialize = function () {
    };
    /** Method called after each test method has completed */
    TestClass.prototype.testCleanup = function () {
    };
    /** Method in which test class intances should call this.testCase(...) to register each of this suite's tests. */
    TestClass.prototype.registerTests = function () {
    };
    /** Register an async Javascript unit testcase. */
    TestClass.prototype.testCaseAsync = function (testInfo) {
        var _this = this;
        if (!testInfo.name) {
            throw new Error("Must specify name in testInfo context in registerTestcase call");
        }
        if (isNaN(testInfo.stepDelay)) {
            throw new Error("Must specify 'stepDelay' period between pre and post");
        }
        if (!testInfo.steps) {
            throw new Error("Must specify 'steps' to take asynchronously");
        }
        // Create a wrapper around the test method so we can do test initilization and cleanup.
        var testMethod = function (assert) {
            var done = assert.async();
            // Save off the instance of the currently running suite.
            TestClass.currentTestClass = _this;
            // Run the test.
            try {
                _this._testStarting();
                var steps_1 = testInfo.steps;
                var trigger_1 = function () {
                    if (steps_1.length) {
                        var step = steps_1.shift();
                        // The callback which activates the next test step. 
                        var nextTestStepTrigger = function () {
                            setTimeout(function () {
                                trigger_1();
                            }, testInfo.stepDelay);
                        };
                        // There 2 types of test steps - simple and polling.
                        // Upon completion of the simple test step the next test step will be called.
                        // In case of polling test step the next test step is passed to the polling test step, and
                        // it is responsibility of the polling test step to call the next test step.
                        try {
                            if (step[TestClass.isPollingStepFlag]) {
                                step.call(_this, nextTestStepTrigger);
                            }
                            else {
                                step.call(_this);
                                nextTestStepTrigger.call(_this);
                            }
                        }
                        catch (e) {
                            _this._testCompleted();
                            Assert.ok(false, e.toString());
                            // done is QUnit callback indicating the end of the test
                            done();
                            return;
                        }
                    }
                    else {
                        _this._testCompleted();
                        // done is QUnit callback indicating the end of the test
                        done();
                    }
                };
                trigger_1();
            }
            catch (ex) {
                Assert.ok(false, "Unexpected Exception: " + ex);
                _this._testCompleted(true);
                // done is QUnit callback indicating the end of the test
                done();
            }
        };
        // Register the test with QUnit
        QUnit.test(testInfo.name, testMethod);
    };
    /** Register a Javascript unit testcase. */
    TestClass.prototype.testCase = function (testInfo) {
        var _this = this;
        if (!testInfo.name) {
            throw new Error("Must specify name in testInfo context in registerTestcase call");
        }
        if (!testInfo.test) {
            throw new Error("Must specify 'test' method in testInfo context in registerTestcase call");
        }
        // Create a wrapper around the test method so we can do test initilization and cleanup.
        var testMethod = function () {
            // Save off the instance of the currently running suite.
            TestClass.currentTestClass = _this;
            // Run the test.
            try {
                _this._testStarting();
                testInfo.test.call(_this);
                _this._testCompleted();
            }
            catch (ex) {
                Assert.ok(false, "Unexpected Exception: " + ex);
                _this._testCompleted(true);
            }
        };
        // Register the test with QUnit
        test(testInfo.name, testMethod);
    };
    /** Called when the test is starting. */
    TestClass.prototype._testStarting = function () {
        // Initialize the sandbox similar to what is done in sinon.js "test()" override. See note on class.
        var config = sinon.getConfig(sinon.config);
        config.useFakeTimers = this.useFakeTimers;
        config.useFakeServer = this.useFakeServer;
        config.injectInto = config.injectIntoThis && this || config.injectInto;
        this.sandbox = sinon.sandbox.create(config);
        this.server = this.sandbox.server;
        // Allow the derived class to perform test initialization.
        this.testInitialize();
    };
    /** Called when the test is completed. */
    TestClass.prototype._testCompleted = function (failed) {
        if (failed) {
            // Just cleanup the sandbox since the test has already failed.
            this.sandbox.restore();
        }
        else {
            // Verify the sandbox and restore.
            this.sandbox.verifyAndRestore();
        }
        this.testCleanup();
        // Clear the instance of the currently running suite.
        TestClass.currentTestClass = null;
    };
    TestClass.prototype.spy = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return null;
    };
    TestClass.prototype.stub = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return null;
    };
    /** Creates a mock for the provided object.Does not change the object, but returns a mock object to set expectations on the object's methods. */
    TestClass.prototype.mock = function (object) { return null; };
    /**** end: Sinon methods and properties ***/
    /** Sends a JSON response to the provided request.
     * @param request The request to respond to.
     * @param data Data to respond with.
     * @param errorCode Optional error code to send with the request, default is 200
    */
    TestClass.prototype.sendJsonResponse = function (request, data, errorCode) {
        if (errorCode === undefined) {
            errorCode = 200;
        }
        request.respond(errorCode, { "Content-Type": "application/json" }, JSON.stringify(data));
    };
    TestClass.prototype.setUserAgent = function (userAgent) {
        Object.defineProperty(window.navigator, 'userAgent', {
            configurable: true,
            get: function () {
                return userAgent;
            }
        });
    };
    TestClass.isPollingStepFlag = "isPollingStep";
    return TestClass;
}());
// Configure Sinon
sinon.assert.fail = function (msg) {
    Assert.ok(false, msg);
};
sinon.assert.pass = function (assertion) {
    Assert.ok(assertion, "sinon assert");
};
sinon.config = {
    injectIntoThis: true,
    injectInto: null,
    properties: ["spy", "stub", "mock", "clock", "sandbox"],
    useFakeTimers: true,
    useFakeServer: true
};
/// <reference path="../External/sinon.d.ts" />
/// <reference path="../External/qunit.d.ts" />
/// <reference path="Assert.ts" />
/// <reference path="TestClass.ts" />
/// <reference path="TestCase.ts" />
define("src/removeDynamic", ["require", "exports", "magic-string"], function (require, exports, magic_string_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ;
    function escape(str) {
        return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
    }
    function isSourceMapEnabled(options) {
        if (options) {
            return options.sourceMap !== false && options.sourcemap !== false;
        }
        return false;
    }
    // Need to mock this rather than rely on JavaScript String.prototype.padEnd() as it doesn't always
    // exists in the build / test infrastructure
    function padEnd(input, len, fill) {
        var value = input || "";
        while (value.length < len) {
            value += fill;
        }
        if (value.length > len) {
            value = value.substring(0, len);
        }
        return value;
    }
    function isNullOrWhitespace(value) {
        if (value) {
            return value.replace(/\s/g, "").length < 1;
        }
        return true;
    }
    /**
     * Simple Rush plugin to remove code that is wrapped between specific comments, this is used to
     * remove the boilerplate code require by typescript to define methods as prototype level while
     * using @ms-dynamicProto project to support minification. This can also be used to remove "debug"
     * functions from the production code.
     */
    function dynamicRemove(options) {
        if (options === void 0) { options = {}; }
        var token = (options || {}).tagname || "@DynamicProtoStub";
        var replaceValue = (options || {}).comment || "// Removed Stub for %function%.";
        var tokenGroups = [4, 10, 13];
        var funcNameGroup = 6;
        // Because of the test infrastructure (PhamtonJS) the RegEx can't use the "s" flag (gis vs gi) or named groups
        var pattern = new RegExp("([\\t ]*\\/\\*\\*((?!\\*\\/)(.|\\r|\\n))*\\*\\/[\\s]*)*(\\/\\/[\\t ]*" + escape(token) + "[^\\r\\n]*(\\r\\n|\\n\\r|\\r|\\n))*[\\t ]*([\\w]*\\.prototype(\\.|\\[\\\"|\\[\\')[\\w]*(\\\"\\]|\\'\\])?)[\\t ]*=[\\t ]*function[\\t ]*\\([^\\{]*\\{[^\\/\\}\\{]*(\\{[^\\}]*\\}[^\\/\\}\\{]*)*(\\/[\\*\\/][\\t ]*" + escape(token) + "[^\\*\\r\\n]*(\\*\\/)?(\\r\\n|\\n\\r|\\r|\\n))*[^\\}]*\\};([\\t ]*\\/\\/[\\t ]*" + escape(token) + "[^\\r\\n]*)*", 'gi');
        function formatError(token, code, pos, id) {
            var lines = code.split(/(?:\r\n|\n\r|\r|\n)/);
            var lineNumber = 0;
            var count = pos;
            while (count > 0) {
                lineNumber++;
                count = code.lastIndexOf("\n", count - 1);
            }
            var column = 0;
            var lineStart = code.lastIndexOf("\n", pos);
            if (lineStart != -1) {
                column = (pos - lineStart);
            }
            else {
                column = pos + 1;
            }
            var message = "Invalid (Unremoved) token [" + token + "] found on line [" + lineNumber + "], column [" + column + "], position [" + pos + "] - " + (id || "") + "\n";
            var marker = padEnd("", token.length, "^");
            var line = lineNumber - 6;
            if (line > 0) {
                message += " ...\n";
            }
            count = 0;
            while (count < 10 && line < lines.length - 1) {
                count++;
                if (line >= 0) {
                    var number = padEnd("" + (line + 1), 4, " ");
                    message += number + ":" + lines[line] + "\n";
                    if (line == lineNumber - 1) {
                        message += padEnd("", column + 4, " ") + marker + "\n";
                    }
                }
                line++;
            }
            if (line < lines.length - 1) {
                message += " ...\n";
            }
            var match;
            var matchCount = 0;
            while ((match = pattern.exec(code))) {
                var funcName = match[funcNameGroup];
                if (!isNullOrWhitespace(funcName)) {
                    if (matchCount == 0) {
                        message += "\nMatch checks\n";
                    }
                    matchCount++;
                    if (match[0].length > 0) {
                        message += "Match " + matchCount + " tag Groups for " + (funcName || "") + "\n";
                        message += "--=( Complete Matched Content )=--\n";
                        message += match[0];
                        message += "\n--------------------------------\n";
                        for (var lp = 1; lp < match.length; lp++) {
                            if (match[lp]) {
                                message += "" + lp + ": " + (match[lp] || "").replace(/\n/g, "\\n").replace(/\r/g, "\\r");
                                if ((match[lp] || "").indexOf(token) != -1) {
                                    message += " <- Contains tag";
                                }
                                message += "\n";
                            }
                        }
                        message += "\n";
                    }
                }
            }
            return message;
        }
        function replaceToken(code, theString) {
            var result = false;
            var match;
            while ((match = pattern.exec(code))) {
                var funcName = match[funcNameGroup];
                if (!isNullOrWhitespace(funcName)) {
                    // Only remove matches that contain a tag and function
                    var hasToken = false;
                    for (var lp = 0; lp < tokenGroups.length; lp++) {
                        if ((match[tokenGroups[lp]] || "").indexOf(token) != -1) {
                            hasToken = true;
                            break;
                        }
                    }
                    if (hasToken) {
                        result = true;
                        var start_1 = match.index;
                        var newValue = replaceValue.replace("%function%", funcName);
                        theString.overwrite(start_1, start_1 + match[0].length, newValue);
                    }
                }
            }
            return result;
        }
        function checkResult(result, id) {
            if (result) {
                var pos = result.indexOf(token);
                if (pos != -1) {
                    throw new Error(formatError(token, result, pos, id));
                }
            }
        }
        function doTransform(code, id) {
            var theString = new magic_string_1.default(code);
            if (!replaceToken(code, theString)) {
                return null;
            }
            var result = { code: theString.toString() };
            if (isSourceMapEnabled(options)) {
                result.map = theString.generateMap({ hires: true });
            }
            return result;
        }
        function doTransformAndCheck(code, id) {
            var result = doTransform(code, id);
            if (result) {
                // Do a final check of the string
                checkResult(result.code, id);
            }
            else {
                // Check that the raw input doesn't include the tag
                checkResult(code, id);
            }
            return result;
        }
        return {
            name: 'dynamicRemove',
            renderChunk: function (code, chunk) {
                return doTransformAndCheck(code, chunk.filename);
            },
            transform: doTransformAndCheck
        };
    }
    exports.default = dynamicRemove;
});
/// <reference path="./TestFramework/Common.ts" />
define("test/DynamicProtoRollup.Tests", ["require", "exports", "src/removeDynamic"], function (require, exports, removeDynamic_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DynamicProtoRollupTests = void 0;
    var DynamicProtoRollupTests = /** @class */ (function (_super) {
        __extends(DynamicProtoRollupTests, _super);
        function DynamicProtoRollupTests() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DynamicProtoRollupTests.prototype.testInitialize = function () {
        };
        DynamicProtoRollupTests.prototype.visibleNewlines = function (value) {
            if (value) {
                return value.replace(/\r/g, "\\r").replace(/\n/g, "\\n");
            }
            return value;
        };
        DynamicProtoRollupTests.prototype.convertNewlines = function (value, newline) {
            if (value) {
                return value.replace(/\n/g, newline);
            }
            return value;
        };
        DynamicProtoRollupTests.prototype.testNoChange = function (options, input) {
            var plugin = (0, removeDynamic_1.default)(options);
            QUnit.assert.equal(plugin.name, "dynamicRemove");
            QUnit.assert.equal(plugin.renderChunk(input, { filename: "test.js" }), null);
            QUnit.assert.equal(plugin.transform(input, "testId"), null);
        };
        DynamicProtoRollupTests.prototype.doTest = function (options, input, expected) {
            this.testExpected(options, input, expected);
            this.testExpected(options, this.convertNewlines(input, "\r"), this.convertNewlines(expected, "\r"));
            this.testExpected(options, this.convertNewlines(input, "\r\n"), this.convertNewlines(expected, "\r\n"));
            this.testExpected(options, this.convertNewlines(input, "\n\r"), this.convertNewlines(expected, "\n\r"));
        };
        DynamicProtoRollupTests.prototype.testExpected = function (options, input, expected) {
            var plugin = (0, removeDynamic_1.default)(options);
            QUnit.assert.equal(plugin.name, "dynamicRemove");
            var result = plugin.renderChunk(input, { filename: "test.js" });
            QUnit.assert.equal(result != null ? result.code : null, expected, this.visibleNewlines(result != null ? result.code : null));
            result = plugin.transform(input, "testId");
            QUnit.assert.equal(result != null ? result.code : null, expected, this.visibleNewlines(result != null ? result.code : null));
        };
        DynamicProtoRollupTests.prototype.testError = function (options, message, input, expected) {
            var plugin = (0, removeDynamic_1.default)(options);
            QUnit.assert.throws(function () {
                plugin.renderChunk(input, { filename: "test.js" });
            }, new Error(expected), message);
            QUnit.assert.throws(function () {
                plugin.transform(input, "test.js");
            }, new Error(expected), message);
        };
        DynamicProtoRollupTests.prototype.registerTests = function () {
            var _this = this;
            this.testCase({
                name: "No matching values for removal",
                test: function () {
                    _this.testNoChange(null, "Nothing removed");
                    _this.testNoChange(null, "ClassName.prototype.anotherMethod = function () {\n};\n");
                    _this.testNoChange(null, "ClassName.prototype.methodName = function () {\n" +
                        "    // This is a comment for a dynamic proto stub\n" +
                        "};\n");
                    _this.testNoChange(null, "ClassName.prototype.methodName = function () {\n" +
                        "    // This is a comment for a dynamic proto stub\n" +
                        "};\n");
                    _this.testNoChange(null, "// @Stub -- Type 1 comment\n" +
                        "function methodName() {\n" +
                        "    // This is a comment for a dynamic proto stub\n" +
                        "};\n");
                    _this.testNoChange(null, "function methodName() {\n" +
                        "     // @Stub -- Type 2 single line comment\n" +
                        "};\n");
                    _this.testNoChange(null, "function methodName() {\n" +
                        "     /* @Stub -- Type 2 multiline comment */\n" +
                        "};\n");
                    _this.testNoChange(null, "function methodName() {\n" +
                        "     /* @Stub -- Type 2 multiline comment\n" +
                        "     * Continuation of a multi-line comment/\n" +
                        "     */\n" +
                        "};\n");
                }
            });
            this.testCase({
                name: "Basic tag patterns",
                test: function () {
                    _this.doTest(null, "// @DynamicProtoStub -- Type 1 comment\n" +
                        "ClassName.prototype.methodName = function () {\n" +
                        "    // This is a comment for a dynamic proto stub\n" +
                        "};\n", "// Removed Stub for ClassName.prototype.methodName.\n");
                    _this.doTest(null, "ClassName.prototype.methodName = function () {\n" +
                        "     // @DynamicProtoStub -- Type 2 single line comment\n" +
                        "};\n", "// Removed Stub for ClassName.prototype.methodName.\n");
                    _this.doTest(null, "ClassName.prototype.methodName = function () {\n" +
                        "     /* @DynamicProtoStub -- Type 2 multiline comment */\n" +
                        "};\n", "// Removed Stub for ClassName.prototype.methodName.\n");
                    _this.doTest(null, "ClassName.prototype.methodName = function () {\n" +
                        "     /* @DynamicProtoStub -- Type 2 multiline comment\n" +
                        "     * Continuation of a multi-line comment/\n" +
                        "     */\n" +
                        "};\n", "// Removed Stub for ClassName.prototype.methodName.\n");
                }
            });
            this.testCase({
                name: "Mixed tagtype combinations",
                test: function () {
                    _this.doTest(null, 
                    // Input, 
                    "    /* ================================================================================================================\n" +
                        "     * DO NOT add any code to these empty implementations as any code defined here will be removed, as\n" +
                        "    /*\n" +
                        "    /**\n" +
                        "     * The function does the initial set up. It adds a notification listener to determine which events to remove.\n" +
                        "     * @param coreConfig - The core configuration.\n" +
                        "     * @param core       - The AppInsights core.\n" +
                        "     * @param extensions - An array of all the plugins being used.\n" +
                        "     */\n" +
                        "    // @DynamicProtoStub \n" +
                        "    TestClass.prototype.func1 = function (coreConfig, core, extensions, pluginChain) {\n" +
                        "    };\n" +
                        "    /**\n" +
                        "     * Process an event to add it to the local storage and then pass it to the next plugin.\n" +
                        "     * @param event - The event that needs to be stored.\n" +
                        "     * @param itemCtx - This is the context for the current request, ITelemetryPlugin instances\n" +
                        "     * can optionally use this to access the current core instance or define / pass additional information\n" +
                        "     * to later plugins (vs appending items to the telemetry item)\n" +
                        "     */\n" +
                        "    TestClass.prototype.func2 = function (evt, itemCtx) {\n" +
                        "    }; // @DynamicProtoStub  - Tag type 3\n" +
                        "    /**\n" +
                        "     * Hello World\n" +
                        "     */\n" +
                        "    TestClass.prototype.func3 = function () {\n" +
                        "        // Normal Function\n" +
                        "    };\n" +
                        "    /**\n" +
                        "     * Process an event to add it to the local storage and then pass it to the next plugin.\n" +
                        "     * @param event - The event that needs to be stored.\n" +
                        "     * @param itemCtx - This is the context for the current request, ITelemetryPlugin instances\n" +
                        "     * can optionally use this to access the current core instance or define / pass additional information\n" +
                        "     * to later plugins (vs appending items to the telemetry item)\n" +
                        "     */\n" +
                        "    TestClass.prototype.func4 = function (evt, itemCtx) {\n" +
                        "        // @DynamicProtoStub  - Tag type 2.1\n" +
                        "    };\n" +
                        "    TestClass.prototype.func5 = function () {\n" +
                        "    };\n" +
                        "    /**\n" +
                        "     * Process an event to add it to the local storage and then pass it to the next plugin.\n" +
                        "     * @param event - The event that needs to be stored.\n" +
                        "     * @param itemCtx - This is the context for the current request, ITelemetryPlugin instances\n" +
                        "     * can optionally use this to access the current core instance or define / pass additional information\n" +
                        "     * to later plugins (vs appending items to the telemetry item)\n" +
                        "     */\n" +
                        "    TestClass.prototype.func6 = function (evt, itemCtx) {\n" +
                        "        /* @DynamicProtoStub  - Tag type 2.2 */\n" +
                        "    };\n" +
                        "    return TestClass;", 
                    // Expected Value
                    "    /* ================================================================================================================\n" +
                        "     * DO NOT add any code to these empty implementations as any code defined here will be removed, as\n" +
                        "    /*\n" +
                        "// Removed Stub for TestClass.prototype.func1.\n" +
                        "// Removed Stub for TestClass.prototype.func2.\n" +
                        "    /**\n" +
                        "     * Hello World\n" +
                        "     */\n" +
                        "    TestClass.prototype.func3 = function () {\n" +
                        "        // Normal Function\n" +
                        "    };\n" +
                        "// Removed Stub for TestClass.prototype.func4.\n" +
                        "    TestClass.prototype.func5 = function () {\n" +
                        "    };\n" +
                        "// Removed Stub for TestClass.prototype.func6.\n" +
                        "    return TestClass;");
                    _this.testExpected(null, 
                    // Input, 
                    "    /**\r\n" +
                        "     * The function does the initial set up. It adds a notification listener to determine which events to remove.\r\n" +
                        "     * @param coreConfig - The core configuration.\r\n" +
                        "     * @param core       - The AppInsights core.\r\n" +
                        "     * @param extensions - An array of all the plugins being used.\r\n" +
                        "     */\r\n" +
                        "    // @DynamicProtoStub \r\n" +
                        "    TestClass.prototype.func1 = function (coreConfig, core, extensions, pluginChain) {\r\n" +
                        "    };\r\n" +
                        "    /**\r" +
                        "     * The function does the initial set up. It adds a notification listener to determine which events to remove.\r" +
                        "     * @param coreConfig - The core configuration.\r" +
                        "     * @param core       - The AppInsights core.\r" +
                        "     * @param extensions - An array of all the plugins being used.\r" +
                        "     */\r" +
                        "    // @DynamicProtoStub \r" +
                        "    TestClass.prototype.func2 = function (coreConfig, core, extensions, pluginChain) {\r" +
                        "    };\r" +
                        "    /**\n\r" +
                        "     * The function does the initial set up. It adds a notification listener to determine which events to remove.\n\r" +
                        "     * @param coreConfig - The core configuration.\n\r" +
                        "     * @param core       - The AppInsights core.\n\r" +
                        "     * @param extensions - An array of all the plugins being used.\n\r" +
                        "     */\n\r" +
                        "    // @DynamicProtoStub \n\r" +
                        "    TestClass.prototype.func3 = function (coreConfig, core, extensions, pluginChain) {\n\r" +
                        "    };\n\r" +
                        "", 
                    // Expected Value
                    "// Removed Stub for TestClass.prototype.func1.\r\n" +
                        "// Removed Stub for TestClass.prototype.func2.\r" +
                        "// Removed Stub for TestClass.prototype.func3.\n\r");
                }
            });
            this.testCase({
                name: "Stubs with return values",
                test: function () {
                    _this.doTest(null, 
                    // Input, 
                    "    /* ================================================================================================================\n" +
                        "     * DO NOT add any code to these empty implementations as any code defined here will be removed, as\n" +
                        "    /*\n" +
                        "    /**\n" +
                        "     * The function does the initial set up. It adds a notification listener to determine which events to remove.\n" +
                        "     * @param coreConfig - The core configuration.\n" +
                        "     * @param core       - The AppInsights core.\n" +
                        "     * @param extensions - An array of all the plugins being used.\n" +
                        "     */\n" +
                        "    // @DynamicProtoStub \n" +
                        "    TestClass.prototype.func1 = function (coreConfig, core, extensions, pluginChain) {\n" +
                        "        return;\n" +
                        "    };\n" +
                        "    /**\n" +
                        "     * Process an event to add it to the local storage and then pass it to the next plugin.\n" +
                        "     * @param event - The event that needs to be stored.\n" +
                        "     * @param itemCtx - This is the context for the current request, ITelemetryPlugin instances\n" +
                        "     * can optionally use this to access the current core instance or define / pass additional information\n" +
                        "     * to later plugins (vs appending items to the telemetry item)\n" +
                        "     */\n" +
                        "    TestClass.prototype.func2 = function (evt, itemCtx) {\n" +
                        "        return;\n" +
                        "    }; // @DynamicProtoStub  - Tag type 3\n" +
                        "    /**\n" +
                        "     * Hello World\n" +
                        "     */\n" +
                        "    TestClass.prototype.func3 = function () {\n" +
                        "        // Normal Function\n" +
                        "        return;\n" +
                        "    };\n" +
                        "    /**\n" +
                        "     * Process an event to add it to the local storage and then pass it to the next plugin.\n" +
                        "     * @param event - The event that needs to be stored.\n" +
                        "     * @param itemCtx - This is the context for the current request, ITelemetryPlugin instances\n" +
                        "     * can optionally use this to access the current core instance or define / pass additional information\n" +
                        "     * to later plugins (vs appending items to the telemetry item)\n" +
                        "     */\n" +
                        "    TestClass.prototype.func4 = function (evt, itemCtx) {\n" +
                        "        // @DynamicProtoStub  - Tag type 2.1\n" +
                        "        return;\n" +
                        "    };\n" +
                        "    TestClass.prototype.func5 = function () {\n" +
                        "        return;\n" +
                        "    };\n" +
                        "    /**\n" +
                        "     * Process an event to add it to the local storage and then pass it to the next plugin.\n" +
                        "     * @param event - The event that needs to be stored.\n" +
                        "     * @param itemCtx - This is the context for the current request, ITelemetryPlugin instances\n" +
                        "     * can optionally use this to access the current core instance or define / pass additional information\n" +
                        "     * to later plugins (vs appending items to the telemetry item)\n" +
                        "     */\n" +
                        "    TestClass.prototype.func6 = function (evt, itemCtx) {\n" +
                        "        /* @DynamicProtoStub  - Tag type 2.2 */\n" +
                        "        return;\n" +
                        "    };\n" +
                        "    return TestClass;", 
                    // Expected Value
                    "    /* ================================================================================================================\n" +
                        "     * DO NOT add any code to these empty implementations as any code defined here will be removed, as\n" +
                        "    /*\n" +
                        "// Removed Stub for TestClass.prototype.func1.\n" +
                        "// Removed Stub for TestClass.prototype.func2.\n" +
                        "    /**\n" +
                        "     * Hello World\n" +
                        "     */\n" +
                        "    TestClass.prototype.func3 = function () {\n" +
                        "        // Normal Function\n" +
                        "        return;\n" +
                        "    };\n" +
                        "// Removed Stub for TestClass.prototype.func4.\n" +
                        "    TestClass.prototype.func5 = function () {\n" +
                        "        return;\n" +
                        "    };\n" +
                        "// Removed Stub for TestClass.prototype.func6.\n" +
                        "    return TestClass;");
                    _this.doTest(null, 
                    // Input, 
                    "    /**\n" +
                        "     * The function does the initial set up. It adds a notification listener to determine which events to remove.\n" +
                        "     * @param coreConfig - The core configuration.\n" +
                        "     * @param core       - The AppInsights core.\n" +
                        "     * @param extensions - An array of all the plugins being used.\n" +
                        "     */\n" +
                        "    // @DynamicProtoStub \n" +
                        "    TestClass.prototype.func1 = function (coreConfig, core, extensions, pluginChain) {\n" +
                        "        throw \"Not Implemented\";\n" +
                        "    };\n" +
                        "    /**\n" +
                        "     * The function does the initial set up. It adds a notification listener to determine which events to remove.\n" +
                        "     * @param coreConfig - The core configuration.\n" +
                        "     * @param core       - The AppInsights core.\n" +
                        "     * @param extensions - An array of all the plugins being used.\n" +
                        "     */\n" +
                        "    // @DynamicProtoStub \n" +
                        "    TestClass.prototype.func2 = function (coreConfig, core, extensions, pluginChain) {\n" +
                        "        throw \"Not Implemented\";\n" +
                        "    };\n" +
                        "    /**\n" +
                        "     * The function does the initial set up. It adds a notification listener to determine which events to remove.\n" +
                        "     * @param coreConfig - The core configuration.\n" +
                        "     * @param core       - The AppInsights core.\n" +
                        "     * @param extensions - An array of all the plugins being used.\n" +
                        "     */\n" +
                        "    // @DynamicProtoStub \n" +
                        "    TestClass.prototype.func3 = function (coreConfig, core, extensions, pluginChain) {\n" +
                        "        throw \"Not Implemented\";\n" +
                        "    };\n" +
                        "", 
                    // Expected Value
                    "// Removed Stub for TestClass.prototype.func1.\n" +
                        "// Removed Stub for TestClass.prototype.func2.\n" +
                        "// Removed Stub for TestClass.prototype.func3.\n");
                }
            });
            this.testCase({
                name: "Test reserved (ES3) function names",
                test: function () {
                    _this.doTest(null, 
                    // Input, 
                    "    /* ================================================================================================================\n" +
                        "     * DO NOT add any code to these empty implementations as any code defined here will be removed, as\n" +
                        "    /*\n" +
                        "    /**\n" +
                        "     * The function does the initial set up. It adds a notification listener to determine which events to remove.\n" +
                        "     * @param coreConfig - The core configuration.\n" +
                        "     * @param core       - The AppInsights core.\n" +
                        "     * @param extensions - An array of all the plugins being used.\n" +
                        "     */\n" +
                        "    // @DynamicProtoStub \n" +
                        "    TestClass.prototype[\"catch\"] = function (coreConfig, core, extensions, pluginChain) {\n" +
                        "    };\n" +
                        "    /**\n" +
                        "     * Process an event to add it to the local storage and then pass it to the next plugin.\n" +
                        "     * @param event - The event that needs to be stored.\n" +
                        "     * @param itemCtx - This is the context for the current request, ITelemetryPlugin instances\n" +
                        "     * can optionally use this to access the current core instance or define / pass additional information\n" +
                        "     * to later plugins (vs appending items to the telemetry item)\n" +
                        "     */\n" +
                        "    TestClass.prototype[\"catch2\"] = function (evt, itemCtx) {\n" +
                        "        return;\n" +
                        "    }; // @DynamicProtoStub  - Tag type 3\n" +
                        "    /**\n" +
                        "     * Hello World\n" +
                        "     */\n" +
                        "    TestClass.prototype[\"func3\"] = function () {\n" +
                        "        // Normal Function\n" +
                        "        return;\n" +
                        "    };\n" +
                        "    return TestClass;", 
                    // Expected Value
                    "    /* ================================================================================================================\n" +
                        "     * DO NOT add any code to these empty implementations as any code defined here will be removed, as\n" +
                        "    /*\n" +
                        "// Removed Stub for TestClass.prototype[\"catch\"].\n" +
                        "// Removed Stub for TestClass.prototype[\"catch2\"].\n" +
                        "    /**\n" +
                        "     * Hello World\n" +
                        "     */\n" +
                        "    TestClass.prototype[\"func3\"] = function () {\n" +
                        "        // Normal Function\n" +
                        "        return;\n" +
                        "    };\n" +
                        "    return TestClass;");
                    _this.doTest(null, 
                    // Input, 
                    "    /**\n" +
                        "     * The function does the initial set up. It adds a notification listener to determine which events to remove.\n" +
                        "     * @param coreConfig - The core configuration.\n" +
                        "     * @param core       - The AppInsights core.\n" +
                        "     * @param extensions - An array of all the plugins being used.\n" +
                        "     */\n" +
                        "    // @DynamicProtoStub \n" +
                        "    TestClass.prototype[\"catch\"] = function (coreConfig, core, extensions, pluginChain) {\n" +
                        "        throw \"Not Implemented\";" +
                        "    };\n" +
                        "    /**\n" +
                        "     * The function does the initial set up. It adds a notification listener to determine which events to remove.\n" +
                        "     * @param coreConfig - The core configuration.\n" +
                        "     * @param core       - The AppInsights core.\n" +
                        "     * @param extensions - An array of all the plugins being used.\n" +
                        "     */\n" +
                        "    // @DynamicProtoStub \n" +
                        "    TestClass.prototype[\"delete\"] = function (coreConfig, core, extensions, pluginChain) {\n" +
                        "        throw \"Not Implemented\";\n" +
                        "    };\n" +
                        "    /**\n" +
                        "     * The function does the initial set up. It adds a notification listener to determine which events to remove.\n" +
                        "     * @param coreConfig - The core configuration.\n" +
                        "     * @param core       - The AppInsights core.\n" +
                        "     * @param extensions - An array of all the plugins being used.\n" +
                        "     */\n" +
                        "    // @DynamicProtoStub \n" +
                        "    TestClass.prototype[\"throw\"] = function (coreConfig, core, extensions, pluginChain) {\n" +
                        "        throw \"Not Implemented\";\n" +
                        "    };\n" +
                        "    /**\n" +
                        "     * The function does the initial set up. It adds a notification listener to determine which events to remove.\n" +
                        "     * @param coreConfig - The core configuration.\n" +
                        "     * @param core       - The AppInsights core.\n" +
                        "     * @param extensions - An array of all the plugins being used.\n" +
                        "     */\n" +
                        "    // @DynamicProtoStub \n" +
                        "    TestClass.prototype['if'] = function (coreConfig, core, extensions, pluginChain) {\n" +
                        "        throw \"Not Implemented\";\n" +
                        "    };\n" +
                        "", 
                    // Expected Value
                    "// Removed Stub for TestClass.prototype[\"catch\"].\n" +
                        "// Removed Stub for TestClass.prototype[\"delete\"].\n" +
                        "// Removed Stub for TestClass.prototype[\"throw\"].\n" +
                        "// Removed Stub for TestClass.prototype['if'].\n");
                }
            });
            this.testCase({
                name: "Test unconverted tags from partial conversion",
                test: function () {
                    _this.testError(null, "1 -- Type 1 comment", "// @DynamicProtoStub -- Type 1 comment\n" +
                        "function methodName() {\n" +
                        "    // This is a comment for a dynamic proto stub\n" +
                        "};\n", "Invalid (Unremoved) token [@DynamicProtoStub] found on line [1], column [4], position [3] - test.js\n" +
                        "1   :// @DynamicProtoStub -- Type 1 comment\n" +
                        "        ^^^^^^^^^^^^^^^^^\n" +
                        "2   :function methodName() {\n" +
                        "3   :    // This is a comment for a dynamic proto stub\n" +
                        "4   :};\n");
                    _this.testError(null, "2 -- Type 2 single line comment", "function methodName() {\n" +
                        "    // @DynamicProtoStub -- Type 2 single line comment\n" +
                        "};\n", "Invalid (Unremoved) token [@DynamicProtoStub] found on line [2], column [8], position [31] - test.js\n" +
                        "1   :function methodName() {\n" +
                        "2   :    // @DynamicProtoStub -- Type 2 single line comment\n" +
                        "            ^^^^^^^^^^^^^^^^^\n" +
                        "3   :};\n");
                    _this.testError(null, "3 -- Type 2 multiline comment", "function methodName() {\n" +
                        "    /* @DynamicProtoStub -- Type 2 multiline comment */\n" +
                        "};\n", "Invalid (Unremoved) token [@DynamicProtoStub] found on line [2], column [8], position [31] - test.js\n" +
                        "1   :function methodName() {\n" +
                        "2   :    /* @DynamicProtoStub -- Type 2 multiline comment */\n" +
                        "            ^^^^^^^^^^^^^^^^^\n" +
                        "3   :};\n");
                    _this.testError(null, "4 -- Type 2 multiline comment (2)", "function methodName() {\n" +
                        "    /* @DynamicProtoStub -- Type 2 multiline comment\n" +
                        "    * Continuation of a multi-line comment/\n" +
                        "    */\n" +
                        "};\n", "Invalid (Unremoved) token [@DynamicProtoStub] found on line [2], column [8], position [31] - test.js\n" +
                        "1   :function methodName() {\n" +
                        "2   :    /* @DynamicProtoStub -- Type 2 multiline comment\n" +
                        "            ^^^^^^^^^^^^^^^^^\n" +
                        "3   :    * Continuation of a multi-line comment/\n" +
                        "4   :    */\n" +
                        "5   :};\n");
                    _this.testError(null, "5 -- Type 1 comment", "// @DynamicProtoStub -- Type 1 comment\n" +
                        "function methodName() {\n" +
                        "    // This is a comment for a dynamic proto stub\n" +
                        "};\n" +
                        "// @DynamicProtoStub -- Type 1 comment\n" +
                        "ClassName.prototype.methodName = function () {\n" +
                        "    // This is a comment for a dynamic proto stub\n" +
                        "};\n", "Invalid (Unremoved) token [@DynamicProtoStub] found on line [1], column [4], position [3] - test.js\n" +
                        "1   :// @DynamicProtoStub -- Type 1 comment\n" +
                        "        ^^^^^^^^^^^^^^^^^\n" +
                        "2   :function methodName() {\n" +
                        "3   :    // This is a comment for a dynamic proto stub\n" +
                        "4   :};\n" +
                        "5   :// Removed Stub for ClassName.prototype.methodName.\n");
                    _this.testError(null, "6 -- Type 2 single line comment", "function methodName() {\n" +
                        "    // @DynamicProtoStub -- Type 2 single line comment\n" +
                        "};\n" +
                        "// @DynamicProtoStub -- Type 1 comment\n" +
                        "ClassName.prototype.methodName = function () {\n" +
                        "    // This is a comment for a dynamic proto stub\n" +
                        "};\n", "Invalid (Unremoved) token [@DynamicProtoStub] found on line [2], column [8], position [31] - test.js\n" +
                        "1   :function methodName() {\n" +
                        "2   :    // @DynamicProtoStub -- Type 2 single line comment\n" +
                        "            ^^^^^^^^^^^^^^^^^\n" +
                        "3   :};\n" +
                        "4   :// Removed Stub for ClassName.prototype.methodName.\n");
                    _this.testError(null, "7 -- Type 2 multiline comment */", "function methodName() {\n" +
                        "    /* @DynamicProtoStub -- Type 2 multiline comment */\n" +
                        "};\n" +
                        "// @DynamicProtoStub -- Type 1 comment\n" +
                        "ClassName.prototype.methodName = function () {\n" +
                        "    // This is a comment for a dynamic proto stub\n" +
                        "};\n", "Invalid (Unremoved) token [@DynamicProtoStub] found on line [2], column [8], position [31] - test.js\n" +
                        "1   :function methodName() {\n" +
                        "2   :    /* @DynamicProtoStub -- Type 2 multiline comment */\n" +
                        "            ^^^^^^^^^^^^^^^^^\n" +
                        "3   :};\n" +
                        "4   :// Removed Stub for ClassName.prototype.methodName.\n");
                    _this.testError(null, "8 -- Type 2 multiline comment (2)", "function methodName() {\n" +
                        "    /* @DynamicProtoStub -- Type 2 multiline comment\n" +
                        "    * Continuation of a multi-line comment/\n" +
                        "    */\n" +
                        "};\n" +
                        "// @DynamicProtoStub -- Type 1 comment\n" +
                        "ClassName.prototype.methodName = function () {\n" +
                        "    // This is a comment for a dynamic proto stub\n" +
                        "};\n", "Invalid (Unremoved) token [@DynamicProtoStub] found on line [2], column [8], position [31] - test.js\n" +
                        "1   :function methodName() {\n" +
                        "2   :    /* @DynamicProtoStub -- Type 2 multiline comment\n" +
                        "            ^^^^^^^^^^^^^^^^^\n" +
                        "3   :    * Continuation of a multi-line comment/\n" +
                        "4   :    */\n" +
                        "5   :};\n" +
                        "6   :// Removed Stub for ClassName.prototype.methodName.\n");
                }
            });
            this.testCase({
                name: "Test prefixed comment with typescript boilerplate for spread and default arguments",
                test: function () {
                    _this.doTest(null, "/**\n" +
                        " * This method tells if given durations should be excluded from collection.\n" +
                        " */\n" +
                        "PageViewPerformanceManager.prototype.shouldCollectDuration = function () {\n" +
                        "    var durations = [];\n" +
                        "    for (var _i = 0; _i < arguments.length; _i++) {\n" +
                        "        durations[_i] = arguments[_i];\n" +
                        "    }\n" +
                        "    // @DynamicProtoStub\n" +
                        "    return true;\n" +
                        "};\n", "// Removed Stub for PageViewPerformanceManager.prototype.shouldCollectDuration.\n");
                    _this.doTest(null, "    /**\n" +
                        " * Manually trigger an immediate send of all telemetry still in the buffer using beacon Sender.\n" +
                        " * Fall back to xhr sender if beacon is not supported.\n" +
                        " * @param {boolean} [async=true]\n" +
                        " * @memberof Initialization\n" +
                        " */\n" +
                        "Initialization.prototype.onunloadFlush = function (async) {\n" +
                        "   if (async === void 0) { async = true; }\n" +
                        "    // @DynamicProtoStub\n" +
                        "};\n", "// Removed Stub for Initialization.prototype.onunloadFlush.\n");
                    _this.doTest(null, "/**\n" +
                        " * This method tells if given durations should be excluded from collection.\n" +
                        " */\n" +
                        "PageViewPerformanceManager.prototype.shouldCollectDuration = function () {\n" +
                        "    var durations = [];\n" +
                        "    for (var _i = 0; _i < arguments.length; _i++) {\n" +
                        "        durations[_i] = arguments[_i];\n" +
                        "    }\n" +
                        "    /* @DynamicProtoStub\n" +
                        "    */\n" +
                        "    return true;\n" +
                        "};\n", "// Removed Stub for PageViewPerformanceManager.prototype.shouldCollectDuration.\n");
                    _this.doTest(null, "    /**\n" +
                        " * Manually trigger an immediate send of all telemetry still in the buffer using beacon Sender.\n" +
                        " * Fall back to xhr sender if beacon is not supported.\n" +
                        " * @param {boolean} [async=true]\n" +
                        " * @memberof Initialization\n" +
                        " */\n" +
                        "Initialization.prototype.onunloadFlush = function (async) {\n" +
                        "   if (async === void 0) { async = true; }\n" +
                        "    /* @DynamicProtoStub\n" +
                        "    */\n" +
                        "};\n", "// Removed Stub for Initialization.prototype.onunloadFlush.\n");
                }
            });
        };
        return DynamicProtoRollupTests;
    }(TestClass));
    exports.DynamicProtoRollupTests = DynamicProtoRollupTests;
});
define("test/Selenium/DynamicProtoRollupTests", ["require", "exports", "test/DynamicProtoRollup.Tests"], function (require, exports, DynamicProtoRollup_Tests_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.runTests = void 0;
    function runTests() {
        new DynamicProtoRollup_Tests_1.DynamicProtoRollupTests().registerTests();
    }
    exports.runTests = runTests;
});
//# sourceMappingURL=dynamicprotorolluptests.js.map