import classnames from 'classnames'
import { ShowValuesConsumer } from 'Components/rule/ShowValuesContext'
import React, { useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'
import writtenNumbers from '../../locales/writtenNumbers.yaml'
import { makeJsx } from '../evaluation'
import { InlineMecanism, Node } from './common'
import './Variations.css'

let Comp = function Variations({ nodeValue, explanation, unit }) {
	let [expandedVariation, toggleVariation] = useState(null)
	const { i18n } = useTranslation()

	return (
		<ShowValuesConsumer>
			{showValues => (
				<Node
					classes="mecanism variations"
					name="variations"
					inline
					unit={unit}
					value={nodeValue}
					child={
						<>
							<p css="text-transform: capitalize">
								<Trans>
									{writtenNumbers[i18n.language][explanation.length]}{' '}
								</Trans>
								<InlineMecanism name="variations" /> :
							</p>
							<ol>
								{explanation.map(({ condition, consequence, satisfied }, i) => (
									<li
										key={i}
										style={{
											transition: 'all 0.2s',
											opacity:
												expandedVariation === i || satisfied || !showValues
													? 1
													: 0.8
										}}>
										{!satisfied && showValues && (
											<>
												<em>non applicable </em>
												{expandedVariation !== i ? (
													<button
														className="ui__ link-button"
														onClick={() => toggleVariation(i)}>
														détails {emoji('▶️')}
													</button>
												) : (
													<button
														className="ui__ link-button"
														onClick={() => toggleVariation(null)}>
														replier {emoji('🔽')}
													</button>
												)}
											</>
										)}
										{(expandedVariation === i || satisfied || !showValues) && (
											<div style={{ margin: '1rem 0' }}>
												{condition && (
													<div
														style={{
															display: 'flex',
															flexWrap: 'wrap',
															alignItems: 'baseline',
															marginBottom: '0.4rem'
														}}>
														<Trans>Si :</Trans>&nbsp;{makeJsx(condition)}
													</div>
												)}
												<div
													style={{
														display: 'flex',
														width: 'fit-content',
														flexWrap: 'wrap',
														alignItems: 'flex-start'
													}}>
													<span
														className={classnames('consequenceType', {
															satisfied
														})}>
														{condition ? (
															<Trans>Alors</Trans>
														) : (
															<Trans>Sinon</Trans>
														)}{' '}
														:&nbsp;
													</span>
													<span
														className={classnames('consequenceContent', {
															satisfied
														})}>
														{consequence && makeJsx(consequence)}
													</span>
												</div>
											</div>
										)}
									</li>
								))}
							</ol>
						</>
					}
				/>
			)}
		</ShowValuesConsumer>
	)
}
// eslint-disable-next-line
export default (nodeValue, explanation, _, unit) => (
	<Comp {...{ nodeValue, explanation, unit }} />
)
