/// <reference path="./TestFramework/Common.ts" />

import dynamicProto from "../src/DynamicProto";

interface IInheritTest {
    executionOrder:string[];
    testFunction?(): void;
}

class InheritNoInstTest1 implements IInheritTest {
    public executionOrder:string[] = [];

    constructor() {
        this.executionOrder.push("InheritTest1()");
    }

    public testFunction() {
        this.executionOrder.push("InheritTest1.test()");
    }
}

class InheritNoInstTest2 extends InheritNoInstTest1 {
    constructor() {
        super();
        this.executionOrder.push("InheritTest2()");
    }

    public testFunction() {
        super.testFunction();
        this.executionOrder.push("InheritTest2.test()");
    }
}

class InheritNoInstTest3 extends InheritNoInstTest2 {
    constructor() {
        super();
        this.executionOrder.push("InheritTest3()");
    }

    public testFunction() {
        super.testFunction();
        this.executionOrder.push("InheritTest3.test()");
    }
}

class DynInheritNoInstTest1 implements IInheritTest {
    public executionOrder:string[] = [];

    public testFunction?(): void;

    constructor() {
        this.executionOrder.push("DynInheritTest1()");
        dynamicProto(DynInheritNoInstTest1, this, (_self, base) => {
            _self.testFunction = () => {
                this.executionOrder.push("DynInheritTest1.test()");
            }
        }, { setInstFuncs: false });
    }
}

class InheritNoInstTest4 extends DynInheritNoInstTest1 {
    constructor() {
        super();
        this.executionOrder.push("InheritTest4()");
    }

    public testFunction() {
        super.testFunction();
        this.executionOrder.push("InheritTest4.test()");
    }
}

class InheritNoInstTest5 extends InheritNoInstTest4 {
    constructor() {
        super();
        this.executionOrder.push("InheritTest5()");
    }

    public testFunction() {
        super.testFunction();
        this.executionOrder.push("InheritTest5.test()");
    }
}

class DynInheritNoInstTest2 extends InheritNoInstTest1 {
    constructor() {
        super();
        this.executionOrder.push("DynInheritTest2()");
        dynamicProto(DynInheritNoInstTest2, this, (_self, base) => {
            _self.testFunction = () => {
                base.testFunction();
                this.executionOrder.push("DynInheritTest2.test()");
            }
        }, { setInstFuncs: false });
    }
}

class DynInheritNoInstTest3 extends DynInheritNoInstTest2 {
    constructor() {
        super();
        this.executionOrder.push("DynInheritTest3()");
        dynamicProto(DynInheritNoInstTest3, this, (_self, base) => {
            _self.testFunction = () => {
                base.testFunction();
                this.executionOrder.push("DynInheritTest3.test()");
            }
        }, { setInstFuncs: false });
    }
}

class InheritNoInstTest6 extends DynInheritNoInstTest2 {
    constructor() {
        super();
        this.executionOrder.push("InheritTest6()");
    }

    public testFunction() {
        super.testFunction();
        this.executionOrder.push("InheritTest6.test()");
    }
}

class DynInheritNoInstTest4 extends InheritNoInstTest6 {
    constructor() {
        super();
        this.executionOrder.push("DynInheritTest4()");
        dynamicProto(DynInheritNoInstTest4, this, (_self, base) => {
            _self.testFunction = () => {
                base.testFunction();
                this.executionOrder.push("DynInheritTest4.test()");
            }
        }, { setInstFuncs: false });
    }
}

class DynInheritNoInstTest5 extends DynInheritNoInstTest1 {
    constructor() {
        super();
        this.executionOrder.push("DynInheritTest5()");
        dynamicProto(DynInheritNoInstTest5, this, (_self, base) => {
            _self.testFunction = () => {
                base.testFunction();
                this.executionOrder.push("DynInheritTest5.test()");
            }
        }, { setInstFuncs: false });
    }
}

class DynInheritNoInstTest6 extends DynInheritNoInstTest5 {
    constructor() {
        super();
        this.executionOrder.push("DynInheritTest6()");
        dynamicProto(DynInheritNoInstTest6, this, (_self, base) => {
            _self.testFunction = () => {
                base.testFunction();
                this.executionOrder.push("DynInheritTest6.test()");
            }
        }, { setInstFuncs: false });
    }
}

class InstInheritNoInst1 implements IInheritTest {
    public executionOrder:string[] = [];

    public testFunction?():void;

    constructor() {
        this.executionOrder.push("InstInherit1()");

        this.testFunction = () => {
            this.executionOrder.push("InstInherit1.test()");
        }
    }
}

class InstInheritNoInst2 extends InheritNoInstTest2 {
    constructor() {
        super();
        this.executionOrder.push("InstInherit2()");

        this.testFunction = () => {
            super.testFunction();
            this.executionOrder.push("InstInherit2.test()");
        }
    }
}

class InheritNoInstTest7 extends InstInheritNoInst1 {
    constructor() {
        super();
        this.executionOrder.push("InheritTest7()");
    }

    public testFunction() {
        super.testFunction();
        this.executionOrder.push("InheritTest7.test()");
    }
}

class DynInheritNoInstTest7 extends InstInheritNoInst1 {
    constructor() {
        super();
        this.executionOrder.push("DynInheritTest7()");
        dynamicProto(DynInheritNoInstTest7, this, (_self, base) => {
            _self.testFunction = () => {
                base.testFunction();
                this.executionOrder.push("DynInheritTest7.test()");
            }
        });
    }
}

class InstInheritNoInst3 extends DynInheritNoInstTest7 {
    constructor() {
        super();
        this.executionOrder.push("InstInherit3()");

        this.testFunction = () => {
            super.testFunction();
            this.executionOrder.push("InstInherit3.test()");
        }
    }
}

class DynInheritNoInstTest8 extends InstInheritNoInst3 {
    constructor() {
        super();
        this.executionOrder.push("DynInheritTest8()");
        dynamicProto(DynInheritNoInstTest8, this, (_self, base) => {
            _self.testFunction = () => {
                base.testFunction();
                this.executionOrder.push("DynInheritTest8.test()");
            }
        }, { setInstFuncs: false });
    }
}

class BadInstInheritNoInst1 extends InstInheritNoInst1 {
    constructor() {
        super();
        this.executionOrder.push("BadInstInherit1()");

        this.testFunction = () => {
            try {
                super.testFunction();
            } catch (e) {
                this.executionOrder.push("BadInstInherit1.throw()");
            }
            this.executionOrder.push("BadInstInherit1.test()");
        }
    }
}

class DynInheritTestNoInst9 extends BadInstInheritNoInst1 {
    constructor() {
        super();
        this.executionOrder.push("DynInheritTest9()");
        dynamicProto(DynInheritTestNoInst9, this, (_self, base) => {
            _self.testFunction = () => {
                base.testFunction();
                this.executionOrder.push("DynInheritTest9.test()");
            }
        }, { setInstFuncs: false });
    }
}

class GoodInstInheritNoInst1 extends InstInheritNoInst1 {
    constructor() {
        super();
        this.executionOrder.push("GoodInstInherit1()");

        let prevTestFunc = this.testFunction;
        this.testFunction = () => {
            prevTestFunc.call(this);
            this.executionOrder.push("GoodInstInherit1.test()");
        }
    }
}

class DynInheritTestNoInst10 extends GoodInstInheritNoInst1 {
    constructor() {
        super();
        this.executionOrder.push("DynInheritTest10()");
        dynamicProto(DynInheritTestNoInst10, this, (_self, base) => {
            _self.testFunction = () => {
                base.testFunction();
                this.executionOrder.push("DynInheritTest10.test()");
            }
        }, { setInstFuncs: false });
    }
}

class GoodInstInheritNoInst2 extends DynInheritTestNoInst10 {
    constructor() {
        super();
        this.executionOrder.push("GoodInstInherit2()");

        let prevTestFunc = this.testFunction;
        this.testFunction = () => {
            prevTestFunc.call(this);
            this.executionOrder.push("GoodInstInherit2.test()");
        }
    }
}

export class DynamicProtoMultipleNoInstTests extends TestClass {

    public testInitialize() {
    }

    private _validateOrder(message:string, actual:string[], expected:string[]) {
        QUnit.assert.equal(actual.length, expected.length, message + ": Checking the length");

        let passed = true;
        let error = "";
        for (let lp = 0; lp < expected.length; lp++) {
            if (lp < actual.length) {
                if (actual[lp] !== expected[lp]) {
                    passed = false
                    error += " **[" + actual[lp] + "!=" + expected[lp] + "]**;"
                } else {
                    error += " " + expected[lp] + ";";
                }
            } else {
                passed = false;
                error += " --[" + expected[lp] + "]--;"
            }
        }

        // Fail test and log any extra unexpected calls
        for (let lp = expected.length; lp < actual.length; lp++) {
            passed = false;
            error += " ++[" + actual[lp] + "]++;"
        }

        QUnit.assert.ok(passed, message + ":" + error);
    }

    private doTest(message:string, theTest:IInheritTest, expectedOrder:string[])
    {
        theTest.testFunction();
        theTest.testFunction();
        this._validateOrder(message, theTest.executionOrder, expectedOrder);
    }

    public registerTests() {
        this.testCase({
            name: "NoInst: Inheritance tests",
            test: () => {
                this.doTest("InheritTest1", new InheritNoInstTest1(), [
                    "InheritTest1()", 
                    "InheritTest1.test()",
                    "InheritTest1.test()"
                ]);

                this.doTest("InheritTest2", new InheritNoInstTest2(), [
                    "InheritTest1()", 
                    "InheritTest2()", 
                    "InheritTest1.test()",
                    "InheritTest2.test()",
                    "InheritTest1.test()",
                    "InheritTest2.test()"
                ]);

                this.doTest("InheritTest3", new InheritNoInstTest3(), [
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

                this.doTest("InheritTest4", new InheritNoInstTest4(), [
                    "DynInheritTest1()", 
                    "InheritTest4()", 
                    "DynInheritTest1.test()",
                    "InheritTest4.test()",
                    "DynInheritTest1.test()",
                    "InheritTest4.test()"
                ]);

                this.doTest("InheritTest5", new InheritNoInstTest5(), [
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

                this.doTest("DynInheritTest1", new DynInheritNoInstTest1(), [
                    "DynInheritTest1()", 
                    "DynInheritTest1.test()",
                    "DynInheritTest1.test()"
                ]);

                this.doTest("DynInheritTest2", new DynInheritNoInstTest2(), [
                    "InheritTest1()", 
                    "DynInheritTest2()", 
                    "InheritTest1.test()",
                    "DynInheritTest2.test()",
                    "InheritTest1.test()",
                    "DynInheritTest2.test()"
                ]);

                this.doTest("DynInheritTest3", new DynInheritNoInstTest3(), [
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

                this.doTest("InheritTest6", new InheritNoInstTest6(), [
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

                this.doTest("DynInheritTest4", new DynInheritNoInstTest4(), [
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

                this.doTest("DynInheritTest5", new DynInheritNoInstTest5(), [
                    "DynInheritTest1()", 
                    "DynInheritTest5()", 
                    "DynInheritTest1.test()",
                    "DynInheritTest5.test()",
                    "DynInheritTest1.test()",
                    "DynInheritTest5.test()"
                ]);

                this.doTest("DynInheritTest6", new DynInheritNoInstTest6(), [
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


                this.doTest("InstInherit1", new InstInheritNoInst1(), [
                    "InstInherit1()", 
                    "InstInherit1.test()",
                    "InstInherit1.test()"
                ]);

                this.doTest("InstInherit2", new InstInheritNoInst2(), [
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
                this.doTest("InheritTest7", new InheritNoInstTest7(), [
                    "InstInherit1()",
                    "InheritTest7()", 
                    "InstInherit1.test()",
                    "InstInherit1.test()"
                ]);

                // NOTE: Notice that DynInheritTest7.test() IS called -- this is because dynamicProto handles this scenario
                this.doTest("DynInheritTest7", new DynInheritNoInstTest7(), [
                    "InstInherit1()", 
                    "DynInheritTest7()", 
                    "InstInherit1.test()",
                    "DynInheritTest7.test()",
                    "InstInherit1.test()",
                    "DynInheritTest7.test()"
                ]);

                this.doTest("InstInherit3", new InstInheritNoInst3(), [
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
                
                this.doTest("DynInheritTest8", new DynInheritNoInstTest8(), [
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
                this.doTest("BadInstInherit1", new BadInstInheritNoInst1(), [
                    "InstInherit1()", 
                    "BadInstInherit1()",
                    "BadInstInherit1.throw()",
                    "BadInstInherit1.test()",
                    "BadInstInherit1.throw()",
                    "BadInstInherit1.test()"
                ]);

                // Note: dynamicProto doesn't fix broken base classes, but it still calls them in the correct order
                this.doTest("DynInheritTest9", new DynInheritTestNoInst9(), [
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

                this.doTest("GoodInstInherit1", new GoodInstInheritNoInst1(), [
                    "InstInherit1()", 
                    "GoodInstInherit1()", 
                    "InstInherit1.test()",
                    "GoodInstInherit1.test()",
                    "InstInherit1.test()",
                    "GoodInstInherit1.test()"
                ]);

                this.doTest("DynInheritTest10", new DynInheritTestNoInst10(), [
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

                this.doTest("GoodInstInherit2", new GoodInstInheritNoInst2(), [
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
    }
}
