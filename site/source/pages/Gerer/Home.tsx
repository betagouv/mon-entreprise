import { Grid } from '@mui/material'
import {
	specifyIfAutoEntrepreneur,
	specifyIfDirigeantMajoritaire,
} from 'Actions/existingCompanyActions'
import CompanyDetails from 'Components/CompanyDetails'
import PageHeader from 'Components/PageHeader'
import { FromBottom } from 'Components/ui/animate'
import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Button } from 'DesignSystem/buttons'
import { Container, Spacing } from 'DesignSystem/layout'
import Popover from 'DesignSystem/Popover'
import { H2 } from 'DesignSystem/typography/heading'
import { Link } from 'DesignSystem/typography/link'
import { Body, Intro } from 'DesignSystem/typography/paragraphs'
import { useContext, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router'
import { Company } from 'Reducers/inFranceAppReducer'
import { RootState } from 'Reducers/rootReducer'
import styled from 'styled-components'
import { TrackPage } from '../../ATInternetTracking'
import { SimulateurCard } from '../Simulateurs/Home'
import useSimulatorsData, { SimulatorData } from '../Simulateurs/metadata'
import AideOrganismeLocal from './AideOrganismeLocal'
import { AutoEntrepreneurCard } from './cards/AutoEntrepeneurCard'
import { DemarcheEmbaucheCard } from './cards/DemarcheEmbauche'
import { KbisCard } from './cards/KBISCard'
import { MobiliteCard } from './cards/MobiliteCard'
import { SecuriteSocialeCard } from './cards/SecuriteSocialeCard'
import forms from './forms.svg'
import growth from './growth.svg'

export type DirigeantOrNull = keyof SimulatorData | null

const infereDirigeantSimulateurFromCompanyDetails = (
	company: Company | null
): DirigeantOrNull => {
	if (!company) {
		return null
	}
	if (company.isAutoEntrepreneur) {
		return 'auto-entrepreneur'
	}
	if (company.statutJuridique === 'EI') {
		return 'entreprise-individuelle'
	}
	if (
		company.statutJuridique &&
		['EIRL', 'SASU', 'EURL'].includes(company.statutJuridique)
	) {
		return company.statutJuridique.toLowerCase() as 'eirl' | 'sasu' | 'eurl'
	}
	if (company.statutJuridique === 'SARL' && company.isDirigeantMajoritaire) {
		return 'indépendant'
	}

	if (company.statutJuridique === 'SAS') {
		return 'sasu'
	}

	return null
}

// Profession Libérale
const inferPLSimulateurFromCompanyDetails = (
	company: Company | null
): DirigeantOrNull => {
	if (!company || !company.codeNAF) {
		return null
	}
	const nafToSimulator = {
		'69.10Z': 'avocat',
		'69.20Z': 'expert-comptable',
		'86.21Z': 'médecin',
		'86.22A': 'médecin',
		'86.22B': 'médecin',
		'86.22C': 'médecin',
		'86.23Z': 'chirurgien-dentiste',
		'47.73Z': 'pharmacien',
		'86.90D': 'pamc',
		'71.11Z': 'profession-libérale', // archi
	} as Record<string, keyof SimulatorData>
	return nafToSimulator[company.codeNAF] || null
}

export default function Gérer() {
	const { t, i18n } = useTranslation()
	const company = useSelector(
		(state: RootState) => state.inFranceApp.existingCompany
	)
	const dirigeantSimulateur =
		infereDirigeantSimulateurFromCompanyDetails(company)
	const plSimulateur = inferPLSimulateurFromCompanyDetails(company)
	const simulateurs = useSimulatorsData()
	const sitePaths = useContext(SitePathsContext)
	if (!company) {
		return <Redirect to={sitePaths.index} />
	}
	return (
		<>
			<Helmet>
				<title>{t('gérer.titre', 'Gérer mon activité')}</title>
			</Helmet>

			<TrackPage name="accueil" />
			<ScrollToTop />
			<FromBottom>
				<PageHeader
					picture={growth}
					titre={<Trans i18nKey="gérer.titre">Gérer mon activité</Trans>}
				>
					<Intro>
						<Trans i18nKey="gérer.description">
							Vous souhaitez vous verser un revenu ou embaucher ? Vous aurez à
							payer des cotisations et des impôts. Anticipez leurs montants
							grâce aux simulateurs adaptés à votre situation.
						</Trans>
					</Intro>
					<CompanySection company={company} />
					<Spacing xl />
				</PageHeader>

				{(dirigeantSimulateur || plSimulateur) && (
					<Container
						backgroundColor={(theme) => theme.colors.bases.primary[600]}
						darkMode
					>
						<FormsImage src={forms} alt="" />
						<Spacing xs />

						<H2>Entreprise et revenus</H2>
						<Grid container spacing={3} position="relative">
							{plSimulateur && (
								<SimulateurCard fromGérer {...simulateurs[plSimulateur]} />
							)}
							{dirigeantSimulateur !== null && (
								<SimulateurCard
									fromGérer
									{...simulateurs[dirigeantSimulateur]}
								/>
							)}

							{company?.statutJuridique &&
								['EIRL', 'EI', 'EURL', 'SARL'].includes(
									company.statutJuridique
								) &&
								!company.isAutoEntrepreneur && (
									<SimulateurCard
										fromGérer
										{...simulateurs['aide-déclaration-indépendant']}
									/>
								)}
							{company?.statutJuridique &&
								['SARL', 'SASU', 'SAS'].includes(company.statutJuridique) && (
									<Grid item xs={12} md={6} lg={4} alignSelf="flex-end">
										<Grid container spacing={3} columns={2}>
											<SimulateurCard fromGérer {...simulateurs['is']} small />
											<SimulateurCard
												fromGérer
												{...simulateurs['dividendes']}
												small
											/>
										</Grid>
									</Grid>
								)}
						</Grid>
						<Spacing xl />
					</Container>
				)}
				{dirigeantSimulateur !== 'auto-entrepreneur' && (
					<>
						<H2>
							<Trans>Salariés et embauche</Trans>
						</H2>
						<Grid container spacing={3}>
							<SimulateurCard fromGérer {...simulateurs['salarié']} />
							<SimulateurCard fromGérer {...simulateurs['chômage-partiel']} />
						</Grid>
					</>
				)}

				<AideOrganismeLocal />

				<H2>
					<Trans>Ressources utiles</Trans>
				</H2>
				<Grid container spacing={3}>
					{dirigeantSimulateur === 'indépendant' &&
						i18n.language === 'fr' &&
						process.env.HEAD !== 'master' && (
							<Grid item sm={12} md={4}>
								<MobiliteCard />
							</Grid>
						)}
					{!company?.isAutoEntrepreneur && (
						<Grid item sm={12} md={4}>
							<DemarcheEmbaucheCard />
						</Grid>
					)}
					{company?.isAutoEntrepreneur && (
						<Grid item sm={12} md={4}>
							<AutoEntrepreneurCard />
						</Grid>
					)}
					<Grid item sm={12} md={4}>
						<SecuriteSocialeCard />
					</Grid>

					<Grid item sm={12} md={4}>
						<KbisCard dirigeant={dirigeantSimulateur} />
					</Grid>
				</Grid>
			</FromBottom>
		</>
	)
}

type CompanySectionProps = {
	company: Company | null
}

export const CompanySection = ({ company }: CompanySectionProps) => {
	const [autoEntrepreneurModal, showAutoEntrepreneurModal] = useState(false)
	const [DirigeantMajoritaireModal, showDirigeantMajoritaireModal] =
		useState(false)
	const sitePaths = useContext(SitePathsContext)
	const companyRef = useRef<Company | null>(null)
	useEffect(() => {
		if (companyRef.current !== company) {
			companyRef.current = company

			if (
				company?.statutJuridique === 'EI' &&
				company?.isAutoEntrepreneur == null
			) {
				showAutoEntrepreneurModal(true)
			}
			if (
				company?.statutJuridique === 'SARL' &&
				company?.isDirigeantMajoritaire == null
			) {
				showDirigeantMajoritaireModal(true)
			}
		}
	}, [company])

	const dispatch = useDispatch()
	const handleAnswerAutoEntrepreneur = (isAutoEntrepreneur: boolean) => {
		dispatch(specifyIfAutoEntrepreneur(isAutoEntrepreneur))
		showAutoEntrepreneurModal(false)
	}
	const handleAnswerDirigeantMajoritaire = (DirigeantMajoritaire: boolean) => {
		dispatch(specifyIfDirigeantMajoritaire(DirigeantMajoritaire))
		showDirigeantMajoritaireModal(false)
	}
	const { t } = useTranslation()

	return (
		<>
			{autoEntrepreneurModal && (
				<>
					<ScrollToTop />
					<Popover
						title={t('gérer.entreprise.auto', 'Êtes-vous auto-entrepreneur ?')}
					>
						<Grid container spacing={2}>
							<Grid item>
								<Button
									size="XS"
									onPress={() => handleAnswerAutoEntrepreneur(true)}
								>
									<Trans>Oui</Trans>
								</Button>
							</Grid>
							<Grid item>
								<Button
									size="XS"
									onPress={() => handleAnswerAutoEntrepreneur(false)}
								>
									<Trans>Non</Trans>
								</Button>
							</Grid>
						</Grid>
					</Popover>
				</>
			)}
			{DirigeantMajoritaireModal && (
				<>
					<ScrollToTop />
					<Popover
						title={t(
							'gérer.entreprise.dirigeant.titre',
							'Êtes-vous dirigeant majoritaire ?'
						)}
					>
						<Body>
							<Trans i18nKey="gérer.entreprise.dirigeant.description">
								Si vous êtes administrateur majoritaire ou si vous faites partie
								d'un conseil d'administration majoritaire, vous n'aurez pas le
								même régime de sécurité sociale que si vous êtes minoritaire.
							</Trans>
						</Body>
						<Grid container spacing={1}>
							<Grid item>
								<Button onPress={() => handleAnswerDirigeantMajoritaire(true)}>
									<Trans>Oui</Trans>
								</Button>
							</Grid>
							<Grid item>
								<Button onPress={() => handleAnswerDirigeantMajoritaire(false)}>
									<Trans>Non</Trans>
								</Button>
							</Grid>
						</Grid>
					</Popover>{' '}
				</>
			)}

			{company && (
				<>
					<CompanyDetails siren={company.siren} />
					<Link to={sitePaths.index}>
						<Trans i18nKey="gérer.entreprise.changer">
							Changer l'entreprise sélectionnée
						</Trans>
					</Link>
				</>
			)}
		</>
	)
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
		height: 25rem;
	}
`
