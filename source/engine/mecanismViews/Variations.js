import React from 'react'
import { Node } from './common'
import { makeJsx } from '../evaluation'
import './Variations.css'

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
								{c.condition && (
									<>
										<span>Si</span> {makeJsx(c.condition)}
									</>
								)}
								<div>
									<span>{c.condition ? 'Alors : ' : 'Sinon : '}</span>
									<span className="content">{makeJsx(c.consequence)}</span>
								</div>
							</div>
						</li>
					))}
				</ul>
			}
		/>
	)
}
