/// <reference path="./TestFramework/Common.ts" />

import dynamicRemove from '../src/removeDynamic';
//import * as sinon from 'sinon';

export class DynamicProtoRollupTests extends TestClass {

    public testInitialize() {
    }

    private visibleNewlines(value) {
        if (value) {
            return value.replace(/\r/g, "\\r").replace(/\n/g, "\\n");
        }

        return value;
    }

    private convertNewlines(value, newline) {
        if (value) {
            return value.replace(/\n/g, newline);
        }

        return value;
    }

    private testNoChange(options:any, input:string) {
        let plugin = dynamicRemove(options);

        QUnit.assert.equal(plugin.name, "dynamicRemove");
        QUnit.assert.equal(plugin.renderChunk(input, { filename: "test.js" }), null);
        QUnit.assert.equal(plugin.transform(input, "testId"), null);
    }

    private doTest(options:any, input:string, expected:string) {
        this.testExpected(options, input, expected);
        this.testExpected(options, this.convertNewlines(input, "\r"), this.convertNewlines(expected, "\r"));
        this.testExpected(options, this.convertNewlines(input, "\r\n"), this.convertNewlines(expected, "\r\n"));
        this.testExpected(options, this.convertNewlines(input, "\n\r"), this.convertNewlines(expected, "\n\r"));
    }

    private testExpected(options:any, input:string, expected:string) {
        let plugin = dynamicRemove(options);

        QUnit.assert.equal(plugin.name, "dynamicRemove");
        let result = plugin.renderChunk(input, { filename: "test.js" });
        QUnit.assert.equal(result != null ? result.code : null, expected, this.visibleNewlines(result != null ? result.code : null));

        result = plugin.transform(input, "testId");
        QUnit.assert.equal(result != null ? result.code : null, expected, this.visibleNewlines(result != null ? result.code : null));
    }

    private testError(options:any, message:string, input:string, expected:string) {
        let plugin = dynamicRemove(options);

        QUnit.assert.throws(() => {
            plugin.renderChunk(input, { filename: "test.js" });
        }, new Error(expected), message);

        QUnit.assert.throws(() => {
            plugin.transform(input, "test.js");
        }, new Error(expected), message);
    }

    public registerTests() {
        this.testCase({
            name: "No matching values for removal",
            test: () => {
                this.testNoChange(null, "Nothing removed");

                this.testNoChange(null, "ClassName.prototype.anotherMethod = function () {\n};\n");

                this.testNoChange(null, 
                    "ClassName.prototype.methodName = function () {\n" +
                    "    // This is a comment for a dynamic proto stub\n" +
                    "};\n");

                this.testNoChange(null, 
                    "ClassName.prototype.methodName = function () {\n" +
                    "    // This is a comment for a dynamic proto stub\n" +
                    "};\n");

                this.testNoChange(null, 
                    "// @Stub -- Type 1 comment\n" +
                    "function methodName() {\n" +
                    "    // This is a comment for a dynamic proto stub\n" +
                    "};\n");
    
                this.testNoChange(null, 
                    "function methodName() {\n" +
                    "     // @Stub -- Type 2 single line comment\n" +
                    "};\n");
    
                this.testNoChange(null, 
                    "function methodName() {\n" +
                    "     /* @Stub -- Type 2 multiline comment */\n" +
                    "};\n");
    
                this.testNoChange(null, 
                    "function methodName() {\n" +
                    "     /* @Stub -- Type 2 multiline comment\n" +
                    "     * Continuation of a multi-line comment/\n" +
                    "     */\n" +
                    "};\n");
                }
        });

        this.testCase({
            name: "Basic tag patterns",
            test: () => {
                this.doTest(null, 
                    "// @DynamicProtoStub -- Type 1 comment\n" +
                    "ClassName.prototype.methodName = function () {\n" +
                    "    // This is a comment for a dynamic proto stub\n" +
                    "};\n", 
                    "// Removed Stub for ClassName.prototype.methodName.\n");
    
                this.doTest(null, 
                    "ClassName.prototype.methodName = function () {\n" +
                    "     // @DynamicProtoStub -- Type 2 single line comment\n" +
                    "};\n", 
                    "// Removed Stub for ClassName.prototype.methodName.\n");
    
                this.doTest(null, 
                    "ClassName.prototype.methodName = function () {\n" +
                    "     /* @DynamicProtoStub -- Type 2 multiline comment */\n" +
                    "};\n", 
                    "// Removed Stub for ClassName.prototype.methodName.\n");
    
                this.doTest(null, 
                    "ClassName.prototype.methodName = function () {\n" +
                    "     /* @DynamicProtoStub -- Type 2 multiline comment\n" +
                    "     * Continuation of a multi-line comment/\n" +
                    "     */\n" +
                    "};\n", 
                    "// Removed Stub for ClassName.prototype.methodName.\n");
            }
        });

        this.testCase({
            name: "Mixed tagtype combinations",
            test: () => {
                this.doTest(null, 
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
                    "    return TestClass;"
                    );

                this.testExpected(null, 
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
                    "// Removed Stub for TestClass.prototype.func3.\n\r"
                    );
            }
        });

        this.testCase({
            name: "Stubs with return values",
            test: () => {
                this.doTest(null, 
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
                    "    return TestClass;"
                    );

                this.doTest(null, 
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
                    "// Removed Stub for TestClass.prototype.func3.\n"
                    );
            }
        });

        this.testCase({
            name: "Test reserved (ES3) function names",
            test: () => {
                this.doTest(null, 
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
                    "    return TestClass;",
                    );

                this.doTest(null, 
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
                    "// Removed Stub for TestClass.prototype['if'].\n"
                    );
            }
        });

        this.testCase({
            name: "Test unconverted tags from partial conversion",
            test: () => {
                this.testError(null, 
                    "1 -- Type 1 comment",
                    "// @DynamicProtoStub -- Type 1 comment\n" +
                    "function methodName() {\n" +
                    "    // This is a comment for a dynamic proto stub\n" +
                    "};\n",
                    "Invalid (Unremoved) token [@DynamicProtoStub] found on line [1], column [4], position [3] - test.js\n" +
                    "1   :// @DynamicProtoStub -- Type 1 comment\n" +
                    "        ^^^^^^^^^^^^^^^^^\n" +
                    "2   :function methodName() {\n" +
                    "3   :    // This is a comment for a dynamic proto stub\n" +
                    "4   :};\n");
    
                this.testError(null, 
                    "2 -- Type 2 single line comment",
                    "function methodName() {\n" +
                    "    // @DynamicProtoStub -- Type 2 single line comment\n" +
                    "};\n",
                    "Invalid (Unremoved) token [@DynamicProtoStub] found on line [2], column [8], position [31] - test.js\n" +
                    "1   :function methodName() {\n" +
                    "2   :    // @DynamicProtoStub -- Type 2 single line comment\n" +
                    "            ^^^^^^^^^^^^^^^^^\n" +
                    "3   :};\n");
    
                this.testError(null,
                    "3 -- Type 2 multiline comment",
                    "function methodName() {\n" +
                    "    /* @DynamicProtoStub -- Type 2 multiline comment */\n" +
                    "};\n",
                    "Invalid (Unremoved) token [@DynamicProtoStub] found on line [2], column [8], position [31] - test.js\n" +
                    "1   :function methodName() {\n" +
                    "2   :    /* @DynamicProtoStub -- Type 2 multiline comment */\n" +
                    "            ^^^^^^^^^^^^^^^^^\n" +
                    "3   :};\n");
    
                this.testError(null,
                    "4 -- Type 2 multiline comment (2)",
                    "function methodName() {\n" +
                    "    /* @DynamicProtoStub -- Type 2 multiline comment\n" +
                    "    * Continuation of a multi-line comment/\n" +
                    "    */\n" +
                    "};\n",
                    "Invalid (Unremoved) token [@DynamicProtoStub] found on line [2], column [8], position [31] - test.js\n" +
                    "1   :function methodName() {\n" +
                    "2   :    /* @DynamicProtoStub -- Type 2 multiline comment\n" +
                    "            ^^^^^^^^^^^^^^^^^\n" +
                    "3   :    * Continuation of a multi-line comment/\n" +
                    "4   :    */\n" +
                    "5   :};\n");

                this.testError(null,
                    "5 -- Type 1 comment",
                    "// @DynamicProtoStub -- Type 1 comment\n" +
                    "function methodName() {\n" +
                    "    // This is a comment for a dynamic proto stub\n" +
                    "};\n" +
                    "// @DynamicProtoStub -- Type 1 comment\n" +
                    "ClassName.prototype.methodName = function () {\n" +
                    "    // This is a comment for a dynamic proto stub\n" +
                    "};\n",
                    "Invalid (Unremoved) token [@DynamicProtoStub] found on line [1], column [4], position [3] - test.js\n" +
                    "1   :// @DynamicProtoStub -- Type 1 comment\n" +
                    "        ^^^^^^^^^^^^^^^^^\n" +
                    "2   :function methodName() {\n" +
                    "3   :    // This is a comment for a dynamic proto stub\n" +
                    "4   :};\n" +
                    "5   :// Removed Stub for ClassName.prototype.methodName.\n");

    
                this.testError(null,
                    "6 -- Type 2 single line comment",
                    "function methodName() {\n" +
                    "    // @DynamicProtoStub -- Type 2 single line comment\n" +
                    "};\n" +
                    "// @DynamicProtoStub -- Type 1 comment\n" +
                    "ClassName.prototype.methodName = function () {\n" +
                    "    // This is a comment for a dynamic proto stub\n" +
                    "};\n",
                    "Invalid (Unremoved) token [@DynamicProtoStub] found on line [2], column [8], position [31] - test.js\n" +
                    "1   :function methodName() {\n" +
                    "2   :    // @DynamicProtoStub -- Type 2 single line comment\n" +
                    "            ^^^^^^^^^^^^^^^^^\n" +
                    "3   :};\n" +
                    "4   :// Removed Stub for ClassName.prototype.methodName.\n");
    
                this.testError(null,
                    "7 -- Type 2 multiline comment */",
                    "function methodName() {\n" +
                    "    /* @DynamicProtoStub -- Type 2 multiline comment */\n" +
                    "};\n" +
                    "// @DynamicProtoStub -- Type 1 comment\n" +
                    "ClassName.prototype.methodName = function () {\n" +
                    "    // This is a comment for a dynamic proto stub\n" +
                    "};\n",
                    "Invalid (Unremoved) token [@DynamicProtoStub] found on line [2], column [8], position [31] - test.js\n" +
                    "1   :function methodName() {\n" +
                    "2   :    /* @DynamicProtoStub -- Type 2 multiline comment */\n" +
                    "            ^^^^^^^^^^^^^^^^^\n" +
                    "3   :};\n" +
                    "4   :// Removed Stub for ClassName.prototype.methodName.\n");
    
                this.testError(null,
                    "8 -- Type 2 multiline comment (2)",
                    "function methodName() {\n" +
                    "    /* @DynamicProtoStub -- Type 2 multiline comment\n" +
                    "    * Continuation of a multi-line comment/\n" +
                    "    */\n" +
                    "};\n" +
                    "// @DynamicProtoStub -- Type 1 comment\n" +
                    "ClassName.prototype.methodName = function () {\n" +
                    "    // This is a comment for a dynamic proto stub\n" +
                    "};\n",
                    "Invalid (Unremoved) token [@DynamicProtoStub] found on line [2], column [8], position [31] - test.js\n" +
                    "1   :function methodName() {\n" +
                    "2   :    /* @DynamicProtoStub -- Type 2 multiline comment\n" +
                    "            ^^^^^^^^^^^^^^^^^\n" +
                    "3   :    * Continuation of a multi-line comment/\n" +
                    "4   :    */\n" +
                    "5   :};\n" +
                    "6   :// Removed Stub for ClassName.prototype.methodName.\n");
            }
        });
    }
}
