import { any, identity, path } from 'ramda'
import React from 'react'
import { Trans } from 'react-i18next'
import { makeJsx } from '../../evaluation'

const Conditions = ({
	'rendu non applicable': disabledBy,
	parentDependencies,
	'applicable si': applicable,
	'non applicable si': notApplicable
}: any) => {
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
			(dependency: any, i: number) =>
				dependency?.nodeValue === true && (
					<ShowIfDisabled dependency={dependency} key={`dependency ${i}`} />
				)
		),
		applicable && <li key="applicable">{makeJsx(applicable)}</li>,
		notApplicable && <li key="non applicable">{makeJsx(notApplicable)}</li>
	]

	return any(identity, listElements) ? (
		<>
			<h2>
				<Trans>Déclenchement</Trans>
			</h2>
			<ul
				css={`
					list-style: none;
					padding: 0;
				`}
			>
				{listElements}
			</ul>
		</>
	) : null
}

function ShowIfDisabled({ dependency }: { dependency: any }) {
	return (
		<li>
			<span style={{ background: 'var(--lighterColor)', fontWeight: 'bold' }}>
				<Trans>Désactivée</Trans>
			</span>{' '}
			<Trans>car dépend de</Trans> {makeJsx(dependency)}
		</li>
	)
}

export default function Algorithm({ rule }: { rule: any }) {
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
