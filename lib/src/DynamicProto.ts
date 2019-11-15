// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

/**
 * Constant string defined to support minimization
 * @ignore
 */ 
const Constructor = 'constructor';

/**
 * Constant string defined to support minimization
 * @ignore
 */ 
const Prototype = 'prototype';

/**
 * Constant string defined to support minimization
 * @ignore
 */
const strFunction = 'function';

/**
 * Constant string defined to support minimization
 * @ignore
 */ 
const GetPrototypeOf = 'getPrototypeOf';

/**
 * Used to define the name of the instance function lookup table
 * @ignore
 */ 
const DynInstFuncTable = '_dynInstFuncs';

/**
 * Name used to tag the dynamic prototype function
 * @ignore
 */ 
const DynProxyTag = '_isDynProxy';

/**
 * Name added to a prototype to define the dynamic prototype "class" name used to lookup the function table
 * @ignore
 */ 
const DynClassName = '_dynClass';

/**
 * Prefix added to the classname to avoid any name clashes with other instance level properties
 * @ignore
 */ 
const DynClassNamePrefix = '_dynCls$';

/**
 * Value used as the name of a class when it cannot be determined
 * @ignore
 */ 
const UnknownValue = '_unknown_';

/**
 * Internal Global used to generate a unique dynamic class name, every new class will increase this value
 * @ignore
 */ 
let _dynamicNames = 0;

/**
 * Helper to check if the object contains a property of the name
 * @ignore
 */ 
function _hasOwnProperty(obj:any, prop:string) {
    return obj && Object[Prototype].hasOwnProperty.call(obj, prop);
}

/**
 * Checks if the passed of value is a function.
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a boolean, false otherwise.
 * @ignore
 */
function _isFunction(value: any): boolean {
    return typeof value === strFunction;
}

/**
 * Helper used to check whether the target is an Object prototype or Array prototype
 * @ignore
 */ 
function _isObjectOrArrayPrototype(target:any) {
    return target && (target === Object[Prototype] || target === Array[Prototype]);
}

/**
 * Helper used to check whether the target is an Object prototype, Array prototype or Function prototype
 * @ignore
 */ 
function _isObjectArrayOrFunctionPrototype(target:any)
{
    return _isObjectOrArrayPrototype(target) || target === Function[Prototype];
}

/**
 * Helper used to get the prototype of the target object as getPrototypeOf is not available in an ES3 environment.
 * @ignore
 */ 
function _getObjProto(target:any) {
    if (target) {
        // This method doesn't existing in older browsers (e.g. IE8)
        if (Object[GetPrototypeOf]) {
            return Object[GetPrototypeOf](target);
        }

        var proto = "__proto__";    // using indexed lookup to assist with minification
        if(_isObjectOrArrayPrototype(target[proto])) {
            return target[proto];
        }

        var construct = target[Constructor];
        if (construct) {
            // May break if the constructor has been changed or removed
            return construct[Prototype];
        }
    }

    return null;
}

/**
 * Helper function to check whether the provided function name is a potential candidate for dynamic
 * callback and prototype generation.
 * @param target The target object, may be a prototpe or class object
 * @param funcName The function name
 * @ignore
 */
function _isDynamicCandidate(target:any, funcName:string) {
    return (funcName !== Constructor && _isFunction(target[funcName]) && _hasOwnProperty(target, funcName));
}

/**
 * Helper to throw a TypeError exception
 * @param message the message
 * @ignore
 */
function _throwTypeError(message:string) {
    throw new TypeError("DynamicProto: " + message);
}

/**
 * Returns a collection of the instance functions that are defined directly on the thisTarget object, it does 
 * not return any inherited functions
 * @param thisTarget The object to get the instance functions from
 * @ignore
 */
function _getInstanceFuncs(thisTarget:any): any {
    // Get the base proto
    var instFuncs = {};

    // Save any existing instance functions
    for (var name in thisTarget) {
        // Don't include any dynamic prototype instances - as we only want the real functions
        if (!instFuncs[name] && _isDynamicCandidate(thisTarget, name)) {
            // Create an instance callback for pasing the base function to the caller
            instFuncs[name] = thisTarget[name];
        }
    }

    return instFuncs;
}

/**
 * Returns an object that contains callback functions for all "base/super" functions, this is used to "save"
 * enabling calling super.xxx() functions without requiring that the base "class" has defined a prototype references
 * @param target The current instance
 * @ignore
 */
function _getBaseFuncs(classProto:any, thisTarget:any, instFuncs:any): any {
    function _instFuncProxy(target:any, theFunc:any) {
        return function() {
            return theFunc.apply(target, arguments);
        };
    }

    // Start creating a new baseFuncs by creating proxies for the instance functions (as they may get replaced)
    var baseFuncs = {};
    for (var name in instFuncs) {
        // Create an instance callback for pasing the base function to the caller
        baseFuncs[name] = _instFuncProxy(thisTarget, instFuncs[name]);
    }
    
    // Get the base prototype functions
    var baseProto = _getObjProto(classProto);

    // Don't include base object functions for Object, Array or Function
    while (baseProto && !_isObjectArrayOrFunctionPrototype(baseProto)) {
        // look for prototype functions
        for (var name in baseProto) {
            // Don't include any dynamic prototype instances - as we only want the real functions
            if (!baseFuncs[name] && _isDynamicCandidate(baseProto, name)) {
                // Create an instance callback for pasing the base function to the caller
                baseFuncs[name] = _instFuncProxy(thisTarget, baseProto[name]);
            }
        }

        // We need to find all possible functions that might be overloaded by walking the entire prototype chain
        // This avoids the caller from needing to check whether it's direct base class implements the function or not
        // by walking the entire chain it simplifies the usage and issues from upgrading any of the base classes.
        baseProto = _getObjProto(baseProto);
    }

    return baseFuncs;
}

/**
 * Add the required dynamic prototype methods to the the class prototype
 * @param proto The class prototype
 * @param className The instance classname 
 * @param target The target instance
 * @param baseInstFuncs The base instance functions
 * @ignore
 */
function _populatePrototype(proto:any, className:string, target:any, baseInstFuncs:any) {
    function _createDynamicPrototype(proto:any, funcName:string) {
        var dynProtoProxy = function() {
            let _this = this;
            // We need to check whether the class name is defined directly on this prototype otherwise
            // it will walk the proto chain and return any parent proto classname.
            if (_this && _hasOwnProperty(proto, DynClassName)) {
                let instFunc = ((_this[DynInstFuncTable] || {})[proto[DynClassName]] || {})[funcName];
                if (instFunc) {
                    // Used the instance function property
                    return instFunc.apply(_this, arguments);
                }

                // Avoid stack overflow from recursive calling the same function
                _throwTypeError("Missing [" + funcName + "] " + strFunction);
            }

            let protoFunc = proto[funcName];

            // Check that the prototype function is not a self reference -- try to avoid stack overflow!
            if (protoFunc === dynProtoProxy) {
                // It is so lookup the base prototype
                protoFunc = _getObjProto(proto)[funcName];
            }

            if (!_isFunction(protoFunc)) {
                _throwTypeError("[" + funcName + "] is not a " + strFunction);
            }

            return protoFunc.apply(_this, arguments);
        };
        
        // Tag this function as a proxy to support replacing dynamic proxy elements (primary use case is for unit testing
        // via which can dynamically replace the prototype function reference)
        (dynProtoProxy as any)[DynProxyTag] = 1;
        return dynProtoProxy;
    }
    
    if (!_isObjectOrArrayPrototype(proto)) {
        let instFuncTable = target[DynInstFuncTable] = target[DynInstFuncTable] || {};
        let instFuncs = instFuncTable[className] = (instFuncTable[className] || {}); // fetch and assign if as it may not exist yet
        for (var name in target) {
            // Only add overriden functions
            if (_isDynamicCandidate(target, name) && target[name] !== baseInstFuncs[name] ) {
                // Save the instance Function to the lookup table and remove it from the instance as it's not a dynamic proto function
                instFuncs[name] = target[name];
                delete target[name];
                
                // Add a dynamic proto if one doesn't exist or if a prototype function exists and it's not a dynamic one
                if (!_hasOwnProperty(proto, name) || (proto[name] && !proto[name][DynProxyTag])) {
                    proto[name] = _createDynamicPrototype(proto, name);
                }
            }
        }
    }
}

/**
 * Checks whether the passed prototype object appears to be correct by walking the prototype heirarchy of the instance
 * @param classProto The class prototype instance
 * @param thisTarget The current instance that will be checked whther the passed prototype instance is in the heirarchy
 * @ignore
 */
function _checkPrototype(classProto:any, thisTarget:any) {
    let thisProto = _getObjProto(thisTarget);
    while (thisProto && !_isObjectArrayOrFunctionPrototype(thisProto)) {
        if (thisProto === classProto) {
            return true;
        }

        thisProto = _getObjProto(thisProto);
    }

    return false;
}

/**
 * Gets the current prototype name using the ES6 name if available otherwise falling back to a use unknown as the name.
 * It's not critical for this to return a name, it's used to decorate the generated unique name for easier debugging only.
 * @param target 
 * @param unknownValue 
 * @ignore
 */
function _getObjName(target:any, unknownValue?:string) {
    if (_hasOwnProperty(target, Prototype)) {
        // Look like a prototype
        return target.name || unknownValue || UnknownValue
    }

    return (((target || {})[Constructor]) || {}).name || unknownValue || UnknownValue;
}

/**
 * The delegate signature for the function used as the callback for dynamicProto() 
 * @typeparam DPType This is the generic type of the class, used to keep intellisense valid for the proxy instance, even 
 * though it is only a proxy that only contains the functions 
 * @param theTarget This is the real "this" of the current target object
 * @param baseFuncProxy The is a proxy object which ONLY contains this function that existed on the "this" instance before
 * calling dynamicProto, it does NOT contain properties of this. This is basically equivalent to using the "super" keyword.
 */
export type DynamicProtoDelegate<DPType> = (theTarget:DPType, baseFuncProxy?:DPType) => void;

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
 * @param theClass This is the current class instance which contains the prototype for the current class
 * @param target The current "this" (target) reference, when the class has been extended this.prototype will not be the 'theClass' value.
 * @param delegateFunc The callback function (closure) that will create the dynamic function
 */
export default function dynamicProto<DPType, DPCls>(theClass:DPCls, target:DPType, delegateFunc: DynamicProtoDelegate<DPType>) {
    // Make sure that the passed theClass argument looks correct
    if (!_hasOwnProperty(theClass, Prototype)) {
        _throwTypeError("theClass is an invalid class definition.");
    }

    // Quick check to make sure that the passed theClass argument looks correct (this is a common copy/paste error)
    let classProto = theClass[Prototype];
    if (!_checkPrototype(classProto, target)) {
        _throwTypeError("[" + _getObjName(theClass) + "] is not in class heirarchy of [" + _getObjName(target) + "]");
    }

    let className = null;
    if (_hasOwnProperty(classProto, DynClassName)) {
        // Only grab the class name if it's defined on this prototype (i.e. don't walk the prototype chain)
        className = classProto[DynClassName];
    } else {
        // As not all browser support name on the prototype creating a unique dynamic one if we have not already
        // assigned one, so we can use a simple string as the lookup rather than an object for the dynamic instance
        // function table lookup.
        className = DynClassNamePrefix + _getObjName(theClass, "_") + "$" + _dynamicNames ;
        _dynamicNames++;
        classProto[DynClassName] = className;
    }

    // Get the current instance functions
    let instFuncs = _getInstanceFuncs(target);

    // Get all of the functions for any base instance (before they are potentially overriden)
    let baseFuncs = _getBaseFuncs(classProto, target, instFuncs);

    // Execute the delegate passing in both the current target "this" and "base" function references
    // Note casting the same type as we don't actually have the base class here and this will provide some intellisense support
    delegateFunc(target, baseFuncs as DPType);

    // Populate the Prototype for any overidden instance functions
    _populatePrototype(classProto, className, target, instFuncs);
}
