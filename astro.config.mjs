import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { siteOrigin, siteBase, documentationRepository } from './site.config.mjs';

export default defineConfig({
  site: siteOrigin,
  base: siteBase,
  trailingSlash: 'always',
  integrations: [starlight({
    title: 'Martian Security',
    description: 'Customer guides for red teaming, Evals, the SDK and CI.',
    favicon: '/favicon.png',
    components: {
      SiteTitle: './src/components/SiteTitle.astro',
      PageTitle: './src/components/PageTitle.astro',
      ThemeProvider: './src/components/ThemeProvider.astro',
    },
    social: [{ icon: 'github', label: 'GitHub', href: documentationRepository }],
    editLink: { baseUrl: `${documentationRepository}/edit/main/` },
    customCss: ['./src/styles/custom.css'],
    expressiveCode: {
      themes: ['github-dark', 'github-light'],
      defaultProps: { wrap: true, frame: 'none' },
      styleOverrides: {
        borderRadius: '8px',
        borderColor: 'var(--sl-color-hairline)',
        codeFontFamily: 'Inter Variable, Inter, sans-serif',
        uiFontFamily: 'Inter Variable, Inter, sans-serif',
        codeFontSize: '0.8125rem',
        codeLineHeight: '1.65',
        codePaddingBlock: '0.875rem',
        codeBackground: '#0C0A09',
        codeForeground: '#F5F3F1',
        frames: {
          shadowColor: 'transparent',
          editorBackground: '#0C0A09',
          terminalBackground: '#0C0A09',
          terminalTitlebarDotsOpacity: '0',
          terminalTitlebarBackground: '#0C0A09',
          terminalTitlebarForeground: '#F5F3F1',
        },
      },
    },
    sidebar: [
  {
    "label": "Overview",
    "slug": ""
  },
  {
    "label": "Get started",
    "items": [
      {
        "autogenerate": {
          "directory": "get-started"
        }
      }
    ]
  },
  {
    "label": "Agents and environments",
    "collapsed": true,
    "items": [
      {
        "autogenerate": {
          "directory": "agents"
        }
      },
      {
        "autogenerate": {
          "directory": "environments"
        }
      }
    ]
  },
  {
    "label": "Red teaming",
    "collapsed": true,
    "items": [
      {
        "autogenerate": {
          "directory": "assessments"
        }
      }
    ]
  },
  {
    "label": "Evals",
    "collapsed": true,
    "items": [
      {
        "autogenerate": {
          "directory": "evals"
        }
      }
    ]
  },
  {
    "label": "SDK and CI",
    "collapsed": true,
    "items": [
      {
        "autogenerate": {
          "directory": "sdk"
        }
      }
    ]
  },
  {
    "label": "Discovery",
    "collapsed": true,
    "items": [
      {
        "autogenerate": {
          "directory": "discovery"
        }
      }
    ]
  },
  {
    "label": "Workspace and library",
    "collapsed": true,
    "items": [
      {
        "autogenerate": {
          "directory": "workspace"
        }
      },
      {
        "autogenerate": {
          "directory": "library"
        }
      }
    ]
  },
  {
    "label": "Reference",
    "collapsed": true,
    "items": [
      {
        "autogenerate": {
          "directory": "reference"
        }
      }
    ]
  },
  {
    "label": "Hermes documentation \u2197",
    "link": "https://morninghq.github.io/martian-hermes-docs/"
  }
],
  })],
});
