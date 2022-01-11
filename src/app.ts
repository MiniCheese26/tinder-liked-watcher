import {SaveType, TinderLikes} from 'types';
import fs from 'fs/promises';
import fetch from 'node-fetch';
import process from 'process';
import config from './config.js';

async function get (url: string): Promise<TinderLikes | null> {
  const response = await fetch(url, {
    headers: {
      'X-Auth-Token': config.authToken
    }
  });

  if (response === null || !response.ok) {
    console.log(response?.statusText ?? 'Response was null');

    // Don't want to spam if the auth token has expired
    if (response?.status === 401) {
      process.exit(1);
    }

    return null;
  }

  return await response.json() as TinderLikes;
}

async function getSaveFile () {
  let fileContent;

  try {
    fileContent = await fs.readFile(config.saveFile, {encoding: 'utf-8'});
  } catch (e) {
    await fs.writeFile(config.saveFile, '');
    return [];
  }

  return JSON.parse(fileContent.toString()) as SaveType[];
}

async function writeToSaveFile (originalData: SaveType[], data: SaveType[]) {
  const newData = originalData.concat(data);

  try {
    await fs.writeFile(config.saveFile, JSON.stringify(newData, null, 2), {encoding: 'utf-8'});
  } catch (e) {
    console.log(e);
  }
}

async function run () {
  const data = await get('https://api.gotinder.com/v2/fast-match/teasers');

  if (data === null) {
    return;
  }

  const saveFile = await getSaveFile();

  const time = new Date();
  const consoleTime = time.toLocaleDateString('en-GB', {
    hour: 'numeric',
    weekday: 'short',
    minute: 'numeric'
  });

  // Ignore profiles we've already saved

  const profiles = data.data.results
    .filter(x => !saveFile.some(y => y.id === x.user._id))
    .map(x =>
      (
        {
          id: x.user._id,
          photoUrl: x.user.photos[0].url,
          time: time.toJSON()
        } as SaveType
      ));

  if (profiles.length > 0) {
    console.log(`${consoleTime}: Saving ${profiles.length} profile(s)`);
    await writeToSaveFile(saveFile, profiles);
  }
}

while (true) {
  await run();
  await new Promise(resolve => setTimeout(resolve, config.timeout));
}

