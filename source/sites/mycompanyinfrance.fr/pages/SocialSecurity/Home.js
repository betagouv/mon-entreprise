/* @flow */

import { Component, React, T } from 'Components'
import { ScrollToTop } from 'Components/utils/Scroll'
import withLanguage from 'Components/utils/withLanguage'
import withSitePaths from 'Components/utils/withSitePaths'
import { compose } from 'ramda'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { régimeSelector } from 'Selectors/companyStatusSelectors'
import * as Animate from 'Ui/animate'
import Video from './Video'

import type { Match, Location } from 'react-router'
import type { TFunction } from 'react-i18next'

type Props = {
	match: Match,
	location: Location,
	t: TFunction,
	showFindYourCompanyLink: boolean,
	legalStatus: string,
	régime: 'indépendant' | 'assimilé-salarié' | 'auto-entrepreneur' | null,
	sitePaths: Object,
	language: string
}
class SocialSecurity extends Component<Props, {}> {
	render() {
		const {
			t,
			match,
			régime,
			sitePaths,
			showFindYourCompanyLink,
			legalStatus
		} = this.props
		return (
			<>
				<Helmet>
					<title>
						{t('sécu.page.titre', "Sécurité sociale et coût d'embauche")}
					</title>
					<meta name="description" content={t('sécu.page.description')} />
				</Helmet>
				<ScrollToTop />

				{match.isExact && (
					<Animate.fromBottom>
						<T k="sécu.content">
							<h1>Protection sociale </h1>
							<p>
								En France, tous les travailleurs bénéficient d'une protection
								sociale de qualité. Ce système obligatoire repose sur la
								solidarité et vise à assurer le{' '}
								<strong>bien-être général de la population</strong>.
							</p>
							<p>
								En contrepartie du paiement de{' '}
								<strong>contributions sociales</strong>, le cotisant est couvert
								sur la maladie, les accidents du travail, chômage ou encore la
								retraite.
							</p>
						</T>
						{showFindYourCompanyLink && (
							<>
								<h2>
									<T>Simulations personnalisées</T>
								</h2>
								<p>
									<T k="sécu.entrepriseCrée">
										Si vous possédez déjà une entreprise, nous pouvons{' '}
										<strong>automatiquement personnaliser</strong> vos
										simulations à votre situation.
									</T>
								</p>
								<div style={{ textAlign: 'center' }}>
									<Link
										to={sitePaths.entreprise.trouver}
										className="ui__ button plain">
										<T>Renseigner mon entreprise</T>
									</Link>
								</div>
							</>
						)}
						{régime === 'auto-entrepreneur' ? (
							<Link
								className="ui__ button-choice "
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
									className="ui__ button-choice "
									to={
										régime
											? sitePaths.sécuritéSociale[régime]
											: sitePaths.sécuritéSociale.selection
									}>
									{emoji('💰')}{' '}
									{legalStatus
										? t(
												[
													'sécu.choix.dirigeant1',
													`Votre rémunération en tant que dirigeant de {{legalStatus}}`
												],
												{ legalStatus: t(legalStatus) }
										  )
										: t(
												'sécu.choix.dirigeant2',
												`La rémunération du dirigeant`
										  )}
								</Link>
								<Link
									className="ui__ button-choice "
									to={sitePaths.sécuritéSociale.salarié}>
									{emoji('👥')}{' '}
									<T k="sécu.choix.employé">Le salaire d'un employé</T>
								</Link>
								<br />
							</>
						)}
						<Video />
					</Animate.fromBottom>
				)}
			</>
		)
	}
}

export default compose(
	withTranslation(),
	withLanguage,
	withSitePaths,
	connect(state => ({
		régime: régimeSelector(state),
		legalStatus: state.inFranceApp.companyStatusChoice,
		showFindYourCompanyLink:
			!state.inFranceApp.existingCompanyDetails &&
			!Object.keys(state.inFranceApp.companyLegalStatus).length &&
			!state.inFranceApp.companyStatusChoice
	}))
)(SocialSecurity)
