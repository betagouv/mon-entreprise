import classnames from 'classnames'
import React, { useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'
import writtenNumbers from '../../locales/writtenNumbers.yaml'
import { makeJsx } from '../../evaluation'
import { InlineMecanism, Node } from './common'
import './Variations.css'

export default function Variations({ nodeValue, explanation, unit }) {
	let [expandedVariation, toggleVariation] = useState(null)
	const { i18n } = useTranslation()
	return (
		<Node
			classes="mecanism variations"
			name="variations"
			inline
			unit={unit}
			value={nodeValue}
		>
			{' '}
			<>
				<p style={{ textTransform: 'capitalize' }}>
					{writtenNumbers[i18n.language][explanation.length]}
					<InlineMecanism name="variations" /> :
				</p>
				<ol>
					{explanation.map(({ condition, consequence, satisfied }, i) => (
						<li
							key={i}
							style={{
								transition: 'all 0.2s',
								opacity:
									expandedVariation === i || satisfied || nodeValue == null
										? 1
										: 0.8
							}}
						>
							{!satisfied && nodeValue != null && (
								<>
									<em>non applicable </em>
									{expandedVariation !== i ? (
										<button
											className="ui__ link-button"
											onClick={() => toggleVariation(i)}
										>
											détails {emoji('▶️')}
										</button>
									) : (
										<button
											className="ui__ link-button"
											onClick={() => toggleVariation(null)}
										>
											replier {emoji('🔽')}
										</button>
									)}
								</>
							)}
							{(expandedVariation === i || satisfied || nodeValue == null) && (
								<div style={{ margin: '1rem 0' }}>
									{!condition.isDefault && (
										<div
											style={{
												display: 'flex',
												flexWrap: 'wrap',
												alignItems: 'baseline',
												marginBottom: '0.4rem'
											}}
										>
											<Trans>Si :</Trans>&nbsp;{makeJsx(condition)}
										</div>
									)}
									<div
										style={{
											display: 'flex',
											width: 'fit-content',
											flexWrap: 'wrap',
											alignItems: 'flex-start'
										}}
									>
										<span
											className={classnames('consequenceType', {
												satisfied
											})}
										>
											{!condition.isDefault ? (
												<Trans>Alors</Trans>
											) : (
												<Trans>Sinon</Trans>
											)}{' '}
											:&nbsp;
										</span>
										<span
											className={classnames('consequenceContent', {
												satisfied
											})}
										>
											{consequence && makeJsx(consequence)}
										</span>
									</div>
								</div>
							)}
						</li>
					))}
				</ol>
			</>
		</Node>
	)
}
