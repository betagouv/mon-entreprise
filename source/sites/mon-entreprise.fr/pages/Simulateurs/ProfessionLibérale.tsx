import React, { useContext } from 'react'
import { useParams, Redirect } from 'react-router'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import Simulation from 'Components/Simulation'

// TODO get variants from publicode rule
const professions = [
	'avocat',
	'médecin',
	'sage-femme',
	'infirmier',
	'kinésithérapeute',
	'pédicure',
	'podologue',
	'orthophoniste',
	'orthoptiste',
	'chirurgien-dentiste',

	// professions CIPAV
	'architecte', // et architecte d’intérieur, économiste de la construction, maître d’œuvre, géomètre expert
	'guide-montage', // et moniteur de ski, guide de haute  montagne, accompagnateur de moyenne montagne ;
	'ostéopathe',
	'psychologue',
	'psychothérapeute',
	'ergothérapeute',
	'diététicien',
	'chiropracteur',
	'ingénieur conseil',
	'guide-conférencier'
]

const config = {
	objectifs: [
		'profession libérale . revenus . BNC . recettes',
		'profession libérale . revenus . BNC . frais réels',
		'profession libérale . revenus . BNC',
		'dirigeant . indépendant . cotisations et contributions',
		'impôt'
	],
	situation: {
		dirigeant: `'indépendant'`
	}
} as const

export default function ProfessionLibéraleSimulator() {
	const { profession } = useParams()
	const sitePaths = useContext(SitePathsContext)

	if (profession) {
		if (!professions.includes(profession)) {
			return (
				<Redirect
					to={sitePaths.simulateurs['profession-libérale'].replace(
						'/:profession?',
						''
					)}
				/>
			)
		}
	}

	const title = profession ?? 'profession libérale'

	return (
		<>
			<h1>Simulateur de revenu pour {title}</h1>
			<Simulation config={config} />
		</>
	)
}
