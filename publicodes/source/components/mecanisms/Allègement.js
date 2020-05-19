import { map, mapObjIndexed, values } from 'ramda'
import React from 'react'
import { makeJsx } from '../../evaluation'
import { Mecanism } from './common'

export default function Allègement({ nodeValue, explanation: rawExplanation }) {
	// Don't display attributes with default values
	let explanation = map(k => (k && !k.isDefault ? k : null), rawExplanation)
	return (
		<div>
			<Mecanism name="allègement" value={nodeValue} unit={explanation.unit}>
				<ul className="properties">
					<li key="assiette">
						<span className="key">Assiette : </span>
						<span className="value">{makeJsx(explanation.assiette)}</span>
					</li>
					{explanation.franchise && (
						<li key="franchise">
							<span className="key">Franchise : </span>
							<span className="value">{makeJsx(explanation.franchise)}</span>
						</li>
					)}
					{explanation.décote && (
						<li key="décote">
							<span className="key">Décote : </span>
							<span className="value">
								<ObjectView data={explanation.décote} />
							</span>
						</li>
					)}
					{explanation.abattement && (
						<li key="abattement">
							<span className="key">Abattement : </span>
							<span className="value">{makeJsx(explanation.abattement)}</span>
						</li>
					)}
					{explanation.plafond && (
						<li key="plafond">
							<span className="key">Plafond : </span>
							<span className="value">{makeJsx(explanation.plafond)}</span>
						</li>
					)}
				</ul>
			</Mecanism>
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
