import { formatValue } from 'publicodes'
import useSimulationConfig from 'Components/utils/useSimulationConfig'
import Animate from 'Components/ui/animate'
import Conversation from 'Components/conversation/Conversation'
import { Questions } from 'Components/Simulation'
import { useEngine } from 'Components/utils/EngineContext'
import RuleLink from 'Components/RuleLink'
import { DottedName } from 'modele-social'
import { ThemeColorsContext } from 'Components/utils/colors'
import { useContext, useMemo } from 'react'
import { SimulationConfig, Situation } from 'Reducers/rootReducer'
import { situationSelector } from 'Selectors/simulationSelectors'
import { partition } from 'ramda'
import { useSimulationProgress } from 'Components/utils/useNextQuestion'
import { HiddenOptionContext } from 'Components/conversation/Question'
import useSearchParamsSimulationSharing, {
	getRulesParamNames,
	getSearchParamsFromSituation,
} from 'Components/utils/useSearchParamsSimulationSharing'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Link } from 'react-router-dom'

type AideDescriptor = {
	title: string
	dottedName: DottedName
	situation: Situation
	description?: string
}

// This could be moved into publicodes
const aides = [
	{
		title: 'Apprenti',
		dottedName:
			"contrat salarié . aides employeur . aide exceptionnelle à l'embauche d'apprentis",
		situation: {
			'contrat salarié . rémunération . brut de base': '1700 €/mois',
			// 'contrat salarié': "'apprentissage'",
		},
		description:
			"Pour l'embauche d'un apprenti ou d'un jeune en contrat de professionnalisation",
	},
	{
		title: 'Jeune en CDI',
		dottedName:
			"contrat salarié . aides employeur . aide exceptionnelle à l'embauche des jeunes",
		situation: {
			'contrat salarié . rémunération . brut de base': '2300 €/mois',
			// 'contrat salarié': "'CDI'",
			"contrat salarié . aides employeur . aide exceptionnelle à l'embauche des jeunes . jeune de moins de 26 ans":
				'oui',
		},
	},
	{
		title: 'Jeune en CDD',
		dottedName:
			"contrat salarié . aides employeur . aide exceptionnelle à l'embauche des jeunes",
		situation: {
			'contrat salarié . rémunération . brut de base': '2300 €/mois',
			// 'contrat salarié': "'CDD'",
			'contrat salarié . CDD . durée contrat': '12 mois',
			"contrat salarié . aides employeur . aide exceptionnelle à l'embauche des jeunes . jeune de moins de 26 ans":
				'oui',
		},
	},
] as Array<AideDescriptor>

const config = {
	'unité par défaut': '€/mois',
	situation: {
		"contrat salarié . aides employeur . aide exceptionnelle à l'embauche des jeunes . jeune de moins de 26 ans":
			'oui',
		'contrat salarié . rémunération . brut de base': '1700 €/mois',
		'contrat salarié . CDD . durée contrat': '12 mois',
	},
	objectifs: ['contrat salarié . aides employeur'],
	questions: {
		liste: ['contrat salarié'],
		'liste noire': [
			'contrat salarié . activité partielle',
			'contrat salarié . prix du travail',
			'contrat salarié . temps de travail . heures supplémentaires',
			'contrat salarié . rémunération',
			'contrat salarié . aides employeur . emploi franc . éligible',
		],
	},
} as SimulationConfig

export default function AidesEmbauche() {
	const { color } = useContext(ThemeColorsContext)
	const progress = useSimulationProgress()
	config.color = color
	useSimulationConfig(config)

	return (
		<>
			<section className="ui__ full-width lighter-bg">
				<div className="ui__ container">
					<HiddenOptionContext.Provider value={['contrat salarié . stage']}>
						<Conversation />
					</HiddenOptionContext.Provider>
				</div>
			</section>
			{progress > 0 && (
				<Animate.fromTop>
					<Results />
				</Animate.fromTop>
			)}
		</>
	)
}

function Results() {
	const engine = useEngine()
	const [aidesActives, aidesInactives] = partition(
		(aide) => typeof engine.evaluate(aide.dottedName).nodeValue === 'number',
		aides
	)
	return (
		<>
			<h3>Aides disponibles</h3>
			<div className="ui__ box-container">
				{aidesActives.map((aide, i) => (
					<ResultCard {...aide} key={i} />
				))}
			</div>
			<h3>Les autres aides</h3>
			<div className="ui__ box-container">
				{aidesInactives.map((aide, i) => (
					<ResultCard {...aide} key={i} />
				))}
			</div>
		</>
	)
}

function ResultCard({
	situation,
	title,
	dottedName,
	description,
}: AideDescriptor) {
	const engine = useEngine()
	const rule = engine.getParsedRules()[dottedName]
	const valueNode = rule.explanation.valeur.explanation.valeur
	const evaluation = engine.evaluate(valueNode)
	const dottedNameParamName = useMemo(
		() => getRulesParamNames(engine.getParsedRules()),
		[engine]
	)
	const search = getSearchParamsFromSituation(
		engine,
		situation,
		dottedNameParamName
	).toString()
	const sitePaths = useContext(SitePathsContext)
	// TODO

	return (
		<div className="ui__ card box">
			<h4>{title}</h4>
			<p className="ui__ notice">{description}</p>
			<p className="ui__ lead">
				<Link
					to={{
						pathname: sitePaths.simulateurs.salarié,
						search,
					}}
				>
					{formatValue(evaluation, { displayedUnit: '€' })}
				</Link>
			</p>
		</div>
	)
}
