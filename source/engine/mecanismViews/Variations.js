import React from 'react'
import { Node } from './common'
import { makeJsx } from '../evaluation'
import './Variations.css'
import classNames from 'classnames'

export default function Variations(nodeValue, explanation) {
	return (
		<Node
			classes="mecanism variations"
			name="variations"
			value={nodeValue}
			child={
				<ul>
					{explanation.map(({ condition, consequence, satisfied }) => (
						<li
							className={classNames('variation', { satisfied })}
							key={JSON.stringify(condition || 'sinon')}>
							<div className="condition">
								{condition && <span>Si {makeJsx(condition)}</span>}
								<div className="consequence">
									{condition ? 'Alors : ' : 'Sinon : '}
									<span className="content">{makeJsx(consequence)}</span>
								</div>
							</div>
						</li>
					))}
				</ul>
			}
		/>
	)
}
