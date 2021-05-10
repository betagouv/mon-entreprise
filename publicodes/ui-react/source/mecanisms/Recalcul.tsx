import { EvaluatedNode } from 'publicodes'
import { RecalculNode } from 'publicodes/dist/types/mecanisms/recalcul'
import { useContext } from 'react'
import {
	EngineContext,
	RegisterEngineContext,
	SituationMetaContext,
} from '../contexts'
import Explanation from '../Explanation'
import { RuleLinkWithContext } from '../RuleLink'
import { Mecanism } from './common'

export default function Recalcul({
	nodeValue,
	explanation,
	unit,
}: RecalculNode & EvaluatedNode) {
	const engine = useContext(EngineContext)
	if (!engine) {
		throw new Error()
	}
	const recalculEngine = engine
		.shallowCopy()
		.setSituation(explanation.parsedSituation)
	useContext(RegisterEngineContext)(recalculEngine)
	return (
		<Mecanism name="recalcul" value={nodeValue} unit={unit}>
			<>
				{explanation.recalcul && (
					<EngineContext.Provider value={recalculEngine}>
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
							<RuleLinkWithContext dottedName={origin.dottedName as string} /> ={' '}
							<Explanation node={replacement} />
						</li>
					))}
				</ul>
			</>
		</Mecanism>
	)
}
