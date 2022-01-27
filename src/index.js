const { csvParser } = require("./start");

const targetSite = process.argv[2];
const csvDest = process.argv[3];
const pagesToScrape = process.argv[4];
const checkLinks = process.argv[5];

if (!targetSite) {
  console.log("Por favor, informe um site para o scrapping");
}

csvParser(targetSite, csvDest, pagesToScrape, checkLinks);
