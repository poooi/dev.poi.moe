/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const siteConfig = {
  title: 'Poi dev documents' /* title for your website */,
  tagline: 'Documents for poi development',
  url: 'https://dev.poooi.app' /* your website url */,
  cname: 'dev.poooi.app',
  baseUrl: '/' /* base url for your project */,
  projectName: 'dev.poi',
  headerLinks: [
    { search: true },
    {doc: 'plugin-introduction', label: 'Docs'},
    {doc: 'cli', label: 'CLI'},
    {page: 'help', label: 'Help'},
    {blog: true, label: 'Blog'},
    { href: 'https://opencollective.com/poi', label: 'Donate'}
  ],
  /* path to images for header/footer */
  headerIcon: 'img/poi.png',
  footerIcon: 'img/poi.png',
  favicon: 'img/poi.png',
  /* colors for website */
  colors: {
    primaryColor: '#03a9f4',
    secondaryColor: '#ff9800',
  },
  /* custom fonts for website */
  fonts: {
    myFont: [
      'IBM Plex Sans',
      'sans-serif'
    ],
    myOtherFont: [
      '-apple-system',
      'system-ui'
    ]
  },
  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright:
    'Copyright © ' +
    new Date().getFullYear() +
    ' Poi contributors',
  organizationName: 'poooi', // or set an env variable ORGANIZATION_NAME
  projectName: 'dev.poooi.app', // or set an env variable PROJECT_NAME
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: 'dracula',
    defaultLang: 'javascript',
  },
  scripts: ['https://buttons.github.io/buttons.js'],
  // You may provide arbitrary config keys to be used as needed by your template.
  repoUrl: 'https://github.com/poooi/dev.poi.io',
  /* On page navigation for the current documentation page */
  // onPageNav: 'separate',
  algolia: {
    apiKey: 'c702792395f27b7554df08c52438496c',
    indexName: 'dev_poi',
    algoliaOptions: {} // Optional, if provided by Algolia
  },
};

module.exports = siteConfig;
