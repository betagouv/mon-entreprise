import { useContext } from 'react'
import {
	EngineContext,
	RegisterEngineContext,
	SituationMetaContext,
} from '../contexts'
import Explanation from '../Explanation'
import { RuleLinkWithContext } from '../RuleLink'
import { Mecanism } from './common'

export default function Recalcul({ nodeValue, explanation, unit }) {
	const engine = useContext(EngineContext)
	if (!engine) {
		throw new Error()
	}
	useContext(RegisterEngineContext)(
		engine.shallowCopy().setSituation(explanation.parsedSituation)
	)
	return (
		<Mecanism name="recalcul" value={nodeValue} unit={unit}>
			<>
				{explanation.recalcul && (
					<EngineContext.Provider value={explanation.engine}>
						<SituationMetaContext.Provider
							value={{
								name: 'Mécanisme recalcul',
							}}
						>
							Recalcul de la valeur de{' '}
							<Explanation node={explanation.recalcul} /> avec la situation
							suivante :
						</SituationMetaContext.Provider>
					</EngineContext.Provider>
				)}
				<ul>
					{explanation.amendedSituation.map(([origin, replacement]) => (
						<li key={origin.dottedName}>
							<RuleLinkWithContext dottedName={origin.dottedName} /> ={' '}
							<Explanation node={replacement} />
						</li>
					))}
				</ul>
			</>
		</Mecanism>
	)
}
