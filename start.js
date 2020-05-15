const fetch = require('node-fetch')
const chunk = require('lodash.chunk');
const { createObjectCsvWriter } = require('csv-writer');

const queryGoogleFromSite = require('./scrapper');

const CHUNK_LENGTH = 10;
  
const writeCSV = async (records, path) => {
  console.log('Writing the CSV file');

  const response = await createObjectCsvWriter({
    path,
    header: [
      { id: 'link', title: 'link_from' },
    ]
  })
  .writeRecords(records);

  console.log('...Done');
  return response;
}

const getSiteStatus = async (link) => {
  const { status } = await fetch(link)

  return {
    link,
    status
  };
}

const asyncReducer = (func) =>
  async (accPromise, currentChunk, index) => {
    const accumulator = await accPromise
    console.log(`Fetching status from links on page ${index + 1}`)
    
    const currentBatchPromises = currentChunk.map(func)
    const result = await Promise.all(currentBatchPromises)

    return [...accumulator, result]
  }

const flat = (prev, next) => [...prev, ...next]

const csvParser = async (targetSite, csvPath = 'filtered-urls.csv', pagesToScrape = 10) => {
  const links = await queryGoogleFromSite(targetSite, pagesToScrape)
  if(!links) {
    console.log('Erro na captura dos links');
    return;
  }

  console.log('Cleaning links that are already correct');
  const linkChunks = chunk(links, CHUNK_LENGTH);
  const siteInfoArray = await linkChunks.reduce(asyncReducer(getSiteStatus), [])
  const linkListFlatAndClean = siteInfoArray
    .reduce(flat, [])
    .filter(site => site.status !== 200)
  
  if(linkListFlatAndClean.length) {
    const csvPromise = await writeCSV(linkListFlatAndClean, csvPath);
    console.log(csvPromise)
    return csvPromise;
  }

  console.log('Todos os links capturados estão válidos')
  return linkListFlatAndClean;
}

module.exports = {
  csvParser,
};
