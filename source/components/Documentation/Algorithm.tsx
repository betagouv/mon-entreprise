import { makeJsx } from 'Engine/evaluation'
import { any, identity, path } from 'ramda'
import React from 'react'
import { Trans } from 'react-i18next'
import './Algorithm.css'
import { EvaluatedRule, ParsedRule } from 'Rules'

const Conditions = ({
	'rendu non applicable': disabledBy,
	parentDependencies,
	'applicable si': applicable,
	'non applicable si': notApplicable
}: EvaluatedRule) => {
	const listElements = [
		...parentDependencies.map(
			parentDependency =>
				parentDependency.nodeValue === false && (
					<ShowIfDisabled
						dependency={parentDependency}
						key={parentDependency.dottedName}
					/>
				)
		),
		...disabledBy?.explanation?.isDisabledBy?.map(
			(dependency: EvaluatedRule, i: number) =>
				dependency?.nodeValue === true && (
					<ShowIfDisabled dependency={dependency} key={`dependency ${i}`} />
				)
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

function ShowIfDisabled({ dependency }: { dependency: EvaluatedRule }) {
	return (
		<li>
			<span css="background: yellow">
				<Trans>Désactivée</Trans>
			</span>{' '}
			<Trans>car dépend de</Trans> {makeJsx(dependency)}
		</li>
	)
}

export default function Algorithm({ rule }: { rule: EvaluatedRule }) {
	const formula =
			rule.formule ||
			(rule.category === 'variable' && rule.explanation.formule),
		displayFormula =
			formula &&
			!!Object.keys(formula).length &&
			!path(['formule', 'explanation', 'une possibilité'], rule) &&
			!(formula.explanation.constant && rule.nodeValue)
	return (
		<>
			<Conditions {...rule} />
			{displayFormula && (
				<>
					<h2>Comment cette donnée est-elle calculée ?</h2>
					<div
						className={
							formula.explanation.constant || formula.explanation.operator
								? 'mecanism'
								: ''
						}
					>
						{makeJsx(formula)}
					</div>
				</>
			)}
		</>
	)
}
