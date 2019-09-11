import classNames from 'classnames'
import { React, T } from 'Components'
import { makeJsx } from 'Engine/evaluation'
import { any, identity, path } from 'ramda'
import { Trans } from 'react-i18next'
import './Algorithm.css'
// The showValues prop is passed as a context. It used to be delt in CSS (not(.showValues) display: none), both coexist right now
import { ShowValuesProvider } from './ShowValuesContext'

let Conditions = ({
	'rendu non applicable': disabledBy,
	parentDependency,
	'applicable si': applicable,
	'non applicable si': notApplicable
}) => {
	let listElements = [
		parentDependency?.nodeValue === false && (
			<ShowIfDisabled dependency={parentDependency} key="parent dependency" />
		),
		...disabledBy?.explanation?.isDisabledBy?.map(
			(dependency, i) =>
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

function ShowIfDisabled({ dependency }) {
	return (
		<li>
			<span css="background: yellow">
				<T>Désactivée</T>
			</span>{' '}
			<T>car dépend de</T> {makeJsx(dependency)}
		</li>
	)
}

export default function Algorithm({ rule, showValues }) {
	let formula =
			rule['formule'] ||
			(rule.category === 'variable' && rule.explanation.formule),
		displayFormula =
			formula &&
			!!Object.keys(formula).length &&
			!path(['formule', 'explanation', 'une possibilité'], rule) &&
			formula.explanation?.category !== 'number'

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
				{makeJsx(rule['rendu non applicable'])}
			</section>
		</div>
	)
}
