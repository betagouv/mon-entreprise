import { findRuleByDottedName } from 'Engine/rules'
import { compose } from 'ramda'
import React from 'react'
import { Trans, withI18n } from 'react-i18next'
import { connect } from 'react-redux'
import {
	flatRulesSelector,
	validatedSituationSelector
} from 'Selectors/analyseSelectors'
import { LinkButton } from 'Ui/Button'
import { capitalise0 } from '../../utils'

export default compose(
	withI18n(),
	connect(
		state => ({
			flatRules: flatRulesSelector(state),
			situation: validatedSituationSelector(state)
		}),
		dispatch => ({
			stepAction: (name, step, source) =>
				dispatch({ type: 'STEP_ACTION', name, step, source })
		})
	)
)(
	class FoldedStep extends React.Component {
		render() {
			let { stepAction, dottedName, flatRules, t, situation } = this.props
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
					<LinkButton
						onClick={() => stepAction('unfold', dottedName, 'unfold')}>
						<i className="fa fa-pencil" aria-hidden="true" />
						<Trans>Modifier</Trans>
					</LinkButton>
				</div>
			)
		}
	}
)
