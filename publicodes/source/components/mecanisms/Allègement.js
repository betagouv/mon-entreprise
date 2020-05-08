import { map, mapObjIndexed, values } from 'ramda'
import React from 'react'
import { makeJsx } from '../../evaluation'
import { Node } from './common'

export default function Allègement({ nodeValue, explanation: rawExplanation }) {
	// Don't display attributes with default values
	let explanation = map(k => (k && !k.isDefault ? k : null), rawExplanation)
	return (
		<div>
			<Node
				classes="mecanism allègement"
				name="allègement"
				value={nodeValue}
				unit={explanation.unit}
			>
				<ul className="properties">
					<li key="assiette">
						<span className="key">assiette: </span>
						<span className="value">{makeJsx(explanation.assiette)}</span>
					</li>
					{explanation.franchise && (
						<li key="franchise">
							<span className="key">franchise: </span>
							<span className="value">{makeJsx(explanation.franchise)}</span>
						</li>
					)}
					{explanation.décote && (
						<li key="décote">
							<span className="key">décote: </span>
							<span className="value">
								<ObjectView data={explanation.décote} />
							</span>
						</li>
					)}
					{explanation.abattement && (
						<li key="abattement">
							<span className="key">abattement: </span>
							<span className="value">{makeJsx(explanation.abattement)}</span>
						</li>
					)}
					{explanation.plafond && (
						<li key="plafond">
							<span className="key">plafond: </span>
							<span className="value">{makeJsx(explanation.plafond)}</span>
						</li>
					)}
				</ul>
			</Node>
		</div>
	)
}

let ObjectView = ({ data }) => (
	<ul className="properties">
		{values(
			mapObjIndexed(
				(v, k) => (
					<li key={k}>
						{' '}
						<span className="key">{k}: </span>
						<span className="value">{makeJsx(v)}</span>
					</li>
				),
				data
			)
		)}
	</ul>
)
