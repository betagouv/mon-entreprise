import { Grid } from '@mui/material'
import {
	resetEntreprise,
	specifyIfAutoEntrepreneur,
	specifyIfDirigeantMajoritaire,
} from 'Actions/existingCompanyActions'
import CompanyDetails from 'Components/CompanyDetails'
import FindCompany from 'Components/FindCompany'
import PageHeader from 'Components/PageHeader'
import { FromBottom } from 'Components/ui/animate'
import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePaths } from 'Components/utils/SitePathsContext'
import { Button } from 'DesignSystem/buttons'
import Popover from 'DesignSystem/Popover'
import { H2 } from 'DesignSystem/typography/heading'
import { Body, Intro } from 'DesignSystem/typography/paragraphs'
import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Company } from 'Reducers/inFranceAppReducer'
import { RootState } from 'Reducers/rootReducer'
import { TrackPage } from '../../ATInternetTracking'
import AideOrganismeLocal from './AideOrganismeLocal'
import businessPlan from './businessPlan.svg'
import { ActivitePartielleCard } from './cards/ActivitePartielle'
import { AutoEntrepreneurCard } from './cards/AutoEntrepeneurCard'
import { DeclarationIndedependantsCard } from './cards/DeclarationIndependantsCard'
import { DemarcheEmbaucheCard } from './cards/DemarcheEmbauche'
import { ImpotSocieteCard } from './cards/ImpotSociete'
import { KbisCard } from './cards/KBISCard'
import { MobiliteCard } from './cards/MobiliteCard'
import { MontantEmbaucheCard } from './cards/MontantEmbauche'
import { RevenuDirigeantCard } from './cards/RevenuDirigeantCard'
import { SecuriteSocialeCard } from './cards/SecuriteSocialeCard'

export type Dirigeant = Exclude<
	keyof SitePaths['simulateurs'],
	'index' | 'profession-libérale' | 'économieCollaborative'
>

export type DirigeantOrNull = Dirigeant | null

const infereDirigeantFromCompanyDetails = (
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

export default function Gérer() {
	const { t, i18n } = useTranslation()
	const company = useSelector(
		(state: RootState) => state.inFranceApp.existingCompany
	)
	const dirigeant = infereDirigeantFromCompanyDetails(company)

	return (
		<>
			<Helmet>
				<title>{t('gérer.titre', 'Gérer mon activité')}</title>
			</Helmet>

			<TrackPage name="accueil" />
			<ScrollToTop />
			<FromBottom>
				<PageHeader
					picture={businessPlan}
					titre={<Trans i18nKey="gérer.titre">Gérer mon activité</Trans>}
				>
					{!company && (
						<Intro>
							<Trans i18nKey="gérer.description">
								Vous souhaitez vous verser un revenu ou embaucher ? <br />
								Vous aurez à payer des cotisations et des impôts. <br />
								Anticipez leurs montants grâce aux simulateurs adaptés à votre
								situation.
							</Trans>
						</Intro>
					)}
					<CompanySection company={company} />
				</PageHeader>
				<>
					<section>
						<Grid container spacing={2}>
							{(company?.statutJuridique === 'EI' ||
								company?.statutJuridique === 'SARL') &&
								!company.isAutoEntrepreneur && (
									<Grid item sm={12} md={4}>
										<DeclarationIndedependantsCard />
									</Grid>
								)}

							{dirigeant !== null && (
								<Grid item>
									<RevenuDirigeantCard dirigeant={dirigeant} />
								</Grid>
							)}

							{dirigeant !== 'auto-entrepreneur' && (
								<>
									<Grid item sm={12} md={4}>
										<ActivitePartielleCard />
									</Grid>
									<Grid item sm={12} md={4}>
										<MontantEmbaucheCard />
									</Grid>
									<Grid item sm={12} md={4}>
										<ImpotSocieteCard />
									</Grid>
								</>
							)}
						</Grid>
					</section>
					<AideOrganismeLocal />

					<H2>
						<Trans>Ressources utiles</Trans>
					</H2>
					<Grid container spacing={2}>
						{dirigeant === 'indépendant' &&
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
							<KbisCard dirigeant={dirigeant} />
						</Grid>
					</Grid>
				</>
			</FromBottom>
		</>
	)
}

type CompanySectionProps = {
	company: Company | null
}

export const CompanySection = ({ company }: CompanySectionProps) => {
	const [searchModal, showSearchModal] = useState(false)
	const [autoEntrepreneurModal, showAutoEntrepreneurModal] = useState(false)
	const [DirigeantMajoritaireModal, showDirigeantMajoritaireModal] =
		useState(false)

	const companyRef = useRef<Company | null>(null)
	useEffect(() => {
		if (companyRef.current !== company) {
			companyRef.current = company
			if (searchModal && company) {
				showSearchModal(false)
			}
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
	}, [company, searchModal])

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
						<div className="ui__ answer-group">
							<Button onClick={() => handleAnswerAutoEntrepreneur(true)}>
								<Trans>Oui</Trans>
							</Button>
							<Button onClick={() => handleAnswerAutoEntrepreneur(false)}>
								<Trans>Non</Trans>
							</Button>
						</div>
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
						<div className="ui__ answer-group">
							<Button onClick={() => handleAnswerDirigeantMajoritaire(true)}>
								<Trans>Oui</Trans>
							</Button>
							<Button onClick={() => handleAnswerDirigeantMajoritaire(false)}>
								<Trans>Non</Trans>
							</Button>
						</div>
					</Popover>{' '}
				</>
			)}
			{searchModal && (
				<>
					<ScrollToTop />
					<Popover
						onClose={() => showSearchModal(false)}
						isDismissable
						title={t('trouver.titre', 'Retrouver mon entreprise')}
					>
						<FindCompany />
					</Popover>
				</>
			)}
			{company ? (
				<>
					<CompanyDetails siren={company.siren} />
					<p>
						{' '}
						{company.statutJuridique !== 'NON_IMPLÉMENTÉ' && (
							<>
								<span className="ui__ label">
									{company.isAutoEntrepreneur
										? 'Auto-entrepreneur'
										: company.statutJuridique}
								</span>
								{company.isDirigeantMajoritaire != null && (
									<span css="margin-left: 1rem;" className="ui__ label">
										{company.isDirigeantMajoritaire ? (
											<Trans i18nKey="gérer.entreprise.majoritaire">
												Dirigeant majoritaire
											</Trans>
										) : (
											<Trans i18nKey="gérer.entreprise.minoritaire">
												Dirigeant minoritaire
											</Trans>
										)}
									</span>
								)}
							</>
						)}
					</p>
					<button
						className="ui__ simple small button"
						onClick={() => {
							dispatch(resetEntreprise())
							showSearchModal(true)
						}}
					>
						<Trans i18nKey="gérer.entreprise.changer">
							Changer l'entreprise sélectionnée
						</Trans>
					</button>
				</>
			) : (
				<Button size="XL" onClick={() => showSearchModal(true)}>
					<Trans i18nKey="gérer.cta">Renseigner mon entreprise</Trans>
				</Button>
			)}
		</>
	)
}
