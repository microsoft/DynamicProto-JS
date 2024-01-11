/// <reference path="./TestFramework/Common.ts" />

import { objGetPrototypeOf } from "@nevware21/ts-utils";
import dynamicProto from "../src/DynamicProto";

class HackClass {
    public hello: string;

    constructor() {
        this.hello = "world";
    }
}


class BadInstClass {
    public _dynInstFuncs: any = {};

    constructor() {
        this._dynInstFuncs = Object.prototype;
    }
}

class BadProxyInstClass {
    public _dynInstFuncs: any = {};

    constructor() {
        this._dynInstFuncs = new Proxy(this, {
            get: (target, prop) => {
                if (typeof prop === "string" && prop.startsWith("_dynCls")) {
                    return Object.prototype;
                }

                return target[prop];
            }
        });
    }
}

export class SecurityCheckTests extends TestClass {

    public testInitialize() {
    }

    public registerTests() {
        this.testCase({
            name: "Try to update Object.prototype directly",
            test: () => {
                let a: any = {};

                try {
                    dynamicProto(Object, a, (_self, base) => {
                        _self._testFunction = () => {
                            QUnit.assert.fail("Should not be able to update Object.prototype");
                        }

                        _self.__proto__ = {
                            testHack: true
                        };

                        _self.prototype = {
                            testHack2: true
                        };
                    });

                    QUnit.assert.fail("Should not be able to update Object.prototype");
                } catch (e) {
                    QUnit.assert.ok(true, "Expected an exception to be thrown");
                }

                QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack"), "Should not have polluted Object.prototype");
                QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack2"), "Should not have polluted Object.prototype");
                QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
            }
        });

        this.testCase({
            name: "Try to update Object.prototype directly",
            test: () => {
                let a: any = {};

                try {
                    dynamicProto(Object.prototype, a, (_self, base) => {
                        _self._testFunction = () => {
                            QUnit.assert.fail("Should not be able to update Object.prototype");
                        }

                        _self.__proto__ = {
                            testHack: true
                        };

                        _self.prototype = {
                            testHack2: true
                        };
                    });

                    QUnit.assert.fail("Should not be able to update Object.prototype");
                } catch (e) {
                    QUnit.assert.ok(true, "Expected an exception to be thrown");
                }

                QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack"), "Should not have polluted Object.prototype");
                QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack2"), "Should not have polluted Object.prototype");
                QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
            }
        });


        this.testCase({
            name: "Try to update Object.prototype directly",
            test: () => {
                let a: any = {};

                try {
                    dynamicProto(Object, a, (_self, base) => {
                        _self._testFunction = () => {
                            QUnit.assert.fail("Should not be able to update Object.prototype");
                        }

                        _self.__proto__ = {
                            testHack: true
                        };

                        _self.prototype = {
                            testHack2: true
                        };
                    });

                    QUnit.assert.fail("Should not be able to update Object.prototype");
                } catch (e) {
                    QUnit.assert.ok(true, "Expected an exception to be thrown");
                }

                QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack"), "Should not have polluted Object.prototype");
                QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack2"), "Should not have polluted Object.prototype");
                QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
            }
        });

        this.testCase({
            name: "Try to update Object.prototype directly with a HackClass instance and __proto__ property",
            test: () => {
                let a = new HackClass();

                dynamicProto(HackClass, a, (_self, base) => {
                    let self = <any>_self;
                    self.__proto__ = {
                        testHack: true
                    };

                    self.prototype = {
                        testHack2: true
                    };

                    self._testFunction = () => {
                        QUnit.assert.fail("Should not be able to update Object.prototype");
                    }
                });

                QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack"), "Should not have polluted Object.prototype");
                QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack2"), "Should not have polluted Object.prototype");
                QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
            }
        });

        this.testCase({
            name: "Try to update Object.prototype directly with a HackClass instance and __proto__ function",
            test: () => {
                let a = new HackClass();

                dynamicProto(HackClass, a, (_self, base) => {
                    let self = <any>_self;
                    self.__proto__ = () => {
                        testHack: true
                    };

                    self.prototype = {
                        testHack2: true
                    };

                    self._testFunction = () => {
                        QUnit.assert.fail("Should not be able to update Object.prototype");
                    }
                });

                QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack"), "Should not have polluted Object.prototype");
                QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack2"), "Should not have polluted Object.prototype");
                QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
            }
        });

        this.testCase({
            name: "Try to update Object.prototype directly using defineProperty with a HackClass instance and __proto__ property",
            test: () => {
                let a = new HackClass();

                dynamicProto(HackClass, a, (_self, base) => {
                    let self = <any>_self;
                    
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

                    self._testFunction = () => {
                        QUnit.assert.fail("Should not be able to update Object.prototype");
                    }
                });

                QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack"), "Should not have polluted Object.prototype");
                QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack2"), "Should not have polluted Object.prototype");
                QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
            }
        });

        this.testCase({
            name: "Try to update Object.prototype directly using defineProperty with a HackClass instance and __proto__ function",
            test: () => {
                let a = new HackClass();

                dynamicProto(HackClass, a, (_self, base) => {
                    let self = <any>_self;
                    
                    Object.defineProperty(self, "__proto__", {
                        value: () => {
                            testHack: true
                        },
                        configurable: true,
                        enumerable: true
                    });

                    self.prototype = {
                        testHack2: true
                    };

                    self._testFunction = () => {
                        QUnit.assert.fail("Should not be able to update Object.prototype");
                    }
                });

                QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack"), "Should not have polluted Object.prototype");
                QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack2"), "Should not have polluted Object.prototype");
                QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
            }
        });

        this.testCase({
            name: "Try to update Object.prototype using HackClass instance with a __proto__ function",
            test: () => {
                let a = new HackClass();

                dynamicProto(HackClass, a, (_self, base) => {
                    let self = <any>_self;
                    
                    self.__proto__ = () => {
                        QUnit.assert.fail("Should not be able to update Object.prototype");
                    };

                    self.prototype = {
                        testHack2: true
                    };

                    self._testFunction = () => {
                        QUnit.assert.fail("Should not be able to update Object.prototype");
                    }
                });

                QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack"), "Should not have polluted Object.prototype");
                QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack2"), "Should not have polluted Object.prototype");
                QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
            }
        });

        this.testCase({
            name: "Try to update Object.prototype directly with HackClass and an object instance",
            test: () => {
                let a = {};

                try {
                    dynamicProto(HackClass, a, (_self, base) => {
                        let self = <any>_self;
                        self._testFunction = () => {
                            QUnit.assert.fail("Should not be able to update Object.prototype");
                        }
    
                        self.__proto__ = {
                            testHack: true
                        };
    
                        self.prototype = {
                            testHack2: true
                        };
                    });

                    QUnit.assert.fail("Should not be able to update Object.prototype");
                } catch (e) {
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
            test: () => {
                let a = {};

                try {
                    dynamicProto(HackClass, a, (_self, base) => {
                        let self = <any>_self;
                        self._testFunction = () => {
                            QUnit.assert.fail("Should not be able to update Object.prototype");
                        }
    
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
                } catch (e) {
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
            test: () => {
                let a = new HackClass();

                dynamicProto(HackClass, a, (_self, base) => {
                    let self = <any>_self;
                    self._testFunction = () => {
                        QUnit.assert.fail("Should not be able to update Object.prototype");
                    }

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
            test: () => {
                let a = new HackClass();

                dynamicProto(HackClass, a, (_self, base) => {
                    let self = <any>_self;
                    self._testFunction = () => {
                        QUnit.assert.fail("Should not be able to update Object.prototype");
                    }

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
            test: () => {
                let a = new HackClass()

                dynamicProto(HackClass, a, (_self, base) => {
                    let self = <any>_self;
                    self._testFunction = () => {
                        QUnit.assert.fail("Should not be able to update Object.prototype");
                    }

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
            test: () => {
                let a = new HackClass();

                dynamicProto(HackClass, a, (_self, base) => {
                    let self = <any>_self;
                    self._testFunction = () => {
                        QUnit.assert.fail("Should not be able to update Object.prototype");
                    }

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
            test: () => {
                let a: any = {};
                let theInstance = Object.create(a);

                try {
                    dynamicProto(theInstance, a, (_self, base) => {
                        _self.__proto__ = {
                            testHack: true
                        };

                        _self.prototype = {
                            testHack2: true
                        };

                        _self._testFunction = () => {
                            QUnit.assert.fail("Should not be able to update Object.prototype");
                        }
                    });

                    QUnit.assert.fail("Should not be able to update Object.prototype");
                } catch (e) {
                    QUnit.assert.ok(true, "Expected an exception to be thrown");
                }

                QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack"), "Should not have polluted Object.prototype");
                QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack2"), "Should not have polluted Object.prototype");
                QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
            }
        });

        this.testCase({
            name: "Try to update Object.prototype indirectly with an a prototype instance",
            test: () => {
                let a: any = {};
                let theInstance = Object.create(a);
                try {
                    dynamicProto(Object.getPrototypeOf(theInstance), a, (_self, base) => {
                        _self._testFunction = () => {
                            QUnit.assert.fail("Should not be able to update Object.prototype");
                        }
                    });

                    QUnit.assert.fail("Should not be able to update Object.prototype");
                } catch (e) {
                    QUnit.assert.ok(true, "Expected an exception to be thrown");
                }

                QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
            }
        });

        this.testCase({
            name: "Try to update Object.prototype indirectly by using a proxy to return the Object.prototype as the instance functions",
            test: () => {
                let a = new HackClass();

                dynamicProto(HackClass, a, (_self, base) => {
                    _self["_dynInstFuncs"] = new Proxy(_self["_dynInstFuncs"] || {}, {
                        get: (target, prop) => {
                            if (typeof prop === "string" && prop.startsWith("_dynCls")) {
                                return Object.prototype;
                            }

                            return target[prop];
                        }
                    });

                    (_self as any)._testFunction = () => {
                        QUnit.assert.fail("Should not be able to update Object.prototype");
                    }
                });

                QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
            }
        });


        this.testCase({
            name: "Try to update Object.prototype indirectly by using a proxy to return the Object.prototype as the instance functions",
            test: () => {
                let a = new HackClass();

                dynamicProto(HackClass, a, (_self, base) => {
                    let className = _self["_dynClass"];
                    let classProto = _self["_dynInstFuncs"] = (_self["_dynInstFuncs"] || {});

                    // Change the return class prototype to be Object.prototype
                    classProto["_dynCls" + className] = Object.prototype;

                    (_self as any)._testFunction = () => {
                        QUnit.assert.fail("Should not be able to update Object.prototype");
                    }
                });

                QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
            }
        });

        this.testCase({
            name: "Try to update Object.prototype indirectly by using a HackClass and updating the base class prototype",
            test: () => {
                let a = new HackClass();

                dynamicProto(HackClass, a, (_self, base) => {
                    try {
                        objGetPrototypeOf(base).testHack = true;
                        QUnit.assert.fail("Should not be able to update Object.prototype");
                    } catch (e) {
                        QUnit.assert.ok(true, "Expected an exception to be thrown");
                    }

                    (_self as any)._testFunction = () => {
                        QUnit.assert.fail("Should not be able to update Object.prototype");
                    }
                });

                QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
                QUnit.assert.ok(!Object.prototype.hasOwnProperty("testHack"), "Should not have polluted Object.prototype");
            }
        });

        this.testCase({
            name: "Try to update Array.prototype indirectly by using a proxy to return the Array.prototype as the instance functions",
            test: () => {
                let a = new HackClass();

                dynamicProto(HackClass, a, (_self, base) => {
                    _self["_dynInstFuncs"] = new Proxy(_self["_dynInstFuncs"] || {}, {
                        get: (target, prop) => {
                            if (typeof prop === "string" && prop.startsWith("_dynCls")) {
                                return Array.prototype;
                            }

                            return target[prop];
                        }
                    });

                    (_self as any)._testFunction = () => {
                        QUnit.assert.fail("Should not be able to update Array.prototype");
                    }
                });

                QUnit.assert.ok(!Array.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Array.prototype");
            }
        });

        this.testCase({
            name: "Try to update Array.prototype indirectly by using a proxy to return the Object.prototype as the instance functions",
            test: () => {
                let a = new HackClass();

                dynamicProto(HackClass, a, (_self, base) => {
                    let className = _self["_dynClass"];
                    let classProto = _self["_dynInstFuncs"] = (_self["_dynInstFuncs"] || {});

                    // Change the return class prototype to be Object.prototype
                    classProto["_dynCls" + className] = Array.prototype;

                    (_self as any)._testFunction = () => {
                        QUnit.assert.fail("Should not be able to update Array.prototype");
                    }
                });

                QUnit.assert.ok(!Array.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Array.prototype");
            }
        });

        this.testCase({
            name: "Try to update Object.prototype with a BadInstClass instance",
            test: () => {
                let a = new BadInstClass();

                dynamicProto(BadInstClass, a, (_self, base) => {

                    (_self as any)._testFunction = () => {
                        QUnit.assert.fail("Should not be able to update Object.prototype");
                    }
                });

                QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
                QUnit.assert.ok(!Object.prototype.hasOwnProperty("_dynInstFuncs"), "Should not have polluted Object.prototype");
            }
        });

        this.testCase({
            name: "Try to update Object.prototype with a BadProxyInstClass instance",
            test: () => {
                let a = new BadProxyInstClass();

                dynamicProto(BadProxyInstClass, a, (_self, base) => {

                    (_self as any)._testFunction = () => {
                        QUnit.assert.fail("Should not be able to update Object.prototype");
                    }
                });

                QUnit.assert.ok(!Object.prototype.hasOwnProperty("_testFunction"), "Should not have polluted Object.prototype");
                QUnit.assert.ok(!Object.prototype.hasOwnProperty("_dynInstFuncs"), "Should not have polluted Object.prototype");
            }
        });

    }
}

