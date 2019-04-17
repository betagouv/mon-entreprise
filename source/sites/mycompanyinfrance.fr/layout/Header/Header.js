/* @flow */

import { React, T } from 'Components'
import withSitePaths from 'Components/utils/withSitePaths'
import withTracker from 'Components/utils/withTracker'
import { compose } from 'ramda'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { NavLink } from 'react-router-dom'
import { régimeSelector } from 'Selectors/companyStatusSelectors'
import companySvg from '../../images/company.svg'
import estimateSvg from '../../images/estimate.svg'
import hiringSvg from '../../images/hiring.svg'
import './Header.css'

import type { Tracker } from 'Components/utils/withTracker'

type OwnProps = {}
type Props = OwnProps & {
	showHiring: boolean,
	tracker: Tracker,
	sitePaths: Object
}
const StepsHeader = ({ showHiring, tracker, sitePaths }: Props) => (
	<header className="steps-header">
		<nav className="ui__ container">
			<NavLink
				to={sitePaths.entreprise.index}
				activeClassName="active"
				onClick={() =>
					tracker.push(['trackEvent', 'Header', 'click', 'Your company'])
				}>
				<img src={companySvg} />
				<div>
					<T>Votre entreprise</T>
				</div>
			</NavLink>
			<NavLink
				to={sitePaths.sécuritéSociale.index}
				activeClassName="active"
				onClick={() =>
					tracker.push(['trackEvent', 'Header', 'click', 'Social security'])
				}>
				<img src={estimateSvg} />
				<div>
					<T>Protection sociale</T>
				</div>
			</NavLink>
			{showHiring && (
				<NavLink
					to={sitePaths.démarcheEmbauche.index}
					activeClassName="active"
					onClick={() =>
						tracker.push(['trackEvent', 'Header', 'click', 'Hiring process'])
					}>
					<img src={hiringSvg} />
					<div>
						<T>Embauche</T>
					</div>
				</NavLink>
			)}
		</nav>
	</header>
)

export default (compose(
	withTracker,
	withRouter,
	connect(
		state => ({ showHiring: régimeSelector(state) !== 'auto-entrepreneur' }),
		{}
	),
	withTranslation(),
	withSitePaths
)(StepsHeader): React$ComponentType<OwnProps>)
