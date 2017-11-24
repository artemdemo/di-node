const { expect } = require('chai');
const { getAllMethodNames, exportPublicMethods } = require('../methodsService');

class SimpleClass {
    constructor(serviceA, serviceB) {
        this.serviceA = serviceA;
        this.serviceB = serviceB;
    }

    methodA() {
        return this.serviceA.toString();
    }

    methodB() {
        return this.serviceB.toString();
    }
}

class ChildClass extends SimpleClass {
    constructor(serviceA, serviceB) {
        super(serviceA, serviceB);
    }

    methodFoo() {
        return 'foo';
    }
}

const _serviceA = {
    toString() {
        return 1;
    }
}

const _serviceB = {
    toString() {
        return 2;
    }
}

describe('methodsService', () => {
    describe('getAllMethodNames', () => {
        it('should return list of methods (only) for simple class', () => {
            const simpleClass = new SimpleClass(_serviceA, _serviceB);
            expect(getAllMethodNames(simpleClass)).to.deep.equal(['methodA', 'methodB']);
        });

        it('should return methods of parent class as well', () => {
            const childClass = new ChildClass(_serviceA, _serviceB);
            expect(getAllMethodNames(childClass)).to.deep.equal(['methodFoo', 'methodA', 'methodB']);
        });
    });

    describe('exportPublicMethods', () => {
        it('should return object with methods of given instance', () => {
            const childClass = new ChildClass(_serviceA, _serviceB);
            const methodsObject = exportPublicMethods(childClass);
            expect(Object.keys(methodsObject)).to.deep.equal(['methodFoo', 'methodA', 'methodB']);
        });

        it('method should operate in the conetext of original class', () => {
            const childClass = new ChildClass(_serviceA, _serviceB);
            const methodsObject = exportPublicMethods(childClass);
            expect(methodsObject.methodA()).to.equal(1);
        });
    });
});