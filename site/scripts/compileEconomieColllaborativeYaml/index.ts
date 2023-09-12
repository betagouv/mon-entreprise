import { execOnFileChange } from './execOnFileChange.js'

export const compileEconomieCollaborativeYaml = async () => {
	console.log('Search for changed file...')

	const results = await execOnFileChange({
		basePath: './',
		depsPath: '.deps.json',
		options: [
			{
				paths: [
					'./source/pages/assistants/économie-collaborative/activités.yaml',
					'./source/pages/assistants/économie-collaborative/activités.en.yaml',
				],
				run: 'yarn build:yaml-to-dts',
			},
		],
	})

	results
		.filter(<T>(x: null | T): x is T => !!x)
		.forEach(({ fileChanged, run, result }) => {
			console.log('Changed file detected:', fileChanged)
			console.log('Execute:', run, '\n')

			if (result.stdout) {
				console.log(result.stdout)
			}
			if (result.stderr) {
				console.error(result.stderr)
			}
		})
}
