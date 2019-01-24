/* @flow */

import { Component, React, T } from 'Components'
import { ScrollToTop } from 'Components/utils/Scroll'
import withLanguage from 'Components/utils/withLanguage'
import withSitePaths from 'Components/utils/withSitePaths'
import { compose } from 'ramda'
import emoji from 'react-easy-emoji'
import Helmet from 'react-helmet'
import { withNamespaces } from 'react-i18next'
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
	régime: 'indépendant' | 'assimilé-salarié' | 'micro-entreprise' | null,
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
							<p>
								Si vous possédez déjà une entreprise, nous pouvons
								<strong>automatiquement personnaliser</strong> vos simulations à
								votre situation. Il vous suffit juste de{' '}
								<Link to={sitePaths.entreprise.trouver}>
									renseigner le nom de votre entreprise.
								</Link>
							</p>
						)}
						<br />
						<h2 style={{ textAlign: 'center' }}>
							{emoji('🧭')} Que souhaitez vous estimer ?
						</h2>
						<Link
							className="landing__choice "
							to={
								régime
									? sitePaths.sécuritéSociale[régime]
									: sitePaths.sécuritéSociale.comparaison
							}>
							{emoji('👔')} La rémunération du dirigeant
						</Link>
						<Link
							className="landing__choice "
							to={sitePaths.sécuritéSociale.salarié}>
							{emoji('👥')} Le salaire d'un employé
						</Link>
						<br />
						<Video />
					</Animate.fromBottom>
				)}
			</>
		)
	}
}

export default compose(
	withNamespaces(),
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
