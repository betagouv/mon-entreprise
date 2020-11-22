import { makeJsx } from '../../evaluation'
import { Mecanism } from './common'

export default function InversionNumérique({ nodeValue, explanation }) {
	return (
		<Mecanism name="inversion numérique" value={nodeValue}>
			{explanation.inversionFailed ? (
				<>
					<p>
						Cette valeur devrait pouvoir être estimée à partir d'une autre
						variable qui possède une formule de calcul et dont la valeur a été
						fixée dans la simulation :
					</p>
					{makeJsx(explanation.inversionGoal)}
					<p>
						Malheureusement, il a été impossible de retrouver une valeur pour
						cette formule qui permette d'atterrir sur la valeur demandée.
					</p>
				</>
			) : explanation.inversionGoal ? (
				<>
					<p>
						Cette valeur a été estimée à partir d'une autre variable qui possède
						une formule de calcul et dont la valeur a été fixée dans la
						simulation :
					</p>
					{makeJsx(explanation.inversionGoal)}
				</>
			) : (
				<>
					<p>
						Cette formule de calcul n'existe pas, mais on peut la calculer par
						inversion en utilisant les formules des règles suivantes :
					</p>
					<ul id="inversionsPossibles">
						{explanation.inversionCandidates.map(el => (
							<li key={el.dottedName}>{makeJsx(el)}</li>
						))}
					</ul>
				</>
			)}
		</Mecanism>
	)
}
