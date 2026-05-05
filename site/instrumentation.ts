export async function register() {
	if (process.env.NEXT_RUNTIME !== 'nodejs') return

	const { convertAllYamlToJson, startYamlWatcher } = await import(
		'./scripts/i18n/yaml-to-json'
	)

	await convertAllYamlToJson()

	if (process.env.NODE_ENV === 'development') {
		startYamlWatcher()
	}
}
