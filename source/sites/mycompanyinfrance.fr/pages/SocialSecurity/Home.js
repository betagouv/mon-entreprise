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
	régime: 'indépendant' | 'assimilé-salarié' | 'auto-entrepreneur' | null,
	sitePaths: Object,
	language: string
}
class SocialSecurity extends Component<Props, {}> {
	render() {
		const { t, match, régime, sitePaths, showFindYourCompanyLink } = this.props
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
							<h1>Protection sociale : coûts et avantages</h1>
							<p>
								La France a choisi d'offrir à ses citoyens une protection
								sociale de qualité. Ce système obligatoire repose sur la
								solidarité et vise à assurer le{' '}
								<strong>bien-être général de la population</strong>.
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
						{!['mycompanyinfrance.fr', 'mon-entreprise.fr'].includes(
							window.location.hostname
						) ? (
							régime === 'auto-entrepreneur' ? (
								<Link
									className="landing__choice "
									to={sitePaths.sécuritéSociale['auto-entrepreneur']}>
									{emoji('💶')} Estimer ma rémunération en tant
									qu'auto-entrepreneur
								</Link>
							) : (
								<>
									<h2>Que souhaitez-vous estimer ?</h2>
									<Link
										className="landing__choice "
										to={
											régime
												? sitePaths.sécuritéSociale[régime]
												: sitePaths.sécuritéSociale.comparaison
										}>
										{emoji('👔')} Votre rémunération en tant que dirigeant
									</Link>
									<Link
										className="landing__choice "
										to={sitePaths.sécuritéSociale.salarié}>
										{emoji('👥')} Le salaire d'un employé
									</Link>
									<br />
								</>
							)
						) : (
							<Link
								className="landing__choice "
								to={sitePaths.sécuritéSociale.salarié}>
								{emoji('👥')}{' '}
								<T>Estimer les cotisations sociales pour une embauche</T>
							</Link>
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
		showFindYourCompanyLink:
			!state.inFranceApp.existingCompanyDetails &&
			!Object.keys(state.inFranceApp.companyLegalStatus).length &&
			!state.inFranceApp.companyStatusChoice
	}))
)(SocialSecurity)
