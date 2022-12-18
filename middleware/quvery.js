import fs from 'fs/promises';
import moment from 'moment';

export const writesQueryMiddleware = async req => {
  try {
    const { method, url } = req;
    const date = moment().format('DD-MM-YYYY_HH:mm:ss');
    return await fs.appendFile(
      './public//server.log',
      `\n${method} ${url} ${date}`
    );
  } catch (err) {
    console.log(err);
  }
};
