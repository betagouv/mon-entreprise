import { Options } from 'vite-plugin-pwa'

export const pwaOptions: Partial<Options> = {
	// selfDestroying: true, // Unregister PWA
	registerType: 'prompt',
	strategies: 'injectManifest',
	srcDir: 'source/entries',
	filename: 'entry-sw.ts',
	injectManifest: {
		maximumFileSizeToCacheInBytes: 3000000,
		manifestTransforms: [
			(entries) => {
				const manifest = entries.filter(
					(entry) =>
						!/assets\/.*(-legacy|lazy_)/.test(entry.url) &&
						(entry.url.endsWith('.html')
							? /(infrance|mon-entreprise)\.html/.test(entry.url)
							: true)
				)

				return { manifest }
			},
		],
	},
	includeAssets: ['logo-*.png'],
	manifest: {
		start_url: '/',
		name: 'Mon entreprise',
		short_name: 'Mon entreprise',
		description: "L'assistant officiel du créateur d'entreprise",
		lang: 'fr',
		orientation: 'portrait-primary',
		display: 'minimal-ui',
		theme_color: '#2975d1',
		background_color: '#ffffff',
		icons: [
			{
				src: '/favicon/android-chrome-192x192-shadow.png?v=2.0',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: '/favicon/android-chrome-512x512-shadow.png?v=2.0',
				sizes: '512x512',
				type: 'image/png',
			},
		],
	},
}
