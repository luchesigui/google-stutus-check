# Welcome to site redirect csv 👋
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#)
[![Twitter: luchesigui](https://img.shields.io/twitter/follow/luchesigui.svg?style=social)](https://twitter.com/luchesigui)

> Scrape results for site:{domain}, filter only for links that have a status different than 200 (togglable by args) and write them in a csv. Excellent to run after a site update to remap the google results and minimize the impact on SEO.

## Install

```sh
npm install
```

## Usage

```sh
npm start
```

## Command line flags
- **`--domain`** (alias: -d): The domain to search for.
Required.

- **`--csv-name`**: The name of the csv file will be created.
Default: filtered-urls.csv.

- **`--pages`** (alias: -p): Quantity of pages to scrape.
Default: 10.

- **`--check`** (alias: -c): Rather the links scraped should be checked for redirects or not.
Default: true.

## Run tests

```sh
npm run test
```

## Author

👤 **Guilherme Luchesi**

* Twitter: [@luchesigui](https://twitter.com/luchesigui)
* Github: [@guiluchesi](https://github.com/guiluchesi)
* LinkedIn: [@guilhermeluchesi](https://linkedin.com/in/guilhermeluchesi)

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
