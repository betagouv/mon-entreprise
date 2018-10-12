import React from 'react'
import { InlineMecanism, Node } from './common'
import { makeJsx } from '../evaluation'
import './Variations.css'
import classNames from 'classnames'
import writtenNumbers from '../../locales/writtenNumbers.yaml'
import withLanguage from 'Components/utils/withLanguage'
import { Trans } from 'react-i18next'

let Comp = withLanguage(function Variations({
	language,
	nodeValue,
	explanation
}) {
	return (
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
						{explanation.map(({ condition, consequence, satisfied }) => (
							<li
								className={classNames('variation', { satisfied })}
								key={JSON.stringify(condition || 'sinon')}>
								<div className="condition">
									{condition && (
										<span>
											<Trans>Si</Trans> {makeJsx(condition)}
										</span>
									)}
									<div className="consequence">
										<span className="consequenceType">
											{condition ? <Trans>Alors</Trans> : <Trans>Sinon</Trans>}{' '}
											:
										</span>
										<span className="consequenceContent">
											{makeJsx(consequence)}
										</span>
									</div>
								</div>
							</li>
						))}
					</ul>
				</>
			}
		/>
	)
})
export default (nodeValue, explanation) => (
	<Comp {...{ nodeValue, explanation }} />
)
