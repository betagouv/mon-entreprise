const TypeDoc = require('typedoc')
const app = new TypeDoc.Application()

app.options.addReader(new TypeDoc.TSConfigReader())
app.bootstrap({
	tsconfig: '../../tsconfig.json'
})
const project = app.convert(app.expandInputFiles(['source']))

if (project) {
	const outputDir = 'source/data/docs'

	app.generateDocs(project, outputDir)
	app.generateJson(project, outputDir + '/documentation.json')
}
