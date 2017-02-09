export let constructStepMeta = ({question, dottedName, name}) => ({
	// name: dottedName.split(' . ').join('.'),
	name: dottedName,
	question: question || name,
	title: name,
	dependencyOfVariables: ['chai pas'],
	visible: true,
	helpText: 'Voila un peu d\'aide poto'
})
