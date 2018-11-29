/* @flow */

import { Component, React, T } from 'Components'
import { ScrollToTop } from 'Components/utils/Scroll'
import withLanguage from 'Components/utils/withLanguage'
import { compose } from 'ramda'
import Helmet from 'react-helmet'
import { withNamespaces } from 'react-i18next'
import { Link } from 'react-router-dom'
import * as Animate from 'Ui/animate'
import sitePaths from '../../sitePaths'
import Video from './Video'
import type { Match, Location } from 'react-router'
import type { TFunction } from 'react-i18next'

type Props = {
	match: Match,
	location: Location,
	t: TFunction,
	language: string
}
class SocialSecurity extends Component<Props, {}> {
	render() {
		return (
			<>
				<Helmet>
					<title>
						{this.props.t(
							'sécu.page.titre',
							"Sécurité sociale et coût d'embauche"
						)}
					</title>
					<meta
						name="description"
						content={this.props.t('sécu.page.description')}
					/>
				</Helmet>
				<ScrollToTop />
				<Animate.fromBottom>
					{this.props.match.isExact && (
						<>
							<T k="sécu.content">
								<h1>Protection sociale : coûts et avantages</h1>
								<p>
									La France a choisi d'offrir à ses citoyens une protection
									sociale de qualité. Ce système obligatoire repose sur la
									solidarité et vise à assurer le{' '}
									<strong>bien-être général de la population</strong>.
								</p>
								<p>
									L'accès facile aux soins de santé et à d'autres services
									permet aux entreprises d'employer des travailleurs en bonne
									santé, productifs et hautement qualifiés.
								</p>
								<Video />
							</T>
							<h2>Que voulez-vous estimer ?</h2>

							<p>
								<T k="sécu.simulation.intro">
									Le dirigeant de l'entreprise et les salariés n'ont pas la même
									protection sociale.
								</T>
							</p>
							<div className="ui__ answer-group">
								<Link
									className="ui__ button"
									to={sitePaths().sécuritéSociale['assimilé-salarié']}>
									<T>La rémunération du dirigeant</T>
								</Link>
								<Link
									className="ui__ button"
									to={sitePaths().sécuritéSociale.salarié}>
									<T>Le salaire de l'employé</T>
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
	withLanguage
)(SocialSecurity)
