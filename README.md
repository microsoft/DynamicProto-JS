# Dynamic Proto JavaScript

Generates dynamic prototype methods for JavaScript objects (classes) by supporting method definition within their "class" constructor (like an instance version), this removes the need to expose internal properties on the instance (this) and the usage of ```ClassName.prototype.funcName()``` both of which result in better code minfication (smaller output) and therefore improved load times for your users.

The dynamically generated prototype methods support class inheritance of any type, which means you can extend from base classes that use instance or prototype defined methods, you also don't need to add the normal boiler plate code to handle detecting, saving and calling any previous instance methods that you are overriding as support for this is provided automatically. 

So whether creating a new class or extending some other class/code, your resulting code, can be successfully extended via TypeScript or JavaScript.

## Removing / Hiding internal properties from instance
By defining the properties / methods within the constructors closure, each instance can contain or define internal state in the form of properties which it does not have to expose publically as each defined "public" instance method has direct access to this define state within the context/scope of the closure method. 

While this does require some additional CPU and memory at the point of creating each instance object this is designed to be as minimal as possible and should be outwayed by the following advantages :-

* Avoids polluting the instance (this) namespace with internal values that can cause issues with inheritence for base/super classes or even derived classes that extend your class.
* Smaller code as the internal properties and methods when defined within the instance can be minified.
* As the resulting generated code can be better minified this *should* result in a smaller minified result and therefore better load times for your users. 

## When to use
While this helper was originally created to support better minification for generated code via TypeScript, it is not limited to only being used from within TypeScript.

And as with including any additional code into your project there is a trade off that you need to make before using this helper which is the size of the additional code of this utility vs the minification gains that *may* be obtained. As in most cases of creating JavaScript code for better minfication if your code doesn't expose or provide a lot of public methods or only uses un-minifiable "names" less than 2 times then the potential gains may not be worth the additional bytes.

And yes at the end of the day, if you are creating JS classes directly in Javascript you *should* be able to create a simplier one-off solution that would result in smaller output as this project needs to be generic to be able to support all use-cases. 

## Basic Usage
```typescript
import dynamicProto from "@microsoft/dynamicproto-js";
class ExampleClass extends BaseClass {
    constructor() {
        dynamicProto(ExampleClass, this, (_self, base) => {
            // This will define a function that will be converted to a prototype function
            _self.newFunc = () => {
                // Access any "this" instance property  
                if (_self.someProperty) {
                    ...
                }
            }
            // This will define a function that will be converted to a prototype function
            _self.myFunction = () => {
                // Access any "this" instance property
                if (_self.someProperty) {
                    // Call the base version of the function that we are overriding
                    base.myFunction();
                }
                ...
            }
            _self.initialize = () => {
                ...
            }
            // Warnings: While the following will work as _self is simply a ference to
            // this, if anyone overrides myFunction() the overridden will be called first
            // as the normal JavaScript method resolution will occur and the defined
            // _self.initialize() function is actually gets removed from the instance and
            // a proxy prototype version is created to reference the created method.
            _self.initialize();
        });
    }
}
```

## Build & Test this repo

1. Install all dependencies

    ```sh
    npm install
    npm install -g @microsoft/rush
    ```

2. Navigate to the root folder and update rush dependencies

    ```sh
    rush update
    ```

3. Build, lint, create docs and run tests

    ```sh
    rush build
    npm run test
    ```

If you are changing package versions or adding/removing any package dependencies, run<br>**```rush update --purge --recheck --full```**<br>before building. Please check-in any files that change under common\ folder.

## Performance

The minified version of this adds a negligible amount of code and loadtime to your source code and by using this library your generated code can be better minified as it removes most references of Classname.prototype.XXX methods from the generated code.

> Summary:
>
> - **~2 KB** minified (uncompressed)


## Browser Support

![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![IE8](https://raw.githubusercontent.com/hotoo/browser-logos/master/ie9-10/ie9-10_48x48.png) | ![Edge](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Opera](https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png)
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | 8+ Full ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

## Contributing

Read our [contributing guide](./CONTRIBUTING.md) to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to Application Insights.

## ES3/IE8 Compatibility

As an library there are numerous users which cannot control the browsers that their customers use. As such we need to ensure that this library continues to "work" and does not break the JS execution when loaded by an older browser. While it would be ideal to just not support IE8 and older generation (ES3) browsers there are numerous large customers/users that continue to require pages to "work" and as noted they may or cannot control which browser that their end users choose to use.

As part of enabling ES3/IE8 support we have set the ```tsconfig.json``` to ES3 and ```uglify``` settings in ```rollup.config.js``` transformations to support ie8. This provides a first level of support which blocks anyone from adding unsupported ES3 features to the code and enables the generated javascript to be validily parsed in an ES3+ environment.

Ensuring that the generated code is compatible with ES3 is only the first step, JS parsers will still parse the code when an unsupport core function is used, it will just fail or throw an exception at runtime. Therefore, we also need to require/use polyfil implementations or helper functions to handle those scenarios.

### ES3/IE8 Features, Solutions, Workarounds and Polyfil style helper functions

This table does not attempt to include ALL of the ES3 unsuported features, just the currently known functions that where being used at the time or writing. You are welcome to contribute to provide additional helpers, workarounds or documentation of values that should not be used.

|  Feature  |  Description  |  Usage |
|-----------|-----------------|------|
| ```Object.keys()``` | Not provided by ES3 and not used | N/A |
| ES5+ getters/setters<br>```Object.defineProperty(...)``` | Not provided by ES3 and not used | N/A |
| ```Object.create(protoObj, [descriptorSet]?)``` | Not provided by ES3 and not used | N/A |
| ```Object.defineProperties()``` | Not provided by ES3 and not used | N/A |
| ```Object.getOwnPropertyNames(obj)``` | Not provided by ES3 and not used | N/A |
| ```Object.getPrototypeOf(obj)``` | Not provided by ES3 and not used | ```_getObjProto(target:any)``` |
| ```Object.getOwnPropertyDescriptor(obj)``` | Not provided by ES3 and not used | N/A |
| ```Object.preventExtensions(obj)``` | Not provided by ES3 and not used | N/A |
| ```Object.isExtensible(obj)``` | Not provided by ES3 and not used | N/A |
| ```Object.seal(obj)``` | Not provided by ES3 and not used | N/A |
| ```Object.isSealed(obj)``` | Not provided by ES3 and not used | N/A |
| ```Object.freeze(obj)``` | Not provided by ES3 and not used | N/A |
| ```Object.isFrozen(obj)``` | Not provided by ES3 and not used | N/A |
