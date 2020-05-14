import { path } from 'ramda'
import React, { useState } from 'react'
import { makeJsx } from '../../evaluation'
import { Node, NodeValuePointer } from './common'
import './Somme.css'

const SommeNode = ({ explanation, nodeValue, unit }) => (
	<Node classes="mecanism somme" name="somme" value={nodeValue} unit={unit}>
		<Table explanation={explanation} unit={unit} />
	</Node>
)
export default SommeNode

let Table = ({ explanation, unit }) => (
	<div className="mecanism-somme__table">
		<div>
			{explanation.map((v, i) => (
				<Row key={i} {...{ v, i }} unit={unit} />
			))}
		</div>
	</div>
)

/* La colonne peut au clic afficher une nouvelle colonne qui sera une autre somme imbriquée */
function Row({ v, i, unit }) {
	let [folded, setFolded] = useState(true),
		rowFormula = path(['explanation', 'formule', 'explanation'], v),
		isSomme = rowFormula && rowFormula.name == 'somme'

	return [
		<div
			className="mecanism-somme__row"
			key={v.name || i}
			// className={isSomme ? '' : 'noNest'}
			onClick={() => setFolded(!folded)}
		>
			<div className="element">
				{makeJsx(v)}
				{isSomme && (
					<button className="unfoldIndication ui__ notice small static simple button">
						{folded ? 'déplier' : 'replier'}
					</button>
				)}
			</div>
			<div className="situationValue value">
				<NodeValuePointer data={v.nodeValue} unit={v.unit} />
			</div>
		</div>,
		...(isSomme && !folded
			? [
					<div className="nested" key={v.name + '-nest'}>
						<Table explanation={rowFormula.explanation} unit={v.unit || unit} />
					</div>
			  ]
			: [])
	]
}
