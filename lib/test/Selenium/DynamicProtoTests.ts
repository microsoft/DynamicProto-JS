import { DynamicProtoDefaultTests } from '../DynamicProto.Tests';
import { DynamicProtoMultipleCallTests } from '../DynamicProtoMultipleCall.Tests';
import { DynamicProtoNoInstTests } from '../DynamicProtoNoInst.Tests';
import { DynamicProtoMultipleNoInstTests } from '../DynamicProtoMultipleNoInst.Tests';

export function runTests() {
    new DynamicProtoDefaultTests("Default").registerTests();
    new DynamicProtoMultipleCallTests("Multiple").registerTests();
    new DynamicProtoNoInstTests("SetInst").registerTests();
    new DynamicProtoMultipleNoInstTests("Multiple SetInst").registerTests();
}
