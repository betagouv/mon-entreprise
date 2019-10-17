import {
	resetEntreprise,
	specifyIfAutoEntrepreneur,
	specifyIfDirigeantMajoritaire
} from 'Actions/existingCompanyActions'
import { React, T } from 'Components'
import CompanyDetails from 'Components/CompanyDetails'
import FindCompany from 'Components/FindCompany'
import Overlay from 'Components/Overlay'
import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import { useContext, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import * as Animate from 'Ui/animate'
import businessPlan from './businessPlan.svg'

const infereRégimeFromCompanyDetails = company => {
	if (!company) {
		return null
	}
	if (company.isAutoEntrepreneur) {
		return 'auto-entrepreneur'
	}
	if (
		['EI', 'EURL'].includes(company.statutJuridique) ||
		(company.statutJuridique === 'SARL' && company.isDirigeantMajoritaire)
	) {
		return 'indépendant'
	}

	if (
		['SASU', 'SAS'].includes(company.statutJuridique) ||
		(company.statutJuridique === 'SARL' && !company.isDirigeantMajoritaire)
	) {
		return 'assimilé-salarié'
	}

	return null
}

export default function SocialSecurity() {
	const { t } = useTranslation()
	const company = useSelector(state => state.inFranceApp.existingCompany)
	const sitePaths = useContext(SitePathsContext)
	const régime = infereRégimeFromCompanyDetails(company)

	return (
		<>
			<Helmet>
				<title>{t('gérer.index.page.titre', 'Gérer mon activité')}</title>
			</Helmet>
			<ScrollToTop />
			<Animate.fromBottom>
				<h1>
					<T k="gérer.index.page.titre">Gérer mon activité</T>
				</h1>
				<div css="display: flex; align-items: flex-start; justify-content: space-between">
					<div>
						{!company && (
							<p className="ui__ lead">
								<T k="gérer.index.content.entreprise">
									Vous souhaitez vous verser un revenu ou embaucher ? <br />
									Vous aurez à payer des cotisations et des impôts. <br />
									Anticipez leurs montants grâce aux simulateurs adaptés à votre
									situation.
								</T>
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
					<h2>Que souhaitez-vous faire ? </h2>
					{!!régime && (
						<Link
							className="ui__ interactive card button-choice lighter-bg"
							css="width: 100%"
							to={{
								pathname: sitePaths.simulateurs[régime],
								state: {
									fromGérer: true
								}
							}}>
							<p>
								<T k="sécu.choix.dirigeant2">Calculer mon revenu net</T>
							</p>
							<small>
								Estimez précisément le montant de vos cotisations grâce au
								simulateur {régime} de l’URSSAF
							</small>
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
							}}>
							<p>
								<T k="sécu.choix.employé">Estimer le montant d’une embauche</T>
							</p>
							<small>
								Découvrez le montant total dépensé par l’entreprise pour
								rémunérer votre prochain employé
							</small>
						</Link>
					)}
					<h2>Ressources utiles</h2>
					<div
						css={`
							display: flex;
							margin-right: -1rem;
							> * {
								flex: 1;
							}
						`}>
						{!company?.isAutoEntrepreneur && (
							<Link
								className="ui__ interactive card button-choice lighter-bg"
								to={sitePaths.gérer.embaucher}>
								<p>Découvrir les démarches d’embauche </p>
								<small>
									La liste des choses à faire pour être sûr de ne rien oublier
									lors de l’embauche d’un nouveau salarié
								</small>
							</Link>
						)}
						{company?.isAutoEntrepreneur && (
							<a
								className="ui__ interactive card button-choice lighter-bg"
								href="https://autoentrepreneur.urssaf.fr">
								<p>Accéder au site officiel auto-entrepreneur</p>
								<small>
									Vous pourrez effectuer votre déclaration de chiffre d'affaire,
									payer vos cotisations, et plus largement trouver toutes les
									informations relatives au statut d'auto-entrepreneur
								</small>
							</a>
						)}
						<Link
							className="ui__ interactive card button-choice lighter-bg"
							to={sitePaths.gérer.sécuritéSociale}>
							<p>Comprendre la sécurité sociale </p>
							<small>
								A quoi servent les cotisations sociales ? Le point sur le
								système de protection sociale dont bénéficient touts les
								travailleurs en France
							</small>
						</Link>
					</div>
				</>
			</Animate.fromBottom>
		</>
	)
}

const CompanySection = ({ company }) => {
	const [searchModal, showSearchModal] = useState(false)
	const [autoEntrepreneurModal, showAutoEntrepreneurModal] = useState(false)
	const [DirigeantMajoritaireModal, showDirigeantMajoritaireModal] = useState(
		false
	)

	const companyRef = useRef(null)
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

	const dispatch = useDispatch(company)
	const handleAnswerAutoEntrepreneur = isAutoEntrepreneur => {
		dispatch(specifyIfAutoEntrepreneur(isAutoEntrepreneur))
		showAutoEntrepreneurModal(false)
	}
	const handleAnswerDirigeantMajoritaire = DirigeantMajoritaire => {
		dispatch(specifyIfDirigeantMajoritaire(DirigeantMajoritaire))
		showDirigeantMajoritaireModal(false)
	}

	return (
		<>
			{autoEntrepreneurModal && (
				<>
					<ScrollToTop />
					<Overlay>
						<h2> Êtes-vous auto-entrepreneur ? </h2>
						<div className="ui__ answer-group">
							<button
								className="ui__ button"
								onClick={() => handleAnswerAutoEntrepreneur(true)}>
								Oui
							</button>
							<button
								className="ui__ button"
								onClick={() => handleAnswerAutoEntrepreneur(false)}>
								Non
							</button>
						</div>
					</Overlay>
				</>
			)}
			{DirigeantMajoritaireModal && (
				<>
					<ScrollToTop />
					<Overlay>
						<h2> Êtes-vous dirigeant majoritaire ? </h2>
						<p>
							Si vous êtes administrateur majoritaire ou si vous faites partie
							d'un conseil d'administration majoritaire, vous n'aurez pas le
							même statut que si vous êtes minoritaire.
						</p>
						<div className="ui__ answer-group">
							<button
								className="ui__ button"
								onClick={() => handleAnswerDirigeantMajoritaire(true)}>
								Oui
							</button>
							<button
								className="ui__ button"
								onClick={() => handleAnswerDirigeantMajoritaire(false)}>
								Non
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
										{company.isDirigeantMajoritaire
											? 'Dirigeant majoritaire'
											: 'Dirigeant minoritaire'}
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
						}}>
						<T>Changer l'entreprise sélectionnée</T>
					</button>
				</>
			) : (
				<p>
					<button
						onClick={() => showSearchModal(true)}
						className="ui__ plain cta button">
						<T>Renseigner mon entreprise</T>
					</button>
				</p>
			)}
		</>
	)
}
