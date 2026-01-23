import moduleAlias from 'module-alias';
import path from 'path';

moduleAlias.addAlias('@', path.join(__dirname, '.'));
import app from './app';
import config from './config/config';
import connectToDB from './config/connection';

connectToDB();

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
