import { explainVariable } from 'Actions/actions'
import classNames from 'classnames'
import { findRuleByDottedName } from 'Engine/rules'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import { DottedName } from 'Types/rule'
import { TrackerContext } from '../utils/withTracker'
import './Explicable.css'

export default function Explicable({ dottedName }: { dottedName: DottedName }) {
	const tracker = useContext(TrackerContext)
	const dispatch = useDispatch()
	const explained = useSelector((state: RootState) => state.explainedVariable)
	const flatRules = useSelector(flatRulesSelector)

	// Rien à expliquer ici, ce n'est pas une règle
	if (dottedName == null) return null

	let rule = findRuleByDottedName(flatRules, dottedName)

	if (rule.description == null) return null

	//TODO montrer les variables de type 'une possibilité'

	return dottedName === explained ? null : (
		<span
			className={classNames('explicable', {
				explained: dottedName === explained
			})}
		>
			<span
				className="icon"
				onClick={e => {
					tracker?.push(['trackEvent', 'help', dottedName])
					dispatch(explainVariable(dottedName))
					e.preventDefault()
					e.stopPropagation()
				}}
			>
				{emoji('ℹ️')}
			</span>
		</span>
	)
}
