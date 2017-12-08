import React, { Component } from "react"
import R from "ramda"
import classNames from "classnames"
import {
	rules,
	disambiguateRuleReference
} from "Engine/rules.js"
import { analyse } from "Engine/traverse"
import "./Examples.css"

export default class Examples extends Component {
	runExamples() {
		let { rule } = this.props,
			{ exemples = [] } = rule

		return exemples.map(ex => {
			// les variables dans les tests peuvent être exprimées relativement à l'espace de nom de la règle,
			// comme dans sa formule
			// TODO - absolutely don't do this here but as a transformation step in rule parsing
			let exempleSituation = R.pipe(
				R.toPairs,
				R.map(([k, v]) => [disambiguateRuleReference(rules, rule, k), v]),
				R.fromPairs
			)(ex.situation)

			let runExemple = analyse(rules, rule.name)(
					v => exempleSituation[v]
				),
				exempleValue = runExemple.targets[0].nodeValue

			return {
				...ex,
				ok: Math.abs(ex["valeur attendue"] - exempleValue) < 0.1, //TODO on peut sûrement faire mieux...
				rule: runExemple
			}
		})
	}

	render() {
		let examples = this.runExamples(),
			focusedExample = R.path(["focusedExample", "nom"])(this.props),
			{ inject, situationExists, showValues } = this.props

		if (!examples.length) return null
		return (
			<div id="examples">
				<h2>Exemples de calcul <small>Cliquez sur un exemple pour le tester</small></h2>
				{R.isEmpty(examples) ? (
					<p>
						<i className="fa fa-exclamation-triangle" aria-hidden="true" />
						<em>Cette règle manque d'exemples...</em>
					</p>
				) : (
					<ul>
						{examples.map(({ nom, ok, rule, "valeur attendue": expected }) => (
							<li
								key={nom}
								className={classNames("example", {
									ok,
									selected: focusedExample == nom
								})}
								onClick={() =>
									focusedExample == nom ? false : inject({ nom, ok, rule })}
							>
								<span>
									{" "}
									{ok ? (
										<i className="fa fa-check-circle" aria-hidden="true" />
									) : (
										<i className="fa fa-times" aria-hidden="true" />
									)}
								</span>
								<span className="name">{nom}</span>
								{!ok &&
									focusedExample == nom && (
										<div className="ko">
											Ce test ne passe pas
											{showValues && (
												<span>
													: le résultat attendu était {" "}
													<span className="expected">{expected}</span>
												</span>
											)}
										</div>
									)}
							</li>
						))}
					</ul>
				)}
				{situationExists &&
					focusedExample && (
						<div>
							<button id="injectSituation" onClick={() => inject()}>
								Revenir à votre situation
							</button>
						</div>
					)}
			</div>
		)
	}
}
