import Explanation from '../Explanation'
import { RuleLinkWithContext } from '../RuleLink'
import { Mecanism } from './common'

export default function Recalcul({ nodeValue, explanation, unit }) {
	return (
		<Mecanism name="recalcul" value={nodeValue} unit={unit}>
			<>
				{explanation.recalcul && (
					<>
						Recalcul de la règle{' '}
						<RuleLinkWithContext dottedName={explanation.recalcul.dottedName} />{' '}
						avec les valeurs suivantes :
					</>
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
