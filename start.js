const fetch = require('node-fetch')
const chunk = require('lodash.chunk');
const { createObjectCsvWriter } = require('csv-writer');

const queryGoogleFromSite = require('./scrapper');

const CHUNK_LENGTH = 10;
  
const writeCSV = async (records, path) => {
  console.log('Escrevendo arquivo csv');

  const response = await createObjectCsvWriter({
    path,
    header: [
      { id: 'link', title: 'link_from' },
    ]
  })
  .writeRecords(records);

  console.log('Pronto');
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
    console.log(`Verificando status dos links da página ${index + 1}`)
    
    const currentBatchPromises = currentChunk.map(func)
    const result = await Promise.all(currentBatchPromises)

    return [...accumulator, result]
  }

const flat = (prev, next) => [...prev, ...next]

const csvParser = async (targetSite, csvPath = 'filtered-urls.csv', pagesToScrape = 10, checkLinks = true) => {
  console.log('Iniciando busca no Google')
  const links = await queryGoogleFromSite(targetSite, pagesToScrape)
  if(!links.length) {
    console.log('Erro na captura dos links');
    return;
  }

  if(checkLinks) {
    console.log(links)
    const linkObjs = links.map(link => ({
      link,
      link_from: '',
    }))
    await writeCSV(linkObjs, csvPath);
    console.log('Os links desse arquivo não foram validados para saber se estão quebrados ou não')
    return;
  }

  console.log('Descartando links que estão corretos');
  const linkChunks = chunk(links, CHUNK_LENGTH);
  const siteInfoArray = await linkChunks.reduce(asyncReducer(getSiteStatus), [])
  const linkListFlatAndClean = siteInfoArray
    .reduce(flat, [])
    .filter(site => site.status !== 200)
  
  if(linkListFlatAndClean.length) {
    await writeCSV(linkListFlatAndClean, csvPath);
    return;
  }

  console.log('Todos os links capturados estão válidos')
  return linkListFlatAndClean;
}

module.exports = {
  csvParser,
};
