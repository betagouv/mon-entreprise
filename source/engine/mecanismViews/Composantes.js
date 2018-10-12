import React from 'react'
import { Node, InlineMecanism } from './common'
import { makeJsx } from '../evaluation'
import './Composantes.css'
import { Trans } from 'react-i18next'
import { toPairs } from 'ramda'

export default function Variations(nodeValue, explanation) {
	return (
		<Node
			classes="mecanism composantes"
			value={nodeValue}
			child={
				<>
					<p>
						Cette règle est la somme de deux{' '}
						<InlineMecanism name="composantes" /> :
					</p>
					<ol>
						{explanation.map(c => [
							<li className="composante" key={JSON.stringify(c.composante)}>
								<ul className="composanteAttributes">
									{toPairs(c.composante).map(([k, v]) => (
										<li key={k} className="composanteName">
											<span>
												<Trans>{k}</Trans>:{' '}
											</span>
											<span>
												<Trans>{v}</Trans>
											</span>
										</li>
									))}
								</ul>
								<div className="content">{makeJsx(c)}</div>
							</li>
						])}
					</ol>
				</>
			}
		/>
	)
}
