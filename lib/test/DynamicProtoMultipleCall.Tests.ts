/// <reference path="./TestFramework/Common.ts" />

import dynamicProto from "../src/DynamicProto";

interface IInheritTest {
    executionOrder:string[];
    testFunction?(): void;
}

class InheritMultipleCallTest1 implements IInheritTest {
    public executionOrder:string[] = [];

    constructor() {
        this.executionOrder.push("InheritTest1()");
    }

    public testFunction() {
        this.executionOrder.push("InheritTest1.test()");
    }
}

class InheritMultipleCallTest2 extends InheritMultipleCallTest1 {
    constructor() {
        super();
        this.executionOrder.push("InheritTest2()");
    }

    public testFunction() {
        super.testFunction();
        this.executionOrder.push("InheritTest2.test()");
    }
}

class InheritMultipleCallTest3 extends InheritMultipleCallTest2 {
    constructor() {
        super();
        this.executionOrder.push("InheritTest3()");
    }

    public testFunction() {
        super.testFunction();
        this.executionOrder.push("InheritTest3.test()");
    }
}

class DynInheritMultipleCallTest1 implements IInheritTest {
    public executionOrder:string[] = [];

    public testFunction?(): void;

    constructor() {
        this.executionOrder.push("DynInheritTest1()");
        dynamicProto(DynInheritMultipleCallTest1, this, (_self, base) => {
            _self.testFunction = () => {
                this.executionOrder.push("DynInheritTest1.test()");
            }
        });
    }
}

class InheritMultipleCallTest4 extends DynInheritMultipleCallTest1 {
    constructor() {
        super();
        this.executionOrder.push("InheritTest4()");
    }

    public testFunction() {
        super.testFunction();
        this.executionOrder.push("InheritTest4.test()");
    }
}

class InheritMultipleCallTest5 extends InheritMultipleCallTest4 {
    constructor() {
        super();
        this.executionOrder.push("InheritTest5()");
    }

    public testFunction() {
        super.testFunction();
        this.executionOrder.push("InheritTest5.test()");
    }
}

class DynInheritMultipleCallTest2 extends InheritMultipleCallTest1 {
    constructor() {
        super();
        this.executionOrder.push("DynInheritTest2()");
        dynamicProto(DynInheritMultipleCallTest2, this, (_self, base) => {
            _self.testFunction = () => {
                base.testFunction();
                this.executionOrder.push("DynInheritTest2.test()");
            }
        });
    }
}

class DynInheritMultipleCallTest3 extends DynInheritMultipleCallTest2 {
    constructor() {
        super();
        this.executionOrder.push("DynInheritTest3()");
        dynamicProto(DynInheritMultipleCallTest3, this, (_self, base) => {
            _self.testFunction = () => {
                base.testFunction();
                this.executionOrder.push("DynInheritTest3.test()");
            }
        });
    }
}

class InheritMultipleCallTest6 extends DynInheritMultipleCallTest2 {
    constructor() {
        super();
        this.executionOrder.push("InheritTest6()");
    }

    public testFunction() {
        super.testFunction();
        this.executionOrder.push("InheritTest6.test()");
    }
}

class DynInheritMultipleCallTest4 extends InheritMultipleCallTest6 {
    constructor() {
        super();
        this.executionOrder.push("DynInheritTest4()");
        dynamicProto(DynInheritMultipleCallTest4, this, (_self, base) => {
            _self.testFunction = () => {
                base.testFunction();
                this.executionOrder.push("DynInheritTest4.test()");
            }
        });
    }
}

class DynInheritMultipleCallTest5 extends DynInheritMultipleCallTest1 {
    constructor() {
        super();
        this.executionOrder.push("DynInheritTest5()");
        dynamicProto(DynInheritMultipleCallTest5, this, (_self, base) => {
            _self.testFunction = () => {
                base.testFunction();
                this.executionOrder.push("DynInheritTest5.test()");
            }
        });
    }
}

class DynInheritMultipleCallTest6 extends DynInheritMultipleCallTest5 {
    constructor() {
        super();
        this.executionOrder.push("DynInheritTest6()");
        dynamicProto(DynInheritMultipleCallTest6, this, (_self, base) => {
            _self.testFunction = () => {
                base.testFunction();
                this.executionOrder.push("DynInheritTest6.test()");
            }
        });
    }
}

class InstInheritMultipleCall1 implements IInheritTest {
    public executionOrder:string[] = [];

    public testFunction?():void;

    constructor() {
        this.executionOrder.push("InstInherit1()");

        this.testFunction = () => {
            this.executionOrder.push("InstInherit1.test()");
        }
    }
}

class InstInheritMultipleCall2 extends InheritMultipleCallTest2 {
    constructor() {
        super();
        this.executionOrder.push("InstInherit2()");

        this.testFunction = () => {
            super.testFunction();
            this.executionOrder.push("InstInherit2.test()");
        }
    }
}

class InheritMultipleCallTest7 extends InstInheritMultipleCall1 {
    constructor() {
        super();
        this.executionOrder.push("InheritTest7()");
    }

    public testFunction() {
        super.testFunction();
        this.executionOrder.push("InheritTest7.test()");
    }
}

class DynInheritMultipleCallTest7 extends InstInheritMultipleCall1 {
    constructor() {
        super();
        this.executionOrder.push("DynInheritTest7()");
        dynamicProto(DynInheritMultipleCallTest7, this, (_self, base) => {
            _self.testFunction = () => {
                base.testFunction();
                this.executionOrder.push("DynInheritTest7.test()");
            }
        });
    }
}

class InstInheritMultipleCall3 extends DynInheritMultipleCallTest7 {
    constructor() {
        super();
        this.executionOrder.push("InstInherit3()");

        this.testFunction = () => {
            super.testFunction();
            this.executionOrder.push("InstInherit3.test()");
        }
    }
}

class DynInheritMultipleCallTest8 extends InstInheritMultipleCall3 {
    constructor() {
        super();
        this.executionOrder.push("DynInheritTest8()");
        dynamicProto(DynInheritMultipleCallTest8, this, (_self, base) => {
            _self.testFunction = () => {
                base.testFunction();
                this.executionOrder.push("DynInheritTest8.test()");
            }
        });
    }
}

class BadInstInheritMultipleCall1 extends InstInheritMultipleCall1 {
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

class DynInheritTestMultipleCall9 extends BadInstInheritMultipleCall1 {
    constructor() {
        super();
        this.executionOrder.push("DynInheritTest9()");
        dynamicProto(DynInheritTestMultipleCall9, this, (_self, base) => {
            _self.testFunction = () => {
                base.testFunction();
                this.executionOrder.push("DynInheritTest9.test()");
            }
        });
    }
}

class GoodInstInheritMultipleCall1 extends InstInheritMultipleCall1 {
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

class DynInheritTestMultipleCall10 extends GoodInstInheritMultipleCall1 {
    constructor() {
        super();
        this.executionOrder.push("DynInheritTest10()");
        dynamicProto(DynInheritTestMultipleCall10, this, (_self, base) => {
            _self.testFunction = () => {
                base.testFunction();
                this.executionOrder.push("DynInheritTest10.test()");
            }
        });
    }
}

class GoodInstInheritMultipleCall2 extends DynInheritTestMultipleCall10 {
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

export class DynamicProtoMultipleCallTests extends TestClass {

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
        theTest.testFunction();
        this._validateOrder(message, theTest.executionOrder, expectedOrder);
    }

    public registerTests() {
        this.testCase({
            name: "MultipleCall: Inheritance tests",
            test: () => {
                this.doTest("InheritTest1", new InheritMultipleCallTest1(), [
                    "InheritTest1()", 
                    "InheritTest1.test()",
                    "InheritTest1.test()",
                    "InheritTest1.test()"
                ]);

                this.doTest("InheritTest2", new InheritMultipleCallTest2(), [
                    "InheritTest1()", 
                    "InheritTest2()", 
                    "InheritTest1.test()",
                    "InheritTest2.test()",
                    "InheritTest1.test()",
                    "InheritTest2.test()",
                    "InheritTest1.test()",
                    "InheritTest2.test()"
                ]);

                this.doTest("InheritTest3", new InheritMultipleCallTest3(), [
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

                this.doTest("InheritTest4", new InheritMultipleCallTest4(), [
                    "DynInheritTest1()", 
                    "InheritTest4()", 
                    "DynInheritTest1.test()",
                    "InheritTest4.test()",
                    "DynInheritTest1.test()",
                    "InheritTest4.test()",
                    "DynInheritTest1.test()",
                    "InheritTest4.test()"
                ]);

                this.doTest("InheritTest5", new InheritMultipleCallTest5(), [
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

                this.doTest("DynInheritTest1", new DynInheritMultipleCallTest1(), [
                    "DynInheritTest1()", 
                    "DynInheritTest1.test()",
                    "DynInheritTest1.test()",
                    "DynInheritTest1.test()"
                ]);

                this.doTest("DynInheritTest2", new DynInheritMultipleCallTest2(), [
                    "InheritTest1()", 
                    "DynInheritTest2()", 
                    "InheritTest1.test()",
                    "DynInheritTest2.test()",
                    "InheritTest1.test()",
                    "DynInheritTest2.test()",
                    "InheritTest1.test()",
                    "DynInheritTest2.test()"
                ]);

                this.doTest("DynInheritTest3", new DynInheritMultipleCallTest3(), [
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

                this.doTest("InheritTest6", new InheritMultipleCallTest6(), [
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

                this.doTest("DynInheritTest4", new DynInheritMultipleCallTest4(), [
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

                this.doTest("DynInheritTest5", new DynInheritMultipleCallTest5(), [
                    "DynInheritTest1()", 
                    "DynInheritTest5()", 
                    "DynInheritTest1.test()",
                    "DynInheritTest5.test()",
                    "DynInheritTest1.test()",
                    "DynInheritTest5.test()",
                    "DynInheritTest1.test()",
                    "DynInheritTest5.test()"
                ]);

                this.doTest("DynInheritTest6", new DynInheritMultipleCallTest6(), [
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


                this.doTest("InstInherit1", new InstInheritMultipleCall1(), [
                    "InstInherit1()", 
                    "InstInherit1.test()",
                    "InstInherit1.test()",
                    "InstInherit1.test()"
                ]);

                this.doTest("InstInherit2", new InstInheritMultipleCall2(), [
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
                this.doTest("InheritTest7", new InheritMultipleCallTest7(), [
                    "InstInherit1()",
                    "InheritTest7()", 
                    "InstInherit1.test()",
                    "InstInherit1.test()",
                    "InstInherit1.test()"
                ]);

                // NOTE: Notice that DynInheritTest7.test() IS called -- this is because dynamicProto handles this scenario
                this.doTest("DynInheritTest7", new DynInheritMultipleCallTest7(), [
                    "InstInherit1()", 
                    "DynInheritTest7()", 
                    "InstInherit1.test()",
                    "DynInheritTest7.test()",
                    "InstInherit1.test()",
                    "DynInheritTest7.test()",
                    "InstInherit1.test()",
                    "DynInheritTest7.test()"
                ]);

                this.doTest("InstInherit3", new InstInheritMultipleCall3(), [
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
                
                this.doTest("DynInheritTest8", new DynInheritMultipleCallTest8(), [
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
                this.doTest("BadInstInherit1", new BadInstInheritMultipleCall1(), [
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
                this.doTest("DynInheritTest9", new DynInheritTestMultipleCall9(), [
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

                this.doTest("GoodInstInherit1", new GoodInstInheritMultipleCall1(), [
                    "InstInherit1()", 
                    "GoodInstInherit1()", 
                    "InstInherit1.test()",
                    "GoodInstInherit1.test()",
                    "InstInherit1.test()",
                    "GoodInstInherit1.test()",
                    "InstInherit1.test()",
                    "GoodInstInherit1.test()"
                ]);

                this.doTest("DynInheritTest10", new DynInheritTestMultipleCall10(), [
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

                this.doTest("GoodInstInherit2", new GoodInstInheritMultipleCall2(), [
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
    }
}
