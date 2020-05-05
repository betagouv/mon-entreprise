import React, { useContext } from 'react'
import { useParams, Redirect } from 'react-router'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { SimulatorSection, Field } from 'Components/SimulatorInput'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import emoji from 'react-easy-emoji'
import { Questions } from 'Components/Simulation'

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
		// 'profession libérale . revenus . BNC . recettes',
		// 'profession libérale . revenus . BNC . frais réels',
		// 'profession libérale . revenus . BNC',
		// 'dirigeant . indépendant . cotisations et contributions',
		// 'impôt'
	],
	situation: {
		dirigeant: `'indépendant'`
	},
	'unité par défaut': '€/an'
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
			{/* {profession ? (
				<Link
					to={sitePaths.simulateurs['profession-libérale']}
					className="ui__ simple small push-left button"
				>
					← <Trans>Voir les autres professions</Trans>
				</Link>
			) : (
				<Link
					to={sitePaths.simulateurs.index}
					className="ui__ simple small push-left button"
				>
					← <Trans>Voir les autres simulateurs</Trans>
				</Link>
			)} */}
			<h1>Simulateur de revenu pour {title}</h1>
			<h2>{emoji('🏢')} Mon activité</h2>
			<SimulatorSection config={config}>
				<Field dottedName="profession libérale . revenus . BNC . recettes" />
				<Field dottedName="profession libérale . revenus . BNC . micro-bnc" />
				<Field dottedName="profession libérale . revenus . BNC . frais réels" />
				<Field dottedName="profession libérale . revenus . BNC" />
			</SimulatorSection>
			<h2>{emoji('👩‍💼')} Mon revenu</h2>
			<SimulatorSection config={config}>
				<Field dottedName="dirigeant . indépendant . revenu net de cotisations" />
				<Field
					dottedName="dirigeant . indépendant . cotisations et contributions"
					editable={false}
				/>
				<Field dottedName="impôt" editable={false} />
				<Field dottedName="revenu net après impôt" />
			</SimulatorSection>
			<Questions />
		</>
	)
}
