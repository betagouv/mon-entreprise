import { Grid } from '@mui/material'
import { HiddenOptionContext } from '@/components/conversation/ChoicesInput'
import Conversation from '@/components/conversation/Conversation'
import { FromTop } from '@/components/ui/animate'
import Warning from '@/components/ui/WarningBlock'
import Emoji from '@/components/utils/Emoji'
import { useEngine } from '@/components/utils/EngineContext'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { useSimulationProgress } from '@/components/utils/useNextQuestion'
import { useParamsFromSituation } from '@/components/utils/useSearchParamsSimulationSharing'
import useSimulationConfig from '@/components/utils/useSimulationConfig'
import { Card } from '@/design-system/card'
import { H2, H3 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'
import { DottedName } from 'modele-social'
import Engine, { formatValue } from 'publicodes'
import { partition } from 'ramda'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { SimulationConfig, Situation } from '@/reducers/rootReducer'
import { TrackPage } from '../../../ATInternetTracking'

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
		versement: <Trans>mensuel</Trans>,
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
			<Trans i18nKey="pages.simulateurs.aides-embauche.aides.emploi franc">
				Pour l’embauche d’un jeune issu d’un quartier prioritaire de la ville
				(QPV). L’aide peut aller jusqu’à 17 000 € sur trois ans.
				<br />
				L’aide est versée tous les <strong>6 mois</strong> par Pôle emploi.
			</Trans>
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
			"contrat salarié . aides employeur . aide à l'embauche des travailleurs handicapés . situation de handicap",
			'contrat salarié . professionnalisation . jeune de moins de 30 ans',
			'contrat salarié . professionnalisation . salarié de 45 ans et plus',
		],
	},
} as SimulationConfig

export default function AidesEmbauche() {
	useSimulationConfig(config)

	return (
		<>
			<Warning
				localStorageKey={'app::simulateurs:warning-folded:v1:aides-embauche'}
			>
				<Body>
					<Trans i18nKey="pages.simulateurs.aides-embauche.warning">
						Ce simulateur présente une liste réduite des aides à l'embauche et
						n'intègre pas l'ensemble des conditions d'éligibilité.
						<br />
						Une simulation plus complète peut être réalisée en cliquant sur «
						Simuler une Embauche ».
					</Trans>
				</Body>
			</Warning>
			<section>
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
			</section>
			<Results />
			<section>
				<Trans i18nKey="pages.simulateurs.aides-embauche.outro">
					<H2>En savoir plus sur les aides</H2>
					<Body>
						Vous pouvez retrouver une liste plus complète des aides à l'embauche
						existantes sur le portail{' '}
						<Link href="https://les-aides.fr">les-aides.fr</Link> édité par les
						chambres de commerce et d'industrie.
					</Body>
					<Body>
						Dans le cadre du plan « France Relance » le gouvernement met en
						place une série de mesures pour encourager les nouvelles embauches.
					</Body>
					<Body>
						Rendez-vous sur le portail{' '}
						<Link href="https://www.1jeune1solution.gouv.fr/je-recrute/articles">
							#1jeune1solution
						</Link>{' '}
						pour en savoir plus
					</Body>
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
			<H3>
				<Trans i18nKey="pages.simulateurs.aides-embauche.titres.aides">
					Les aides
				</Trans>
			</H3>
			<AidesGrid
				aides={aides.map((aide) => ({ ...aide, engine: baseEngine }))}
			/>
		</>
	) : (
		<FromTop>
			<H3>
				<Trans i18nKey="pages.simulateurs.aides-embauche.titres.aidesDisponibles">
					Aides disponibles
				</Trans>
			</H3>
			<AidesGrid aides={aidesActives} />
			<H3>
				<Trans i18nKey="pages.simulateurs.aides-embauche.titres.autresAides">
					Les autres aides
				</Trans>
			</H3>
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
		<Grid container spacing={2}>
			{aides.map((aide, i) => (
				<Grid item xs={12} md={6} lg={4} key={i}>
					<ResultCard {...aide} />
				</Grid>
			))}
		</Grid>
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
	const {
		t,
		i18n: { language },
	} = useTranslation()
	const rule = engine.getParsedRules()[dottedName]
	const valueNode = (rule.explanation.valeur as any)?.explanation.valeur
	const evaluation = engine.evaluate(valueNode)
	const search =
		useParamsFromSituation(situation).toString() + '&view=employeur'
	const sitePaths = useContext(SitePathsContext)

	return (
		<Card
			title={title}
			to={{
				pathname: sitePaths.simulateurs.salarié,
				search,
			}}
			ctaLabel={t(
				'pages.simulateurs.aides-embauche.card.action',
				'Simuler une embauche'
			)}
		>
			<Body>
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
						{new Intl.DateTimeFormat(language, {
							month: 'long',
							day: 'numeric',
						}).format(dateFin)}
					</>
				)}
			</Body>
			<Body className="ui__ notice">{description}</Body>
		</Card>
	)
}
