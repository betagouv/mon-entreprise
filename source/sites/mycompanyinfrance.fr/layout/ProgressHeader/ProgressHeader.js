/* @flow */

import { React, T } from 'Components'
import withSitePaths from 'Components/utils/withSitePaths'
import withTracker from 'Components/utils/withTracker'
import { compose } from 'ramda'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import selectors from 'Selectors/progressSelectors'
import companySvg from '../../images/company.svg'
import estimateSvg from '../../images/estimate.svg'
import hiringSvg from '../../images/hiring.svg'
import './ProgressHeader.css'

import type { Tracker } from 'Components/utils/withTracker'

const Progress = ({ percent }) => (
	<div className="progress">
		<div
			className="bar"
			style={{
				width: `${percent}%`
			}}
		/>
	</div>
)
type Props = {
	companyProgress: number,
	estimationProgress: number,
	hiringProgress: number,
	tracker: Tracker,
	sitePaths: Object
}
const StepsHeader = ({
	companyProgress,
	estimationProgress,
	hiringProgress,
	tracker,
	sitePaths
}: Props) => (
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
				<Progress percent={companyProgress} />
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

				<Progress percent={estimationProgress} />
			</NavLink>
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

				<Progress percent={hiringProgress} />
			</NavLink>
		</nav>
	</header>
)

export default compose(
	withRouter,
	withTracker,
	connect(
		selectors,
		{}
	),
	withNamespaces(),
	withSitePaths
)(StepsHeader)
