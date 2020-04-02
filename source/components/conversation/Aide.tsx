import { explainVariable } from 'Actions/actions'
import Overlay from 'Components/Overlay'
import { Markdown } from 'Components/utils/markdown'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import { parsedRulesSelector } from 'Selectors/analyseSelectors'
import References from '../rule/References'
import './Aide.css'

export default function Aide() {
	const explained = useSelector((state: RootState) => state.explainedVariable)
	const rules = useSelector(parsedRulesSelector)
	const dispatch = useDispatch()

	const stopExplaining = () => dispatch(explainVariable())

	if (!explained) return null

	let rule = rules[explained],
		text = rule.description,
		refs = rule.références

	return (
		<Overlay onClose={stopExplaining}>
			<div
				css={`
					padding: 0.6rem;
				`}
			>
				<h2>{rule.title}</h2>
				<p>
					<Markdown source={text} />
				</p>
				{refs && (
					<div>
						<References refs={refs} />
					</div>
				)}
			</div>
		</Overlay>
	)
}
