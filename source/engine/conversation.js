export let constructStepMeta = ({dottedName, name, description}) => ({
	name: dottedName,
	question: description || name,
	title: name,
	dependencyOfVariables: ['chai pas'],
	visible: true,
	helpText: 'Voila un peu d\'aide poto'
})
