import { makeJsx } from 'Engine/evaluation'
import classNames from 'classnames'
import { path, values } from 'ramda'
import React from 'react'
import { Trans, translate } from 'react-i18next'
import './Algorithm.css'

// The showValues prop is passed as a context. It used to be delt in CSS (not(.showValues) display: none), both coexist right now
import { ShowValuesProvider } from './ShowValuesContext'

@translate()
export default class Algorithm extends React.Component {
	render() {
		let { rule, showValues } = this.props,
			ruleWithoutFormula =
				!rule['formule'] ||
				path(['formule', 'explanation', 'une possibilité'], rule)

		return (
			<div id="algorithm">
				<section id="rule-rules" className={classNames({ showValues })}>
					<ShowValuesProvider value={showValues}>
						{do {
							// TODO ce let est incompréhensible !
							let applicabilityMecanisms = values(rule).filter(
								v => v && v['rulePropType'] == 'cond'
							)
							applicabilityMecanisms.length > 0 && (
								<section id="declenchement">
									<h2>
										<Trans>Déclenchement</Trans>
									</h2>
									<ul>
										{applicabilityMecanisms.map(v => (
											<li key={v.name}>{makeJsx(v)}</li>
										))}
									</ul>
								</section>
							)
						}}
						{!ruleWithoutFormula ? (
							<section id="formule">
								<h2>
									<Trans>Calcul</Trans>
								</h2>
								{makeJsx(rule['formule'])}
							</section>
						) : null}
					</ShowValuesProvider>
				</section>
			</div>
		)
	}
}
