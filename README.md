## Dependency Injection (DI) for NodeJS

Experiments with dependency injections for NodeJS.

This is not DI:

```js
const db = require('../databaseConnector');

const getProjects = () => {
    return db.query('select * from projects');
};

module.exports = {
    getProjects,
};
```

We are importing the db module directly, and we therefore depend on it’s location on disk,
and on that particular implementation. Therefore this module is not testable. And we can do better.

```js
const db = require('../databaseConnector');
const { exportClass } = require('../../methodsService');

class ProjectsModelClass {
    constructor(db) {
        this.db = db;
    }

    getProjects() {
        return db.query('select * from projects');
    }
}

module.exports = {
    ProjectsModelClass,
    projectsModel: exportClass(db)(ProjectsModelClass),
};
```

And then write proper test:

```js
const { expect } = require('chai');
const { exportClass } = require('../../methodsService');
const { ProjectsModelClass } = require('../projectsModel');

const projectsList = [
    {id: 1, name: 'First Project'}
];

const dbMock = {
    query(queryStr) {
        switch(queryStr) {
            case 'select * from projects':
                return projectsList;
        }
    }
};

describe('projectsModal', () => {
    it('should return projects list', () => {
        const projectsModel = exportClass(dbMock)(ProjectsModelClass);
        expect(projectsModel.getProjects()).to.deep.equal(projectsList);
    });
});
```