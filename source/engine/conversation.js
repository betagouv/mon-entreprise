export let constructStepMeta = ({name, description}) => ({
	name: name,
	question: description || name,
	title: name,
	dependencyOfVariables: ['chai pas'],
	visible: true,
	helpText: 'Voila un peu d\'aide poto'
})
