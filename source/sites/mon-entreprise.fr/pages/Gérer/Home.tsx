import {
	resetEntreprise,
	specifyIfAutoEntrepreneur,
	specifyIfDirigeantMajoritaire
} from 'Actions/existingCompanyActions'
import CompanyDetails from 'Components/CompanyDetails'
import FindCompany from 'Components/FindCompany'
import Overlay from 'Components/Overlay'
import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Company } from 'Reducers/inFranceAppReducer'
import { RootState } from 'Reducers/rootReducer'
import * as Animate from 'Ui/animate'
import AideOrganismeLocal from './AideOrganismeLocal'
import businessPlan from './businessPlan.svg'

const infereRégimeFromCompanyDetails = (company: Company | null) => {
	if (!company) {
		return null
	}
	if (company.isAutoEntrepreneur) {
		return 'auto-entrepreneur'
	}
	if (
		['EI', 'EURL'].includes(company.statutJuridique ?? '') ||
		(company.statutJuridique === 'SARL' && company.isDirigeantMajoritaire)
	) {
		return 'indépendant'
	}

	if (
		['SASU', 'SAS'].includes(company.statutJuridique ?? '') ||
		(company.statutJuridique === 'SARL' && !company.isDirigeantMajoritaire)
	) {
		return 'assimilé-salarié'
	}

	return null
}

export default function SocialSecurity() {
	const { t } = useTranslation()
	const company = useSelector(
		(state: RootState) => state.inFranceApp.existingCompany
	)
	const sitePaths = useContext(SitePathsContext)
	const régime = infereRégimeFromCompanyDetails(company)

	return (
		<>
			<Helmet>
				<title>{t('gérer.titre', 'Gérer mon activité')}</title>
			</Helmet>
			<ScrollToTop />
			<Animate.fromBottom>
				<h1>
					<Trans key="gérer.titre">Gérer mon activité</Trans>
				</h1>
				<div css="display: flex; align-items: flex-start; justify-content: space-between">
					<div>
						{!company && (
							<p className="ui__ lead">
								<Trans key="gérer.description">
									Vous souhaitez vous verser un revenu ou embaucher ? <br />
									Vous aurez à payer des cotisations et des impôts. <br />
									Anticipez leurs montants grâce aux simulateurs adaptés à votre
									situation.
								</Trans>
							</p>
						)}
						<CompanySection company={company} />
					</div>

					<img
						className="ui__ hide-mobile"
						src={businessPlan}
						css="margin-left: 3rem; max-width: 15rem; transform: translateX(2rem) scale(1.4);"
					/>
				</div>

				<>
					<h2>
						<Trans key="gérer.choix.titre">Que souhaitez-vous faire ?</Trans>
					</h2>
					{!!régime && (
						<Link
							className="ui__ interactive card button-choice lighter-bg"
							css="width: 100%"
							to={{
								pathname: sitePaths.simulateurs[régime],
								state: {
									fromGérer: true
								}
							}}
						>
							<Trans key="gérer.choix.revenus">
								<p>Calculer mon revenu net</p>
								<small>
									Estimez précisément le montant de vos cotisations grâce au
									simulateur {{ régime }} de l'Urssaf
								</small>
							</Trans>
						</Link>
					)}
					{régime !== 'auto-entrepreneur' && (
						<Link
							className="ui__ interactive card button-choice lighter-bg "
							css="width: 100%"
							to={{
								pathname: sitePaths.simulateurs.salarié,
								state: {
									fromGérer: true
								}
							}}
						>
							<Trans key="gérer.choix.embauche">
								<p>Estimer le montant d’une embauche</p>
								<small>
									Calculez le montant total que votre entreprise devra dépenser
									pour rémunérer votre prochain employé
								</small>
							</Trans>
						</Link>
					)}
					<AideOrganismeLocal />
					<h2>
						<Trans>Ressources utiles</Trans>
					</h2>
					<div
						css={`
							display: flex;
							margin-right: -1rem;
							flex-wrap: wrap;
							> * {
								flex: 1;
							}
						`}
					>
						{!company?.isAutoEntrepreneur && (
							<Link
								className="ui__ interactive card button-choice lighter-bg"
								to={sitePaths.gérer.embaucher}
							>
								<Trans key="gérer.ressources.embaucher">
									<p>Découvrir les démarches d’embauche </p>
									<small>
										La liste des choses à faire pour être sûr de ne rien oublier
										lors de l’embauche d’un nouveau salarié
									</small>
								</Trans>
							</Link>
						)}
						{company?.isAutoEntrepreneur && (
							<a
								className="ui__ interactive card button-choice lighter-bg"
								href="https://autoentrepreneur.urssaf.fr"
							>
								<Trans key="gérer.ressources.autoEntrepreneur">
									<p>Accéder au site officiel auto-entrepreneur</p>
									<small>
										Vous pourrez effectuer votre déclaration de chiffre
										d'affaire, payer vos cotisations, et plus largement trouver
										toutes les informations relatives au statut
										d'auto-entrepreneur
									</small>
								</Trans>
							</a>
						)}
						<Link
							className="ui__ interactive card button-choice lighter-bg"
							to={sitePaths.gérer.sécuritéSociale}
						>
							<Trans key="gérer.ressources.sécuritéSociale">
								<p>Comprendre la sécurité sociale </p>
								<small>
									A quoi servent les cotisations sociales ? Le point sur le
									système de protection sociale dont bénéficient tous les
									travailleurs en France
								</small>
							</Trans>
						</Link>
					</div>
				</>
			</Animate.fromBottom>
		</>
	)
}

type CompanySectionProps = {
	company: Company | null
}

const CompanySection = ({ company }: CompanySectionProps) => {
	const [searchModal, showSearchModal] = useState(false)
	const [autoEntrepreneurModal, showAutoEntrepreneurModal] = useState(false)
	const [DirigeantMajoritaireModal, showDirigeantMajoritaireModal] = useState(
		false
	)

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
						<h2>
							<Trans key="gérer.entreprise.auto">
								Êtes-vous auto-entrepreneur ?{' '}
							</Trans>
						</h2>
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
						<Trans key="gérer.entreprise.dirigeant">
							<h2> Êtes-vous dirigeant majoritaire ? </h2>
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
									<span css="margin-left: 1rem" className="ui__ label">
										{company.isDirigeantMajoritaire ? (
											<Trans key="gérer.entreprise.majoritaire">
												Dirigeant majoritaire
											</Trans>
										) : (
											<Trans key="gérer.entreprise.minoritaire">
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
						<Trans key="gérer.entreprise.changer">
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
						<Trans key="gérer.cta">Renseigner mon entreprise</Trans>
					</button>
				</p>
			)}
		</>
	)
}
