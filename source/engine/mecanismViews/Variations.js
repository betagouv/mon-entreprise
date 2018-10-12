import React from 'react'
import { InlineMecanism, Node } from './common'
import { makeJsx } from '../evaluation'
import './Variations.css'
import classNames from 'classnames'
import writtenNumbers from '../../locales/writtenNumbers.yaml'
import withLanguage from 'Components/utils/withLanguage'
import { Trans } from 'react-i18next'

export default function Variations(nodeValue, explanation) {
	let Comp = withLanguage(({ language }) => (
		<Node
			classes="mecanism variations"
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
										{condition ? <Trans>Alors</Trans> : <Trans>Sinon</Trans>} :{' '}
										<span className="content">{makeJsx(consequence)}</span>
									</div>
								</div>
							</li>
						))}
					</ul>
				</>
			}
		/>
	))
	return <Comp />
}
