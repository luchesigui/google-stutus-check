const yargs = require('yargs')
const { csvParser } = require("./start")

const args = yargs
  .scriptName('site-redirect-csv')
  .usage('$0 <cmd> [args]')
  .command('scrape', 'Starts scraping Google results for the given domain')
  .option('domain', {
    alias: 'd',
    description: 'The domain to search for',
    type: 'string'
  })
  .option('csv-name', {
    description: 'The name of the csv file will be created',
    type: 'string',
    default: 'filtered-urls.csv'
  })
  .option('pages', {
    alias: 'p',
    description: 'Quantity of pages to scrape',
    type: 'number',
    default: 10
  })
  .option('check', {
    alias: 'c',
    description: 'Rather the links scraped should be checked for redirects or not',
    type: 'boolean',
    default: true
  })
  .demandOption('domain', 'Please provide a domain to scrape')
  .help()
  .alias('help', 'h')
  .argv

const configuration = {
  targetSite: args.domain,
  csvDest: args.csvName,
  pagesToScrape: args.pages,
  checkLinks: args.check
}

csvParser(configuration);
