import { resetEntreprise, specifyIfAutoEntrepreneur, specifyIfDirigeantMajoritaire } from 'Actions/existingCompanyActions'
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
				<title>{t('gérer.titre', 'Gérer mon activité')}</title>
			</Helmet>
			<ScrollToTop />
			<Animate.fromBottom>
				<h1>
					<T k="gérer.titre">Gérer mon activité</T>
				</h1>
				<div css="display: flex; align-items: flex-start; justify-content: space-between">
					<div>
						{!company && (
							<p className="ui__ lead">
								<T k="gérer.description">
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
					<h2><T k="gérer.choix.titre">Que souhaitez-vous faire ?</T></h2>
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
							<T k="gérer.choix.revenus">
								<p>
									Calculer mon revenu net
								</p>
								<small>
									Estimez précisément le montant de vos cotisations grâce au
									simulateur {{ régime }} de l’URSSAF
								</small>
							</T>
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
							<T k="gérer.choix.embauche">
								<p>
									Estimer le montant d’une embauche
							</p>
								<small>
									Calculez le montant total que votre entreprise devra dépenser pour
									rémunérer votre prochain employé
							</small>
							</T>
						</Link>
					)}
					<h2><T>Ressources utiles</T></h2>
					<div
						css={`
							display: flex;
							margin-right: -1rem;
							flex-wrap: wrap;
							> * {
								flex: 1;
							}
						`}>
						{!company ?.isAutoEntrepreneur && (
							<Link
								className="ui__ interactive card button-choice lighter-bg"
								to={sitePaths.gérer.embaucher}>
								<T k="gérer.ressources.embaucher">

									<p>Découvrir les démarches d’embauche </p>
									<small>
										La liste des choses à faire pour être sûr de ne rien oublier
										lors de l’embauche d’un nouveau salarié
								</small>
								</T>
							</Link>
						)}
						{company ?.isAutoEntrepreneur && (
							<a
								className="ui__ interactive card button-choice lighter-bg"
								href="https://autoentrepreneur.urssaf.fr">
								<T k="gérer.ressources.autoEntrepreneur">
									<p>Accéder au site officiel auto-entrepreneur</p>
									<small>
										Vous pourrez effectuer votre déclaration de chiffre d'affaire,
										payer vos cotisations, et plus largement trouver toutes les
										informations relatives au statut d'auto-entrepreneur
								</small>
								</T>
							</a>
						)}
						<Link
							className="ui__ interactive card button-choice lighter-bg"
							to={sitePaths.gérer.sécuritéSociale}>
							<T k="gérer.ressources.sécuritéSociale">
								<p>Comprendre la sécurité sociale </p>
								<small>
									A quoi servent les cotisations sociales ? Le point sur le
									système de protection sociale dont bénéficient tous les
									travailleurs en France
							</small>
							</T>
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
				company ?.statutJuridique === 'EI' &&
					company ?.isAutoEntrepreneur == null
			) {
				showAutoEntrepreneurModal(true)
			}
			if (
				company ?.statutJuridique === 'SARL' &&
					company ?.isDirigeantMajoritaire == null
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
						<h2><T k="gérer.entreprise.auto">Êtes-vous auto-entrepreneur ? </T></h2>
						<div className="ui__ answer-group">
							<button
								className="ui__ button"
								onClick={() => handleAnswerAutoEntrepreneur(true)}>
								<T>Oui</T>
							</button>
							<button
								className="ui__ button"
								onClick={() => handleAnswerAutoEntrepreneur(false)}>
								<T>Non</T>
							</button>
						</div>
					</Overlay>
				</>
			)}
			{DirigeantMajoritaireModal && (
				<>
					<ScrollToTop />
					<Overlay>
						<T k="gérer.entreprise.dirigeant">
							<h2> Êtes-vous dirigeant majoritaire ? </h2>
							<p>
								Si vous êtes administrateur majoritaire ou si vous faites partie
								d'un conseil d'administration majoritaire, vous n'aurez pas le
								même régime de sécurité sociale que si vous êtes minoritaire.
							</p>
						</T>
						<div className="ui__ answer-group">
							<button
								className="ui__ button"
								onClick={() => handleAnswerDirigeantMajoritaire(true)}>
								<T>Oui</T>
							</button>
							<button
								className="ui__ button"
								onClick={() => handleAnswerDirigeantMajoritaire(false)}>
								<T>Non</T>
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
											? <T k="gérer.entreprise.majoritaire">Dirigeant majoritaire</T>
											: <T k="gérer.entreprise.minoritaire">Dirigeant minoritaire</T>}
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
						<T k="gérer.entreprise.changer">Changer l'entreprise sélectionnée</T>
					</button>
				</>
			) : (
					<p>
						<button
							onClick={() => showSearchModal(true)}
							className="ui__ plain cta button">
							<T k="gérer.cta">Renseigner mon entreprise</T>
						</button>
					</p>
				)}
		</>
	)
}
