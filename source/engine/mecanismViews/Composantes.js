import colors from 'Engine/mecanismViews/colors'
import { toPairs } from 'ramda'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import writtenNumbers from '../../locales/writtenNumbers.yaml'
import { makeJsx } from '../evaluation'
import { InlineMecanism, Node } from './common'
import './Composantes.css'

export default function Composantes({ nodeValue, explanation, unit }) {
	const { i18n } = useTranslation()

	return (
		<Node
			classes="mecanism composantes"
			name="composantes"
			inline
			value={nodeValue}
			unit={unit}
		>
			<>
				<p css="margin-bottom: 1em">
					<Trans>La somme de</Trans>{' '}
					{writtenNumbers[i18n.language][explanation.length]}{' '}
					<InlineMecanism name="composantes" /> :
				</p>
				<ol>
					{explanation.map((c, i) => [
						<li
							className="composante"
							css={``}
							key={JSON.stringify(c.composante)}
						>
							<ul
								className="composanteAttributes"
								css={`
									border-left: 4px solid ${colors('composantes')};
								`}
							>
								{toPairs(c.composante).map(([k, v]) => (
									<li key={k} className="composanteName">
										<span
											css={`
												color: ${colors('composantes')};
											`}
										>
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
								`}
							>
								{i === explanation.length - 1 ? null : '+'}
							</div>
						</li>
					])}
				</ol>
			</>
		</Node>
	)
}
