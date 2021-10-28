import { EvaluatedNode } from 'publicodes'
import { RecalculNode } from 'publicodes/dist/types/mecanisms/recalcul'
import { useContext } from 'react'
import { EngineContext } from '../contexts'
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
	const recalculEngine = explanation.subEngineId
		? engine.subEngines[explanation.subEngineId]
		: engine
	return (
		<Mecanism name="recalcul" value={nodeValue} unit={unit}>
			<>
				{explanation.recalcul && (
					<EngineContext.Provider value={recalculEngine}>
						Recalcul de la valeur de <Explanation node={explanation.recalcul} />{' '}
						avec la situation suivante :
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
