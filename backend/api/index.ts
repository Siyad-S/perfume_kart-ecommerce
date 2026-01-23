
import moduleAlias from 'module-alias';
import path from 'path';

moduleAlias.addAlias('@', path.join(__dirname, '../src'));
import app from '../src/app';

export default app;
