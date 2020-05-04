import { explainVariable } from 'Actions/actions'
import Animate from 'Components/ui/animate'
import { Markdown } from 'Components/utils/markdown'
import { findRuleByDottedName } from 'Engine/rules'
import React from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import References from '../rule/References'
import './Aide.css'

export default function Aide() {
	const explained = useSelector((state: RootState) => state.explainedVariable)
	const flatRules = useSelector(flatRulesSelector)
	const dispatch = useDispatch()

	const stopExplaining = () => dispatch(explainVariable())

	if (!explained) return <section id="helpWrapper" />

	let rule = findRuleByDottedName(flatRules, explained),
		text = rule.description,
		refs = rule.références

	return (
		<Animate.fromTop>
			<div
				className="controlText ui__ card"
				css="padding: 0.6rem 0; flex: 1; margin-bottom: 1rem"
			>
				<h4>{rule.title}</h4>
				<p>
					<Markdown source={text} />
				</p>
				{refs && (
					<div>
						<References refs={refs} />
					</div>
				)}
				<button className="hide" aria-label="close" onClick={stopExplaining}>
					×
				</button>
			</div>
		</Animate.fromTop>
	)
}
