/* @flow */

import {
	resetEntreprise,
	specifyIfAutoEntrepreneur
} from 'Actions/existingCompanyActions'
import { React, T } from 'Components'
import CompanyDetails from 'Components/CompanyDetails'
import FindCompany from 'Components/FindCompany'
import Overlay from 'Components/Overlay'
import { ScrollToTop } from 'Components/utils/Scroll'
import withSitePaths from 'Components/utils/withSitePaths'
import { useEffect, useRef, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import * as Animate from 'Ui/animate'
import Video from './Video'

import type { Match, Location } from 'react-router'

const infereRégimeFromCompanyDetails = (
	company
): 'indépendant' | 'assimilé-salarié' | 'auto-entrepreneur' | null => {
	if (!company) {
		return null
	}
	if (company.isAutoEntrepreneur) {
		return 'auto-entrepreneur'
	}
	if (['EI', 'EURL'].includes(company.statutJuridique)) {
		return 'indépendant'
	}

	if (['SASU', 'SAS'].includes(company.statutJuridique)) {
		return 'assimilé-salarié'
	}

	return null
}

type Props = {
	match: Match,
	location: Location,
	showFindYourCompanyLink: boolean,
	legalStatus: string,
	régime: 'indépendant' | 'assimilé-salarié' | 'auto-entrepreneur' | null,
	sitePaths: Object
}

function SocialSecurity({ sitePaths }: Props) {
	const { t } = useTranslation()
	const company = useSelector(state => state.inFranceApp.existingCompany)
	const régime = infereRégimeFromCompanyDetails(company)

	return (
		<>
			<Helmet>
				<title>
					{t('sécu.page.titre', "Sécurité sociale et coût d'embauche")}
				</title>
				<meta name="description" content={t('sécu.page.description')} />
			</Helmet>
			<ScrollToTop />

			<Animate.fromBottom>
				<T k="sécu.content">
					<h1>Protection sociale </h1>
					<p>
						En France, tous les travailleurs bénéficient d'une protection
						sociale de qualité. Ce système obligatoire repose sur la solidarité
						et vise à assurer le{' '}
						<strong>bien-être général de la population</strong>.
					</p>
					<p>
						En contrepartie du paiement de{' '}
						<strong>contributions sociales</strong>, le cotisant est couvert sur
						la maladie, les accidents du travail, chômage ou encore la retraite.
					</p>
				</T>
				<CompanySection company={company} />

				<section
					style={{ marginTop: '2rem' }}
					className="ui__ full-width light-bg">
					<div className="ui__ container">
						{régime === 'auto-entrepreneur' ? (
							<Link
								className="ui__ interactive card button-choice "
								to={sitePaths.sécuritéSociale['auto-entrepreneur']}>
								{emoji('🚶')}{' '}
								<T k="sécu.choix.auto-entrepreneur">
									Estimer ma rémunération en tant qu'auto-entrepreneur
								</T>
							</Link>
						) : (
							<>
								<h2>
									<T k="sécu.choix.titre">Que souhaitez-vous estimer ?</T>
								</h2>
								<Link
									className="ui__ interactive card button-choice "
									to={
										régime
											? sitePaths.sécuritéSociale[régime]
											: sitePaths.sécuritéSociale.selection
									}>
									{emoji('💰')}{' '}
									{company?.statutJuridique &&
									company.statutJuridique !== 'NON_IMPLÉMENTÉ'
										? t(
												[
													'sécu.choix.dirigeant1',
													`Mon revenu en tant que dirigeant de {{legalStatus}}`
												],
												{ legalStatus: t(company.statutJuridique) }
										  )
										: t(
												'sécu.choix.dirigeant2',
												`Mon revenu en tant que chef d'entreprise`
										  )}
								</Link>
								<Link
									className="ui__ interactive card button-choice "
									to={sitePaths.sécuritéSociale.salarié}>
									{emoji('👥')}{' '}
									<T k="sécu.choix.employé">Le salaire d'un employé</T>
								</Link>
							</>
						)}
					</div>
				</section>
				<section style={{ marginTop: '2rem' }}>
					<Video />
				</section>
			</Animate.fromBottom>
		</>
	)
}

const CompanySection = ({ company }) => {
	const [searchModal, showSearchModal] = useState(false)
	const [autoEntrepreneurModal, showAutoEntrepreneurModal] = useState(false)

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
		}
	}, [company, searchModal])

	const dispatch = useDispatch(company)
	const handleAnswerAutoEntrepreneur = isAutoEntrepreneur => {
		dispatch(specifyIfAutoEntrepreneur(isAutoEntrepreneur))
		showAutoEntrepreneurModal(false)
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
					<h2>
						<T>Votre entreprise</T>
					</h2>
					<CompanyDetails siren={company.siren} />
					<br />
					<button
						className="ui__ simple small button"
						onClick={() => {
							dispatch(resetEntreprise())
							showSearchModal(true)
						}}>
						<T>Changer</T>
					</button>
				</>
			) : (
				<>
					<h2>
						<T>Simulations personnalisées</T>
					</h2>
					<p>
						<T k="sécu.entrepriseCrée">
							Si vous possédez déjà une entreprise, nous pouvons{' '}
							<strong>automatiquement personnaliser</strong> vos simulations à
							votre situation.
						</T>
					</p>
					<div style={{ textAlign: 'center' }}>
						<button
							onClick={() => showSearchModal(true)}
							className="ui__ button plain">
							<T>Renseigner mon entreprise</T>
						</button>
					</div>
				</>
			)}
		</>
	)
}

export default withSitePaths(SocialSecurity)
