import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Poi dev documents',
  description: 'Documents for poi development',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Plugin', link: '/docs/plugin/introduction' },
      { text: 'API', link: '/docs/api/introduction' },
      { text: 'Guides', link: '/docs/guides/coding-style' },
      { text: 'CLI', link: '/docs/cli' },
    ],

    sidebar: {
      '/docs/guides/': [
        {
          text: 'Poi development guides',
          items: [
            { text: 'Coding style guide', link: '/docs/guides/coding-style' },
            { text: 'Debugging a plugin', link: '/docs/guides/debugging' },
            { text: 'Publishing a plugin', link: '/docs/guides/publishing' },
            { text: 'Tips that might help', link: '/docs/guides/tips' },
          ],
        },
      ],
      '/docs/plugin/': [
        {
          text: 'Poi plugin development',
          items: [
            {
              text: 'Introduction to poi and plugins',
              link: '/docs/plugin/introduction',
            },
            { text: 'Plugin life cycle', link: '/docs/plugin/life-cycle' },
            {
              text: 'Meta fields in package.json',
              link: '/docs/plugin/meta-fields',
            },
            { text: 'Exported variables', link: '/docs/plugin/exports' },
          ],
        },
      ],
      '/docs/api/': [
        {
          text: 'API',
          items: [
            { text: 'API Introduction', link: '/docs/api/introduction' },
            { text: 'Events', link: '/docs/api/events' },
            { text: 'Utilities with redux', link: '/docs/api/redux' },
            { text: 'Utilities in poi', link: '/docs/api/poi-utils' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/poooi/poi' }],

    footer: {
      copyright: 'Copyright © 2015-present poi contributors',
    },

    search: {
      provider: 'local',
    },
  },

  sitemap: {
    hostname: 'https://dev.poi.moe',
  },

  lastUpdated: true,

  cleanUrls: true,
})
