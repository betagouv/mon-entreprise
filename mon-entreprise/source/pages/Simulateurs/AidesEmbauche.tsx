import Conversation from 'Components/conversation/Conversation'
import { HiddenOptionContext } from 'Components/conversation/Question'
import Animate from 'Components/ui/animate'
import { ThemeColorsContext } from 'Components/utils/colors'
import { useEngine } from 'Components/utils/EngineContext'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { useSimulationProgress } from 'Components/utils/useNextQuestion'
import { useParamsFromSituation } from 'Components/utils/useSearchParamsSimulationSharing'
import useSimulationConfig from 'Components/utils/useSimulationConfig'
import { DottedName } from 'modele-social'
import Engine, { formatValue } from 'publicodes'
import { partition } from 'ramda'
import { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { SimulationConfig, Situation } from 'Reducers/rootReducer'
import styled from 'styled-components'

type AideDescriptor = {
	title: string
	dottedName: DottedName
	situation: Situation
	description?: string
}

// This could be moved into publicodes
const aides = [
	{
		title: 'Apprenti ou contrat Pro jeune',
		dottedName:
			"contrat salarié . aides employeur . aide exceptionnelle à l'embauche d'apprentis",
		situation: {
			'contrat salarié . rémunération . brut de base': '1700 €/mois',
		},
		description:
			"Pour l'embauche d'un apprenti ou d'un jeune en contrat de professionnalisation",
	},
	{
		title: 'Jeune de -26 ans',
		dottedName:
			"contrat salarié . aides employeur . aide exceptionnelle à l'embauche des jeunes",
		situation: {
			'contrat salarié . rémunération . brut de base': '1700 €/mois',
			"contrat salarié . aides employeur . aide exceptionnelle à l'embauche des jeunes . jeune de moins de 26 ans":
				'oui',
		},
	},
	{
		title: 'Emploi franc',
		dottedName: 'contrat salarié . aides employeur . emploi franc',
		situation: {
			'contrat salarié . rémunération . brut de base': '1700 €/mois',
			'contrat salarié . aides employeur . emploi franc . éligible': 'oui',
		},
	},
	{
		title: "Demandeur d'emploi de 45 ans ou plus",
		dottedName:
			"contrat salarié . aides employeur . aide à l'embauche senior professionnalisation",
		situation: {
			// 'contrat salarié . rémunération . brut de base': '1700 €/mois',
			'contrat salarié . professionnalisation . jeune de moins de 30 ans':
				'non',
			'contrat salarié . professionnalisation . salarié de 45 ans et plus':
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
			"contrat salarié . ancienneté . date d'embauche",
			'contrat salarié . temps de travail . heures supplémentaires',
			'contrat salarié . temps de travail . heures complémentaires',
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
						<Conversation
							customEndMessages={
								<>
									Vous pouvez maintenant simuler le coût d'embauche précis en en
									sélectionnant une aide éligible.
								</>
							}
						/>
					</HiddenOptionContext.Provider>
				</div>
			</section>
			{progress > 0 && (
				<Animate.fromTop>
					<Results />
				</Animate.fromTop>
			)}
			<section>
				<h2>En savoir plus sur les aides</h2>
				<p>Bla bla 1jeune1solution</p>
			</section>
		</>
	)
}

function Results() {
	const baseEngine = useEngine()
	const aidesEngines = aides.map((aide) => {
		const engine = new Engine(baseEngine.parsedRules)
		const situation = { ...aide.situation, ...baseEngine.parsedSituation }
		engine.setSituation({ ...aide.situation, ...baseEngine.parsedSituation })
		return { ...aide, situation, engine }
	})
	const [aidesActives, aidesInactives] = partition(
		({ dottedName, engine }) =>
			typeof engine.evaluate(dottedName).nodeValue === 'number',
		aidesEngines
	)
	return (
		<>
			<h3>Aides disponibles</h3>
			<div className="ui__ box-container large">
				{aidesActives.map((aide, i) => (
					<ResultCard {...aide} key={i} />
				))}
			</div>
			<h3>Les autres aides</h3>
			<div className="ui__ box-container large">
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
	const valueNode = (rule.explanation.valeur as any)?.explanation.valeur
	const evaluation = engine.evaluate(valueNode)
	const search = useParamsFromSituation(situation).toString()
	const sitePaths = useContext(SitePathsContext)

	return (
		<AideCard className="ui__ card box">
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
		</AideCard>
	)
}

const AideCard = styled.div`
	max-width: none !important;
	align-items: flex-start;

	p {
		text-align: left;
	}
`
