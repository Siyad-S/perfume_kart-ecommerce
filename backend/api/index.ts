
import moduleAlias from 'module-alias';
import path from 'path';

const srcPath = path.join(__dirname, '../src');
moduleAlias.addAlias('@', srcPath);

// Use require to prevent import hoisting - aliases must be registered BEFORE importing app
const app = require('../src/app').default;

export default app;
