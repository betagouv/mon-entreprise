import { resetCompany } from '@/actions/companyActions'
import {
	FabriqueSocialEntreprise,
	searchDenominationOrSiren,
} from '@/api/fabrique-social'
import { CompanyDetails } from '@/components/company/Details'
import RuleInput from '@/components/conversation/RuleInput'
import {
	Condition,
	WhenApplicable,
	WhenNotApplicable,
} from '@/components/EngineValue'
import PageData from '@/components/PageData'
import PageHeader from '@/components/PageHeader'
import { PlaceDesEntreprisesButton } from '@/components/PlaceDesEntreprises'
import { FromTop } from '@/components/ui/animate'
import { useEngine } from '@/components/utils/EngineContext'
import { Markdown } from '@/components/utils/markdown'
import { ScrollToTop } from '@/components/utils/Scroll'
import useSimulationConfig from '@/components/utils/useSimulationConfig'
import { Message, Popover } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Container, Grid, Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H2, H4 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import { useQuestionList } from '@/hooks/useQuestionList'
import { useSetEntreprise } from '@/hooks/useSetEntreprise'
import { companySituationSelector } from '@/selectors/simulationSelectors'
import { useSitePaths } from '@/sitePaths'
import { evaluateQuestion } from '@/utils'
import { useOverlayTriggerState } from '@react-stately/overlays'
import { DottedName } from 'modele-social'
import Engine, { Evaluation } from 'publicodes'
import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
	generatePath,
	Navigate,
	Route,
	Routes,
	useLocation,
	useParams,
} from 'react-router-dom'
import styled from 'styled-components'
import { TrackChapter, TrackPage } from '../../ATInternetTracking'
import { SimulateurCard } from '../Simulateurs/Home'
import useSimulatorsData, { SimulatorData } from '../Simulateurs/metadata'
import Embaucher from './embaucher'
import SocialSecurity from './sécurité-sociale'
import { AnnuaireEntreprises } from './_components/AnnuaireEntreprises'
import { AutoEntrepreneurCard } from './_components/AutoEntrepeneurCard'
import { DemarcheEmbaucheCard } from './_components/DemarcheEmbauche'
import forms from './_components/forms.svg'
import growth from './_components/growth.svg'
import { MobiliteCard } from './_components/MobiliteCard'
import { SecuriteSocialeCard } from './_components/SecuriteSocialeCard'

export default function Gérer() {
	const { relativeSitePaths, absoluteSitePaths } = useSitePaths()
	const location = useLocation()
	const simulateurs = useSimulatorsData()

	const back = (
		<Link to={absoluteSitePaths.gérer.index}>
			← <Trans>Retour à mon activité</Trans>
		</Link>
	)

	return (
		<>
			<ScrollToTop key={location.pathname} />

			<TrackChapter chapter1="gerer">
				<Routes>
					<Route index element={<Home />} />
					<Route path={relativeSitePaths.gérer.entreprise} element={<Home />} />
					<Route
						path={relativeSitePaths.gérer.sécuritéSociale}
						element={
							<>
								{back}
								<SocialSecurity />
							</>
						}
					/>
					<Route
						path={relativeSitePaths.gérer.embaucher}
						element={
							<>
								{back}
								<Embaucher />
							</>
						}
					/>
					{[
						simulateurs['déclaration-charges-sociales-indépendant'],
						simulateurs['déclaration-revenu-indépendant-beta'],
						simulateurs['déclaration-revenu-indépendant'],
						simulateurs['demande-mobilité'],
					].map((p) => (
						<Route
							key={p.shortName}
							path={p.path.replace(absoluteSitePaths.gérer.index, '') + '/*'}
							element={
								<>
									{back}
									<PageData {...p} />
								</>
							}
						/>
					))}
				</Routes>
			</TrackChapter>
		</>
	)
}

const infereSimulateurRevenuFromSituation = (
	engine: Engine<DottedName>
): keyof SimulatorData | null => {
	if (
		engine.evaluate('entreprise . catégorie juridique . EI . auto-entrepreneur')
			.nodeValue
	) {
		return 'auto-entrepreneur'
	}

	if (
		engine.evaluate('entreprise . catégorie juridique . SARL . unipersonnelle')
			.nodeValue
	) {
		return 'eurl'
	}
	if (
		engine.evaluate('entreprise . catégorie juridique . SAS . unipersonnelle')
			.nodeValue
	) {
		return 'sasu'
	}
	if (engine.evaluate('entreprise . catégorie juridique . EI').nodeValue) {
		return 'eirl'
	}
	if (engine.evaluate('entreprise . catégorie juridique . EI').nodeValue) {
		const métierProfessionLibéral = engine.evaluate(
			'dirigeant . indépendant . PL . métier'
		).nodeValue
		switch (métierProfessionLibéral) {
			case 'avocat':
				return 'avocat'
			case 'expert-comptable':
				return 'expert-comptable'
			case 'santé . médecin':
				return 'médecin'
			case 'santé . chirurgien-dentiste':
				return 'chirurgien-dentiste'
			case 'santé . sage-femme':
				return 'sage-femme'
			case 'santé . auxiliaire médical':
				return 'auxiliaire-médical'
			case 'santé . pharmacien':
				return 'pharmacien'
		}
		if (engine.evaluate('dirigeant . indépendant . PL').nodeValue) {
			return 'profession-libérale'
		}

		return 'entreprise-individuelle'
	}
	const régimeSocial = engine.evaluate('dirigeant . régime social').nodeValue

	if (régimeSocial === 'indépendant') {
		return 'indépendant'
	}

	// TODO : assimilé-salarié
	// if (
	// 	régimeSocial === 'assimilé-salarié'
	// ) {
	// 	return 'assimilé-salarié'
	// }
	return null
}

function Home() {
	const { t, i18n } = useTranslation()
	const dirigeantSimulateur = infereSimulateurRevenuFromSituation(useEngine())
	const simulateurs = useSimulatorsData()
	const { absoluteSitePaths } = useSitePaths()
	const engine = useEngine()
	const dispatch = useDispatch()
	const engineSiren = engine.evaluate('entreprise . SIREN').nodeValue
	const [overwrite, setOverwrite] = useState(engineSiren === undefined)
	const { param, entreprise, entrepriseNotFound, entreprisePending } =
		useSirenFromParams(overwrite)
	const gérerPath = useGérerPath()

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
		return <Navigate to={gérerPath} />
	}

	if (
		(!param && !engineSiren) ||
		(param && entrepriseNotFound) ||
		(entreprise && !overwrite && !engineSiren)
	) {
		return <Navigate to={absoluteSitePaths.index} />
	}

	return (
		<>
			<Helmet>
				<title>{t('gérer.titre', 'Gérer mon activité')}</title>
			</Helmet>

			{param && param !== engineSiren && !overwrite && (
				<PopoverOverwriteSituation
					onOverwrite={() => {
						dispatch(resetCompany())
						setOverwrite(true)
					}}
				/>
			)}

			<TrackPage name="accueil" />
			<PageHeader
				picture={growth}
				titre={<Trans i18nKey="gérer.titre">Gérer mon activité</Trans>}
			>
				<Intro>
					<Trans i18nKey="gérer.description">
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

			<Container
				backgroundColor={(theme) => theme.colors.bases.primary[600]}
				darkMode
			>
				<FromTop>
					<FormsImage src={forms} alt="" />
					<Spacing xs />
					<H2>Simulateurs pour votre entreprise</H2>
					<Grid
						container
						spacing={3}
						css={`
							position: relative;
						`}
					>
						{dirigeantSimulateur ? (
							<SimulateurCard fromGérer {...simulateurs[dirigeantSimulateur]} />
						) : (
							<Grid
								item
								md={12}
								lg={8}
								css={`
									margin-bottom: -1rem;
								`}
							>
								<Message border={false} type="info">
									<Trans i18nKey="gérer.avertissement-entreprise-non-traitée">
										<Intro>
											Il n'existe pas encore de simulateur de revenu pour votre
											type d'entreprise sur ce site.
										</Intro>
										<Body>
											Si vous souhaitez que nous développions un nouveau
											simulateur, laissez-nous message en cliquant sur le bouton
											"Faire une suggestion" en bas de cette page.
										</Body>
									</Trans>
								</Message>
							</Grid>
						)}

						<WhenApplicable dottedName="dirigeant . indépendant">
							<SimulateurCard
								fromGérer
								{...simulateurs['déclaration-revenu-indépendant-beta']}
							/>
						</WhenApplicable>
						<Condition expression="entreprise . imposition . IS">
							<Grid
								item
								xs={12}
								md={6}
								lg={4}
								css={`
									align-self: flex-end;
								`}
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
			{dirigeantSimulateur !== 'auto-entrepreneur' && (
				<FromTop>
					<H2>
						<Trans>Salariés et embauche</Trans>
					</H2>
					<Grid container spacing={3}>
						<SimulateurCard fromGérer {...simulateurs['salarié']} />
						<SimulateurCard fromGérer {...simulateurs['chômage-partiel']} />
					</Grid>
				</FromTop>
			)}

			<Trans i18nKey="gérer.PdE">
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

			<PlaceDesEntreprisesButton
				pathname="/aide-entreprise/mon-entreprise-urssaf-fr"
				siret={
					engine.evaluate('établissement . SIRET')
						.nodeValue as Evaluation<string>
				}
			/>

			<H2>
				<Trans>Ressources utiles</Trans>
			</H2>
			<Grid container spacing={3}>
				{dirigeantSimulateur === 'indépendant' && i18n.language === 'fr' && (
					<Grid item sm={12} md={4}>
						<MobiliteCard />
					</Grid>
				)}
				<WhenNotApplicable dottedName="entreprise . catégorie juridique . EI . auto-entrepreneur">
					<Grid item sm={12} md={4}>
						<DemarcheEmbaucheCard />
					</Grid>
				</WhenNotApplicable>
				<WhenApplicable dottedName="entreprise . catégorie juridique . EI . auto-entrepreneur">
					<Grid item sm={12} md={4}>
						<AutoEntrepreneurCard />
					</Grid>
				</WhenApplicable>
				<Grid item sm={12} md={4}>
					<SecuriteSocialeCard />
				</Grid>
				<Grid item sm={12} md={4}>
					<AnnuaireEntreprises />
				</Grid>
			</Grid>
		</>
	)
}

const companyDetailsConfig = {
	questions: {
		'liste noire': ['entreprise . imposition . régime'] as DottedName[],
	},
	objectifs: [
		'dirigeant . régime social',
		'entreprise . imposition',
	] as DottedName[],
}

const UlInColumns = styled.ul`
	@media (min-width: ${({ theme }) => theme.breakpointsWidth.md}) {
		columns: 2;
	}
	@media (min-width: ${({ theme }) => theme.breakpointsWidth.lg}) {
		columns: 3;
	}
`

export const AskCompanyMissingDetails = () => {
	const { absoluteSitePaths } = useSitePaths()
	useSimulationConfig(companyDetailsConfig, {
		path: absoluteSitePaths.gérer.index,
	})

	const [questions, onQuestionAnswered] = useQuestionList()
	const engine = useEngine()

	return (
		<>
			<CompanyDetails showSituation />
			{!!questions.length && (
				<>
					<Body
						css={`
							margin-bottom: -0.5rem;
						`}
					>
						Répondez aux questions suivantes pour découvrir les simulateurs et
						assistants adaptés à votre situation :
					</Body>

					{questions.map((question) => (
						<FromTop key={question.dottedName}>
							<H4>
								<Markdown options={{ forceInline: true }}>
									{evaluateQuestion(engine, question) ?? ''}
								</Markdown>
							</H4>
							<RuleInput
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
					css={`
						justify-content: end;
					`}
					spacing={2}
				>
					<Grid item>
						<Button
							size="XS"
							onClick={() => {
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
							onClick={() => {
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

const useGérerPath = () => {
	const { absoluteSitePaths } = useSitePaths()
	const company = useSelector(companySituationSelector)

	if (company['entreprise . SIREN']) {
		const siren = (company['entreprise . SIREN'] as string).replace(/'/g, '')

		return generatePath(absoluteSitePaths.gérer.entreprise, {
			entreprise: siren,
		})
	}

	return null
}

const useSirenFromParams = (overwrite: boolean) => {
	const { entreprise: param } = useParams<{ entreprise?: string }>()
	const [entreprise, setEntreprise] = useState<FabriqueSocialEntreprise | null>(
		null
	)
	const engine = useEngine()
	const engineSiren = engine.evaluate('entreprise . SIREN').nodeValue

	const [entreprisePending, setEntreprisePending] = useState(false)
	const [entrepriseNotFound, setEntrepriseNotFound] = useState(false)

	const pass = param && param !== engineSiren && !overwrite

	const once = useRef(false)
	useEffect(() => {
		let canceled = false
		if (!param || pass || once.current) {
			return
		}
		once.current = true
		setEntreprisePending(true)
		searchDenominationOrSiren(param)
			.then((entreprises) => {
				if (canceled) {
					return
				}
				setEntreprisePending(false)
				if (!entreprises || !entreprises.length) {
					return setEntrepriseNotFound(true)
				}
				setEntreprise(entreprises[0])
			})
			.catch((error) => {
				if (canceled) {
					return
				}
				setEntrepriseNotFound(true)
				setEntreprisePending(false)
				// eslint-disable-next-line no-console
				console.error(error)
			})

		return () => {
			canceled = true
		}
	}, [setEntreprise, param, pass])

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
