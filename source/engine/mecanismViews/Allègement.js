import React from 'react'
import { Node } from './common'
import { makeJsx } from '../evaluation'
import { mapObjIndexed, values } from 'ramda'

export default (nodeValue, explanation) => (
	<div>
		<Node
			classes="mecanism allègement"
			name="allègement"
			value={nodeValue}
			child={
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
				</ul>
			}
		/>
	</div>
)

let ObjectView = ({ data }) =>
	console.log('data', data) || (
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
