import { buildFlatRules } from 'Engine/rules'
import { safeLoad } from 'js-yaml'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import { setSimulationConfig } from '../../actions/actions'

let initialInput = `
a: 
  formule: 10
b: 
  formule: a + 18
`

export default function Yo() {
	const [ready, setReady] = useState(false)
	const dispatch = useDispatch()
	const stateConfig = useSelector(state => state.simulation?.config)
	useEffect(() => {
		dispatch({
			type: 'SET_RULES',
			rules: buildFlatRules(safeLoad(initialInput))
		})
		dispatch(setSimulationConfig({ objectifs: ['b'] }))
		setReady(true)
	}, [])
	return (
		<div>
			Saissez des formules
			{ready && <Results />}
		</div>
	)
}
export const Results = () => {
	const analysis = useSelector(state => analysisWithDefaultsSelector(state))
	return <div>{analysis.targets[0].nodeValue}</div>
}
