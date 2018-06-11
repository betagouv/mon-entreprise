import React from 'react'
import { findRuleByDottedName } from 'Engine/rules'
import { capitalise0 } from '../../utils'
import { connect } from 'react-redux'
import { Trans, translate } from 'react-i18next'
import {
	flatRulesSelector,
	validatedSituationSelector
} from 'Selectors/analyseSelectors'
import { stepAction } from '../../actions'

@translate()
@connect(
	state => ({
		themeColours: state.themeColours,
		flatRules: flatRulesSelector(state),
		situation: validatedSituationSelector(state)
	}),
	dispatch => ({
		stepAction: (name, step, source) => dispatch(stepAction(name, step, source))
	})
)
export default class FoldedStep extends React.Component {
	render() {
		let {
			stepAction,
			themeColours,
			dottedName,
			flatRules,
			t,
			situation
		} = this.props
		let { title } = findRuleByDottedName(flatRules, dottedName),
			answer = situation[dottedName],
			eventualEnumAnswerRule = findRuleByDottedName(
				flatRules,
				dottedName + ' . ' + answer
			),
			translatedAnswer =
				(eventualEnumAnswerRule && eventualEnumAnswerRule.title) || t(answer)

		return (
			<div className="foldedQuestion">
				<span className="borderWrapper">
					<span className="title">{capitalise0(title)}</span>
					<span className="answer">{translatedAnswer}</span>
				</span>
				<button
					className="edit"
					onClick={() => stepAction('unfold', dottedName, 'unfold')}
					style={{ color: themeColours.textColourOnWhite }}>
					<i className="fa fa-pencil" aria-hidden="true" />
					{'  '}
					<span>
						<Trans>Modifier</Trans>
					</span>
				</button>
			</div>
		)
	}
}
