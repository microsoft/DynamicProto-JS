/// <reference path="../External/qunit.d.ts" />
/// <reference path="../External/sinon.d.ts" />
/**
 * Wrapper around QUnit asserts. This class has two purposes:
 * - Make Assertion methods easy to discover.
 * - Make them consistent with XUnit assertions in the order of the actual and expected parameter values.
 */
declare class Assert {
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
    static deepEqual(expected: any, actual: any, message?: string): any;
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
    static equal(expected: any, actual: any, message?: string): any;
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
    static notDeepEqual(expected: any, actual: any, message?: string): any;
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
    static notEqual(expected: any, actual: any, message?: string): any;
    static notPropEqual(expected: any, actual: any, message?: string): any;
    static propEqual(expected: any, actual: any, message?: string): any;
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
    static notStrictEqual(expected: any, actual: any, message?: string): any;
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
    static ok(state: any, message?: string): any;
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
    static strictEqual(expected: any, actual: any, message?: string): any;
    /**
     * Assertion to test if a callback throws an exception when run.
     *
     * When testing code that is expected to throw an exception based on a specific set of
     * circumstances, use throws() to catch the error object for testing and comparison.
     *
     * @param block Function to execute
     * @param expected Error Object to compare
     * @param message A short description of the assertion
     */
    static throws(block: () => any, expected: any, message?: string): any;
    /**
     * @param block Function to execute
     * @param message A short description of the assertion
     */
    static throws(block: () => any, message?: string): any;
}
/** Defines a test case */
declare class TestCase {
    /** Name to use for the test case */
    name: string;
    /** Test case method */
    test: () => void;
}
/** Defines a test case */
interface TestCaseAsync {
    /** Name to use for the test case */
    name: string;
    /** time to wait after pre before invoking post and calling start() */
    stepDelay: number;
    /** async steps */
    steps: Array<() => void>;
}
declare class TestClass {
    constructor(name?: string);
    static isPollingStepFlag: string;
    /** The instance of the currently running suite. */
    static currentTestClass: TestClass;
    /** Turns on/off sinon's syncronous implementation of setTimeout. On by default. */
    useFakeTimers: boolean;
    /** Turns on/off sinon's fake implementation of XMLHttpRequest. On by default. */
    useFakeServer: boolean;
    /** Method called before the start of each test method */
    testInitialize(): void;
    /** Method called after each test method has completed */
    testCleanup(): void;
    /** Method in which test class intances should call this.testCase(...) to register each of this suite's tests. */
    registerTests(): void;
    /** Register an async Javascript unit testcase. */
    testCaseAsync(testInfo: TestCaseAsync): void;
    /** Register a Javascript unit testcase. */
    testCase(testInfo: TestCase): void;
    /** Called when the test is starting. */
    private _testStarting;
    /** Called when the test is completed. */
    private _testCompleted;
    /**** Sinon methods and properties ***/
    clock: SinonFakeTimers;
    server: SinonFakeServer;
    sandbox: SinonSandbox;
    /** Creates an anonymous function that records arguments, this value, exceptions and return values for all calls. */
    spy(): SinonSpy;
    /** Spies on the provided function */
    spy(funcToWrap: Function): SinonSpy;
    /** Creates a spy for object.methodName and replaces the original method with the spy. The spy acts exactly like the original method in all cases. The original method can be restored by calling object.methodName.restore(). The returned spy is the function object which replaced the original method. spy === object.method. */
    spy(object: any, methodName: string, func?: Function): SinonSpy;
    /** Creates an anonymous stub function. */
    stub(): SinonStub;
    /** Stubs all the object's methods. */
    stub(object: any): SinonStub;
    /** Replaces object.methodName with a func, wrapped in a spy. As usual, object.methodName.restore(); can be used to restore the original method. */
    stub(object: any, methodName: string, func?: Function): SinonStub;
    /** Creates a mock for the provided object.Does not change the object, but returns a mock object to set expectations on the object's methods. */
    mock(object: any): SinonMock;
    /**** end: Sinon methods and properties ***/
    /** Sends a JSON response to the provided request.
     * @param request The request to respond to.
     * @param data Data to respond with.
     * @param errorCode Optional error code to send with the request, default is 200
    */
    sendJsonResponse(request: SinonFakeXMLHttpRequest, data: any, errorCode?: number): void;
    protected setUserAgent(userAgent: string): void;
}
declare module "src/DynamicProto" {
    /**
     * Interface to define additional configuration options to control how the dynamic prototype functions operate.
     */
    export interface IDynamicProtoOpts {
        /**
         * Should the dynamic prototype attempt to set an instance function for instances that do not already have an
         * function of the same name or have been extended by a class with a (non-dynamic proto) prototype function.
         */
        setInstFuncs: boolean;
        /**
         * When looking for base (super) functions if it finds a dynamic proto instances can it use the instance functions
         * and bypass the prototype lookups. Defaults to true.
         */
        useBaseInst?: boolean;
    }
    /**
     * The delegate signature for the function used as the callback for dynamicProto()
     * @typeparam DPType This is the generic type of the class, used to keep intellisense valid for the proxy instance, even
     * though it is only a proxy that only contains the functions
     * @param theTarget This is the real "this" of the current target object
     * @param baseFuncProxy The is a proxy object which ONLY contains this function that existed on the "this" instance before
     * calling dynamicProto, it does NOT contain properties of this. This is basically equivalent to using the "super" keyword.
     */
    export type DynamicProtoDelegate<DPType> = (theTarget: DPType, baseFuncProxy?: DPType) => void;
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
    export default function dynamicProto<DPType, DPCls>(theClass: DPCls, target: DPType, delegateFunc: DynamicProtoDelegate<DPType>, options?: IDynamicProtoOpts): void;
}
declare module "test/DynamicProto.Tests" {
    export class DynamicProtoDefaultTests extends TestClass {
        testInitialize(): void;
        private _validateOrder;
        private doTest;
        registerTests(): void;
    }
}
declare module "test/DynamicProtoMultipleCall.Tests" {
    export class DynamicProtoMultipleCallTests extends TestClass {
        testInitialize(): void;
        private _validateOrder;
        private doTest;
        registerTests(): void;
    }
}
declare module "test/DynamicProtoNoInst.Tests" {
    export class DynamicProtoNoInstTests extends TestClass {
        testInitialize(): void;
        private _validateOrder;
        private doTest;
        registerTests(): void;
    }
}
declare module "test/DynamicProtoMultipleNoInst.Tests" {
    export class DynamicProtoMultipleNoInstTests extends TestClass {
        testInitialize(): void;
        private _validateOrder;
        private doTest;
        registerTests(): void;
    }
}
declare module "test/SecurityCheck.Tests" {
    export class SecurityCheckTests extends TestClass {
        testInitialize(): void;
        registerTests(): void;
    }
}
declare module "test/Selenium/DynamicProtoTests" {
    export function runTests(): void;
}
