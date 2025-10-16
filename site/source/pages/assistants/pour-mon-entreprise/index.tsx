import { useOverlayTriggerState } from '@react-stately/overlays'
import { Evaluation } from 'publicodes'
import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
	generatePath,
	Navigate,
	Route,
	Routes,
	useParams,
} from 'react-router-dom'
import { styled } from 'styled-components'

import { ACCUEIL, TrackPage } from '@/components/ATInternetTracking'
import { ConseillersEntreprisesButton } from '@/components/ConseillersEntreprisesButton'
import RuleInput from '@/components/conversation/RuleInput'
import { CurrentSimulatorCard } from '@/components/CurrentSimulatorCard'
import { Condition } from '@/components/EngineValue/Condition'
import { EntrepriseDetails } from '@/components/entreprise/EntrepriseDetails'
import PageHeader from '@/components/PageHeader'
import { SimulateurCard } from '@/components/SimulateurCard'
import { FromTop } from '@/components/ui/animate'
import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import { useEngine } from '@/components/utils/EngineContext'
import {
	Body,
	Button,
	Container,
	Grid,
	H2,
	H3,
	Intro,
	Markdown,
	Message,
	Popover,
	Spacing,
	Strong,
} from '@/design-system'
import { Entreprise } from '@/domaine/Entreprise'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useQuestionList } from '@/hooks/useQuestionList'
import { useEntreprisesRepository } from '@/hooks/useRepositories'
import { useSetEntreprise } from '@/hooks/useSetEntreprise'
import useSimulationConfig from '@/hooks/useSimulationConfig'
import useSimulatorsData from '@/hooks/useSimulatorsData'
import { useSitePaths } from '@/sitePaths'
import { resetCompany } from '@/store/actions/companyActions'
import { SimulationConfig } from '@/store/reducers/rootReducer'
import { companySituationSelector } from '@/store/selectors/simulationSelectors'
import { evaluateQuestion } from '@/utils/publicodes'

import forms from './forms.svg'
import growth from './growth.svg'

export default function PourMonEntrepriseHome() {
	const { relativeSitePaths } = useSitePaths()

	return (
		<Routes>
			<Route
				path={relativeSitePaths.assistants['pour-mon-entreprise'].entreprise}
				element={<PourMonEntreprise />}
			/>
			<Route path="*" element={<PourMonEntreprise />} />
		</Routes>
	)
}

function PourMonEntreprise() {
	const simulateurs = useSimulatorsData()
	const engine = useEngine()
	const dispatch = useDispatch()
	const engineSiren = engine.evaluate('entreprise . SIREN').nodeValue
	const prevSiren = useRef(engineSiren)
	const [overwrite, setOverwrite] = useState(engineSiren === undefined)
	const { param, entreprise, entrepriseNotFound, entreprisePending } =
		useSirenFromParams(overwrite)
	const gérerPath = usePourMonEntreprisePath()

	const setEntreprise = useSetEntreprise()

	const updateEntreprise =
		overwrite &&
		!entreprisePending &&
		!entrepriseNotFound &&
		entreprise &&
		entreprise.siren !== engineSiren

	useEffect(() => {
		if (updateEntreprise) {
			setEntreprise(entreprise)
			setOverwrite(false)
		}
	}, [entreprise, setEntreprise, updateEntreprise])

	if (
		gérerPath &&
		(param == null || (entreprise?.siren && entreprise.siren !== param))
	) {
		return <Navigate to={gérerPath} replace />
	}

	if (
		(!param && !engineSiren) ||
		(!engineSiren && !overwrite && prevSiren.current) ||
		(param && entrepriseNotFound) ||
		(entreprise && !overwrite && !engineSiren)
	) {
		return <Navigate to="/404" replace />
	}

	const isAutoEntrepreneur =
		engine.evaluate('dirigeant . auto-entrepreneur').nodeValue === true

	return (
		<>
			<Helmet>
				<meta name="robots" content="noindex" />
			</Helmet>

			{param && engineSiren && param !== engineSiren && !overwrite && (
				<PopoverOverwriteSituation
					onOverwrite={() => {
						dispatch(resetCompany())
						setOverwrite(true)
					}}
				/>
			)}

			<TrackPage name={ACCUEIL} />
			<PageHeader picture={growth}>
				<Intro>
					<Trans i18nKey="pages.assistants.pour-mon-entreprise.description">
						Vous souhaitez vous verser un revenu ou embaucher ? Vous aurez à
						payer des cotisations et des impôts. Anticipez leurs montants grâce
						aux simulateurs adaptés à votre situation.
					</Trans>
				</Intro>
				{entreprisePending ? (
					<Message type="info" border={false}>
						<Intro>
							<Trans i18nKey="loading">Chargement en cours...</Trans>
						</Intro>
					</Message>
				) : (
					<AskCompanyMissingDetails />
				)}
				<Spacing xl />
			</PageHeader>

			<Container backgroundColor={(theme) => theme.colors.bases.primary[600]}>
				<FromTop>
					<FormsImage src={forms} alt="" />
					<Spacing xs />
					<ForceThemeProvider forceTheme="dark">
						<H2>Simulateurs pour votre entreprise</H2>
					</ForceThemeProvider>
					<Grid
						container
						spacing={3}
						style={{
							position: 'relative',
						}}
					>
						<CurrentSimulatorCard fromGérer />

						<Condition expression="dirigeant . indépendant">
							<SimulateurCard
								fromGérer
								{...simulateurs['déclaration-charges-sociales-indépendant']}
							/>
						</Condition>
						<Condition expression="entreprise . imposition . IS">
							<Grid
								item
								xs={12}
								md={6}
								lg={4}
								style={{
									alignSelf: 'flex-end',
								}}
							>
								<Grid container spacing={3} columns={2}>
									<SimulateurCard fromGérer {...simulateurs.is} small />
									<SimulateurCard fromGérer {...simulateurs.dividendes} small />
								</Grid>
							</Grid>
						</Condition>
					</Grid>
				</FromTop>
				<Spacing xl />
			</Container>
			{!isAutoEntrepreneur && (
				<FromTop>
					<H2>
						<Trans>Salariés et embauche</Trans>
					</H2>
					<Grid container spacing={3}>
						<SimulateurCard fromGérer {...simulateurs['salarié']} />
						<SimulateurCard fromGérer {...simulateurs['activité-partielle']} />
					</Grid>
				</FromTop>
			)}

			<Trans i18nKey="pages.assistants.pour-mon-entreprise.info.PdE">
				<H2>
					Échanger avec le conseiller qui peut vous aider selon votre
					problématique
				</H2>
				<Body as="div">
					<span>Vous souhaitez :</span>
					<UlInColumns>
						<li>recruter, former vos salariés</li>
						<li>financer vos projets d'investissement</li>
						<li>résoudre un problème de trésorerie</li>
						<li>être conseillé(e) en droit du travail</li>
						<li>développer votre activité commerciale</li>
						<li>vendre sur internet</li>
						<li>vendre ou reprendre une entreprise</li>
						<li>améliorer la santé et sécurité au travail</li>
						<li>entrer dans une démarche de transition écologique & RSE</li>
					</UlInColumns>
				</Body>
				<Body>
					<Strong>
						Service public simple et rapide : vous êtes rappelé(e) par LE
						conseiller qui peut vous aider.
					</Strong>
				</Body>
				<Body>
					Plus de 40 partenaires publics sont mobilisés pour vous accompagner en
					fonction de votre problématique.
					<br />
					Le conseiller compétent proche de chez vous vous rappelle sous 5
					jours.
				</Body>
			</Trans>

			<ConseillersEntreprisesButton
				siret={
					engine.evaluate('établissement . SIRET')
						.nodeValue as Evaluation<string>
				}
			/>
			<Spacing lg />
		</>
	)
}

const configEntrepriseDetails: SimulationConfig = {
	questions: {
		'liste noire': ['entreprise . imposition . régime'] as DottedName[],
	},
	objectifs: [
		'dirigeant . régime social',
		'entreprise . imposition',
	] as DottedName[],
	situation: {
		'entreprise . catégorie juridique . EI . auto-entrepreneur . par défaut':
			'oui',
	},
}

const UlInColumns = styled.ul`
	@media (min-width: ${({ theme }) => theme.breakpointsWidth.md}) {
		columns: 2;
	}
	@media (min-width: ${({ theme }) => theme.breakpointsWidth.lg}) {
		columns: 3;
	}
`

const AskCompanyMissingDetails = () => {
	const { absoluteSitePaths } = useSitePaths()
	useSimulationConfig({
		key: absoluteSitePaths.assistants.index,
		config: configEntrepriseDetails,
	})

	const [questions, onQuestionAnswered] = useQuestionList()
	const engine = useEngine()

	return (
		<>
			<EntrepriseDetails showSituation headingTag="h2" />
			{!!questions.length && (
				<>
					<Body
						style={{
							marginBottom: '-0.5rem',
						}}
					>
						Répondez aux questions suivantes pour découvrir les simulateurs et
						assistants adaptés à votre situation :
					</Body>

					{questions.map((question) => (
						<FromTop key={question.dottedName}>
							<H3>
								<Markdown options={{ forceInline: true }}>
									{evaluateQuestion(engine, question) ?? ''}
								</Markdown>
							</H3>
							<RuleInput
								hideDefaultValue
								dottedName={question.dottedName}
								onChange={onQuestionAnswered(question.dottedName)}
							/>
						</FromTop>
					))}
				</>
			)}
		</>
	)
}

const PopoverOverwriteSituation = ({
	onOverwrite,
	onCancel,
}: {
	onOverwrite?: () => void
	onCancel?: () => void
}) => {
	const { t } = useTranslation()
	const state = useOverlayTriggerState({ defaultOpen: true })

	if (!state.isOpen) {
		return null
	}

	return (
		<Popover
			title={t(
				'warning.overwrite.situation',
				'Voulez-vous écraser votre situation ?'
			)}
			onClose={() => {
				state.close()
				onCancel?.()
			}}
			isDismissable
			small
		>
			<Trans>
				<Message type="info">
					<Body>
						Nous avons détecté une ancienne situation, êtes-vous sûr de vouloir
						l'écraser ?
					</Body>
				</Message>
				<Grid
					container
					style={{
						justifyContent: 'end',
					}}
					spacing={2}
				>
					<Grid item>
						<Button
							size="XS"
							onPress={() => {
								onOverwrite?.()
							}}
						>
							Ecraser
						</Button>
					</Grid>
					<Grid item>
						<Button
							size="XS"
							light
							onPress={() => {
								state.close()
								onCancel?.()
							}}
						>
							Annuler
						</Button>
					</Grid>
				</Grid>
			</Trans>
		</Popover>
	)
}

const usePourMonEntreprisePath = () => {
	const { absoluteSitePaths } = useSitePaths()
	const company = useSelector(companySituationSelector)

	if (company['entreprise . SIREN']) {
		const siren = (company['entreprise . SIREN'] as string).replace(/'/g, '')

		return generatePath(
			absoluteSitePaths.assistants['pour-mon-entreprise'].entreprise,
			{ entreprise: siren }
		)
	}

	return null
}

const useSirenFromParams = (overwrite: boolean) => {
	const { entreprise: param } = useParams<{ entreprise?: string }>()
	const [entreprise, setEntreprise] = useState<Entreprise | null>(null)

	const [entreprisePending, setEntreprisePending] = useState(false)
	const [entrepriseNotFound, setEntrepriseNotFound] = useState(false)
	const entreprisesRepository = useEntreprisesRepository()

	useEffect(() => {
		if (!param || !overwrite) {
			return
		}
		setEntreprisePending(true)
		entreprisesRepository
			.rechercheTexteLibre(param)
			.then((entreprises) => {
				setEntreprisePending(false)
				if (!entreprises || !entreprises.length) {
					return setEntrepriseNotFound(true)
				}
				setEntreprise(entreprises[0])
			})
			.catch((error) => {
				setEntrepriseNotFound(true)
				setEntreprisePending(false)
				// eslint-disable-next-line no-console
				console.error(error)
			})
	}, [param, overwrite])

	return {
		param,
		entreprise,
		entreprisePending,
		entrepriseNotFound,
	}
}

const FormsImage = styled.img`
	position: absolute;
	height: 25rem;
	transform: rotate(180deg);
	top: -1px;
	z-index: 0;

	@media (max-width: ${({ theme }) => theme.breakpointsWidth.md}) {
		display: none;
	}

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.md}) {
		right: 5rem;
		height: 12rem;
	}

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.lg}) {
		right: 8.5rem;
		height: 20rem;
	}

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.xl}) {
		right: 10rem;
		height: 23rem;
	}
`
