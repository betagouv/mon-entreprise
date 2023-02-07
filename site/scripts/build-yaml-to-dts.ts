import { readFileSync } from 'fs'
import { join } from 'path'
import { Project } from 'ts-morph'
import yaml from 'yaml'

const buildYamlToDts = [
	'./source/pages/Simulateurs/économie-collaborative/activités.yaml',
	'./source/pages/Simulateurs/économie-collaborative/activités.en.yaml',
]

const transform = (data: Record<string, unknown>, filePath: string) => {
	const relativePath = filePath.replace(join(import.meta.url, '/'), '')
	console.log('Transform:', relativePath)
	const source = JSON.stringify(data)
	const defaultExportedJson = `const _default = ${source} as const\nexport default _default`
	const project = new Project({
		compilerOptions: {
			declaration: true,
			emitDeclarationOnly: true,
		},
	})
	project.createSourceFile(filePath + '.ts', defaultExportedJson, {
		overwrite: true,
	})
	project
		.emit()
		.then(() => console.log('  Done!  :', relativePath + '.d.ts'))
		.catch((err) => console.error(err))
}

buildYamlToDts.forEach((path) => {
	const file = readFileSync(path, { encoding: 'utf8' })
	const data = yaml.parse(file, { merge: true }) as Record<string, unknown>
	transform(data, path)
})
