const puppeteer = require('puppeteer');

const getPageLinks = () => {
  let linkSelector = document.querySelectorAll('#search .rc .r > a');
  return Array
    .from(linkSelector)
    .map(link => link.href);
}

const queryGoogleFromSite = async (site, pagesToQuery = 10) => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto('https://www.google.com');
  
  await page.type('input[name=q]', `site:${site}`);
  await page.keyboard.press('Enter');
  
  await page.waitFor(1500);
  
  let allLinks = [];
  for (let index = 0; index < pagesToQuery; index++) {
    const links = await page.evaluate(getPageLinks);
    allLinks = [...allLinks, ...links];

    const hasNextPage = await page.$$eval('#pnnext', buttons => buttons.length);
    if(!hasNextPage) {
      break;
    }

    console.log(`Retriving page ${index+1} from site:${site}`)
    await page.click('#pnnext');
    await page.waitFor('#search');
  }

  await browser.close();
  return allLinks;
}

module.exports = queryGoogleFromSite
