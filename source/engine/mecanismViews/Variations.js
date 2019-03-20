import { ShowValuesConsumer } from 'Components/rule/ShowValuesContext'
import withLanguage from 'Components/utils/withLanguage'
import React, { useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import writtenNumbers from '../../locales/writtenNumbers.yaml'
import { makeJsx } from '../evaluation'
import { InlineMecanism, Node } from './common'
import './Variations.css'

let Comp = withLanguage(function Variations({
	language,
	nodeValue,
	explanation
}) {
	let [expandedVariation, toggleVariation] = useState(null)

	return (
		<ShowValuesConsumer>
			{showValues => (
				<Node
					classes="mecanism variations"
					name="variations"
					inline
					value={nodeValue}
					child={
						<>
							<p>
								<Trans>Cette règle présente</Trans>{' '}
								{writtenNumbers[language][explanation.length]}{' '}
								<InlineMecanism name="variations" />
							</p>
							<ol>
								{explanation.map(({ condition, consequence, satisfied }, i) =>
									showValues && (!satisfied && !(expandedVariation === i)) ? (
										<li style={{ opacity: '0.6' }}>
											non applicable{' '}
											<button
												className="ui__ link-button"
												onClick={() =>
													toggleVariation(expandedVariation !== i ? i : null)
												}>
												détails {emoji(' ▶️')}
											</button>
										</li>
									) : (
										<li>
											{expandedVariation === i && (
												<button
													className="ui__ link-button"
													onClick={() => toggleVariation(null)}>
													replier {emoji(' 🔽')}
												</button>
											)}
											<div className="condition">
												{condition && (
													<div
														style={{
															display: 'flex',
															flexWrap: 'wrap',
															alignItems: 'baseline'
														}}>
														<Trans>Si :</Trans>&nbsp;{makeJsx(condition)}
													</div>
												)}
												<div className="consequence">
													<span className="consequenceType">
														{condition ? (
															<Trans>Alors</Trans>
														) : (
															<Trans>Sinon</Trans>
														)}{' '}
														:
													</span>
													<span className="consequenceContent">
														{consequence && makeJsx(consequence)}
													</span>
												</div>
											</div>
										</li>
									)
								)}
							</ol>
						</>
					}
				/>
			)}
		</ShowValuesConsumer>
	)
})
// eslint-disable-next-line
export default (nodeValue, explanation) => (
	<Comp {...{ nodeValue, explanation }} />
)
