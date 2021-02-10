import Conversation from 'Components/conversation/Conversation'
import { HiddenOptionContext } from 'Components/conversation/Question'
import Animate from 'Components/ui/animate'
import { ThemeColorsContext } from 'Components/utils/colors'
import Emoji from 'Components/utils/Emoji'
import { useEngine } from 'Components/utils/EngineContext'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { useSimulationProgress } from 'Components/utils/useNextQuestion'
import { useParamsFromSituation } from 'Components/utils/useSearchParamsSimulationSharing'
import useSimulationConfig from 'Components/utils/useSimulationConfig'
import { DottedName } from 'modele-social'
import Engine, { formatValue } from 'publicodes'
import { partition } from 'ramda'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { SimulationConfig, Situation } from 'Reducers/rootReducer'
import styled from 'styled-components'

type AideDescriptor = {
	title: string
	dottedName: DottedName
	situation: Situation
	dateFin?: Date
	description?: JSX.Element
}

// TODO : This could be moved into publicodes
const aides = [
	{
		title: 'Apprenti ou contrat Pro jeune',
		dottedName:
			"contrat salarié . aides employeur . aide exceptionnelle à l'embauche d'apprentis",
		situation: {
			'contrat salarié . professionnalisation . jeune de moins de 30 ans':
				'oui',
		},
		dateFin: new Date('2020/02/28'),
		description: (
			<>
				Pour l’embauche d’un apprenti ou d’un jeune en contrat de
				professionnalisation.
				<br />
				L’aide est versée <strong>mensuellement</strong> et automatiquement par
				l’Agence de services et de paiement (ASP).
			</>
		),
	},
	{
		title: 'Jeune de -26 ans',
		dottedName:
			"contrat salarié . aides employeur . aide exceptionnelle à l'embauche des jeunes",
		situation: {
			"contrat salarié . aides employeur . aide exceptionnelle à l'embauche des jeunes . jeune de moins de 26 ans":
				'oui',
		},
		dateFin: new Date('2020/03/31'),
		description: (
			<>
				Pour l’embauche d’un jeune de moins de 26 ans en CDI ou pour un CDD d’au
				moins 3 mois.
				<br />
				L’aide est versée <strong>trimestriellement</strong> par l’Agence de
				services et de paiement (ASP).
			</>
		),
	},
	{
		title: 'Emploi Franc+',
		dottedName: 'contrat salarié . aides employeur . emploi franc',
		situation: {
			'contrat salarié . aides employeur . emploi franc . éligible': 'oui',
		},
		dateFin: new Date('2020/03/31'),
		description: (
			<>
				Pour l’embauche d’un jeune issu d’un quartier prioritaire de la ville
				(QPV). L’aide peut aller jusqu’à 17 000 € sur trois ans.
				<br />
				L’aide est versée tous les <strong>6 mois</strong> par Pôle Emploi.
			</>
		),
	},
	{
		title: "Demandeur d'emploi de 45 ans ou plus",
		dottedName:
			"contrat salarié . aides employeur . aide à l'embauche senior professionnalisation",
		situation: {
			'contrat salarié . professionnalisation . jeune de moins de 30 ans':
				'non',
			'contrat salarié . professionnalisation . salarié de 45 ans et plus':
				'oui',
		},
		description: (
			<>
				Pour une embauche en contrat de professionnalisation d’un demandeur
				d’emploi de 45 ans ou plus.
				<br />
				L’aide est versée par Pôle Emploi sous la forme de deux versements de
				1000 € chacun.
			</>
		),
	},
] as Array<AideDescriptor>

const config = {
	'unité par défaut': '€/mois',
	situation: {
		'contrat salarié . rémunération . brut de base': '1700 €/mois',
		'contrat salarié . CDD . durée contrat': '12 mois',
		'contrat salarié . activité partielle': 'non',
		"contrat salarié . ancienneté . date d'embauche": '01/02/2021',
	},
	objectifs: ['contrat salarié . aides employeur'],
	questions: {
		liste: ['contrat salarié'],
		// TODO : It would be simplier to define a white-list of question instead of
		// this gigantic black-list that will need to maintained every time we add
		// new questions in the main simulator. But it's not that simple because we
		// want to include the main question "contrat salarié", and by doing so we
		// include all of its namespace. We propably need to move this question
		// elsewhere than in the top-level namespace.
		'liste noire': [
			'contrat salarié . prix du travail',
			'contrat salarié . temps de travail . heures supplémentaires',
			'contrat salarié . temps de travail . heures complémentaires',
			'contrat salarié . rémunération',
			'contrat salarié . aides employeur . emploi franc . éligible',
			'contrat salarié . professionnalisation . jeune de moins de 30 ans',
			'contrat salarié . professionnalisation . salarié de 45 ans et plus',
		],
	},
} as SimulationConfig

export default function AidesEmbauche() {
	const { color } = useContext(ThemeColorsContext)
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
									Vous pouvez maintenant simuler le coût d’embauche précis en en
									sélectionnant une aide éligible.
								</>
							}
						/>
					</HiddenOptionContext.Provider>
				</div>
			</section>
			<Results />
			<section>
				<h2>En savoir plus sur les aides</h2>
				<p>
					Dans le cadre du plan « Plan Relance » le gouvernement met en place
					une série de mesure pour encourager les nouvelles embauches.
				</p>
				<p>
					Rendez-vous sur le portail{' '}
					<a href="https://www.1jeune1solution.gouv.fr/je-recrute/articles">
						#1jeune1solution
					</a>{' '}
					pour en savoir plus
				</p>
			</section>
		</>
	)
}

function Results() {
	const progress = useSimulationProgress()
	const baseEngine = useEngine()
	const aidesEngines = aides.map((aide) => {
		const engine = new Engine(baseEngine.parsedRules)
		const situation = { ...baseEngine.parsedSituation, ...aide.situation }
		engine.setSituation(situation)
		return { ...aide, situation, engine }
	})
	const [aidesActives, aidesInactives] = partition(({ dottedName, engine }) => {
		return typeof engine.evaluate(dottedName).nodeValue === 'number'
	}, aidesEngines)

	return progress === 0 ? (
		<>
			<h3>Les aides</h3>
			<AidesGrid aides={aides} />
		</>
	) : (
		<Animate.fromTop>
			<h3>Aides disponibles</h3>
			<AidesGrid aides={aidesActives} />
			<h3>Les autres aides</h3>
			<AidesGrid aides={aidesInactives} />
		</Animate.fromTop>
	)
}

function AidesGrid({ aides }: { aides: Array<AideDescriptor> }) {
	return (
		<div className="ui__ box-container large">
			{aides.map((aide, i) => (
				<ResultCard {...aide} key={i} />
			))}
		</div>
	)
}

function ResultCard({
	situation,
	title,
	dottedName,
	dateFin,
	description,
}: AideDescriptor) {
	const engine = useEngine()
	const rule = engine.getParsedRules()[dottedName]
	const valueNode = (rule.explanation.valeur as any)?.explanation.valeur
	const evaluation = engine.evaluate(valueNode)
	const search = useParamsFromSituation(situation).toString()
	const sitePaths = useContext(SitePathsContext)
	const lang = useTranslation().i18n.language

	return (
		<AideCard className="ui__ card box">
			<h4>{title}</h4>
			<p className="ui__ notice">
				<Emoji emoji={'💶'} />
				&nbsp; Montant de l’aide :{' '}
				<strong>{formatValue(evaluation, { displayedUnit: '€' })}</strong> 
				{(dottedName.includes('aides employeur . emploi franc') ||
					dottedName.includes(
						"aide exceptionnelle à l'embauche d'apprentis"
					)) &&
					'la première année'}
				{dateFin && (
					<>
						<br />
						<Emoji emoji={'📆'} />
						&nbsp; Jusqu’au{' '}
						{new Intl.DateTimeFormat(lang, {
							month: 'long',
							day: 'numeric',
						}).format(dateFin)}
					</>
				)}
			</p>
			<hr />
			<p className="ui__ notice">{description}</p>
			<hr />
			<div className="ui__ small simple button">
				<Link
					to={{
						pathname: sitePaths.simulateurs.salarié,
						search,
					}}
				>
					Simuler une embauche
				</Link>
			</div>
		</AideCard>
	)
}

const AideCard = styled.div`
	max-width: none !important;

	p.ui__.notice {
		align-self: flex-start;
		text-align: left;
	}

	h4,
	.button {
		align-self: center;
	}
`
