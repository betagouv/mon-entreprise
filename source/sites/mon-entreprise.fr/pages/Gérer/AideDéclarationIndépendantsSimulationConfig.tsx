import { DottedName } from 'Types/rule'

export const simulationConfig = {
	objectifs: [
		'aide déclaration revenu indépendant 2019 . revenu net fiscal',
		'aide déclaration revenu indépendant 2019 . CSG déductible',
		'aide déclaration revenu indépendant 2019 . cotisations sociales déductible',
		'aide déclaration revenu indépendant 2019 . CFP',
		'aide déclaration revenu indépendant 2019 . total charges sociales déductible',
		'aide déclaration revenu indépendant 2019 . assiette sociale'
	] as Array<DottedName>,
	situation: {
		dirigeant: 'indépendant',
		'aide déclaration revenu indépendant 2019': true
	},
	'unités par défaut': ['€/an']
}
