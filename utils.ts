import path from 'path';
import fs from 'fs';
import { PATH } from './env/public_env.js';
export const Log = async (text: string) => {
  const logDir = path.join(PATH.RootPath, PATH.logs_dir_rel);
  const logPath = path.join(logDir, 'log.log');

  try {
    // Ensure the logs directory exists
    await fs.promises.mkdir(logDir, { recursive: true });

    // Append log text with newline
    await fs.promises.appendFile(logPath, text + '\n', 'utf8');
  } catch (err) {
    console.error('Failed to write to log:', err);
  }
};
