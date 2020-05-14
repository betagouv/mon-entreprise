import React from 'react'
import { makeJsx } from '../../evaluation'
import { Node } from './common'
import './InversionNumérique.css'

export default function InversionNumérique({ nodeValue, explanation }) {
	return (
		<Node
			classes="mecanism inversionNumérique"
			name="inversion numérique"
			value={nodeValue}
		>
			{explanation.inversionFailed ? (
				<>
					{' '}
					<p>
						Cette valeur devrait pouvoir être estimée à partir d'une autre
						variable qui possède une formule de calcul et dont la valeur a été
						fixée dans la simulation :
					</p>
					{makeJsx(explanation.inversedWith)}
					<p>
						Malheureusement, il a été impossible de retrouver une valeur pour
						cette formule qui permette d'atterir sur la valeur demandée.
					</p>
				</>
			) : explanation.inversedWith ? (
				<>
					{' '}
					<p>
						Cette valeur a été estimée à partir d'une autre variable qui possède
						une formule de calcul et dont la valeur a été fixée dans la
						simulation :
					</p>
					{makeJsx(explanation.inversedWith)}
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
		</Node>
	)
}
