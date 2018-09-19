import classNames from 'classnames'
import { makeJsx } from 'Engine/evaluation'
import { compose, path, values } from 'ramda'
import React from 'react'
import { Trans, withNamespaces } from 'react-i18next'
import './Algorithm.css'
// The showValues prop is passed as a context. It used to be delt in CSS (not(.showValues) display: none), both coexist right now
import { ShowValuesProvider } from './ShowValuesContext'

export default compose(withNamespaces())(
	class Algorithm extends React.Component {
		render() {
			let { rule, showValues } = this.props
			return (
				<div id="algorithm">
					<section id="rule-rules" className={classNames({ showValues })}>
						<ShowValuesProvider value={showValues}>
							<section id="declenchement">
								<h2>
									<Trans>Déclenchement</Trans>
								</h2>
								<ul>
									{[
										'parentDependency',
										'applicable si',
										'non applicable si'
									].map(k => rule[k] && <li key={k}>{makeJsx(rule[k])}</li>)}
								</ul>
							</section>
							{do {
								let formula =
										rule['formule'] ||
										(rule.category === 'variable' && rule.explanation.formule),
									displayFormula =
										formula &&
										!path(['formule', 'explanation', 'une possibilité'], rule)
								displayFormula && (
									<section id="formule">
										<h2>
											<Trans>Calcul</Trans>
										</h2>
										{makeJsx(formula)}
									</section>
								)
							}}
						</ShowValuesProvider>
					</section>
				</div>
			)
		}
	}
)
