import { toPairs } from 'ramda'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { makeJsx } from '../../evaluation'
import writtenNumbers from '../../locales/writtenNumbers.yaml'
import colors from './colors'
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
				<p
					style={{
						marginBottom: '1rem'
					}}
				>
					<Trans>La somme de</Trans>{' '}
					{writtenNumbers[i18n.language][explanation.length]}{' '}
					<InlineMecanism name="composantes" /> :
				</p>
				<ol>
					{explanation.map((c, i) => [
						<li className="composante" key={JSON.stringify(c.composante)}>
							<ul
								className="composanteAttributes"
								style={{
									borderLeft: `4px solid ${colors('composantes')}`
								}}
							>
								{toPairs(c.composante).map(([k, v]) => (
									<li key={k} className="composanteName">
										<span
											style={{
												color: colors('composantes')
											}}
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
								style={{
									textAlign: 'center',
									width: '100%',
									fontSize: '2.6rem',
									margin: '0.4em 0 0.2em'
								}}
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
