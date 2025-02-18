import { setupServer } from "./server.js";
import { initMongoConnection } from './db/initMongoConnection.js';


import { createDirIfNotExist } from "./utils/createDirIfNotExist.js";

import { TEMP_UPLOAD_DIR, UPLOADS_DIR } from "./constans/index.js";

const bootstrap = async () => {
  await createDirIfNotExist(TEMP_UPLOAD_DIR);
  await createDirIfNotExist(UPLOADS_DIR);
  await initMongoConnection();
  setupServer();
};

bootstrap();
