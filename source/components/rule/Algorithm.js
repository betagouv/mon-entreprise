import React from 'react'
import classNames from 'classnames'
import R from 'ramda'
import {AttachDictionary} from '../AttachDictionary'
import knownMecanisms from 'Engine/known-mecanisms.yaml'
import marked from 'Engine/marked'
import {makeJsx} from 'Engine/evaluation'

let RuleWithoutFormula = () =>
	<p>
		Nous ne connaissons pas la formule de cette règle pour l'instant. Sa valeur
		doit donc être renseignée directement.
	</p>

@AttachDictionary(knownMecanisms)
export default class Algorithm extends React.Component {
	state = {
		showValues: true
	}
	render(){
		let {traversedRule: rule, showValues} = this.props,
			ruleWithoutFormula = !rule['formule'] || rule.formule.explanation['une possibilité']
		return (
			<div id="algorithm">
				<section id="rule-rules" className={classNames({showValues})}>
					{ do {
						// TODO ce let est incompréhensible !
						let [,cond] =
							R.toPairs(rule).find(([,v]) => v && v.rulePropType == 'cond') || []
						cond != null &&
							<section id="declenchement">
								<h2>Conditions de déclenchement</h2>
								{makeJsx(cond)}
							</section>
					}}
					<section id="formule">
						<h2>Calcul</h2>
						<p>Vous pouvez cliquer sur chaque valeur pour comprendre comment elle est calculée.</p>
						{ruleWithoutFormula ? <RuleWithoutFormula /> : makeJsx(rule['formule'])}
					</section>
				</section>
			</div>
		)
	}
}
