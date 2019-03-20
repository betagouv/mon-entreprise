import classNames from 'classnames'
import { makeJsx } from 'Engine/evaluation'
import { any, compose, identity, path } from 'ramda'
import React from 'react'
import { Trans, withTranslation } from 'react-i18next'
import './Algorithm.css'
// The showValues prop is passed as a context. It used to be delt in CSS (not(.showValues) display: none), both coexist right now
import { ShowValuesProvider } from './ShowValuesContext'

let Conditions = ({
	parentDependency,
	'applicable si': applicable,
	'non applicable si': notApplicable
}) => {
	let listElements = [
		parentDependency?.nodeValue === false && (
			<li key="parentDependency">Désactivée car {makeJsx(parentDependency)}</li>
		),
		applicable && <li key="applicable">{makeJsx(applicable)}</li>,
		notApplicable && <li key="non applicable">{makeJsx(notApplicable)}</li>
	]

	return any(identity, listElements) ? (
		<section id="declenchement">
			<h2>
				<Trans>Déclenchement</Trans>
			</h2>
			<ul>{listElements}</ul>
		</section>
	) : null
}

export default compose(withTranslation())(
	class Algorithm extends React.Component {
		render() {
			let { rule, showValues } = this.props
			let formula =
					rule['formule'] ||
					(rule.category === 'variable' && rule.explanation.formule),
				displayFormula =
					formula &&
					!!Object.keys(formula).length &&
					!path(['formule', 'explanation', 'une possibilité'], rule)
			return (
				<div id="algorithm">
					<section id="rule-rules" className={classNames({ showValues })}>
						<ShowValuesProvider value={showValues}>
							<Conditions {...rule} />
							{displayFormula && (
								<section id="formule">
									<h2>
										<Trans>Calcul</Trans>
									</h2>
									<div style={{ display: 'flex', justifyContent: 'center' }}>
										{makeJsx(formula)}
									</div>
								</section>
							)}
						</ShowValuesProvider>
					</section>
				</div>
			)
		}
	}
)
