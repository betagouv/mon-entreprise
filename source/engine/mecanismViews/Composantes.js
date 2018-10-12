import React from 'react'
import { Node, InlineMecanism } from './common'
import { makeJsx } from '../evaluation'
import './Composantes.css'
import { Trans } from 'react-i18next'
import { toPairs } from 'ramda'
import writtenNumbers from '../../locales/writtenNumbers.yaml'
import withLanguage from 'Components/utils/withLanguage'

let Comp = withLanguage(function Composantes({
	language,
	nodeValue,
	explanation
}) {
	return (
		<Node
			classes="mecanism composantes"
			name="composantes"
			inline
			value={nodeValue}
			child={
				<>
					<p>
						<Trans>Cette règle est la somme de</Trans>{' '}
						{writtenNumbers[language][explanation.length]}{' '}
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
})

export default (nodeValue, explanation) => (
	<Comp {...{ nodeValue, explanation }} />
)
