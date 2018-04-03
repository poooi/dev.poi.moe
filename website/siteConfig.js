/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* List of projects/orgs using your project for the users page */
const users = [
  {
    caption: 'User1',
    image: '/test-site/img/poi.png',
    infoLink: 'https://www.facebook.com',
    pinned: true,
  },
];

const siteConfig = {
  title: 'dev.poi.io' /* title for your website */,
  tagline: 'Documents for poi development',
  url: 'https://dev.poi.io' /* your website url */,
  baseUrl: '/dev.poi.io/' /* base url for your project */,
  projectName: 'poi',
  headerLinks: [
    {doc: 'plugin-introduction', label: 'Docs'},
    {doc: 'cli', label: 'CLI'},
    {page: 'help', label: 'Help'},
    {blog: true, label: 'Blog'},
  ],
  users,
  /* path to images for header/footer */
  headerIcon: 'img/poi.png',
  footerIcon: 'img/poi.png',
  favicon: 'img/poi.png',
  /* colors for website */
  colors: {
    primaryColor: '#3a8fb7',
    secondaryColor: '#52869e',
  },
  /* custom fonts for website */
  /*fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },*/
  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright:
    'Copyright © ' +
    new Date().getFullYear() +
    ' Poi contributors',
  organizationName: 'poi', // or set an env variable ORGANIZATION_NAME
  projectName: 'dev.poi.io', // or set an env variable PROJECT_NAME
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: 'tomorrow',
  },
  scripts: ['https://buttons.github.io/buttons.js'],
  // You may provide arbitrary config keys to be used as needed by your template.
  repoUrl: 'https://github.com/kagamichan/dev.poi.io',
  /* On page navigation for the current documentation page */
  // onPageNav: 'separate',
};

module.exports = siteConfig;
