import React from 'react'
import { Node } from './common'
import { makeJsx } from '../evaluation'

export default function Variations(nodeValue, explanation) {
	return (
		<Node
			classes="mecanism variations"
			name="variations"
			value={nodeValue}
			child={
				<ul>
					{explanation.map(c => (
						<li
							className="variation"
							key={JSON.stringify(c.condition | 'sinon')}>
							<div className="condition">
								{c.condition ? <span>Si {makeJsx(c.condition)}</span> : 'Sinon'}
								<div className="content">{makeJsx(c.consequence)}</div>
							</div>
						</li>
					))}
				</ul>
			}
		/>
	)
}
