import React from 'react'
import { Node, InlineMecanism } from './common'
import { makeJsx } from '../evaluation'
import './Composantes.css'
import { Trans } from 'react-i18next'
import { toPairs } from 'ramda'
import writtenNumbers from '../../locales/writtenNumbers.yaml'
import withLanguage from 'Components/utils/withLanguage'
import colours from 'Engine/mecanismViews/colours'

let Comp = withLanguage(function Composantes({
	language,
	nodeValue,
	explanation,
	unit
}) {
	return (
		<Node
			classes="mecanism composantes"
			name="composantes"
			inline
			value={nodeValue}
			unit={unit}
			child={
				<>
					<p css="margin-bottom: 1em">
						<Trans>La somme de</Trans>{' '}
						{writtenNumbers[language][explanation.length]}{' '}
						<InlineMecanism name="composantes" /> :
					</p>
					<ol>
						{explanation.map((c, i) => [
							<li
								className="composante"
								css={``}
								key={JSON.stringify(c.composante)}>
								<ul
									className="composanteAttributes"
									css={`
										border-left: 4px solid ${colours('composantes')};
									`}>
									{toPairs(c.composante).map(([k, v]) => (
										<li key={k} className="composanteName">
											<span
												css={`
													color: ${colours('composantes')};
												`}>
												<Trans>{k}</Trans>:{' '}
											</span>
											<span>
												<Trans>{v}</Trans>
											</span>
										</li>
									))}
								</ul>
								<div className="content">{makeJsx(c)}</div>
								<div
									css={`
										text-align: center;
										width: 100%;
										font-size: 2.6rem;
										margin: 0.4em 0 0.2em;
									`}>
									{i === explanation.length - 1 ? null : '+'}
								</div>
							</li>
						])}
					</ol>
				</>
			}
		/>
	)
})

// eslint-disable-next-line
export default (nodeValue, explanation, _, unit) => (
	<Comp {...{ nodeValue, explanation, unit }} />
)
