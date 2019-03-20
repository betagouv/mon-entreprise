import React from 'react'
import { InlineMecanism, Node } from './common'
import { makeJsx } from '../evaluation'
import './Variations.css'
import classNames from 'classnames'
import writtenNumbers from '../../locales/writtenNumbers.yaml'
import withLanguage from 'Components/utils/withLanguage'
import { Trans } from 'react-i18next'
import { ShowValuesConsumer } from 'Components/rule/ShowValuesContext'
import emoji from 'react-easy-emoji'
import { useState } from 'react'

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
								<InlineMecanism name="variations" /> :
							</p>
							<ul>
								{explanation.map(({ condition, consequence, satisfied }, i) => (
									<li
										className={classNames('variation', {
											satisfied: showValues && satisfied
										})}
										key={i}>
										{showValues &&
										(!satisfied && !(expandedVariation === i)) ? (
											<p style={{ opacity: '0.6' }}>
												non applicable{' '}
												<button
													className="ui__ link-button"
													onClick={() =>
														toggleVariation(expandedVariation !== i ? i : null)
													}>
													détails {emoji(' ▶️')}
												</button>
											</p>
										) : (
											<>
												{expandedVariation === i && (
													<button
														className="ui__ link-button"
														onClick={() => toggleVariation(null)}>
														replier {emoji(' 🔽')}
													</button>
												)}
												<div className="condition">
													{condition && (
														<span>
															<Trans>Si</Trans> {makeJsx(condition)}
														</span>
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
											</>
										)}
									</li>
								))}
							</ul>
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
