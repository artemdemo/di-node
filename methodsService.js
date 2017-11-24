/**
 * Return array of method names of given class instane
 * 
 * @source https://stackoverflow.com/a/35033472
 * @param {Object} instanceObject - some class instane
 * @private
 */
const _getAllMethodNames = (instanceObject) => {
    let _props = [];
    let _obj = instanceObject;

    do {
        const currentMethods = Object.getOwnPropertyNames(_obj)
            .concat(Object.getOwnPropertySymbols(_obj).map(s => s.toString()))
            .filter((name, index, arr) =>
                typeof _obj[name] === 'function' &&         // only the methods
                name !== 'constructor' &&                   // not the constructor
                (index == 0 || name !== arr[index - 1]) &&  // not overriding in this prototype
                _props.indexOf(name) === -1 &&              // not overridden in a child
                name.startsWith('_') === false              // do not export private methods
            );
        _props = _props.concat(currentMethods);
        _obj = Object.getPrototypeOf(_obj);                 // walk-up the prototype chain
    }
    while (
        Object.getPrototypeOf(_obj) // not the the Object prototype methods (hasOwnProperty, etc...)
    )

    return _props;
}

/**
 * Return object with methods of given class instance
 * 
 * @param {Object} instanceObject - some class instane
 * @private
 */
const _exportPublicMethods = (instanceObject) => {
    const methodsList = _getAllMethodNames(instanceObject);
    return methodsList.reduce((acc, name) => {
        acc[name] = instanceObject[name].bind(instanceObject);
        return acc;
    }, {});
}

/**
 * Accepts list of dependencies and constructor function (class)
 * and returns object with methods
 *
 * @param {*} dependencies
 * @public
 */
const exportClass = (...dependencies) => (OriginalClass) => {
    const classInstance = (() => {
        if (dependencies.length === 1 && Array.isArray(dependencies[0]) && dependencies[0].length > 0) {
            return new OriginalClass(...dependencies[0]);
        } else if (dependencies.length > 0) {
            return new OriginalClass(...dependencies);
        }
        return new OriginalClass();
    })();
    return _exportPublicMethods(classInstance);
}

module.exports = {
    _getAllMethodNames,
    _exportPublicMethods,
    exportClass,
};
