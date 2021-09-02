import Conversation from 'Components/conversation/Conversation'
import { HiddenOptionContext } from 'Components/conversation/Question'
import { FromTop } from 'Components/ui/animate'
import Warning from 'Components/ui/WarningBlock'
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
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { SimulationConfig, Situation } from 'Reducers/rootReducer'
import styled from 'styled-components'
import { TrackPage } from '../../ATInternetTracking'

type AideDescriptor = {
	title: string
	dottedName: DottedName
	situation: Situation
	dateFin?: Date
	versement: JSX.Element
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
		dateFin: new Date('2021/12/31'),
		description: (
			<Trans i18nKey="pages.simulateurs.aides-embauche.aides.apprenti">
				Pour l’embauche d’un apprenti ou d’un jeune en contrat de
				professionnalisation.
				<br />
				L’aide est versée <strong>mensuellement</strong> et automatiquement par
				l’Agence de services et de paiement (ASP).
			</Trans>
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
		dateFin: new Date('2021/05/31'),
		versement: <Trans>trimestriel</Trans>,
		description: (
			<Trans i18nKey="pages.simulateurs.aides-embauche.aides.jeune">
				Pour l’embauche d’un jeune de moins de 26 ans en CDI ou pour un CDD d’au
				moins 3 mois.
				<br />
				L’aide est versée <strong>trimestriellement</strong> par l’Agence de
				services et de paiement (ASP).
			</Trans>
		),
	},
	{
		title: 'Emploi Franc',
		dottedName: 'contrat salarié . aides employeur . emploi franc',
		situation: {
			'contrat salarié . aides employeur . emploi franc . éligible': 'oui',
		},
		dateFin: new Date('2021/05/31'),
		versement: <Trans>tous les 6 mois</Trans>,
		description: (
			<Trans i18nKey="pages.simulateurs.aides-embauche.aides.emploi franc"></Trans>
		),
	},
	{
		title: 'Travailleur handicapé',
		dottedName:
			"contrat salarié . aides employeur . aide à l'embauche des travailleurs handicapés",
		situation: {
			"contrat salarié . aides employeur . aide à l'embauche des travailleurs handicapés . situation de handicap":
				'oui',
		},
		dateFin: new Date('2021/06/30'),
		versement: <Trans>trimestriel</Trans>,
		description: (
			<Trans i18nKey="pages.simulateurs.aides-embauche.aides.handicapé">
				Pour l’embauche d’un travailleur en situation de handicap.
				<br />
				L’aide est versée <strong>trimestriellement</strong> par l’Agence de
				services et de paiement (ASP).
			</Trans>
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
		versement: <Trans>en deux fois</Trans>,
		description: (
			<Trans i18nKey="pages.simulateurs.aides-embauche.aides.senior">
				Pour une embauche en contrat de professionnalisation d’un demandeur
				d’emploi de 45 ans ou plus.
				<br />
				L’aide est versée par Pôle emploi sous la forme de deux versements de
				1000 € chacun.
			</Trans>
		),
	},
] as Array<AideDescriptor>

const config = {
	'unité par défaut': '€/mois',
	situation: {
		'contrat salarié . rémunération . brut de base': '1700 €/mois',
		'contrat salarié . durée': '12 mois',
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
			"contrat salarié . aides employeur . aide à l'embauche des travailleurs handicapés . situation de handicap",
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
			<div style={{ '--lighterColor': '#e9fff6' } as React.CSSProperties}>
				<Warning
					localStorageKey={'app::simulateurs:warning-folded:v1:aides-embauche'}
				>
					<Trans i18nKey="pages.simulateurs.aides-embauche.warning">
						Ce simulateur présente une liste réduite des aides à l'embauche et
						n'intègre pas l'ensemble des conditions d'éligibilité.
						<br />
						Une simulation plus complète peut être réalisée en cliquant sur «
						Simuler une Embauche ».
					</Trans>
				</Warning>
			</div>
			<section className="ui__ full-width lighter-bg">
				<div className="ui__ container">
					<HiddenOptionContext.Provider value={['contrat salarié . stage']}>
						<Conversation
							customEndMessages={
								<Trans i18nKey="pages.simulateurs.aides-embauche.message fin">
									Vous pouvez maintenant simuler le coût d’embauche précis en
									sélectionnant une aide éligible.
								</Trans>
							}
						/>
					</HiddenOptionContext.Provider>
				</div>
			</section>
			<Results />
			<section>
				<Trans i18nKey="pages.simulateurs.aides-embauche.outro">
					<h2>En savoir plus sur les aides</h2>
					<p>
						Vous pouvez retrouver une liste plus complète des aides à l'embauche
						existantes sur le portail{' '}
						<a href="https://les-aides.fr" target="_blank">
							les-aides.fr
						</a>{' '}
						édité par les chambres de commerce et d'industrie.
					</p>
					<p>
						Dans le cadre du plan « France Relance » le gouvernement met en
						place une série de mesures pour encourager les nouvelles embauches.
					</p>
					<p>
						Rendez-vous sur le portail{' '}
						<a
							href="https://www.1jeune1solution.gouv.fr/je-recrute/articles"
							target="_blank"
						>
							#1jeune1solution
						</a>{' '}
						pour en savoir plus
					</p>
				</Trans>
			</section>
		</>
	)
}

function Results() {
	const progress = useSimulationProgress()
	const baseEngine = useEngine()
	const aidesEngines = aides.map((aide) => {
		const engine = baseEngine.shallowCopy()
		engine.setSituation({ ...aide.situation, ...baseEngine.parsedSituation })
		const isActive =
			typeof engine.evaluate(aide.dottedName).nodeValue === 'number'
		const situation = { ...baseEngine.parsedSituation, ...aide.situation }
		return { ...aide, situation, engine, isActive }
	})
	const [aidesActives, aidesInactives] = partition(
		({ isActive }) => isActive,
		aidesEngines
	)

	return progress === 0 ? (
		<>
			<TrackPage name="accueil" />
			<h3>
				<Trans i18nKey="pages.simulateurs.aides-embauche.titres.aides">
					Les aides
				</Trans>
			</h3>
			<AidesGrid
				aides={aides.map((aide) => ({ ...aide, engine: baseEngine }))}
			/>
		</>
	) : (
		<FromTop>
			<h3>
				<Trans i18nKey="pages.simulateurs.aides-embauche.titres.aidesDisponibles">
					Aides disponibles
				</Trans>
			</h3>
			<AidesGrid aides={aidesActives} />
			<h3>
				<Trans i18nKey="pages.simulateurs.aides-embauche.titres.autresAides">
					Les autres aides
				</Trans>
			</h3>
			<AidesGrid aides={aidesInactives} />
		</FromTop>
	)
}

function AidesGrid({
	aides,
}: {
	aides: Array<AideDescriptor & { engine: Engine }>
}) {
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
	engine,
	dateFin,
	versement,
	description,
}: AideDescriptor & { engine: Engine }) {
	const rule = engine.getParsedRules()[dottedName]
	const valueNode = (rule.explanation.valeur as any)?.explanation.valeur
	const evaluation = engine.evaluate(valueNode)
	const search =
		useParamsFromSituation(situation).toString() + '&view=employeur'
	const sitePaths = useContext(SitePathsContext)
	const lang = useTranslation().i18n.language

	return (
		<AideCard className="ui__ card box">
			<h4>{title}</h4>
			<p className="ui__ notice">
				<Emoji emoji={'💶'} />
				&nbsp;{' '}
				<Trans i18nKey="pages.simulateurs.aides-embauche.card.montant">
					Montant de l’aide
				</Trans>{' '}
				: <strong>{formatValue(evaluation, { displayedUnit: '€' })}</strong>
				{(dottedName.includes('aides employeur . emploi franc') ||
					dottedName.includes(
						"aide exceptionnelle à l'embauche d'apprentis"
					)) && (
					<Trans i18nKey="pages.simulateurs.aides-embauche.card.première année">
						{' '}
						la première année
					</Trans>
				)}
				<br />
				<Emoji emoji={'🕑'} />
				&nbsp; <Trans>Versement : </Trans> <strong>{versement}</strong>
				{dateFin && (
					<>
						<br />
						<Emoji emoji={'📆'} />
						&nbsp; <Trans>Jusqu’au</Trans>{' '}
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
					<Trans i18nKey="pages.simulateurs.aides-embauche.card.action">
						Simuler une embauche
					</Trans>
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
