import React from 'react'
import Explicable from '../components/conversation/Explicable'

export let constructStepMeta = ({titre, question, subquestion, dottedName, name}) => ({
	// name: dottedName.split(' . ').join('.'),
	name: dottedName,
	// question: question || name,
	question: <Explicable
		label={question || name}
		name={name}
		lightBackground={true}
	/>,
	title: titre || name,
	dependencyOfVariables: ['chai pas'],
	subquestion,

// Legacy properties :

	visible: true,
	// helpText: 'Voila un peu d\'aide poto'
})
