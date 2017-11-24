const { expect } = require('chai');
const { _getAllMethodNames, _exportPublicMethods, exportClass } = require('../di');

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

class ChildClassWithPrivates extends SimpleClass {
    constructor(serviceA, serviceB) {
        super(serviceA, serviceB);
    }

    _metodPrivate() {
        return 'shouldn\'t be exported';
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
    describe('_getAllMethodNames', () => {
        it('should return list of methods (only) for simple class', () => {
            const simpleClass = new SimpleClass(_serviceA, _serviceB);
            expect(_getAllMethodNames(simpleClass)).to.deep.equal(['methodA', 'methodB']);
        });

        it('should return methods of parent class as well', () => {
            const childClass = new ChildClass(_serviceA, _serviceB);
            expect(_getAllMethodNames(childClass)).to.deep.equal(['methodFoo', 'methodA', 'methodB']);
        });

        it('should not provide private methods', () => {
            const privateClass = new ChildClassWithPrivates(_serviceA, _serviceB);
            expect(_getAllMethodNames(privateClass)).to.deep.equal(['methodA', 'methodB']);
        });
    });

    describe('_exportPublicMethods', () => {
        it('should return object with methods of given instance', () => {
            const childClass = new ChildClass(_serviceA, _serviceB);
            const methodsObject = _exportPublicMethods(childClass);
            expect(Object.keys(methodsObject)).to.deep.equal(['methodFoo', 'methodA', 'methodB']);
        });

        it('method should operate in the conetext of original class', () => {
            const childClass = new ChildClass(_serviceA, _serviceB);
            const methodsObject = _exportPublicMethods(childClass);
            expect(methodsObject.methodA()).to.equal(1);
        });
    });

    describe('exportClass', () => {
        it('should export class with given dependencies', () => {
            const methodsObject = exportClass(
                _serviceA,
                _serviceB
            )(ChildClass);

            expect(Object.keys(methodsObject)).to.deep.equal(['methodFoo', 'methodA', 'methodB']);
            expect(methodsObject.methodB()).to.equal(2);
        });

        it('dependencies could be provided as Array', () => {
            const methodsObject = exportClass([
                _serviceA,
                _serviceB,
            ])(ChildClass);

            expect(Object.keys(methodsObject)).to.deep.equal(['methodFoo', 'methodA', 'methodB']);
            expect(methodsObject.methodB()).to.equal(2);
        })

        it('should throw an error if not class given', () => {
            const badClass = function() {};

            expect(() => exportClass()(badClass)).to.throw();
        });
    });
});