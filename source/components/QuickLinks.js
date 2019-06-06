/* @flow */
import { goToQuestion } from 'Actions/actions'
import withLanguage from 'Components/utils/withLanguage'
import { compose, contains, reject, toPairs } from 'ramda'
import React from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import type { Location } from 'react-router'

type OwnProps = {
	quickLinks: { [string]: string }
}
type Props = OwnProps & {
	goToQuestion: string => void,
	location: Location,
	quickLinksToHide: Array<string>,
	show: boolean
}

const QuickLinks = ({ goToQuestion, quickLinks, quickLinksToHide }: Props) => {
	if (!quickLinks) {
		return null
	}
	const links = compose(
		toPairs,
		reject(dottedName => contains(dottedName, quickLinksToHide))
	)(quickLinks)
	return (
		<span>
			<small>Autres questions : </small>
			{links.map(([label, dottedName]) => (
				<>
					<button
						key={dottedName}
						className="ui__ link-button"
						onClick={() => goToQuestion(dottedName)}>
						<Trans>{label}</Trans>
					</button>{' '}
					/{' '}
				</>
			))}{' '}
			{/* <button className="ui__ link-button">Voir la liste</button> */}
		</span>
	)
}

export default (compose(
	withLanguage,
	withRouter,
	connect(
		(state, props) => ({
			key: props.language,
			quickLinks: state.simulation?.config["questions à l'affiche"],
			quickLinksToHide: [
				...state.conversationSteps.foldedSteps,
				state.conversationSteps.unfoldedStep
			]
		}),
		{
			goToQuestion
		}
	)
)(QuickLinks): React$ComponentType<OwnProps>)
