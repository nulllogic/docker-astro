import {defineConfig} from 'astro/config';

import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    site: 'https://example.com',
    integrations: [mdx(), sitemap(), preact()],
    output: 'server',
    markdown: {
        extendDefaultPlugins: true,
    }
});
