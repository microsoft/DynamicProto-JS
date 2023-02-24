# Dynamic Proto JavaScript

Generates dynamic prototype methods for JavaScript objects (classes) by supporting method definition within their "class" constructor (like an instance version), this removes the need to expose internal properties on the instance (this) and the usage of ```ClassName.prototype.funcName()``` both of which result in better code minfication (smaller output) and therefore improved load times for your users.

The dynamically generated prototype methods support class inheritance of any type, which means you can extend from base classes that use instance or prototype defined methods, you also don't need to add the normal boiler plate code to handle detecting, saving and calling any previous instance methods that you are overriding as support for this is provided automatically.

So whether creating a new class or extending some other class/code, your resulting code, can be successfully extended via TypeScript or JavaScript.

## Documentation

[Typedoc API references](https://microsoft.github.io/DynamicProto-JS/typedoc/index.html).

## Included NPM distribution formats

As part of the build / publish formats via NPM we include the following module formats:

* dist/esm – Used as the "module" definition for npm, which keeps the bundle as an ES module file, suitable for other bundlers and inclusion as a &lt; amd – Asynchronous Module Definition, used with module loaders like RequireJS
* dist/node - Used as the "main" npm entry point for the utility, using the umd format with any third party modules located and included using the [Node resolution algorithm](https://nodejs.org/api/modules.html#modules_all_together)

### Other included formats

* dist/cjs – CommonJS, suitable for Node and other bundlers
script type=module&gt; tag in modern browsers
* dist/iife – A self-executing function, suitable for inclusion as a &lt;script&gt; tag. (If you want to create a bundle for your application, you probably want to use this.)
* dist/umd – Universal Module Definition, works as amd, cjs and iife all in one
* dist/system – Native format of the SystemJS loader


## Browser Support

![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![IE8](https://raw.githubusercontent.com/hotoo/browser-logos/master/ie9-10/ie9-10_48x48.png) | ![Edge](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Opera](https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png)
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | 8+ Full ✔ | Latest ✔ | Latest ✔ | Latest ✔ |
