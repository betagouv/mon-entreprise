/* @flow */

import { Component, React, T } from 'Components'
import { ScrollToTop } from 'Components/utils/Scroll'
import withLanguage from 'Components/utils/withLanguage'
import withSitePaths from 'Components/utils/withSitePaths'
import { compose } from 'ramda'
import Helmet from 'react-helmet'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { régimeSelector } from 'Selectors/companyStatusSelectors'
import * as Animate from 'Ui/animate'
import Video from './Video'

import type { Match, Location } from 'react-router'
import type { TFunction } from 'react-i18next'
import emoji from 'react-easy-emoji'

type Props = {
	match: Match,
	location: Location,
	t: TFunction,
	régime: 'indépendant' | 'assimilé-salarié' | 'micro-entreprise' | null,
	sitePaths: Object,
	language: string
}
class SocialSecurity extends Component<Props, {}> {
	render() {
		const { t, match, régime, sitePaths } = this.props
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
					{match.isExact && (
						<>
							<T k="sécu.content">
								<h1>Protection sociale : coûts et avantages</h1>
								<p>
									La France a choisi d'offrir à ses citoyens une protection
									sociale de qualité. Ce système obligatoire repose sur la
									solidarité et vise à assurer le{' '}
									<strong>bien-être général de la population</strong>.
								</p>
							</T>
							<Video />
							<p>
								<T k="sécu.simulation.intro">
									Le dirigeant de l'entreprise et les salariés n'ont pas la même
									protection sociale.
								</T>
							</p>
							<h2>Que souhaitez-vous estimer ?</h2>
							<div>
								<Link
									className="ui__ button"
									to={
										régime
											? sitePaths.sécuritéSociale[régime]
											: sitePaths.sécuritéSociale.comparaison
									}>
									{emoji('👔 ')}
									<T>La rémunération du dirigeant</T>
								</Link>
								<Link
									className="ui__ button"
									to={sitePaths.sécuritéSociale.salarié}>
									{emoji('👥 ')}
									<T>Le salaire d'un employé</T>
								</Link>
							</div>
						</>
					)}
				</Animate.fromBottom>
			</>
		)
	}
}

export default compose(
	withNamespaces(),
	withLanguage,
	withSitePaths,
	connect(state => ({
		régime: régimeSelector(state)
	}))
)(SocialSecurity)
