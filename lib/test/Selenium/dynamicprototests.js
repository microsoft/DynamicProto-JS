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
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
define("src/DynamicProto", ["require", "exports", "@nevware21/ts-utils"], function (require, exports, ts_utils_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    ;
    var UNDEFINED = "undefined";
    /**
     * Helper to check if we're running in a server-side rendering environment
     * like Node.js or Cloudflare Workers
     * @ignore
     */
    function _isServerSideRender() {
        var gbl = (0, ts_utils_1.getGlobal)();
        // Check for common server-side environments
        // 1. Missing window or document (Node.js, some SSR frameworks)
        // 2. Cloudflare Worker specific environment
        return (typeof gbl.window === UNDEFINED ||
            typeof gbl.document === UNDEFINED ||
            (typeof gbl.navigator !== UNDEFINED &&
                typeof gbl.navigator.userAgent !== UNDEFINED &&
                gbl.navigator.userAgent.indexOf('Cloudflare-Workers') >= 0));
    }
    /**
     * Constant string defined to support minimization
     * @ignore
     */
    var Constructor = 'constructor';
    /**
     * Constant string defined to support minimization
     * @ignore
     */
    var Prototype = 'prototype';
    /**
     * Constant string defined to support minimization
     * @ignore
     */
    var strFunction = 'function';
    /**
     * Used to define the name of the instance function lookup table
     * @ignore
     */
    var DynInstFuncTable = '_dynInstFuncs';
    /**
     * Name used to tag the dynamic prototype function
     * @ignore
     */
    var DynProxyTag = '_isDynProxy';
    /**
     * Name added to a prototype to define the dynamic prototype "class" name used to lookup the function table
     * @ignore
     */
    var DynClassName = '_dynClass';
    /**
     * Prefix added to the classname to avoid any name clashes with other instance level properties
     * @ignore
     */
    var DynClassNamePrefix = '_dynCls$';
    /**
     * A tag which is used to check if we have already to attempted to set the instance function if one is not present
     * @ignore
     */
    var DynInstChkTag = '_dynInstChk';
    /**
     * A tag which is used to check if we are allows to try and set an instance function is one is not present. Using the same
     * tag name as the function level but a different const name for readability only.
     */
    var DynAllowInstChkTag = DynInstChkTag;
    /**
     * The global (imported) instances where the global performance options are stored
     */
    var DynProtoDefaultOptions = '_dfOpts';
    /**
     * Value used as the name of a class when it cannot be determined
     * @ignore
     */
    var UnknownValue = '_unknown_';
    /**
     * Constant string defined to support minimization
     * @ignore
     */
    var str__Proto = "__proto__";
    /**
     * The polyfill version of __proto__ so that it doesn't cause issues for anyone not expecting it to exist
     */
    var DynProtoBaseProto = "_dyn" + str__Proto;
    /**
     * Runtime Global holder for dynamicProto settings
     */
    var DynProtoGlobalSettings = "__dynProto$Gbl";
    /**
     * Track the current prototype for IE8 as you can't look back to get the prototype
     */
    var DynProtoCurrent = "_dynInstProto";
    /**
     * Constant string defined to support minimization
     * @ignore
     */
    var strUseBaseInst = 'useBaseInst';
    /**
     * Constant string defined to support minimization
     * @ignore
     */
    var strSetInstFuncs = 'setInstFuncs';
    var Obj = Object;
    /**
     * Pre-lookup to check if we are running on a modern browser (i.e. not IE8)
     * @ignore
     */
    var _objGetPrototypeOf = Obj["getPrototypeOf"];
    /**
     * Pre-lookup to check for the existence of this function
     */
    var _objGetOwnProps = Obj["getOwnPropertyNames"];
    // Since 1.1.7 moving these to the runtime global to work around mixed version and module issues
    // See Issue https://github.com/microsoft/DynamicProto-JS/issues/57 for details
    var _gbl = (0, ts_utils_1.getGlobal)();
    var _gblInst = _gbl[DynProtoGlobalSettings] || (_gbl[DynProtoGlobalSettings] = {
        o: (_a = {},
            _a[strSetInstFuncs] = true,
            _a[strUseBaseInst] = true,
            _a),
        n: 1000 // Start new global index @ 1000 so we "fix" some cases when mixed with 1.1.6 or earlier
    });
    /**
     * Helper used to check whether the target is an Object prototype or Array prototype
     * @ignore
     */
    function _isObjectOrArrayPrototype(target) {
        return target && (target === Obj[Prototype] || target === Array[Prototype]);
    }
    /**
     * Helper used to check whether the target is an Object prototype, Array prototype or Function prototype
     * @ignore
     */
    function _isObjectArrayOrFunctionPrototype(target) {
        return _isObjectOrArrayPrototype(target) || target === Function[Prototype];
    }
    /**
     * Helper used to get the prototype of the target object as getPrototypeOf is not available in an ES3 environment.
     * @ignore
     */
    function _getObjProto(target) {
        var newProto;
        if (target) {
            // This method doesn't exist in older browsers (e.g. IE8)
            if (_objGetPrototypeOf) {
                return _objGetPrototypeOf(target);
            }
            var curProto = target[str__Proto] || target[Prototype] || (target[Constructor] ? target[Constructor][Prototype] : null);
            // Using the pre-calculated value as IE8 doesn't support looking up the prototype of a prototype and thus fails for more than 1 base class
            newProto = target[DynProtoBaseProto] || curProto;
            if (!(0, ts_utils_1.objHasOwnProperty)(target, DynProtoBaseProto)) {
                // As this prototype doesn't have this property then this is from an inherited class so newProto is the base to return so save it
                // so we can look it up value (which for a multiple hierarchy dynamicProto will be the base class)
                delete target[DynProtoCurrent]; // Delete any current value allocated to this instance so we pick up the value from prototype hierarchy
                newProto = target[DynProtoBaseProto] = target[DynProtoCurrent] || target[DynProtoBaseProto];
                target[DynProtoCurrent] = curProto;
            }
        }
        return newProto;
    }
    /**
     * Helper to get the properties of an object, including none enumerable ones as functions on a prototype in ES6
     * are not enumerable.
     * @param target
     */
    function _forEachProp(target, func) {
        var props = [];
        if (_objGetOwnProps) {
            props = _objGetOwnProps(target);
        }
        else {
            for (var name_1 in target) {
                if (typeof name_1 === "string" && (0, ts_utils_1.objHasOwnProperty)(target, name_1)) {
                    props.push(name_1);
                }
            }
        }
        if (props && props.length > 0) {
            for (var lp = 0; lp < props.length; lp++) {
                func(props[lp]);
            }
        }
    }
    /**
     * Helper function to check whether the provided function name is a potential candidate for dynamic
     * callback and prototype generation.
     * @param target The target object, may be a prototype or class object
     * @param funcName The function name
     * @param skipOwn Skips the check for own property
     * @ignore
     */
    function _isDynamicCandidate(target, funcName, skipOwn) {
        return (funcName !== Constructor && typeof target[funcName] === strFunction && (skipOwn || (0, ts_utils_1.objHasOwnProperty)(target, funcName)) && funcName !== str__Proto && funcName !== Prototype);
    }
    /**
     * Helper to throw a TypeError exception
     * @param message the message
     * @ignore
     */
    function _throwTypeError(message) {
        (0, ts_utils_1.throwTypeError)("DynamicProto: " + message);
    }
    /**
     * Returns a collection of the instance functions that are defined directly on the thisTarget object, it does
     * not return any inherited functions
     * @param thisTarget The object to get the instance functions from
     * @ignore
     */
    function _getInstanceFuncs(thisTarget) {
        // Get the base proto
        var instFuncs = (0, ts_utils_1.objCreate)(null);
        // Save any existing instance functions
        _forEachProp(thisTarget, function (name) {
            // Don't include any dynamic prototype instances - as we only want the real functions
            if (!instFuncs[name] && _isDynamicCandidate(thisTarget, name, false)) {
                // Create an instance callback for passing the base function to the caller
                instFuncs[name] = thisTarget[name];
            }
        });
        return instFuncs;
    }
    /**
     * Returns whether the value is included in the array
     * @param values The array of values
     * @param value  The value
     */
    function _hasVisited(values, value) {
        for (var lp = values.length - 1; lp >= 0; lp--) {
            if (values[lp] === value) {
                return true;
            }
        }
        return false;
    }
    /**
     * Returns an object that contains callback functions for all "base/super" functions, this is used to "save"
     * enabling calling super.xxx() functions without requiring that the base "class" has defined a prototype references
     * @param target The current instance
     * @ignore
     */
    function _getBaseFuncs(classProto, thisTarget, instFuncs, useBaseInst) {
        function _instFuncProxy(target, funcHost, funcName) {
            var theFunc = funcHost[funcName];
            if (theFunc[DynProxyTag] && useBaseInst) {
                // grab and reuse the hosted looking function (if available) otherwise the original passed function
                var instFuncTable = target[DynInstFuncTable] || {};
                if (instFuncTable[DynAllowInstChkTag] !== false) {
                    theFunc = (instFuncTable[funcHost[DynClassName]] || {})[funcName] || theFunc;
                }
            }
            return function () {
                // eslint-disable-next-line prefer-rest-params
                return theFunc.apply(target, arguments);
            };
        }
        // Start creating a new baseFuncs by creating proxies for the instance functions (as they may get replaced)
        var baseFuncs = (0, ts_utils_1.objCreate)(null);
        _forEachProp(instFuncs, function (name) {
            // Create an instance callback for passing the base function to the caller
            baseFuncs[name] = _instFuncProxy(thisTarget, instFuncs, name);
        });
        // Get the base prototype functions
        var baseProto = _getObjProto(classProto);
        var visited = [];
        // Don't include base object functions for Object, Array or Function
        while (baseProto && !_isObjectArrayOrFunctionPrototype(baseProto) && !_hasVisited(visited, baseProto)) {
            // look for prototype functions
            _forEachProp(baseProto, function (name) {
                // Don't include any dynamic prototype instances - as we only want the real functions
                // For IE 7/8 the prototype lookup doesn't provide the full chain so we need to bypass the 
                // hasOwnProperty check we get all of the methods, main difference is that IE7/8 doesn't return
                // the Object prototype methods while bypassing the check
                if (!baseFuncs[name] && _isDynamicCandidate(baseProto, name, !_objGetPrototypeOf)) {
                    // Create an instance callback for passing the base function to the caller
                    baseFuncs[name] = _instFuncProxy(thisTarget, baseProto, name);
                }
            });
            // We need to find all possible functions that might be overloaded by walking the entire prototype chain
            // This avoids the caller from needing to check whether it's direct base class implements the function or not
            // by walking the entire chain it simplifies the usage and issues from upgrading any of the base classes.
            visited.push(baseProto);
            baseProto = _getObjProto(baseProto);
        }
        return baseFuncs;
    }
    function _getInstFunc(target, funcName, proto, currentDynProtoProxy) {
        var instFunc = null;
        // We need to check whether the class name is defined directly on this prototype otherwise
        // it will walk the proto chain and return any parent proto classname.
        if (target && (0, ts_utils_1.objHasOwnProperty)(proto, DynClassName)) {
            var instFuncTable = target[DynInstFuncTable] || (0, ts_utils_1.objCreate)(null);
            instFunc = (instFuncTable[proto[DynClassName]] || (0, ts_utils_1.objCreate)(null))[funcName];
            if (!instFunc) {
                // Avoid stack overflow from recursive calling the same function
                _throwTypeError("Missing [" + funcName + "] " + strFunction);
            }
            // We have the instance function, lets check it we can speed up further calls
            // by adding the instance function back directly on the instance (avoiding the dynamic func lookup)
            if (!instFunc[DynInstChkTag] && instFuncTable[DynAllowInstChkTag] !== false) {
                // If the instance already has an instance function we can't replace it
                var canAddInst = !(0, ts_utils_1.objHasOwnProperty)(target, funcName);
                // Get current prototype
                var objProto = _getObjProto(target);
                var visited = [];
                // Lookup the function starting at the top (instance level prototype) and traverse down, if the first matching function
                // if nothing is found or if the first hit is a dynamic proto instance then we can safely add an instance shortcut
                while (canAddInst && objProto && !_isObjectArrayOrFunctionPrototype(objProto) && !_hasVisited(visited, objProto)) {
                    var protoFunc = objProto[funcName];
                    if (protoFunc) {
                        canAddInst = (protoFunc === currentDynProtoProxy);
                        break;
                    }
                    // We need to find all possible initial functions to ensure that we don't bypass a valid override function
                    visited.push(objProto);
                    objProto = _getObjProto(objProto);
                }
                try {
                    if (canAddInst) {
                        // This instance doesn't have an instance func and the class hierarchy does have a higher level prototype version
                        // so it's safe to directly assign for any subsequent calls (for better performance)
                        target[funcName] = instFunc;
                    }
                    // Block further attempts to set the instance function for any
                    instFunc[DynInstChkTag] = 1;
                }
                catch (e) {
                    // Don't crash if the object is readonly or the runtime doesn't allow changing this
                    // And set a flag so we don't try again for any function
                    instFuncTable[DynAllowInstChkTag] = false;
                }
            }
        }
        return instFunc;
    }
    function _getProtoFunc(funcName, proto, currentDynProtoProxy) {
        var protoFunc = proto[funcName];
        // Check that the prototype function is not a self reference -- try to avoid stack overflow!
        if (protoFunc === currentDynProtoProxy) {
            // It is so lookup the base prototype
            protoFunc = _getObjProto(proto)[funcName];
        }
        if (typeof protoFunc !== strFunction) {
            _throwTypeError("[" + funcName + "] is not a " + strFunction);
        }
        return protoFunc;
    }
    /**
     * Add the required dynamic prototype methods to the the class prototype
     * @param proto - The class prototype
     * @param className - The instance classname
     * @param target - The target instance
     * @param baseInstFuncs - The base instance functions
     * @param setInstanceFunc - Flag to allow prototype function to reset the instance function if one does not exist
     * @ignore
     */
    function _populatePrototype(proto, className, target, baseInstFuncs, setInstanceFunc) {
        function _createDynamicPrototype(proto, funcName) {
            var dynProtoProxy = function () {
                // Use the instance or prototype function
                var instFunc = _getInstFunc(this, funcName, proto, dynProtoProxy) || _getProtoFunc(funcName, proto, dynProtoProxy);
                // eslint-disable-next-line prefer-rest-params
                return instFunc.apply(this, arguments);
            };
            // Tag this function as a proxy to support replacing dynamic proxy elements (primary use case is for unit testing
            // via which can dynamically replace the prototype function reference)
            dynProtoProxy[DynProxyTag] = 1;
            return dynProtoProxy;
        }
        if (!_isObjectOrArrayPrototype(proto)) {
            var instFuncTable = target[DynInstFuncTable] = target[DynInstFuncTable] || (0, ts_utils_1.objCreate)(null);
            if (!_isObjectOrArrayPrototype(instFuncTable)) {
                var instFuncs_1 = instFuncTable[className] = (instFuncTable[className] || (0, ts_utils_1.objCreate)(null)); // fetch and assign if as it may not exist yet
                // Set whether we are allow to lookup instances, if someone has set to false then do not re-enable
                if (instFuncTable[DynAllowInstChkTag] !== false) {
                    instFuncTable[DynAllowInstChkTag] = !!setInstanceFunc;
                }
                if (!_isObjectOrArrayPrototype(instFuncs_1)) {
                    _forEachProp(target, function (name) {
                        // Only add overridden functions
                        if (_isDynamicCandidate(target, name, false) && target[name] !== baseInstFuncs[name]) {
                            // Save the instance Function to the lookup table and remove it from the instance as it's not a dynamic proto function
                            instFuncs_1[name] = target[name];
                            delete target[name];
                            // Add a dynamic proto if one doesn't exist or if a prototype function exists and it's not a dynamic one
                            if (!(0, ts_utils_1.objHasOwnProperty)(proto, name) || (proto[name] && !proto[name][DynProxyTag])) {
                                proto[name] = _createDynamicPrototype(proto, name);
                            }
                        }
                    });
                }
            }
        }
    }
    /**
     * Checks whether the passed prototype object appears to be correct by walking the prototype hierarchy of the instance
     * @param classProto The class prototype instance
     * @param thisTarget The current instance that will be checked whether the passed prototype instance is in the hierarchy
     * @ignore
     */
    function _checkPrototype(classProto, thisTarget) {
        // This method doesn't existing in older browsers (e.g. IE8)
        if (_objGetPrototypeOf) {
            // As this is primarily a coding time check, don't bother checking if running in IE8 or lower
            var visited = [];
            var thisProto = _getObjProto(thisTarget);
            while (thisProto && !_isObjectArrayOrFunctionPrototype(thisProto) && !_hasVisited(visited, thisProto)) {
                if (thisProto === classProto) {
                    return true;
                }
                // This avoids the caller from needing to check whether it's direct base class implements the function or not
                // by walking the entire chain it simplifies the usage and issues from upgrading any of the base classes.
                visited.push(thisProto);
                thisProto = _getObjProto(thisProto);
            }
            return false;
        }
        // If objGetPrototypeOf doesn't exist then just assume everything is ok.
        return true;
    }
    /**
     * Gets the current prototype name using the ES6 name if available otherwise falling back to a use unknown as the name.
     * It's not critical for this to return a name, it's used to decorate the generated unique name for easier debugging only.
     * @param target
     * @param unknownValue
     * @ignore
     */
    function _getObjName(target, unknownValue) {
        if ((0, ts_utils_1.objHasOwnProperty)(target, Prototype)) {
            // Look like a prototype
            return target.name || unknownValue || UnknownValue;
        }
        return (((target || {})[Constructor]) || {}).name || unknownValue || UnknownValue;
    }
    /**
     * Helper function when creating dynamic (inline) functions for classes, this helper performs the following tasks :-
     * - Saves references to all defined base class functions
     * - Calls the delegateFunc with the current target (this) and a base object reference that can be used to call all "super" functions.
     * - Will populate the class prototype for all overridden functions to support class extension that call the prototype instance.
     * Callers should use this helper when declaring all function within the constructor of a class, as mentioned above the delegateFunc is
     * passed both the target "this" and an object that can be used to call any base (super) functions, using this based object in place of
     * super.XXX() (which gets expanded to _super.prototype.XXX()) provides a better minification outcome and also ensures the correct "this"
     * context is maintained as TypeScript creates incorrect references using super.XXXX() for dynamically defined functions i.e. Functions
     * defined in the constructor or some other function (rather than declared as complete typescript functions).
     * ### Usage
     * ```typescript
     * import dynamicProto from "@microsoft/dynamicproto-js";
     * class ExampleClass extends BaseClass {
     *     constructor() {
     *         dynamicProto(ExampleClass, this, (_self, base) => {
     *             // This will define a function that will be converted to a prototype function
     *             _self.newFunc = () => {
     *                 // Access any "this" instance property
     *                 if (_self.someProperty) {
     *                     ...
     *                 }
     *             }
     *             // This will define a function that will be converted to a prototype function
     *             _self.myFunction = () => {
     *                 // Access any "this" instance property
     *                 if (_self.someProperty) {
     *                     // Call the base version of the function that we are overriding
     *                     base.myFunction();
     *                 }
     *                 ...
     *             }
     *             _self.initialize = () => {
     *                 ...
     *             }
     *             // Warnings: While the following will work as _self is simply a reference to
     *             // this, if anyone overrides myFunction() the overridden will be called first
     *             // as the normal JavaScript method resolution will occur and the defined
     *             // _self.initialize() function is actually gets removed from the instance and
     *             // a proxy prototype version is created to reference the created method.
     *             _self.initialize();
     *         });
     *     }
     * }
     * ```
     * @typeparam DPType This is the generic type of the class, used to keep intellisense valid
     * @typeparam DPCls The type that contains the prototype of the current class
     * @param theClass - This is the current class instance which contains the prototype for the current class
     * @param target - The current "this" (target) reference, when the class has been extended this.prototype will not be the 'theClass' value.
     * @param delegateFunc - The callback function (closure) that will create the dynamic function
     * @param options - Additional options to configure how the dynamic prototype operates
     */
    function dynamicProto(theClass, target, delegateFunc, options) {
        // Make sure that the passed theClass argument looks correct
        if (!(0, ts_utils_1.objHasOwnProperty)(theClass, Prototype)) {
            _throwTypeError("theClass is an invalid class definition.");
        }
        // Quick check to make sure that the passed theClass argument looks correct (this is a common copy/paste error)
        var classProto = theClass[Prototype];
        if (!_checkPrototype(classProto, target)) {
            _throwTypeError("[" + _getObjName(theClass) + "] not in hierarchy of [" + _getObjName(target) + "]");
        }
        var className = null;
        if ((0, ts_utils_1.objHasOwnProperty)(classProto, DynClassName)) {
            // Only grab the class name if it's defined on this prototype (i.e. don't walk the prototype chain)
            className = classProto[DynClassName];
        }
        else {
            // As not all browser support name on the prototype creating a unique dynamic one if we have not already
            // assigned one, so we can use a simple string as the lookup rather than an object for the dynamic instance
            // function table lookup.
            className = DynClassNamePrefix + _getObjName(theClass, "_") + "$" + _gblInst.n;
            _gblInst.n++;
            classProto[DynClassName] = className;
        }
        var perfOptions = dynamicProto[DynProtoDefaultOptions];
        var useBaseInst = !!perfOptions[strUseBaseInst];
        if (useBaseInst && options && options[strUseBaseInst] !== undefined) {
            useBaseInst = !!options[strUseBaseInst];
        }
        // Get the current instance functions
        var instFuncs = _getInstanceFuncs(target);
        // Get all of the functions for any base instance (before they are potentially overridden)
        var baseFuncs = _getBaseFuncs(classProto, target, instFuncs, useBaseInst);
        // Execute the delegate passing in both the current target "this" and "base" function references
        // Note casting the same type as we don't actually have the base class here and this will provide some intellisense support
        delegateFunc(target, baseFuncs);
        // Don't allow setting instance functions for older IE instances or in SSR environments
        var setInstanceFunc = !!_objGetPrototypeOf && !!perfOptions[strSetInstFuncs] && !_isServerSideRender();
        if (setInstanceFunc && options) {
            setInstanceFunc = !!options[strSetInstFuncs];
        }
        // Populate the Prototype for any overridden instance functions
        _populatePrototype(classProto, className, target, instFuncs, setInstanceFunc !== false);
    }
    exports.default = dynamicProto;
    /**
     * Exposes the default global options to allow global configuration, if the global values are disabled these will override
     * any passed values. This is primarily exposed to support unit-testing without the need for individual classes to expose
     * their internal usage of dynamic proto.
     */
    dynamicProto[DynProtoDefaultOptions] = _gblInst.o;
});
/// <reference path="./TestFramework/Common.ts" />
define("test/DynamicProto.Tests", ["require", "exports", "src/DynamicProto"], function (require, exports, DynamicProto_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DynamicProtoDefaultTests = void 0;
    var InheritTest1 = /** @class */ (function () {
        function InheritTest1() {
            this.executionOrder = [];
            this.executionOrder.push("InheritTest1()");
        }
        InheritTest1.prototype.testFunction = function () {
            this.executionOrder.push("InheritTest1.test()");
        };
        return InheritTest1;
    }());
    var InheritTest2 = /** @class */ (function (_super) {
        __extends(InheritTest2, _super);
        function InheritTest2() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InheritTest2()");
            return _this;
        }
        InheritTest2.prototype.testFunction = function () {
            _super.prototype.testFunction.call(this);
            this.executionOrder.push("InheritTest2.test()");
        };
        return InheritTest2;
    }(InheritTest1));
    var InheritTest3 = /** @class */ (function (_super) {
        __extends(InheritTest3, _super);
        function InheritTest3() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InheritTest3()");
            return _this;
        }
        InheritTest3.prototype.testFunction = function () {
            _super.prototype.testFunction.call(this);
            this.executionOrder.push("InheritTest3.test()");
        };
        return InheritTest3;
    }(InheritTest2));
    var DynInheritTest1 = /** @class */ (function () {
        function DynInheritTest1() {
            var _this = this;
            this.executionOrder = [];
            this.executionOrder.push("DynInheritTest1()");
            (0, DynamicProto_1.default)(DynInheritTest1, this, function (_self, base) {
                _self.testFunction = function () {
                    _this.executionOrder.push("DynInheritTest1.test()");
                };
            });
        }
        return DynInheritTest1;
    }());
    var InheritTest4 = /** @class */ (function (_super) {
        __extends(InheritTest4, _super);
        function InheritTest4() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InheritTest4()");
            return _this;
        }
        InheritTest4.prototype.testFunction = function () {
            _super.prototype.testFunction.call(this);
            this.executionOrder.push("InheritTest4.test()");
        };
        return InheritTest4;
    }(DynInheritTest1));
    var InheritTest5 = /** @class */ (function (_super) {
        __extends(InheritTest5, _super);
        function InheritTest5() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InheritTest5()");
            return _this;
        }
        InheritTest5.prototype.testFunction = function () {
            _super.prototype.testFunction.call(this);
            this.executionOrder.push("InheritTest5.test()");
        };
        return InheritTest5;
    }(InheritTest4));
    var DynInheritTest2 = /** @class */ (function (_super) {
        __extends(DynInheritTest2, _super);
        function DynInheritTest2() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest2()");
            (0, DynamicProto_1.default)(DynInheritTest2, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest2.test()");
                };
            });
            return _this;
        }
        return DynInheritTest2;
    }(InheritTest1));
    var DynInheritTest3 = /** @class */ (function (_super) {
        __extends(DynInheritTest3, _super);
        function DynInheritTest3() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest3()");
            (0, DynamicProto_1.default)(DynInheritTest3, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest3.test()");
                };
            });
            return _this;
        }
        return DynInheritTest3;
    }(DynInheritTest2));
    var InheritTest6 = /** @class */ (function (_super) {
        __extends(InheritTest6, _super);
        function InheritTest6() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InheritTest6()");
            return _this;
        }
        InheritTest6.prototype.testFunction = function () {
            _super.prototype.testFunction.call(this);
            this.executionOrder.push("InheritTest6.test()");
        };
        return InheritTest6;
    }(DynInheritTest2));
    var DynInheritTest4 = /** @class */ (function (_super) {
        __extends(DynInheritTest4, _super);
        function DynInheritTest4() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest4()");
            (0, DynamicProto_1.default)(DynInheritTest4, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest4.test()");
                };
            });
            return _this;
        }
        return DynInheritTest4;
    }(InheritTest6));
    var DynInheritTest5 = /** @class */ (function (_super) {
        __extends(DynInheritTest5, _super);
        function DynInheritTest5() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest5()");
            (0, DynamicProto_1.default)(DynInheritTest5, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest5.test()");
                };
            });
            return _this;
        }
        return DynInheritTest5;
    }(DynInheritTest1));
    var DynInheritTest6 = /** @class */ (function (_super) {
        __extends(DynInheritTest6, _super);
        function DynInheritTest6() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest6()");
            (0, DynamicProto_1.default)(DynInheritTest6, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest6.test()");
                };
            });
            return _this;
        }
        return DynInheritTest6;
    }(DynInheritTest5));
    var InstInherit1 = /** @class */ (function () {
        function InstInherit1() {
            var _this = this;
            this.executionOrder = [];
            this.executionOrder.push("InstInherit1()");
            this.testFunction = function () {
                _this.executionOrder.push("InstInherit1.test()");
            };
        }
        return InstInherit1;
    }());
    var InstInherit2 = /** @class */ (function (_super) {
        __extends(InstInherit2, _super);
        function InstInherit2() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InstInherit2()");
            _this.testFunction = function () {
                _super.prototype.testFunction.call(_this);
                _this.executionOrder.push("InstInherit2.test()");
            };
            return _this;
        }
        return InstInherit2;
    }(InheritTest2));
    var InheritTest7 = /** @class */ (function (_super) {
        __extends(InheritTest7, _super);
        function InheritTest7() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InheritTest7()");
            return _this;
        }
        InheritTest7.prototype.testFunction = function () {
            _super.prototype.testFunction.call(this);
            this.executionOrder.push("InheritTest7.test()");
        };
        return InheritTest7;
    }(InstInherit1));
    var DynInheritTest7 = /** @class */ (function (_super) {
        __extends(DynInheritTest7, _super);
        function DynInheritTest7() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest7()");
            (0, DynamicProto_1.default)(DynInheritTest7, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest7.test()");
                };
            });
            return _this;
        }
        return DynInheritTest7;
    }(InstInherit1));
    var InstInherit3 = /** @class */ (function (_super) {
        __extends(InstInherit3, _super);
        function InstInherit3() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InstInherit3()");
            _this.testFunction = function () {
                _super.prototype.testFunction.call(_this);
                _this.executionOrder.push("InstInherit3.test()");
            };
            return _this;
        }
        return InstInherit3;
    }(DynInheritTest7));
    var DynInheritTest8 = /** @class */ (function (_super) {
        __extends(DynInheritTest8, _super);
        function DynInheritTest8() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest8()");
            (0, DynamicProto_1.default)(DynInheritTest8, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest8.test()");
                };
            });
            return _this;
        }
        return DynInheritTest8;
    }(InstInherit3));
    var BadInstInherit1 = /** @class */ (function (_super) {
        __extends(BadInstInherit1, _super);
        function BadInstInherit1() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("BadInstInherit1()");
            _this.testFunction = function () {
                try {
                    _super.prototype.testFunction.call(_this);
                }
                catch (e) {
                    _this.executionOrder.push("BadInstInherit1.throw()");
                }
                _this.executionOrder.push("BadInstInherit1.test()");
            };
            return _this;
        }
        return BadInstInherit1;
    }(InstInherit1));
    var DynInheritTest9 = /** @class */ (function (_super) {
        __extends(DynInheritTest9, _super);
        function DynInheritTest9() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest9()");
            (0, DynamicProto_1.default)(DynInheritTest9, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest9.test()");
                };
            });
            return _this;
        }
        return DynInheritTest9;
    }(BadInstInherit1));
    var GoodInstInherit1 = /** @class */ (function (_super) {
        __extends(GoodInstInherit1, _super);
        function GoodInstInherit1() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("GoodInstInherit1()");
            var prevTestFunc = _this.testFunction;
            _this.testFunction = function () {
                prevTestFunc.call(_this);
                _this.executionOrder.push("GoodInstInherit1.test()");
            };
            return _this;
        }
        return GoodInstInherit1;
    }(InstInherit1));
    var DynInheritTest10 = /** @class */ (function (_super) {
        __extends(DynInheritTest10, _super);
        function DynInheritTest10() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest10()");
            (0, DynamicProto_1.default)(DynInheritTest10, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest10.test()");
                };
            });
            return _this;
        }
        return DynInheritTest10;
    }(GoodInstInherit1));
    var GoodInstInherit2 = /** @class */ (function (_super) {
        __extends(GoodInstInherit2, _super);
        function GoodInstInherit2() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("GoodInstInherit2()");
            var prevTestFunc = _this.testFunction;
            _this.testFunction = function () {
                prevTestFunc.call(_this);
                _this.executionOrder.push("GoodInstInherit2.test()");
            };
            return _this;
        }
        return GoodInstInherit2;
    }(DynInheritTest10));
    var DynamicProtoDefaultTests = /** @class */ (function (_super) {
        __extends(DynamicProtoDefaultTests, _super);
        function DynamicProtoDefaultTests() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DynamicProtoDefaultTests.prototype.testInitialize = function () {
        };
        DynamicProtoDefaultTests.prototype._validateOrder = function (message, actual, expected) {
            QUnit.assert.equal(actual.length, expected.length, message + ": Checking the length");
            var passed = true;
            var error = "";
            for (var lp = 0; lp < expected.length; lp++) {
                if (lp < actual.length) {
                    if (actual[lp] !== expected[lp]) {
                        passed = false;
                        error += " **[" + actual[lp] + "!=" + expected[lp] + "]**;";
                    }
                    else {
                        error += " " + expected[lp] + ";";
                    }
                }
                else {
                    passed = false;
                    error += " --[" + expected[lp] + "]--;";
                }
            }
            // Fail test and log any extra unexpected calls
            for (var lp = expected.length; lp < actual.length; lp++) {
                passed = false;
                error += " ++[" + actual[lp] + "]++;";
            }
            QUnit.assert.ok(passed, message + ":" + error);
        };
        DynamicProtoDefaultTests.prototype.doTest = function (message, theTest, expectedOrder) {
            theTest.testFunction();
            this._validateOrder(message, theTest.executionOrder, expectedOrder);
        };
        DynamicProtoDefaultTests.prototype.registerTests = function () {
            var _this = this;
            this.testCase({
                name: "Default: Inheritance tests",
                test: function () {
                    _this.doTest("InheritTest1", new InheritTest1(), [
                        "InheritTest1()",
                        "InheritTest1.test()"
                    ]);
                    _this.doTest("InheritTest2", new InheritTest2(), [
                        "InheritTest1()",
                        "InheritTest2()",
                        "InheritTest1.test()",
                        "InheritTest2.test()"
                    ]);
                    _this.doTest("InheritTest3", new InheritTest3(), [
                        "InheritTest1()",
                        "InheritTest2()",
                        "InheritTest3()",
                        "InheritTest1.test()",
                        "InheritTest2.test()",
                        "InheritTest3.test()"
                    ]);
                    _this.doTest("InheritTest4", new InheritTest4(), [
                        "DynInheritTest1()",
                        "InheritTest4()",
                        "DynInheritTest1.test()",
                        "InheritTest4.test()"
                    ]);
                    _this.doTest("InheritTest5", new InheritTest5(), [
                        "DynInheritTest1()",
                        "InheritTest4()",
                        "InheritTest5()",
                        "DynInheritTest1.test()",
                        "InheritTest4.test()",
                        "InheritTest5.test()"
                    ]);
                    _this.doTest("DynInheritTest1", new DynInheritTest1(), [
                        "DynInheritTest1()",
                        "DynInheritTest1.test()"
                    ]);
                    _this.doTest("DynInheritTest2", new DynInheritTest2(), [
                        "InheritTest1()",
                        "DynInheritTest2()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()"
                    ]);
                    _this.doTest("DynInheritTest3", new DynInheritTest3(), [
                        "InheritTest1()",
                        "DynInheritTest2()",
                        "DynInheritTest3()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()",
                        "DynInheritTest3.test()"
                    ]);
                    _this.doTest("InheritTest6", new InheritTest6(), [
                        "InheritTest1()",
                        "DynInheritTest2()",
                        "InheritTest6()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()",
                        "InheritTest6.test()"
                    ]);
                    _this.doTest("DynInheritTest4", new DynInheritTest4(), [
                        "InheritTest1()",
                        "DynInheritTest2()",
                        "InheritTest6()",
                        "DynInheritTest4()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()",
                        "InheritTest6.test()",
                        "DynInheritTest4.test()"
                    ]);
                    _this.doTest("DynInheritTest5", new DynInheritTest5(), [
                        "DynInheritTest1()",
                        "DynInheritTest5()",
                        "DynInheritTest1.test()",
                        "DynInheritTest5.test()"
                    ]);
                    _this.doTest("DynInheritTest6", new DynInheritTest6(), [
                        "DynInheritTest1()",
                        "DynInheritTest5()",
                        "DynInheritTest6()",
                        "DynInheritTest1.test()",
                        "DynInheritTest5.test()",
                        "DynInheritTest6.test()"
                    ]);
                    _this.doTest("InstInherit1", new InstInherit1(), [
                        "InstInherit1()",
                        "InstInherit1.test()"
                    ]);
                    _this.doTest("InstInherit2", new InstInherit2(), [
                        "InheritTest1()",
                        "InheritTest2()",
                        "InstInherit2()",
                        "InheritTest1.test()",
                        "InheritTest2.test()",
                        "InstInherit2.test()"
                    ]);
                    // NOTE: Notice that InheritTest7.test() was not called -- this is because TS doesn't handle this
                    _this.doTest("InheritTest7", new InheritTest7(), [
                        "InstInherit1()",
                        "InheritTest7()",
                        "InstInherit1.test()"
                    ]);
                    // NOTE: Notice that DynInheritTest7.test() IS called -- this is because dynamicProto handles this scenario
                    _this.doTest("DynInheritTest7", new DynInheritTest7(), [
                        "InstInherit1()",
                        "DynInheritTest7()",
                        "InstInherit1.test()",
                        "DynInheritTest7.test()"
                    ]);
                    _this.doTest("InstInherit3", new InstInherit3(), [
                        "InstInherit1()",
                        "DynInheritTest7()",
                        "InstInherit3()",
                        "InstInherit1.test()",
                        "DynInheritTest7.test()",
                        "InstInherit3.test()"
                    ]);
                    _this.doTest("DynInheritTest8", new DynInheritTest8(), [
                        "InstInherit1()",
                        "DynInheritTest7()",
                        "InstInherit3()",
                        "DynInheritTest8()",
                        "InstInherit1.test()",
                        "DynInheritTest7.test()",
                        "InstInherit3.test()",
                        "DynInheritTest8.test()"
                    ]);
                    // Note: Bad inherit as with InheritTest7 fails to call base instance and actually throws in this case
                    _this.doTest("BadInstInherit1", new BadInstInherit1(), [
                        "InstInherit1()",
                        "BadInstInherit1()",
                        "BadInstInherit1.throw()",
                        "BadInstInherit1.test()"
                    ]);
                    // Note: dynamicProto doesn't fix broken base classes, but it still calls them in the correct order
                    _this.doTest("DynInheritTest9", new DynInheritTest9(), [
                        "InstInherit1()",
                        "BadInstInherit1()",
                        "DynInheritTest9()",
                        "BadInstInherit1.throw()",
                        "BadInstInherit1.test()",
                        "DynInheritTest9.test()"
                    ]);
                    _this.doTest("GoodInstInherit1", new GoodInstInherit1(), [
                        "InstInherit1()",
                        "GoodInstInherit1()",
                        "InstInherit1.test()",
                        "GoodInstInherit1.test()"
                    ]);
                    _this.doTest("DynInheritTest10", new DynInheritTest10(), [
                        "InstInherit1()",
                        "GoodInstInherit1()",
                        "DynInheritTest10()",
                        "InstInherit1.test()",
                        "GoodInstInherit1.test()",
                        "DynInheritTest10.test()"
                    ]);
                    _this.doTest("GoodInstInherit2", new GoodInstInherit2(), [
                        "InstInherit1()",
                        "GoodInstInherit1()",
                        "DynInheritTest10()",
                        "GoodInstInherit2()",
                        "InstInherit1.test()",
                        "GoodInstInherit1.test()",
                        "DynInheritTest10.test()",
                        "GoodInstInherit2.test()",
                    ]);
                }
            });
        };
        return DynamicProtoDefaultTests;
    }(TestClass));
    exports.DynamicProtoDefaultTests = DynamicProtoDefaultTests;
});
/// <reference path="./TestFramework/Common.ts" />
define("test/DynamicProtoMultipleCall.Tests", ["require", "exports", "src/DynamicProto"], function (require, exports, DynamicProto_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DynamicProtoMultipleCallTests = void 0;
    var InheritMultipleCallTest1 = /** @class */ (function () {
        function InheritMultipleCallTest1() {
            this.executionOrder = [];
            this.executionOrder.push("InheritTest1()");
        }
        InheritMultipleCallTest1.prototype.testFunction = function () {
            this.executionOrder.push("InheritTest1.test()");
        };
        return InheritMultipleCallTest1;
    }());
    var InheritMultipleCallTest2 = /** @class */ (function (_super) {
        __extends(InheritMultipleCallTest2, _super);
        function InheritMultipleCallTest2() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InheritTest2()");
            return _this;
        }
        InheritMultipleCallTest2.prototype.testFunction = function () {
            _super.prototype.testFunction.call(this);
            this.executionOrder.push("InheritTest2.test()");
        };
        return InheritMultipleCallTest2;
    }(InheritMultipleCallTest1));
    var InheritMultipleCallTest3 = /** @class */ (function (_super) {
        __extends(InheritMultipleCallTest3, _super);
        function InheritMultipleCallTest3() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InheritTest3()");
            return _this;
        }
        InheritMultipleCallTest3.prototype.testFunction = function () {
            _super.prototype.testFunction.call(this);
            this.executionOrder.push("InheritTest3.test()");
        };
        return InheritMultipleCallTest3;
    }(InheritMultipleCallTest2));
    var DynInheritMultipleCallTest1 = /** @class */ (function () {
        function DynInheritMultipleCallTest1() {
            var _this = this;
            this.executionOrder = [];
            this.executionOrder.push("DynInheritTest1()");
            (0, DynamicProto_2.default)(DynInheritMultipleCallTest1, this, function (_self, base) {
                _self.testFunction = function () {
                    _this.executionOrder.push("DynInheritTest1.test()");
                };
            });
        }
        return DynInheritMultipleCallTest1;
    }());
    var InheritMultipleCallTest4 = /** @class */ (function (_super) {
        __extends(InheritMultipleCallTest4, _super);
        function InheritMultipleCallTest4() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InheritTest4()");
            return _this;
        }
        InheritMultipleCallTest4.prototype.testFunction = function () {
            _super.prototype.testFunction.call(this);
            this.executionOrder.push("InheritTest4.test()");
        };
        return InheritMultipleCallTest4;
    }(DynInheritMultipleCallTest1));
    var InheritMultipleCallTest5 = /** @class */ (function (_super) {
        __extends(InheritMultipleCallTest5, _super);
        function InheritMultipleCallTest5() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InheritTest5()");
            return _this;
        }
        InheritMultipleCallTest5.prototype.testFunction = function () {
            _super.prototype.testFunction.call(this);
            this.executionOrder.push("InheritTest5.test()");
        };
        return InheritMultipleCallTest5;
    }(InheritMultipleCallTest4));
    var DynInheritMultipleCallTest2 = /** @class */ (function (_super) {
        __extends(DynInheritMultipleCallTest2, _super);
        function DynInheritMultipleCallTest2() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest2()");
            (0, DynamicProto_2.default)(DynInheritMultipleCallTest2, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest2.test()");
                };
            });
            return _this;
        }
        return DynInheritMultipleCallTest2;
    }(InheritMultipleCallTest1));
    var DynInheritMultipleCallTest3 = /** @class */ (function (_super) {
        __extends(DynInheritMultipleCallTest3, _super);
        function DynInheritMultipleCallTest3() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest3()");
            (0, DynamicProto_2.default)(DynInheritMultipleCallTest3, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest3.test()");
                };
            });
            return _this;
        }
        return DynInheritMultipleCallTest3;
    }(DynInheritMultipleCallTest2));
    var InheritMultipleCallTest6 = /** @class */ (function (_super) {
        __extends(InheritMultipleCallTest6, _super);
        function InheritMultipleCallTest6() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InheritTest6()");
            return _this;
        }
        InheritMultipleCallTest6.prototype.testFunction = function () {
            _super.prototype.testFunction.call(this);
            this.executionOrder.push("InheritTest6.test()");
        };
        return InheritMultipleCallTest6;
    }(DynInheritMultipleCallTest2));
    var DynInheritMultipleCallTest4 = /** @class */ (function (_super) {
        __extends(DynInheritMultipleCallTest4, _super);
        function DynInheritMultipleCallTest4() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest4()");
            (0, DynamicProto_2.default)(DynInheritMultipleCallTest4, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest4.test()");
                };
            });
            return _this;
        }
        return DynInheritMultipleCallTest4;
    }(InheritMultipleCallTest6));
    var DynInheritMultipleCallTest5 = /** @class */ (function (_super) {
        __extends(DynInheritMultipleCallTest5, _super);
        function DynInheritMultipleCallTest5() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest5()");
            (0, DynamicProto_2.default)(DynInheritMultipleCallTest5, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest5.test()");
                };
            });
            return _this;
        }
        return DynInheritMultipleCallTest5;
    }(DynInheritMultipleCallTest1));
    var DynInheritMultipleCallTest6 = /** @class */ (function (_super) {
        __extends(DynInheritMultipleCallTest6, _super);
        function DynInheritMultipleCallTest6() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest6()");
            (0, DynamicProto_2.default)(DynInheritMultipleCallTest6, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest6.test()");
                };
            });
            return _this;
        }
        return DynInheritMultipleCallTest6;
    }(DynInheritMultipleCallTest5));
    var InstInheritMultipleCall1 = /** @class */ (function () {
        function InstInheritMultipleCall1() {
            var _this = this;
            this.executionOrder = [];
            this.executionOrder.push("InstInherit1()");
            this.testFunction = function () {
                _this.executionOrder.push("InstInherit1.test()");
            };
        }
        return InstInheritMultipleCall1;
    }());
    var InstInheritMultipleCall2 = /** @class */ (function (_super) {
        __extends(InstInheritMultipleCall2, _super);
        function InstInheritMultipleCall2() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InstInherit2()");
            _this.testFunction = function () {
                _super.prototype.testFunction.call(_this);
                _this.executionOrder.push("InstInherit2.test()");
            };
            return _this;
        }
        return InstInheritMultipleCall2;
    }(InheritMultipleCallTest2));
    var InheritMultipleCallTest7 = /** @class */ (function (_super) {
        __extends(InheritMultipleCallTest7, _super);
        function InheritMultipleCallTest7() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InheritTest7()");
            return _this;
        }
        InheritMultipleCallTest7.prototype.testFunction = function () {
            _super.prototype.testFunction.call(this);
            this.executionOrder.push("InheritTest7.test()");
        };
        return InheritMultipleCallTest7;
    }(InstInheritMultipleCall1));
    var DynInheritMultipleCallTest7 = /** @class */ (function (_super) {
        __extends(DynInheritMultipleCallTest7, _super);
        function DynInheritMultipleCallTest7() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest7()");
            (0, DynamicProto_2.default)(DynInheritMultipleCallTest7, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest7.test()");
                };
            });
            return _this;
        }
        return DynInheritMultipleCallTest7;
    }(InstInheritMultipleCall1));
    var InstInheritMultipleCall3 = /** @class */ (function (_super) {
        __extends(InstInheritMultipleCall3, _super);
        function InstInheritMultipleCall3() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InstInherit3()");
            _this.testFunction = function () {
                _super.prototype.testFunction.call(_this);
                _this.executionOrder.push("InstInherit3.test()");
            };
            return _this;
        }
        return InstInheritMultipleCall3;
    }(DynInheritMultipleCallTest7));
    var DynInheritMultipleCallTest8 = /** @class */ (function (_super) {
        __extends(DynInheritMultipleCallTest8, _super);
        function DynInheritMultipleCallTest8() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest8()");
            (0, DynamicProto_2.default)(DynInheritMultipleCallTest8, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest8.test()");
                };
            });
            return _this;
        }
        return DynInheritMultipleCallTest8;
    }(InstInheritMultipleCall3));
    var BadInstInheritMultipleCall1 = /** @class */ (function (_super) {
        __extends(BadInstInheritMultipleCall1, _super);
        function BadInstInheritMultipleCall1() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("BadInstInherit1()");
            _this.testFunction = function () {
                try {
                    _super.prototype.testFunction.call(_this);
                }
                catch (e) {
                    _this.executionOrder.push("BadInstInherit1.throw()");
                }
                _this.executionOrder.push("BadInstInherit1.test()");
            };
            return _this;
        }
        return BadInstInheritMultipleCall1;
    }(InstInheritMultipleCall1));
    var DynInheritTestMultipleCall9 = /** @class */ (function (_super) {
        __extends(DynInheritTestMultipleCall9, _super);
        function DynInheritTestMultipleCall9() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest9()");
            (0, DynamicProto_2.default)(DynInheritTestMultipleCall9, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest9.test()");
                };
            });
            return _this;
        }
        return DynInheritTestMultipleCall9;
    }(BadInstInheritMultipleCall1));
    var GoodInstInheritMultipleCall1 = /** @class */ (function (_super) {
        __extends(GoodInstInheritMultipleCall1, _super);
        function GoodInstInheritMultipleCall1() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("GoodInstInherit1()");
            var prevTestFunc = _this.testFunction;
            _this.testFunction = function () {
                prevTestFunc.call(_this);
                _this.executionOrder.push("GoodInstInherit1.test()");
            };
            return _this;
        }
        return GoodInstInheritMultipleCall1;
    }(InstInheritMultipleCall1));
    var DynInheritTestMultipleCall10 = /** @class */ (function (_super) {
        __extends(DynInheritTestMultipleCall10, _super);
        function DynInheritTestMultipleCall10() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest10()");
            (0, DynamicProto_2.default)(DynInheritTestMultipleCall10, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest10.test()");
                };
            });
            return _this;
        }
        return DynInheritTestMultipleCall10;
    }(GoodInstInheritMultipleCall1));
    var GoodInstInheritMultipleCall2 = /** @class */ (function (_super) {
        __extends(GoodInstInheritMultipleCall2, _super);
        function GoodInstInheritMultipleCall2() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("GoodInstInherit2()");
            var prevTestFunc = _this.testFunction;
            _this.testFunction = function () {
                prevTestFunc.call(_this);
                _this.executionOrder.push("GoodInstInherit2.test()");
            };
            return _this;
        }
        return GoodInstInheritMultipleCall2;
    }(DynInheritTestMultipleCall10));
    var DynamicProtoMultipleCallTests = /** @class */ (function (_super) {
        __extends(DynamicProtoMultipleCallTests, _super);
        function DynamicProtoMultipleCallTests() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DynamicProtoMultipleCallTests.prototype.testInitialize = function () {
        };
        DynamicProtoMultipleCallTests.prototype._validateOrder = function (message, actual, expected) {
            QUnit.assert.equal(actual.length, expected.length, message + ": Checking the length");
            var passed = true;
            var error = "";
            for (var lp = 0; lp < expected.length; lp++) {
                if (lp < actual.length) {
                    if (actual[lp] !== expected[lp]) {
                        passed = false;
                        error += " **[" + actual[lp] + "!=" + expected[lp] + "]**;";
                    }
                    else {
                        error += " " + expected[lp] + ";";
                    }
                }
                else {
                    passed = false;
                    error += " --[" + expected[lp] + "]--;";
                }
            }
            // Fail test and log any extra unexpected calls
            for (var lp = expected.length; lp < actual.length; lp++) {
                passed = false;
                error += " ++[" + actual[lp] + "]++;";
            }
            QUnit.assert.ok(passed, message + ":" + error);
        };
        DynamicProtoMultipleCallTests.prototype.doTest = function (message, theTest, expectedOrder) {
            theTest.testFunction();
            theTest.testFunction();
            theTest.testFunction();
            this._validateOrder(message, theTest.executionOrder, expectedOrder);
        };
        DynamicProtoMultipleCallTests.prototype.registerTests = function () {
            var _this = this;
            this.testCase({
                name: "MultipleCall: Inheritance tests",
                test: function () {
                    _this.doTest("InheritTest1", new InheritMultipleCallTest1(), [
                        "InheritTest1()",
                        "InheritTest1.test()",
                        "InheritTest1.test()",
                        "InheritTest1.test()"
                    ]);
                    _this.doTest("InheritTest2", new InheritMultipleCallTest2(), [
                        "InheritTest1()",
                        "InheritTest2()",
                        "InheritTest1.test()",
                        "InheritTest2.test()",
                        "InheritTest1.test()",
                        "InheritTest2.test()",
                        "InheritTest1.test()",
                        "InheritTest2.test()"
                    ]);
                    _this.doTest("InheritTest3", new InheritMultipleCallTest3(), [
                        "InheritTest1()",
                        "InheritTest2()",
                        "InheritTest3()",
                        "InheritTest1.test()",
                        "InheritTest2.test()",
                        "InheritTest3.test()",
                        "InheritTest1.test()",
                        "InheritTest2.test()",
                        "InheritTest3.test()",
                        "InheritTest1.test()",
                        "InheritTest2.test()",
                        "InheritTest3.test()"
                    ]);
                    _this.doTest("InheritTest4", new InheritMultipleCallTest4(), [
                        "DynInheritTest1()",
                        "InheritTest4()",
                        "DynInheritTest1.test()",
                        "InheritTest4.test()",
                        "DynInheritTest1.test()",
                        "InheritTest4.test()",
                        "DynInheritTest1.test()",
                        "InheritTest4.test()"
                    ]);
                    _this.doTest("InheritTest5", new InheritMultipleCallTest5(), [
                        "DynInheritTest1()",
                        "InheritTest4()",
                        "InheritTest5()",
                        "DynInheritTest1.test()",
                        "InheritTest4.test()",
                        "InheritTest5.test()",
                        "DynInheritTest1.test()",
                        "InheritTest4.test()",
                        "InheritTest5.test()",
                        "DynInheritTest1.test()",
                        "InheritTest4.test()",
                        "InheritTest5.test()"
                    ]);
                    _this.doTest("DynInheritTest1", new DynInheritMultipleCallTest1(), [
                        "DynInheritTest1()",
                        "DynInheritTest1.test()",
                        "DynInheritTest1.test()",
                        "DynInheritTest1.test()"
                    ]);
                    _this.doTest("DynInheritTest2", new DynInheritMultipleCallTest2(), [
                        "InheritTest1()",
                        "DynInheritTest2()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()"
                    ]);
                    _this.doTest("DynInheritTest3", new DynInheritMultipleCallTest3(), [
                        "InheritTest1()",
                        "DynInheritTest2()",
                        "DynInheritTest3()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()",
                        "DynInheritTest3.test()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()",
                        "DynInheritTest3.test()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()",
                        "DynInheritTest3.test()"
                    ]);
                    _this.doTest("InheritTest6", new InheritMultipleCallTest6(), [
                        "InheritTest1()",
                        "DynInheritTest2()",
                        "InheritTest6()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()",
                        "InheritTest6.test()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()",
                        "InheritTest6.test()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()",
                        "InheritTest6.test()"
                    ]);
                    _this.doTest("DynInheritTest4", new DynInheritMultipleCallTest4(), [
                        "InheritTest1()",
                        "DynInheritTest2()",
                        "InheritTest6()",
                        "DynInheritTest4()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()",
                        "InheritTest6.test()",
                        "DynInheritTest4.test()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()",
                        "InheritTest6.test()",
                        "DynInheritTest4.test()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()",
                        "InheritTest6.test()",
                        "DynInheritTest4.test()"
                    ]);
                    _this.doTest("DynInheritTest5", new DynInheritMultipleCallTest5(), [
                        "DynInheritTest1()",
                        "DynInheritTest5()",
                        "DynInheritTest1.test()",
                        "DynInheritTest5.test()",
                        "DynInheritTest1.test()",
                        "DynInheritTest5.test()",
                        "DynInheritTest1.test()",
                        "DynInheritTest5.test()"
                    ]);
                    _this.doTest("DynInheritTest6", new DynInheritMultipleCallTest6(), [
                        "DynInheritTest1()",
                        "DynInheritTest5()",
                        "DynInheritTest6()",
                        "DynInheritTest1.test()",
                        "DynInheritTest5.test()",
                        "DynInheritTest6.test()",
                        "DynInheritTest1.test()",
                        "DynInheritTest5.test()",
                        "DynInheritTest6.test()",
                        "DynInheritTest1.test()",
                        "DynInheritTest5.test()",
                        "DynInheritTest6.test()"
                    ]);
                    _this.doTest("InstInherit1", new InstInheritMultipleCall1(), [
                        "InstInherit1()",
                        "InstInherit1.test()",
                        "InstInherit1.test()",
                        "InstInherit1.test()"
                    ]);
                    _this.doTest("InstInherit2", new InstInheritMultipleCall2(), [
                        "InheritTest1()",
                        "InheritTest2()",
                        "InstInherit2()",
                        "InheritTest1.test()",
                        "InheritTest2.test()",
                        "InstInherit2.test()",
                        "InheritTest1.test()",
                        "InheritTest2.test()",
                        "InstInherit2.test()",
                        "InheritTest1.test()",
                        "InheritTest2.test()",
                        "InstInherit2.test()"
                    ]);
                    // NOTE: Notice that InheritTest7.test() was not called -- this is because TS doesn't handle this
                    _this.doTest("InheritTest7", new InheritMultipleCallTest7(), [
                        "InstInherit1()",
                        "InheritTest7()",
                        "InstInherit1.test()",
                        "InstInherit1.test()",
                        "InstInherit1.test()"
                    ]);
                    // NOTE: Notice that DynInheritTest7.test() IS called -- this is because dynamicProto handles this scenario
                    _this.doTest("DynInheritTest7", new DynInheritMultipleCallTest7(), [
                        "InstInherit1()",
                        "DynInheritTest7()",
                        "InstInherit1.test()",
                        "DynInheritTest7.test()",
                        "InstInherit1.test()",
                        "DynInheritTest7.test()",
                        "InstInherit1.test()",
                        "DynInheritTest7.test()"
                    ]);
                    _this.doTest("InstInherit3", new InstInheritMultipleCall3(), [
                        "InstInherit1()",
                        "DynInheritTest7()",
                        "InstInherit3()",
                        "InstInherit1.test()",
                        "DynInheritTest7.test()",
                        "InstInherit3.test()",
                        "InstInherit1.test()",
                        "DynInheritTest7.test()",
                        "InstInherit3.test()",
                        "InstInherit1.test()",
                        "DynInheritTest7.test()",
                        "InstInherit3.test()"
                    ]);
                    _this.doTest("DynInheritTest8", new DynInheritMultipleCallTest8(), [
                        "InstInherit1()",
                        "DynInheritTest7()",
                        "InstInherit3()",
                        "DynInheritTest8()",
                        "InstInherit1.test()",
                        "DynInheritTest7.test()",
                        "InstInherit3.test()",
                        "DynInheritTest8.test()",
                        "InstInherit1.test()",
                        "DynInheritTest7.test()",
                        "InstInherit3.test()",
                        "DynInheritTest8.test()",
                        "InstInherit1.test()",
                        "DynInheritTest7.test()",
                        "InstInherit3.test()",
                        "DynInheritTest8.test()"
                    ]);
                    // Note: Bad inherit as with InheritTest7 fails to call base instance and actually throws in this case
                    _this.doTest("BadInstInherit1", new BadInstInheritMultipleCall1(), [
                        "InstInherit1()",
                        "BadInstInherit1()",
                        "BadInstInherit1.throw()",
                        "BadInstInherit1.test()",
                        "BadInstInherit1.throw()",
                        "BadInstInherit1.test()",
                        "BadInstInherit1.throw()",
                        "BadInstInherit1.test()"
                    ]);
                    // Note: dynamicProto doesn't fix broken base classes, but it still calls them in the correct order
                    _this.doTest("DynInheritTest9", new DynInheritTestMultipleCall9(), [
                        "InstInherit1()",
                        "BadInstInherit1()",
                        "DynInheritTest9()",
                        "BadInstInherit1.throw()",
                        "BadInstInherit1.test()",
                        "DynInheritTest9.test()",
                        "BadInstInherit1.throw()",
                        "BadInstInherit1.test()",
                        "DynInheritTest9.test()",
                        "BadInstInherit1.throw()",
                        "BadInstInherit1.test()",
                        "DynInheritTest9.test()"
                    ]);
                    _this.doTest("GoodInstInherit1", new GoodInstInheritMultipleCall1(), [
                        "InstInherit1()",
                        "GoodInstInherit1()",
                        "InstInherit1.test()",
                        "GoodInstInherit1.test()",
                        "InstInherit1.test()",
                        "GoodInstInherit1.test()",
                        "InstInherit1.test()",
                        "GoodInstInherit1.test()"
                    ]);
                    _this.doTest("DynInheritTest10", new DynInheritTestMultipleCall10(), [
                        "InstInherit1()",
                        "GoodInstInherit1()",
                        "DynInheritTest10()",
                        "InstInherit1.test()",
                        "GoodInstInherit1.test()",
                        "DynInheritTest10.test()",
                        "InstInherit1.test()",
                        "GoodInstInherit1.test()",
                        "DynInheritTest10.test()",
                        "InstInherit1.test()",
                        "GoodInstInherit1.test()",
                        "DynInheritTest10.test()"
                    ]);
                    _this.doTest("GoodInstInherit2", new GoodInstInheritMultipleCall2(), [
                        "InstInherit1()",
                        "GoodInstInherit1()",
                        "DynInheritTest10()",
                        "GoodInstInherit2()",
                        "InstInherit1.test()",
                        "GoodInstInherit1.test()",
                        "DynInheritTest10.test()",
                        "GoodInstInherit2.test()",
                        "InstInherit1.test()",
                        "GoodInstInherit1.test()",
                        "DynInheritTest10.test()",
                        "GoodInstInherit2.test()",
                        "InstInherit1.test()",
                        "GoodInstInherit1.test()",
                        "DynInheritTest10.test()",
                        "GoodInstInherit2.test()"
                    ]);
                }
            });
        };
        return DynamicProtoMultipleCallTests;
    }(TestClass));
    exports.DynamicProtoMultipleCallTests = DynamicProtoMultipleCallTests;
});
/// <reference path="./TestFramework/Common.ts" />
define("test/DynamicProtoNoInst.Tests", ["require", "exports", "src/DynamicProto"], function (require, exports, DynamicProto_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DynamicProtoNoInstTests = void 0;
    var InheritNoInstTest1 = /** @class */ (function () {
        function InheritNoInstTest1() {
            this.executionOrder = [];
            this.executionOrder.push("InheritTest1()");
        }
        InheritNoInstTest1.prototype.testFunction = function () {
            this.executionOrder.push("InheritTest1.test()");
        };
        return InheritNoInstTest1;
    }());
    var InheritNoInstTest2 = /** @class */ (function (_super) {
        __extends(InheritNoInstTest2, _super);
        function InheritNoInstTest2() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InheritTest2()");
            return _this;
        }
        InheritNoInstTest2.prototype.testFunction = function () {
            _super.prototype.testFunction.call(this);
            this.executionOrder.push("InheritTest2.test()");
        };
        return InheritNoInstTest2;
    }(InheritNoInstTest1));
    var InheritNoInstTest3 = /** @class */ (function (_super) {
        __extends(InheritNoInstTest3, _super);
        function InheritNoInstTest3() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InheritTest3()");
            return _this;
        }
        InheritNoInstTest3.prototype.testFunction = function () {
            _super.prototype.testFunction.call(this);
            this.executionOrder.push("InheritTest3.test()");
        };
        return InheritNoInstTest3;
    }(InheritNoInstTest2));
    var DynInheritNoInstTest1 = /** @class */ (function () {
        function DynInheritNoInstTest1() {
            var _this = this;
            this.executionOrder = [];
            this.executionOrder.push("DynInheritTest1()");
            (0, DynamicProto_3.default)(DynInheritNoInstTest1, this, function (_self, base) {
                _self.testFunction = function () {
                    _this.executionOrder.push("DynInheritTest1.test()");
                };
            }, { setInstFuncs: false });
        }
        return DynInheritNoInstTest1;
    }());
    var InheritNoInstTest4 = /** @class */ (function (_super) {
        __extends(InheritNoInstTest4, _super);
        function InheritNoInstTest4() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InheritTest4()");
            return _this;
        }
        InheritNoInstTest4.prototype.testFunction = function () {
            _super.prototype.testFunction.call(this);
            this.executionOrder.push("InheritTest4.test()");
        };
        return InheritNoInstTest4;
    }(DynInheritNoInstTest1));
    var InheritNoInstTest5 = /** @class */ (function (_super) {
        __extends(InheritNoInstTest5, _super);
        function InheritNoInstTest5() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InheritTest5()");
            return _this;
        }
        InheritNoInstTest5.prototype.testFunction = function () {
            _super.prototype.testFunction.call(this);
            this.executionOrder.push("InheritTest5.test()");
        };
        return InheritNoInstTest5;
    }(InheritNoInstTest4));
    var DynInheritNoInstTest2 = /** @class */ (function (_super) {
        __extends(DynInheritNoInstTest2, _super);
        function DynInheritNoInstTest2() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest2()");
            (0, DynamicProto_3.default)(DynInheritNoInstTest2, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest2.test()");
                };
            }, { setInstFuncs: false });
            return _this;
        }
        return DynInheritNoInstTest2;
    }(InheritNoInstTest1));
    var DynInheritNoInstTest3 = /** @class */ (function (_super) {
        __extends(DynInheritNoInstTest3, _super);
        function DynInheritNoInstTest3() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest3()");
            (0, DynamicProto_3.default)(DynInheritNoInstTest3, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest3.test()");
                };
            }, { setInstFuncs: false });
            return _this;
        }
        return DynInheritNoInstTest3;
    }(DynInheritNoInstTest2));
    var InheritNoInstTest6 = /** @class */ (function (_super) {
        __extends(InheritNoInstTest6, _super);
        function InheritNoInstTest6() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InheritTest6()");
            return _this;
        }
        InheritNoInstTest6.prototype.testFunction = function () {
            _super.prototype.testFunction.call(this);
            this.executionOrder.push("InheritTest6.test()");
        };
        return InheritNoInstTest6;
    }(DynInheritNoInstTest2));
    var DynInheritNoInstTest4 = /** @class */ (function (_super) {
        __extends(DynInheritNoInstTest4, _super);
        function DynInheritNoInstTest4() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest4()");
            (0, DynamicProto_3.default)(DynInheritNoInstTest4, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest4.test()");
                };
            }, { setInstFuncs: false });
            return _this;
        }
        return DynInheritNoInstTest4;
    }(InheritNoInstTest6));
    var DynInheritNoInstTest5 = /** @class */ (function (_super) {
        __extends(DynInheritNoInstTest5, _super);
        function DynInheritNoInstTest5() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest5()");
            (0, DynamicProto_3.default)(DynInheritNoInstTest5, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest5.test()");
                };
            }, { setInstFuncs: false });
            return _this;
        }
        return DynInheritNoInstTest5;
    }(DynInheritNoInstTest1));
    var DynInheritNoInstTest6 = /** @class */ (function (_super) {
        __extends(DynInheritNoInstTest6, _super);
        function DynInheritNoInstTest6() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest6()");
            (0, DynamicProto_3.default)(DynInheritNoInstTest6, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest6.test()");
                };
            }, { setInstFuncs: false });
            return _this;
        }
        return DynInheritNoInstTest6;
    }(DynInheritNoInstTest5));
    var InstInheritNoInst1 = /** @class */ (function () {
        function InstInheritNoInst1() {
            var _this = this;
            this.executionOrder = [];
            this.executionOrder.push("InstInherit1()");
            this.testFunction = function () {
                _this.executionOrder.push("InstInherit1.test()");
            };
        }
        return InstInheritNoInst1;
    }());
    var InstInheritNoInst2 = /** @class */ (function (_super) {
        __extends(InstInheritNoInst2, _super);
        function InstInheritNoInst2() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InstInherit2()");
            _this.testFunction = function () {
                _super.prototype.testFunction.call(_this);
                _this.executionOrder.push("InstInherit2.test()");
            };
            return _this;
        }
        return InstInheritNoInst2;
    }(InheritNoInstTest2));
    var InheritNoInstTest7 = /** @class */ (function (_super) {
        __extends(InheritNoInstTest7, _super);
        function InheritNoInstTest7() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InheritTest7()");
            return _this;
        }
        InheritNoInstTest7.prototype.testFunction = function () {
            _super.prototype.testFunction.call(this);
            this.executionOrder.push("InheritTest7.test()");
        };
        return InheritNoInstTest7;
    }(InstInheritNoInst1));
    var DynInheritNoInstTest7 = /** @class */ (function (_super) {
        __extends(DynInheritNoInstTest7, _super);
        function DynInheritNoInstTest7() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest7()");
            (0, DynamicProto_3.default)(DynInheritNoInstTest7, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest7.test()");
                };
            });
            return _this;
        }
        return DynInheritNoInstTest7;
    }(InstInheritNoInst1));
    var InstInheritNoInst3 = /** @class */ (function (_super) {
        __extends(InstInheritNoInst3, _super);
        function InstInheritNoInst3() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InstInherit3()");
            _this.testFunction = function () {
                _super.prototype.testFunction.call(_this);
                _this.executionOrder.push("InstInherit3.test()");
            };
            return _this;
        }
        return InstInheritNoInst3;
    }(DynInheritNoInstTest7));
    var DynInheritNoInstTest8 = /** @class */ (function (_super) {
        __extends(DynInheritNoInstTest8, _super);
        function DynInheritNoInstTest8() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest8()");
            (0, DynamicProto_3.default)(DynInheritNoInstTest8, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest8.test()");
                };
            }, { setInstFuncs: false });
            return _this;
        }
        return DynInheritNoInstTest8;
    }(InstInheritNoInst3));
    var BadInstInheritNoInst1 = /** @class */ (function (_super) {
        __extends(BadInstInheritNoInst1, _super);
        function BadInstInheritNoInst1() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("BadInstInherit1()");
            _this.testFunction = function () {
                try {
                    _super.prototype.testFunction.call(_this);
                }
                catch (e) {
                    _this.executionOrder.push("BadInstInherit1.throw()");
                }
                _this.executionOrder.push("BadInstInherit1.test()");
            };
            return _this;
        }
        return BadInstInheritNoInst1;
    }(InstInheritNoInst1));
    var DynInheritTestNoInst9 = /** @class */ (function (_super) {
        __extends(DynInheritTestNoInst9, _super);
        function DynInheritTestNoInst9() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest9()");
            (0, DynamicProto_3.default)(DynInheritTestNoInst9, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest9.test()");
                };
            }, { setInstFuncs: false });
            return _this;
        }
        return DynInheritTestNoInst9;
    }(BadInstInheritNoInst1));
    var GoodInstInheritNoInst1 = /** @class */ (function (_super) {
        __extends(GoodInstInheritNoInst1, _super);
        function GoodInstInheritNoInst1() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("GoodInstInherit1()");
            var prevTestFunc = _this.testFunction;
            _this.testFunction = function () {
                prevTestFunc.call(_this);
                _this.executionOrder.push("GoodInstInherit1.test()");
            };
            return _this;
        }
        return GoodInstInheritNoInst1;
    }(InstInheritNoInst1));
    var DynInheritTestNoInst10 = /** @class */ (function (_super) {
        __extends(DynInheritTestNoInst10, _super);
        function DynInheritTestNoInst10() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest10()");
            (0, DynamicProto_3.default)(DynInheritTestNoInst10, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest10.test()");
                };
            }, { setInstFuncs: false });
            return _this;
        }
        return DynInheritTestNoInst10;
    }(GoodInstInheritNoInst1));
    var GoodInstInheritNoInst2 = /** @class */ (function (_super) {
        __extends(GoodInstInheritNoInst2, _super);
        function GoodInstInheritNoInst2() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("GoodInstInherit2()");
            var prevTestFunc = _this.testFunction;
            _this.testFunction = function () {
                prevTestFunc.call(_this);
                _this.executionOrder.push("GoodInstInherit2.test()");
            };
            return _this;
        }
        return GoodInstInheritNoInst2;
    }(DynInheritTestNoInst10));
    var DynamicProtoNoInstTests = /** @class */ (function (_super) {
        __extends(DynamicProtoNoInstTests, _super);
        function DynamicProtoNoInstTests() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DynamicProtoNoInstTests.prototype.testInitialize = function () {
        };
        DynamicProtoNoInstTests.prototype._validateOrder = function (message, actual, expected) {
            QUnit.assert.equal(actual.length, expected.length, message + ": Checking the length");
            var passed = true;
            var error = "";
            for (var lp = 0; lp < expected.length; lp++) {
                if (lp < actual.length) {
                    if (actual[lp] !== expected[lp]) {
                        passed = false;
                        error += " **[" + actual[lp] + "!=" + expected[lp] + "]**;";
                    }
                    else {
                        error += " " + expected[lp] + ";";
                    }
                }
                else {
                    passed = false;
                    error += " --[" + expected[lp] + "]--;";
                }
            }
            // Fail test and log any extra unexpected calls
            for (var lp = expected.length; lp < actual.length; lp++) {
                passed = false;
                error += " ++[" + actual[lp] + "]++;";
            }
            QUnit.assert.ok(passed, message + ":" + error);
        };
        DynamicProtoNoInstTests.prototype.doTest = function (message, theTest, expectedOrder) {
            theTest.testFunction();
            this._validateOrder(message, theTest.executionOrder, expectedOrder);
        };
        DynamicProtoNoInstTests.prototype.registerTests = function () {
            var _this = this;
            this.testCase({
                name: "NoInst: Inheritance tests",
                test: function () {
                    _this.doTest("InheritTest1", new InheritNoInstTest1(), [
                        "InheritTest1()",
                        "InheritTest1.test()"
                    ]);
                    _this.doTest("InheritTest2", new InheritNoInstTest2(), [
                        "InheritTest1()",
                        "InheritTest2()",
                        "InheritTest1.test()",
                        "InheritTest2.test()"
                    ]);
                    _this.doTest("InheritTest3", new InheritNoInstTest3(), [
                        "InheritTest1()",
                        "InheritTest2()",
                        "InheritTest3()",
                        "InheritTest1.test()",
                        "InheritTest2.test()",
                        "InheritTest3.test()"
                    ]);
                    _this.doTest("InheritTest4", new InheritNoInstTest4(), [
                        "DynInheritTest1()",
                        "InheritTest4()",
                        "DynInheritTest1.test()",
                        "InheritTest4.test()"
                    ]);
                    _this.doTest("InheritTest5", new InheritNoInstTest5(), [
                        "DynInheritTest1()",
                        "InheritTest4()",
                        "InheritTest5()",
                        "DynInheritTest1.test()",
                        "InheritTest4.test()",
                        "InheritTest5.test()"
                    ]);
                    _this.doTest("DynInheritTest1", new DynInheritNoInstTest1(), [
                        "DynInheritTest1()",
                        "DynInheritTest1.test()"
                    ]);
                    _this.doTest("DynInheritTest2", new DynInheritNoInstTest2(), [
                        "InheritTest1()",
                        "DynInheritTest2()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()"
                    ]);
                    _this.doTest("DynInheritTest3", new DynInheritNoInstTest3(), [
                        "InheritTest1()",
                        "DynInheritTest2()",
                        "DynInheritTest3()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()",
                        "DynInheritTest3.test()"
                    ]);
                    _this.doTest("InheritTest6", new InheritNoInstTest6(), [
                        "InheritTest1()",
                        "DynInheritTest2()",
                        "InheritTest6()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()",
                        "InheritTest6.test()"
                    ]);
                    _this.doTest("DynInheritTest4", new DynInheritNoInstTest4(), [
                        "InheritTest1()",
                        "DynInheritTest2()",
                        "InheritTest6()",
                        "DynInheritTest4()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()",
                        "InheritTest6.test()",
                        "DynInheritTest4.test()"
                    ]);
                    _this.doTest("DynInheritTest5", new DynInheritNoInstTest5(), [
                        "DynInheritTest1()",
                        "DynInheritTest5()",
                        "DynInheritTest1.test()",
                        "DynInheritTest5.test()"
                    ]);
                    _this.doTest("DynInheritTest6", new DynInheritNoInstTest6(), [
                        "DynInheritTest1()",
                        "DynInheritTest5()",
                        "DynInheritTest6()",
                        "DynInheritTest1.test()",
                        "DynInheritTest5.test()",
                        "DynInheritTest6.test()"
                    ]);
                    _this.doTest("InstInherit1", new InstInheritNoInst1(), [
                        "InstInherit1()",
                        "InstInherit1.test()"
                    ]);
                    _this.doTest("InstInherit2", new InstInheritNoInst2(), [
                        "InheritTest1()",
                        "InheritTest2()",
                        "InstInherit2()",
                        "InheritTest1.test()",
                        "InheritTest2.test()",
                        "InstInherit2.test()"
                    ]);
                    // NOTE: Notice that InheritTest7.test() was not called -- this is because TS doesn't handle this
                    _this.doTest("InheritTest7", new InheritNoInstTest7(), [
                        "InstInherit1()",
                        "InheritTest7()",
                        "InstInherit1.test()"
                    ]);
                    // NOTE: Notice that DynInheritTest7.test() IS called -- this is because dynamicProto handles this scenario
                    _this.doTest("DynInheritTest7", new DynInheritNoInstTest7(), [
                        "InstInherit1()",
                        "DynInheritTest7()",
                        "InstInherit1.test()",
                        "DynInheritTest7.test()"
                    ]);
                    _this.doTest("InstInherit3", new InstInheritNoInst3(), [
                        "InstInherit1()",
                        "DynInheritTest7()",
                        "InstInherit3()",
                        "InstInherit1.test()",
                        "DynInheritTest7.test()",
                        "InstInherit3.test()"
                    ]);
                    _this.doTest("DynInheritTest8", new DynInheritNoInstTest8(), [
                        "InstInherit1()",
                        "DynInheritTest7()",
                        "InstInherit3()",
                        "DynInheritTest8()",
                        "InstInherit1.test()",
                        "DynInheritTest7.test()",
                        "InstInherit3.test()",
                        "DynInheritTest8.test()"
                    ]);
                    // Note: Bad inherit as with InheritTest7 fails to call base instance and actually throws in this case
                    _this.doTest("BadInstInherit1", new BadInstInheritNoInst1(), [
                        "InstInherit1()",
                        "BadInstInherit1()",
                        "BadInstInherit1.throw()",
                        "BadInstInherit1.test()"
                    ]);
                    // Note: dynamicProto doesn't fix broken base classes, but it still calls them in the correct order
                    _this.doTest("DynInheritTest9", new DynInheritTestNoInst9(), [
                        "InstInherit1()",
                        "BadInstInherit1()",
                        "DynInheritTest9()",
                        "BadInstInherit1.throw()",
                        "BadInstInherit1.test()",
                        "DynInheritTest9.test()"
                    ]);
                    _this.doTest("GoodInstInherit1", new GoodInstInheritNoInst1(), [
                        "InstInherit1()",
                        "GoodInstInherit1()",
                        "InstInherit1.test()",
                        "GoodInstInherit1.test()"
                    ]);
                    _this.doTest("DynInheritTest10", new DynInheritTestNoInst10(), [
                        "InstInherit1()",
                        "GoodInstInherit1()",
                        "DynInheritTest10()",
                        "InstInherit1.test()",
                        "GoodInstInherit1.test()",
                        "DynInheritTest10.test()"
                    ]);
                    _this.doTest("GoodInstInherit2", new GoodInstInheritNoInst2(), [
                        "InstInherit1()",
                        "GoodInstInherit1()",
                        "DynInheritTest10()",
                        "GoodInstInherit2()",
                        "InstInherit1.test()",
                        "GoodInstInherit1.test()",
                        "DynInheritTest10.test()",
                        "GoodInstInherit2.test()",
                    ]);
                }
            });
        };
        return DynamicProtoNoInstTests;
    }(TestClass));
    exports.DynamicProtoNoInstTests = DynamicProtoNoInstTests;
});
/// <reference path="./TestFramework/Common.ts" />
define("test/DynamicProtoMultipleNoInst.Tests", ["require", "exports", "src/DynamicProto"], function (require, exports, DynamicProto_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DynamicProtoMultipleNoInstTests = void 0;
    var InheritNoInstTest1 = /** @class */ (function () {
        function InheritNoInstTest1() {
            this.executionOrder = [];
            this.executionOrder.push("InheritTest1()");
        }
        InheritNoInstTest1.prototype.testFunction = function () {
            this.executionOrder.push("InheritTest1.test()");
        };
        return InheritNoInstTest1;
    }());
    var InheritNoInstTest2 = /** @class */ (function (_super) {
        __extends(InheritNoInstTest2, _super);
        function InheritNoInstTest2() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InheritTest2()");
            return _this;
        }
        InheritNoInstTest2.prototype.testFunction = function () {
            _super.prototype.testFunction.call(this);
            this.executionOrder.push("InheritTest2.test()");
        };
        return InheritNoInstTest2;
    }(InheritNoInstTest1));
    var InheritNoInstTest3 = /** @class */ (function (_super) {
        __extends(InheritNoInstTest3, _super);
        function InheritNoInstTest3() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InheritTest3()");
            return _this;
        }
        InheritNoInstTest3.prototype.testFunction = function () {
            _super.prototype.testFunction.call(this);
            this.executionOrder.push("InheritTest3.test()");
        };
        return InheritNoInstTest3;
    }(InheritNoInstTest2));
    var DynInheritNoInstTest1 = /** @class */ (function () {
        function DynInheritNoInstTest1() {
            var _this = this;
            this.executionOrder = [];
            this.executionOrder.push("DynInheritTest1()");
            (0, DynamicProto_4.default)(DynInheritNoInstTest1, this, function (_self, base) {
                _self.testFunction = function () {
                    _this.executionOrder.push("DynInheritTest1.test()");
                };
            }, { setInstFuncs: false });
        }
        return DynInheritNoInstTest1;
    }());
    var InheritNoInstTest4 = /** @class */ (function (_super) {
        __extends(InheritNoInstTest4, _super);
        function InheritNoInstTest4() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InheritTest4()");
            return _this;
        }
        InheritNoInstTest4.prototype.testFunction = function () {
            _super.prototype.testFunction.call(this);
            this.executionOrder.push("InheritTest4.test()");
        };
        return InheritNoInstTest4;
    }(DynInheritNoInstTest1));
    var InheritNoInstTest5 = /** @class */ (function (_super) {
        __extends(InheritNoInstTest5, _super);
        function InheritNoInstTest5() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InheritTest5()");
            return _this;
        }
        InheritNoInstTest5.prototype.testFunction = function () {
            _super.prototype.testFunction.call(this);
            this.executionOrder.push("InheritTest5.test()");
        };
        return InheritNoInstTest5;
    }(InheritNoInstTest4));
    var DynInheritNoInstTest2 = /** @class */ (function (_super) {
        __extends(DynInheritNoInstTest2, _super);
        function DynInheritNoInstTest2() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest2()");
            (0, DynamicProto_4.default)(DynInheritNoInstTest2, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest2.test()");
                };
            }, { setInstFuncs: false });
            return _this;
        }
        return DynInheritNoInstTest2;
    }(InheritNoInstTest1));
    var DynInheritNoInstTest3 = /** @class */ (function (_super) {
        __extends(DynInheritNoInstTest3, _super);
        function DynInheritNoInstTest3() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest3()");
            (0, DynamicProto_4.default)(DynInheritNoInstTest3, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest3.test()");
                };
            }, { setInstFuncs: false });
            return _this;
        }
        return DynInheritNoInstTest3;
    }(DynInheritNoInstTest2));
    var InheritNoInstTest6 = /** @class */ (function (_super) {
        __extends(InheritNoInstTest6, _super);
        function InheritNoInstTest6() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InheritTest6()");
            return _this;
        }
        InheritNoInstTest6.prototype.testFunction = function () {
            _super.prototype.testFunction.call(this);
            this.executionOrder.push("InheritTest6.test()");
        };
        return InheritNoInstTest6;
    }(DynInheritNoInstTest2));
    var DynInheritNoInstTest4 = /** @class */ (function (_super) {
        __extends(DynInheritNoInstTest4, _super);
        function DynInheritNoInstTest4() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest4()");
            (0, DynamicProto_4.default)(DynInheritNoInstTest4, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest4.test()");
                };
            }, { setInstFuncs: false });
            return _this;
        }
        return DynInheritNoInstTest4;
    }(InheritNoInstTest6));
    var DynInheritNoInstTest5 = /** @class */ (function (_super) {
        __extends(DynInheritNoInstTest5, _super);
        function DynInheritNoInstTest5() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest5()");
            (0, DynamicProto_4.default)(DynInheritNoInstTest5, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest5.test()");
                };
            }, { setInstFuncs: false });
            return _this;
        }
        return DynInheritNoInstTest5;
    }(DynInheritNoInstTest1));
    var DynInheritNoInstTest6 = /** @class */ (function (_super) {
        __extends(DynInheritNoInstTest6, _super);
        function DynInheritNoInstTest6() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest6()");
            (0, DynamicProto_4.default)(DynInheritNoInstTest6, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest6.test()");
                };
            }, { setInstFuncs: false });
            return _this;
        }
        return DynInheritNoInstTest6;
    }(DynInheritNoInstTest5));
    var InstInheritNoInst1 = /** @class */ (function () {
        function InstInheritNoInst1() {
            var _this = this;
            this.executionOrder = [];
            this.executionOrder.push("InstInherit1()");
            this.testFunction = function () {
                _this.executionOrder.push("InstInherit1.test()");
            };
        }
        return InstInheritNoInst1;
    }());
    var InstInheritNoInst2 = /** @class */ (function (_super) {
        __extends(InstInheritNoInst2, _super);
        function InstInheritNoInst2() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InstInherit2()");
            _this.testFunction = function () {
                _super.prototype.testFunction.call(_this);
                _this.executionOrder.push("InstInherit2.test()");
            };
            return _this;
        }
        return InstInheritNoInst2;
    }(InheritNoInstTest2));
    var InheritNoInstTest7 = /** @class */ (function (_super) {
        __extends(InheritNoInstTest7, _super);
        function InheritNoInstTest7() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InheritTest7()");
            return _this;
        }
        InheritNoInstTest7.prototype.testFunction = function () {
            _super.prototype.testFunction.call(this);
            this.executionOrder.push("InheritTest7.test()");
        };
        return InheritNoInstTest7;
    }(InstInheritNoInst1));
    var DynInheritNoInstTest7 = /** @class */ (function (_super) {
        __extends(DynInheritNoInstTest7, _super);
        function DynInheritNoInstTest7() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest7()");
            (0, DynamicProto_4.default)(DynInheritNoInstTest7, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest7.test()");
                };
            });
            return _this;
        }
        return DynInheritNoInstTest7;
    }(InstInheritNoInst1));
    var InstInheritNoInst3 = /** @class */ (function (_super) {
        __extends(InstInheritNoInst3, _super);
        function InstInheritNoInst3() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("InstInherit3()");
            _this.testFunction = function () {
                _super.prototype.testFunction.call(_this);
                _this.executionOrder.push("InstInherit3.test()");
            };
            return _this;
        }
        return InstInheritNoInst3;
    }(DynInheritNoInstTest7));
    var DynInheritNoInstTest8 = /** @class */ (function (_super) {
        __extends(DynInheritNoInstTest8, _super);
        function DynInheritNoInstTest8() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest8()");
            (0, DynamicProto_4.default)(DynInheritNoInstTest8, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest8.test()");
                };
            }, { setInstFuncs: false });
            return _this;
        }
        return DynInheritNoInstTest8;
    }(InstInheritNoInst3));
    var BadInstInheritNoInst1 = /** @class */ (function (_super) {
        __extends(BadInstInheritNoInst1, _super);
        function BadInstInheritNoInst1() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("BadInstInherit1()");
            _this.testFunction = function () {
                try {
                    _super.prototype.testFunction.call(_this);
                }
                catch (e) {
                    _this.executionOrder.push("BadInstInherit1.throw()");
                }
                _this.executionOrder.push("BadInstInherit1.test()");
            };
            return _this;
        }
        return BadInstInheritNoInst1;
    }(InstInheritNoInst1));
    var DynInheritTestNoInst9 = /** @class */ (function (_super) {
        __extends(DynInheritTestNoInst9, _super);
        function DynInheritTestNoInst9() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest9()");
            (0, DynamicProto_4.default)(DynInheritTestNoInst9, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest9.test()");
                };
            }, { setInstFuncs: false });
            return _this;
        }
        return DynInheritTestNoInst9;
    }(BadInstInheritNoInst1));
    var GoodInstInheritNoInst1 = /** @class */ (function (_super) {
        __extends(GoodInstInheritNoInst1, _super);
        function GoodInstInheritNoInst1() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("GoodInstInherit1()");
            var prevTestFunc = _this.testFunction;
            _this.testFunction = function () {
                prevTestFunc.call(_this);
                _this.executionOrder.push("GoodInstInherit1.test()");
            };
            return _this;
        }
        return GoodInstInheritNoInst1;
    }(InstInheritNoInst1));
    var DynInheritTestNoInst10 = /** @class */ (function (_super) {
        __extends(DynInheritTestNoInst10, _super);
        function DynInheritTestNoInst10() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("DynInheritTest10()");
            (0, DynamicProto_4.default)(DynInheritTestNoInst10, _this, function (_self, base) {
                _self.testFunction = function () {
                    base.testFunction();
                    _this.executionOrder.push("DynInheritTest10.test()");
                };
            }, { setInstFuncs: false });
            return _this;
        }
        return DynInheritTestNoInst10;
    }(GoodInstInheritNoInst1));
    var GoodInstInheritNoInst2 = /** @class */ (function (_super) {
        __extends(GoodInstInheritNoInst2, _super);
        function GoodInstInheritNoInst2() {
            var _this = _super.call(this) || this;
            _this.executionOrder.push("GoodInstInherit2()");
            var prevTestFunc = _this.testFunction;
            _this.testFunction = function () {
                prevTestFunc.call(_this);
                _this.executionOrder.push("GoodInstInherit2.test()");
            };
            return _this;
        }
        return GoodInstInheritNoInst2;
    }(DynInheritTestNoInst10));
    var DynamicProtoMultipleNoInstTests = /** @class */ (function (_super) {
        __extends(DynamicProtoMultipleNoInstTests, _super);
        function DynamicProtoMultipleNoInstTests() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DynamicProtoMultipleNoInstTests.prototype.testInitialize = function () {
        };
        DynamicProtoMultipleNoInstTests.prototype._validateOrder = function (message, actual, expected) {
            QUnit.assert.equal(actual.length, expected.length, message + ": Checking the length");
            var passed = true;
            var error = "";
            for (var lp = 0; lp < expected.length; lp++) {
                if (lp < actual.length) {
                    if (actual[lp] !== expected[lp]) {
                        passed = false;
                        error += " **[" + actual[lp] + "!=" + expected[lp] + "]**;";
                    }
                    else {
                        error += " " + expected[lp] + ";";
                    }
                }
                else {
                    passed = false;
                    error += " --[" + expected[lp] + "]--;";
                }
            }
            // Fail test and log any extra unexpected calls
            for (var lp = expected.length; lp < actual.length; lp++) {
                passed = false;
                error += " ++[" + actual[lp] + "]++;";
            }
            QUnit.assert.ok(passed, message + ":" + error);
        };
        DynamicProtoMultipleNoInstTests.prototype.doTest = function (message, theTest, expectedOrder) {
            theTest.testFunction();
            theTest.testFunction();
            this._validateOrder(message, theTest.executionOrder, expectedOrder);
        };
        DynamicProtoMultipleNoInstTests.prototype.registerTests = function () {
            var _this = this;
            this.testCase({
                name: "NoInst: Inheritance tests",
                test: function () {
                    _this.doTest("InheritTest1", new InheritNoInstTest1(), [
                        "InheritTest1()",
                        "InheritTest1.test()",
                        "InheritTest1.test()"
                    ]);
                    _this.doTest("InheritTest2", new InheritNoInstTest2(), [
                        "InheritTest1()",
                        "InheritTest2()",
                        "InheritTest1.test()",
                        "InheritTest2.test()",
                        "InheritTest1.test()",
                        "InheritTest2.test()"
                    ]);
                    _this.doTest("InheritTest3", new InheritNoInstTest3(), [
                        "InheritTest1()",
                        "InheritTest2()",
                        "InheritTest3()",
                        "InheritTest1.test()",
                        "InheritTest2.test()",
                        "InheritTest3.test()",
                        "InheritTest1.test()",
                        "InheritTest2.test()",
                        "InheritTest3.test()"
                    ]);
                    _this.doTest("InheritTest4", new InheritNoInstTest4(), [
                        "DynInheritTest1()",
                        "InheritTest4()",
                        "DynInheritTest1.test()",
                        "InheritTest4.test()",
                        "DynInheritTest1.test()",
                        "InheritTest4.test()"
                    ]);
                    _this.doTest("InheritTest5", new InheritNoInstTest5(), [
                        "DynInheritTest1()",
                        "InheritTest4()",
                        "InheritTest5()",
                        "DynInheritTest1.test()",
                        "InheritTest4.test()",
                        "InheritTest5.test()",
                        "DynInheritTest1.test()",
                        "InheritTest4.test()",
                        "InheritTest5.test()"
                    ]);
                    _this.doTest("DynInheritTest1", new DynInheritNoInstTest1(), [
                        "DynInheritTest1()",
                        "DynInheritTest1.test()",
                        "DynInheritTest1.test()"
                    ]);
                    _this.doTest("DynInheritTest2", new DynInheritNoInstTest2(), [
                        "InheritTest1()",
                        "DynInheritTest2()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()"
                    ]);
                    _this.doTest("DynInheritTest3", new DynInheritNoInstTest3(), [
                        "InheritTest1()",
                        "DynInheritTest2()",
                        "DynInheritTest3()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()",
                        "DynInheritTest3.test()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()",
                        "DynInheritTest3.test()"
                    ]);
                    _this.doTest("InheritTest6", new InheritNoInstTest6(), [
                        "InheritTest1()",
                        "DynInheritTest2()",
                        "InheritTest6()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()",
                        "InheritTest6.test()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()",
                        "InheritTest6.test()"
                    ]);
                    _this.doTest("DynInheritTest4", new DynInheritNoInstTest4(), [
                        "InheritTest1()",
                        "DynInheritTest2()",
                        "InheritTest6()",
                        "DynInheritTest4()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()",
                        "InheritTest6.test()",
                        "DynInheritTest4.test()",
                        "InheritTest1.test()",
                        "DynInheritTest2.test()",
                        "InheritTest6.test()",
                        "DynInheritTest4.test()"
                    ]);
                    _this.doTest("DynInheritTest5", new DynInheritNoInstTest5(), [
                        "DynInheritTest1()",
                        "DynInheritTest5()",
                        "DynInheritTest1.test()",
                        "DynInheritTest5.test()",
                        "DynInheritTest1.test()",
                        "DynInheritTest5.test()"
                    ]);
                    _this.doTest("DynInheritTest6", new DynInheritNoInstTest6(), [
                        "DynInheritTest1()",
                        "DynInheritTest5()",
                        "DynInheritTest6()",
                        "DynInheritTest1.test()",
                        "DynInheritTest5.test()",
                        "DynInheritTest6.test()",
                        "DynInheritTest1.test()",
                        "DynInheritTest5.test()",
                        "DynInheritTest6.test()"
                    ]);
                    _this.doTest("InstInherit1", new InstInheritNoInst1(), [
                        "InstInherit1()",
                        "InstInherit1.test()",
                        "InstInherit1.test()"
                    ]);
                    _this.doTest("InstInherit2", new InstInheritNoInst2(), [
                        "InheritTest1()",
                        "InheritTest2()",
                        "InstInherit2()",
                        "InheritTest1.test()",
                        "InheritTest2.test()",
                        "InstInherit2.test()",
                        "InheritTest1.test()",
                        "InheritTest2.test()",
                        "InstInherit2.test()"
                    ]);
                    // NOTE: Notice that InheritTest7.test() was not called -- this is because TS doesn't handle this
                    _this.doTest("InheritTest7", new InheritNoInstTest7(), [
                        "InstInherit1()",
                        "InheritTest7()",
                        "InstInherit1.test()",
                        "InstInherit1.test()"
                    ]);
                    // NOTE: Notice that DynInheritTest7.test() IS called -- this is because dynamicProto handles this scenario
                    _this.doTest("DynInheritTest7", new DynInheritNoInstTest7(), [
                        "InstInherit1()",
                        "DynInheritTest7()",
                        "InstInherit1.test()",
                        "DynInheritTest7.test()",
                        "InstInherit1.test()",
                        "DynInheritTest7.test()"
                    ]);
                    _this.doTest("InstInherit3", new InstInheritNoInst3(), [
                        "InstInherit1()",
                        "DynInheritTest7()",
                        "InstInherit3()",
                        "InstInherit1.test()",
                        "DynInheritTest7.test()",
                        "InstInherit3.test()",
                        "InstInherit1.test()",
                        "DynInheritTest7.test()",
                        "InstInherit3.test()"
                    ]);
                    _this.doTest("DynInheritTest8", new DynInheritNoInstTest8(), [
                        "InstInherit1()",
                        "DynInheritTest7()",
                        "InstInherit3()",
                        "DynInheritTest8()",
                        "InstInherit1.test()",
                        "DynInheritTest7.test()",
                        "InstInherit3.test()",
                        "DynInheritTest8.test()",
                        "InstInherit1.test()",
                        "DynInheritTest7.test()",
                        "InstInherit3.test()",
                        "DynInheritTest8.test()"
                    ]);
                    // Note: Bad inherit as with InheritTest7 fails to call base instance and actually throws in this case
                    _this.doTest("BadInstInherit1", new BadInstInheritNoInst1(), [
                        "InstInherit1()",
                        "BadInstInherit1()",
                        "BadInstInherit1.throw()",
                        "BadInstInherit1.test()",
                        "BadInstInherit1.throw()",
                        "BadInstInherit1.test()"
                    ]);
                    // Note: dynamicProto doesn't fix broken base classes, but it still calls them in the correct order
                    _this.doTest("DynInheritTest9", new DynInheritTestNoInst9(), [
                        "InstInherit1()",
                        "BadInstInherit1()",
                        "DynInheritTest9()",
                        "BadInstInherit1.throw()",
                        "BadInstInherit1.test()",
                        "DynInheritTest9.test()",
                        "BadInstInherit1.throw()",
                        "BadInstInherit1.test()",
                        "DynInheritTest9.test()"
                    ]);
                    _this.doTest("GoodInstInherit1", new GoodInstInheritNoInst1(), [
                        "InstInherit1()",
                        "GoodInstInherit1()",
                        "InstInherit1.test()",
                        "GoodInstInherit1.test()",
                        "InstInherit1.test()",
                        "GoodInstInherit1.test()"
                    ]);
                    _this.doTest("DynInheritTest10", new DynInheritTestNoInst10(), [
                        "InstInherit1()",
                        "GoodInstInherit1()",
                        "DynInheritTest10()",
                        "InstInherit1.test()",
                        "GoodInstInherit1.test()",
                        "DynInheritTest10.test()",
                        "InstInherit1.test()",
                        "GoodInstInherit1.test()",
                        "DynInheritTest10.test()"
                    ]);
                    _this.doTest("GoodInstInherit2", new GoodInstInheritNoInst2(), [
                        "InstInherit1()",
                        "GoodInstInherit1()",
                        "DynInheritTest10()",
                        "GoodInstInherit2()",
                        "InstInherit1.test()",
                        "GoodInstInherit1.test()",
                        "DynInheritTest10.test()",
                        "GoodInstInherit2.test()",
                        "InstInherit1.test()",
                        "GoodInstInherit1.test()",
                        "DynInheritTest10.test()",
                        "GoodInstInherit2.test()"
                    ]);
                }
            });
        };
        return DynamicProtoMultipleNoInstTests;
    }(TestClass));
    exports.DynamicProtoMultipleNoInstTests = DynamicProtoMultipleNoInstTests;
});
/// <reference path="./TestFramework/Common.ts" />
define("test/SecurityCheck.Tests", ["require", "exports", "@nevware21/ts-utils", "src/DynamicProto"], function (require, exports, ts_utils_2, DynamicProto_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SecurityCheckTests = void 0;
    var HackClass = /** @class */ (function () {
        function HackClass() {
            this.hello = "world";
        }
        return HackClass;
    }());
    var BadInstClass = /** @class */ (function () {
        function BadInstClass() {
            this._dynInstFuncs = {};
            this._dynInstFuncs = Object.prototype;
        }
        return BadInstClass;
    }());
    var BadProxyInstClass = /** @class */ (function () {
        function BadProxyInstClass() {
            this._dynInstFuncs = {};
            this._dynInstFuncs = new Proxy(this, {
                get: function (target, prop) {
                    if (typeof prop === "string" && prop.startsWith("_dynCls")) {
                        return Object.prototype;
                    }
                    return target[prop];
                }
            });
        }
        return BadProxyInstClass;
    }());
    var SecurityCheckTests = /** @class */ (function (_super) {
        __extends(SecurityCheckTests, _super);
        function SecurityCheckTests() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SecurityCheckTests.prototype.testInitialize = function () {
        };
        SecurityCheckTests.prototype.registerTests = function () {
            this.testCase({
                name: "Try to update Object.prototype directly",
                test: function () {
                    var a = {};
                    try {
                        (0, DynamicProto_5.default)(Object, a, function (_self, base) {
                            _self._testFunction = function () {
                                QUnit.assert.fail("Should not be able to update Object.prototype");
                            };
                            _self.__proto__ = {
                                testHack: true
                            };
                            _self.prototype = {
                                testHack2: true
                            };
                        });
                        QUnit.assert.fail("Should not be able to update Object.prototype");
                    }
                    catch (e) {
                        QUnit.assert.ok(true, "Expected an exception to be thrown");
                    }
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack2"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
                }
            });
            this.testCase({
                name: "Try to update Object.prototype directly",
                test: function () {
                    var a = {};
                    try {
                        (0, DynamicProto_5.default)(Object.prototype, a, function (_self, base) {
                            _self._testFunction = function () {
                                QUnit.assert.fail("Should not be able to update Object.prototype");
                            };
                            _self.__proto__ = {
                                testHack: true
                            };
                            _self.prototype = {
                                testHack2: true
                            };
                        });
                        QUnit.assert.fail("Should not be able to update Object.prototype");
                    }
                    catch (e) {
                        QUnit.assert.ok(true, "Expected an exception to be thrown");
                    }
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack2"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
                }
            });
            this.testCase({
                name: "Try to update Object.prototype directly",
                test: function () {
                    var a = {};
                    try {
                        (0, DynamicProto_5.default)(Object, a, function (_self, base) {
                            _self._testFunction = function () {
                                QUnit.assert.fail("Should not be able to update Object.prototype");
                            };
                            _self.__proto__ = {
                                testHack: true
                            };
                            _self.prototype = {
                                testHack2: true
                            };
                        });
                        QUnit.assert.fail("Should not be able to update Object.prototype");
                    }
                    catch (e) {
                        QUnit.assert.ok(true, "Expected an exception to be thrown");
                    }
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack2"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
                }
            });
            this.testCase({
                name: "Try to update Object.prototype directly with a HackClass instance and __proto__ property",
                test: function () {
                    var a = new HackClass();
                    (0, DynamicProto_5.default)(HackClass, a, function (_self, base) {
                        var self = _self;
                        self.__proto__ = {
                            testHack: true
                        };
                        self.prototype = {
                            testHack2: true
                        };
                        self._testFunction = function () {
                            QUnit.assert.fail("Should not be able to update Object.prototype");
                        };
                    });
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack2"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
                }
            });
            this.testCase({
                name: "Try to update Object.prototype directly with a HackClass instance and __proto__ function",
                test: function () {
                    var a = new HackClass();
                    (0, DynamicProto_5.default)(HackClass, a, function (_self, base) {
                        var self = _self;
                        self.__proto__ = function () {
                            testHack: true;
                        };
                        self.prototype = {
                            testHack2: true
                        };
                        self._testFunction = function () {
                            QUnit.assert.fail("Should not be able to update Object.prototype");
                        };
                    });
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack2"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
                }
            });
            this.testCase({
                name: "Try to update Object.prototype directly using defineProperty with a HackClass instance and __proto__ property",
                test: function () {
                    var a = new HackClass();
                    (0, DynamicProto_5.default)(HackClass, a, function (_self, base) {
                        var self = _self;
                        Object.defineProperty(self, "__proto__", {
                            value: {
                                testHack: true
                            },
                            configurable: true,
                            enumerable: true
                        });
                        self.prototype = {
                            testHack2: true
                        };
                        self._testFunction = function () {
                            QUnit.assert.fail("Should not be able to update Object.prototype");
                        };
                    });
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack2"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
                }
            });
            this.testCase({
                name: "Try to update Object.prototype directly using defineProperty with a HackClass instance and __proto__ function",
                test: function () {
                    var a = new HackClass();
                    (0, DynamicProto_5.default)(HackClass, a, function (_self, base) {
                        var self = _self;
                        Object.defineProperty(self, "__proto__", {
                            value: function () {
                                testHack: true;
                            },
                            configurable: true,
                            enumerable: true
                        });
                        self.prototype = {
                            testHack2: true
                        };
                        self._testFunction = function () {
                            QUnit.assert.fail("Should not be able to update Object.prototype");
                        };
                    });
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack2"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
                }
            });
            this.testCase({
                name: "Try to update Object.prototype using HackClass instance with a __proto__ function",
                test: function () {
                    var a = new HackClass();
                    (0, DynamicProto_5.default)(HackClass, a, function (_self, base) {
                        var self = _self;
                        self.__proto__ = function () {
                            QUnit.assert.fail("Should not be able to update Object.prototype");
                        };
                        self.prototype = {
                            testHack2: true
                        };
                        self._testFunction = function () {
                            QUnit.assert.fail("Should not be able to update Object.prototype");
                        };
                    });
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack2"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
                }
            });
            this.testCase({
                name: "Try to update Object.prototype directly with HackClass and an object instance",
                test: function () {
                    var a = {};
                    try {
                        (0, DynamicProto_5.default)(HackClass, a, function (_self, base) {
                            var self = _self;
                            self._testFunction = function () {
                                QUnit.assert.fail("Should not be able to update Object.prototype");
                            };
                            self.__proto__ = {
                                testHack: true
                            };
                            self.prototype = {
                                testHack2: true
                            };
                        });
                        QUnit.assert.fail("Should not be able to update Object.prototype");
                    }
                    catch (e) {
                        QUnit.assert.ok(true, "Expected an exception to be thrown");
                        QUnit.assert.ok(e.message.indexOf("not in hierarchy") > -1, "Expected an exception to be thrown");
                    }
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack2"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
                }
            });
            this.testCase({
                name: "Try to update Object.prototype indirectly using defineProperty with HackClass and an object instance",
                test: function () {
                    var a = {};
                    try {
                        (0, DynamicProto_5.default)(HackClass, a, function (_self, base) {
                            var self = _self;
                            self._testFunction = function () {
                                QUnit.assert.fail("Should not be able to update Object.prototype");
                            };
                            Object.defineProperty(self, "__proto__", {
                                value: {
                                    testHack: true
                                },
                                configurable: true,
                                enumerable: true
                            });
                            self.prototype = {
                                testHack2: true
                            };
                        });
                    }
                    catch (e) {
                        QUnit.assert.ok(true, "Expected an exception to be thrown");
                        QUnit.assert.ok(e.message.indexOf("not in hierarchy") > -1, "Expected an exception to be thrown");
                    }
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack2"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
                }
            });
            this.testCase({
                name: "Try to update Object.prototype directly  with evil __proto__ with HackClass and an object instance",
                test: function () {
                    var a = new HackClass();
                    (0, DynamicProto_5.default)(HackClass, a, function (_self, base) {
                        var self = _self;
                        self._testFunction = function () {
                            QUnit.assert.fail("Should not be able to update Object.prototype");
                        };
                        self["__proto__['hacked']"] = {
                            testHack: true
                        };
                        self.prototype = {
                            testHack2: true
                        };
                    });
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack2"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
                }
            });
            this.testCase({
                name: "Try to update Object.prototype indirectly using defineProperty with evil __proto__ with HackClass and an object instance",
                test: function () {
                    var a = new HackClass();
                    (0, DynamicProto_5.default)(HackClass, a, function (_self, base) {
                        var self = _self;
                        self._testFunction = function () {
                            QUnit.assert.fail("Should not be able to update Object.prototype");
                        };
                        Object.defineProperty(self, "__proto__['hacked']", {
                            value: {
                                testHack: true
                            },
                            configurable: true,
                            enumerable: true
                        });
                        self.prototype = {
                            testHack2: true
                        };
                    });
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack2"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
                }
            });
            this.testCase({
                name: "Try to update Object.prototype directly with a HackClass instance",
                test: function () {
                    var a = new HackClass();
                    (0, DynamicProto_5.default)(HackClass, a, function (_self, base) {
                        var self = _self;
                        self._testFunction = function () {
                            QUnit.assert.fail("Should not be able to update Object.prototype");
                        };
                        self.__proto__ = {
                            testHack: true
                        };
                        self.prototype = {
                            testHack2: true
                        };
                    });
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack2"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
                }
            });
            this.testCase({
                name: "Try to update Object.prototype indirectly using defineProperty with a HackClass instance",
                test: function () {
                    var a = new HackClass();
                    (0, DynamicProto_5.default)(HackClass, a, function (_self, base) {
                        var self = _self;
                        self._testFunction = function () {
                            QUnit.assert.fail("Should not be able to update Object.prototype");
                        };
                        Object.defineProperty(self, "__proto__", {
                            value: {
                                testHack: true
                            },
                            configurable: true,
                            enumerable: true
                        });
                        self.prototype = {
                            testHack2: true
                        };
                    });
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack2"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
                }
            });
            this.testCase({
                name: "Try to update Object.prototype indirectly with a null prototype instance",
                test: function () {
                    var a = {};
                    var theInstance = Object.create(a);
                    try {
                        (0, DynamicProto_5.default)(theInstance, a, function (_self, base) {
                            _self.__proto__ = {
                                testHack: true
                            };
                            _self.prototype = {
                                testHack2: true
                            };
                            _self._testFunction = function () {
                                QUnit.assert.fail("Should not be able to update Object.prototype");
                            };
                        });
                        QUnit.assert.fail("Should not be able to update Object.prototype");
                    }
                    catch (e) {
                        QUnit.assert.ok(true, "Expected an exception to be thrown");
                    }
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack2"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
                }
            });
            this.testCase({
                name: "Try to update Object.prototype indirectly with an a prototype instance",
                test: function () {
                    var a = {};
                    var theInstance = Object.create(a);
                    try {
                        (0, DynamicProto_5.default)(Object.getPrototypeOf(theInstance), a, function (_self, base) {
                            _self._testFunction = function () {
                                QUnit.assert.fail("Should not be able to update Object.prototype");
                            };
                        });
                        QUnit.assert.fail("Should not be able to update Object.prototype");
                    }
                    catch (e) {
                        QUnit.assert.ok(true, "Expected an exception to be thrown");
                    }
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
                }
            });
            this.testCase({
                name: "Try to update Object.prototype indirectly by using a proxy to return the Object.prototype as the instance functions",
                test: function () {
                    var a = new HackClass();
                    (0, DynamicProto_5.default)(HackClass, a, function (_self, base) {
                        _self["_dynInstFuncs"] = new Proxy(_self["_dynInstFuncs"] || {}, {
                            get: function (target, prop) {
                                if (typeof prop === "string" && prop.startsWith("_dynCls")) {
                                    return Object.prototype;
                                }
                                return target[prop];
                            }
                        });
                        _self._testFunction = function () {
                            QUnit.assert.fail("Should not be able to update Object.prototype");
                        };
                    });
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
                }
            });
            this.testCase({
                name: "Try to update Object.prototype indirectly by using a proxy to return the Object.prototype as the instance functions",
                test: function () {
                    var a = new HackClass();
                    (0, DynamicProto_5.default)(HackClass, a, function (_self, base) {
                        var className = _self["_dynClass"];
                        var classProto = _self["_dynInstFuncs"] = (_self["_dynInstFuncs"] || {});
                        // Change the return class prototype to be Object.prototype
                        classProto["_dynCls" + className] = Object.prototype;
                        _self._testFunction = function () {
                            QUnit.assert.fail("Should not be able to update Object.prototype");
                        };
                    });
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
                }
            });
            this.testCase({
                name: "Try to update Object.prototype indirectly by using a HackClass and updating the base class prototype",
                test: function () {
                    var a = new HackClass();
                    (0, DynamicProto_5.default)(HackClass, a, function (_self, base) {
                        try {
                            (0, ts_utils_2.objGetPrototypeOf)(base).testHack = true;
                            QUnit.assert.fail("Should not be able to update Object.prototype");
                        }
                        catch (e) {
                            QUnit.assert.ok(true, "Expected an exception to be thrown");
                        }
                        _self._testFunction = function () {
                            QUnit.assert.fail("Should not be able to update Object.prototype");
                        };
                    });
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack"), "Should not have polluted Object.prototype");
                }
            });
            this.testCase({
                name: "Try to update Array.prototype indirectly by using a proxy to return the Array.prototype as the instance functions",
                test: function () {
                    var a = new HackClass();
                    (0, DynamicProto_5.default)(HackClass, a, function (_self, base) {
                        _self["_dynInstFuncs"] = new Proxy(_self["_dynInstFuncs"] || {}, {
                            get: function (target, prop) {
                                if (typeof prop === "string" && prop.startsWith("_dynCls")) {
                                    return Array.prototype;
                                }
                                return target[prop];
                            }
                        });
                        _self._testFunction = function () {
                            QUnit.assert.fail("Should not be able to update Array.prototype");
                        };
                    });
                    QUnit.assert.ok(!Array.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Array.prototype");
                }
            });
            this.testCase({
                name: "Try to update Array.prototype indirectly by using a proxy to return the Object.prototype as the instance functions",
                test: function () {
                    var a = new HackClass();
                    (0, DynamicProto_5.default)(HackClass, a, function (_self, base) {
                        var className = _self["_dynClass"];
                        var classProto = _self["_dynInstFuncs"] = (_self["_dynInstFuncs"] || {});
                        // Change the return class prototype to be Object.prototype
                        classProto["_dynCls" + className] = Array.prototype;
                        _self._testFunction = function () {
                            QUnit.assert.fail("Should not be able to update Array.prototype");
                        };
                    });
                    QUnit.assert.ok(!Array.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Array.prototype");
                }
            });
            this.testCase({
                name: "Try to update Object.prototype with a BadInstClass instance",
                test: function () {
                    var a = new BadInstClass();
                    (0, DynamicProto_5.default)(BadInstClass, a, function (_self, base) {
                        _self._testFunction = function () {
                            QUnit.assert.fail("Should not be able to update Object.prototype");
                        };
                    });
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("_dynInstFuncs"), "Should not have polluted Object.prototype");
                }
            });
            this.testCase({
                name: "Try to update Object.prototype with a BadProxyInstClass instance",
                test: function () {
                    var a = new BadProxyInstClass();
                    (0, DynamicProto_5.default)(BadProxyInstClass, a, function (_self, base) {
                        _self._testFunction = function () {
                            QUnit.assert.fail("Should not be able to update Object.prototype");
                        };
                    });
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
                    QUnit.assert.ok(!Object.prototype.hasOwnProperty("_dynInstFuncs"), "Should not have polluted Object.prototype");
                }
            });
        };
        return SecurityCheckTests;
    }(TestClass));
    exports.SecurityCheckTests = SecurityCheckTests;
});
define("test/Selenium/DynamicProtoTests", ["require", "exports", "test/DynamicProto.Tests", "test/DynamicProtoMultipleCall.Tests", "test/DynamicProtoNoInst.Tests", "test/DynamicProtoMultipleNoInst.Tests", "test/SecurityCheck.Tests"], function (require, exports, DynamicProto_Tests_1, DynamicProtoMultipleCall_Tests_1, DynamicProtoNoInst_Tests_1, DynamicProtoMultipleNoInst_Tests_1, SecurityCheck_Tests_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.runTests = void 0;
    function runTests() {
        new DynamicProto_Tests_1.DynamicProtoDefaultTests("Default").registerTests();
        new DynamicProtoMultipleCall_Tests_1.DynamicProtoMultipleCallTests("Multiple").registerTests();
        new DynamicProtoNoInst_Tests_1.DynamicProtoNoInstTests("SetInst").registerTests();
        new DynamicProtoMultipleNoInst_Tests_1.DynamicProtoMultipleNoInstTests("Multiple SetInst").registerTests();
        new SecurityCheck_Tests_1.SecurityCheckTests("Security Checks").registerTests();
    }
    exports.runTests = runTests;
});
//# sourceMappingURL=dynamicprototests.js.map