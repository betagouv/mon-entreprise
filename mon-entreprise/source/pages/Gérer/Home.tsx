import {
	resetEntreprise,
	specifyIfAutoEntrepreneur,
	specifyIfDirigeantMajoritaire,
} from 'Actions/existingCompanyActions'
import CompanyDetails from 'Components/CompanyDetails'
import FindCompany from 'Components/FindCompany'
import Overlay from 'Components/Overlay'
import PageHeader from 'Components/PageHeader'
import { FromBottom } from 'Components/ui/animate'
import Emoji from 'Components/utils/Emoji'
import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePaths, SitePathsContext } from 'Components/utils/SitePathsContext'
import { H2, H3, H5 } from 'DesignSystem/typography/heading'
import { useContext, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Company } from 'Reducers/inFranceAppReducer'
import { RootState } from 'Reducers/rootReducer'
import { TrackPage } from '../../ATInternetTracking'
import AideOrganismeLocal from './AideOrganismeLocal'
import businessPlan from './businessPlan.svg'

const infereDirigeantFromCompanyDetails = (
	company: Company | null
): Exclude<
	keyof SitePaths['simulateurs'],
	'index' | 'profession-libérale' | 'économieCollaborative'
> | null => {
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
	const sitePaths = useContext(SitePathsContext)
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
						<p className="ui__ lead">
							<Trans i18nKey="gérer.description">
								Vous souhaitez vous verser un revenu ou embaucher ? <br />
								Vous aurez à payer des cotisations et des impôts. <br />
								Anticipez leurs montants grâce aux simulateurs adaptés à votre
								situation.
							</Trans>
						</p>
					)}
					<CompanySection company={company} />
				</PageHeader>
				<>
					<section>
						<div className="ui__ full-width box-container">
							{(company?.statutJuridique === 'EI' ||
								company?.statutJuridique === 'SARL') &&
								!company.isAutoEntrepreneur && (
									<Link
										className="ui__ interactive card box light-border"
										to={{
											pathname: sitePaths.gérer.déclarationIndépendant,
										}}
									>
										<div className="ui__ big box-icon">
											<Emoji emoji="✍" />
										</div>
										<Trans i18nKey="gérer.choix.déclaration">
											<H3>Remplir ma déclaration de revenus</H3>
											<p className="ui__ notice">
												Calculez facilement les montants des charges sociales à
												reporter dans votre déclaration de revenu au titre de
												2020
											</p>
										</Trans>
										<div className="ui__ small simple button hide-mobile">
											<Trans>Commencer</Trans>
										</div>
									</Link>
								)}

							{!!dirigeant && (
								<Link
									className="ui__ interactive card box light-border"
									to={{
										pathname: sitePaths.simulateurs[dirigeant],
										state: {
											fromGérer: true,
										},
									}}
								>
									<div className="ui__ big box-icon">
										<Emoji emoji="💶" />
									</div>
									<Trans i18nKey="gérer.choix.revenus">
										<H3>Calculer mon revenu net de cotisations</H3>
										<p className="ui__ notice">
											Estimez précisément le montant de vos cotisations grâce au
											simulateur {{ régime: dirigeant }} de l'Urssaf
										</p>
									</Trans>
									<div className="ui__ small simple button hide-mobile">
										<Trans>Commencer</Trans>
									</div>
								</Link>
							)}
							{dirigeant !== 'auto-entrepreneur' && (
								<>
									<Link
										className="ui__ interactive card box light-border"
										to={{
											pathname: sitePaths.simulateurs['chômage-partiel'],
										}}
									>
										<div className="ui__ big box-icon">
											<Emoji emoji="🕟" />
										</div>
										<Trans i18nKey="gérer.choix.chomage-partiel">
											<H3>Activité partielle</H3>
											<p className="ui__ notice">
												Calculez le reste à payer après remboursement de l'État
												lorsque vous activez le dispositif pour un employé.
											</p>
										</Trans>
										<div className="ui__ small simple button hide-mobile">
											<Trans>Découvrir</Trans>
										</div>
										<span className="ui__ label">Covid-19</span>
									</Link>
									<Link
										className="ui__ interactive card box light-border"
										to={{
											pathname: sitePaths.simulateurs.salarié,
											search: '?view=employeur',
											state: {
												fromGérer: true,
											},
										}}
									>
										<div className="ui__ big box-icon">
											<Emoji emoji="🤝" />
										</div>
										<Trans i18nKey="gérer.choix.embauche">
											<H3>Estimer le montant d’une embauche</H3>
											<p className="ui__ notice">
												Calculez le montant total que votre entreprise devra
												dépenser pour rémunérer votre prochain employé
											</p>
										</Trans>
										<div className="ui__ small simple button hide-mobile">
											<Trans>Commencer</Trans>
										</div>
									</Link>
									<Link
										className="ui__ interactive card box light-border"
										to={{
											pathname: sitePaths.simulateurs.is,
											state: {
												fromGérer: true,
											},
										}}
									>
										<div className="ui__ big box-icon">
											<Emoji emoji="🗓" />
										</div>
										<Trans i18nKey="gérer.choix.is">
											<H3>Estimer le montant de l’impôt sur les sociétés</H3>
											<p className="ui__ notice">
												Calculez le montant de l'impôt sur les sociétés à partir
												de votre bénéfice.
											</p>
										</Trans>
										<div className="ui__ small simple button hide-mobile">
											<Trans>Commencer</Trans>
										</div>
									</Link>
								</>
							)}
						</div>
					</section>
					<AideOrganismeLocal />

					<H3 as="h2">
						<Emoji emoji="🧰" />
						<Trans>Ressources utiles</Trans>
					</H3>
					<div className="ui__ box-container">
						{dirigeant === 'indépendant' &&
							i18n.language === 'fr' &&
							process.env.HEAD !== 'master' && (
								<Link
									className="ui__ interactive card box lighter-bg"
									to={sitePaths.gérer.formulaireMobilité}
								>
									<Trans i18nKey="gérer.ressources.export">
										<H5 as="h3">Exporter son activité en Europe</H5>
										<p className="ui__ notice">
											Le formulaire pour effectuer une demande de mobilité
											internationale (détachement ou pluriactivité)
										</p>
									</Trans>
								</Link>
							)}
						{!company?.isAutoEntrepreneur && (
							<Link
								className="ui__ interactive card box lighter-bg"
								to={sitePaths.gérer.embaucher}
							>
								<Trans i18nKey="gérer.ressources.embaucher">
									<H5 as="h3">Découvrir les démarches d’embauche </H5>
									<p className="ui__ notice">
										La liste des choses à faire pour être sûr de ne rien oublier
										lors de l’embauche d’un nouveau salarié
									</p>
								</Trans>
							</Link>
						)}
						{company?.isAutoEntrepreneur && (
							<a
								className="ui__ interactive card box lighter-bg"
								href="https://autoentrepreneur.urssaf.fr"
							>
								<Trans i18nKey="gérer.ressources.autoEntrepreneur">
									<H5 as="h3">Accéder au site officiel auto-entrepreneur</H5>
									<p className="ui__ notice">
										Vous pourrez effectuer votre déclaration de chiffre
										d'affaires, payer vos cotisations, et plus largement trouver
										toutes les informations relatives au statut
										d'auto-entrepreneur
									</p>
								</Trans>
							</a>
						)}
						<Link
							className="ui__ interactive card box lighter-bg"
							to={sitePaths.gérer.sécuritéSociale}
						>
							<Trans i18nKey="gérer.ressources.sécuritéSociale">
								<H5 as="h3">Comprendre la sécurité sociale </H5>
								<p className="ui__ notice">
									A quoi servent les cotisations sociales ? Le point sur le
									système de protection sociale dont bénéficient tous les
									travailleurs en France
								</p>
							</Trans>
						</Link>
						{dirigeant === 'auto-entrepreneur' ? (
							<a
								className="ui__ interactive card box lighter-bg"
								href={`https://www.service-public.fr/professionnels-entreprises/vosdroits/F21000${
									i18n.language === 'fr' ? '' : '?lang=en'
								}`}
								target="_blank"
								rel="noreferrer noopener"
							>
								<Trans i18nKey="gérer.ressources.kbis-autoentrepreneur">
									<H5 as="h3">Récupérer un extrait de Kbis?</H5>
									<p className="ui__ notice">
										Les auto-entrepreneurs n'ont pas de Kbis. Ils peuvent
										cependant récupérer et présenter un extrait K. Voir le site
										du service-public pour plus d'informations.
									</p>
								</Trans>
							</a>
						) : (
							<a
								className="ui__ interactive card box lighter-bg"
								href="https://www.monidenum.fr"
								target="_blank"
								rel="noreferrer noopener"
							>
								<Trans i18nKey="gérer.ressources.kbis">
									<H5 as="h3">Récupérer un extrait de Kbis</H5>
									<p className="ui__ notice">
										Le Kbis est un document permettant de justifier de
										l'enregistrement de l'entreprise au{' '}
										<abbr title="Registre du Commerce et des Sociétés">
											RCS
										</abbr>{' '}
										et de prouver son existence légale. Ce document peut être
										récupéré gratuitement pour votre entreprise via le site
										MonIdeNum.
									</p>
								</Trans>
							</a>
						)}
					</div>
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

	return (
		<>
			{autoEntrepreneurModal && (
				<>
					<ScrollToTop />
					<Overlay>
						<H2>
							<Trans i18nKey="gérer.entreprise.auto">
								Êtes-vous auto-entrepreneur ?{' '}
							</Trans>
						</H2>
						<div className="ui__ answer-group">
							<button
								className="ui__ button"
								onClick={() => handleAnswerAutoEntrepreneur(true)}
							>
								<Trans>Oui</Trans>
							</button>
							<button
								className="ui__ button"
								onClick={() => handleAnswerAutoEntrepreneur(false)}
							>
								<Trans>Non</Trans>
							</button>
						</div>
					</Overlay>
				</>
			)}
			{DirigeantMajoritaireModal && (
				<>
					<ScrollToTop />
					<Overlay>
						<Trans i18nKey="gérer.entreprise.dirigeant">
							<H2>Êtes-vous dirigeant majoritaire ?</H2>
							<p>
								Si vous êtes administrateur majoritaire ou si vous faites partie
								d'un conseil d'administration majoritaire, vous n'aurez pas le
								même régime de sécurité sociale que si vous êtes minoritaire.
							</p>
						</Trans>
						<div className="ui__ answer-group">
							<button
								className="ui__ button"
								onClick={() => handleAnswerDirigeantMajoritaire(true)}
							>
								<Trans>Oui</Trans>
							</button>
							<button
								className="ui__ button"
								onClick={() => handleAnswerDirigeantMajoritaire(false)}
							>
								<Trans>Non</Trans>
							</button>
						</div>
					</Overlay>
				</>
			)}
			{searchModal && (
				<>
					<ScrollToTop />
					<Overlay onClose={() => showSearchModal(false)}>
						<FindCompany />
					</Overlay>
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
				<p>
					<button
						onClick={() => showSearchModal(true)}
						className="ui__ plain cta button"
					>
						<Trans i18nKey="gérer.cta">Renseigner mon entreprise</Trans>
					</button>
				</p>
			)}
		</>
	)
}
