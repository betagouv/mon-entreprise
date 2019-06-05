/* @flow */
import { goToQuestion } from 'Actions/actions'
import withLanguage from 'Components/utils/withLanguage'
import { compose, toPairs } from 'ramda'
import React from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { animated, Spring } from 'react-spring'
import type { Location } from 'react-router'

type OwnProps = {
	quickLinks: { [string]: string }
}
type Props = OwnProps & {
	goToQuestion: string => void,
	location: Location,
	show: boolean
}

const QuickLinks = ({ goToQuestion, show, quickLinks }: Props) => {
	return (
		<Spring
			to={{
				height: show ? 'auto' : 0,
				opacity: show ? 1 : 0
			}}
			native>
			{styles => (
				<animated.div
					className="ui__ answer-group"
					style={{
						...styles,
						display: 'flex',
						overflow: 'hidden',
						flexWrap: 'wrap-reverse',
						fontSize: '110%',
						justifyContent: 'space-evenly',
						marginBottom: '1rem'
					}}>
					{toPairs(quickLinks).map(([label, dottedName]) => (
						<button
							key={label}
							className="ui__ small button"
							onClick={() => goToQuestion(dottedName)}>
							<Trans>{label}</Trans>
						</button>
					))}
				</animated.div>
			)}
		</Spring>
	)
}

export default (compose(
	withLanguage,
	withRouter,
	connect(
		(state, props) => ({
			key: props.language,
			quickLinks: state.simulation?.config["questions à l'affiche"]
		}),
		{
			goToQuestion
		}
	)
)(QuickLinks): React$ComponentType<OwnProps>)
