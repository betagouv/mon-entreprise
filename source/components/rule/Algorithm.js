import classNames from 'classnames'
import { React, T } from 'Components'
import withSitePaths from 'Components/utils/withSitePaths'
import { makeJsx } from 'Engine/evaluation'
import { encodeRuleName } from 'Engine/rules'
import { any, compose, identity, path } from 'ramda'
import { Trans, withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
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
			<li key="parentDependency">
				<span css="background: yellow">
					<T>Désactivée</T>
				</span>{' '}
				<T>car dépend de</T> {makeJsx(parentDependency)}
			</li>
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

let DisabledBy = withSitePaths(({ isDisabledBy, sitePaths }) => {
	return (
		isDisabledBy.length > 0 && (
			<>
				<h3>Exception : </h3>
				<p>
					Cette règle ne s'applique pas pour le{' '}
					{isDisabledBy.map(r => (
						<Link
							style={{
								textDecoration: 'underline'
							}}
							to={
								sitePaths.documentation.index +
								'/' +
								encodeRuleName(r.dottedName)
							}>
							{r.title || r.name}
						</Link>
					))}
				</p>
			</>
		)
	)
})

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
						<DisabledBy {...rule} />
					</section>
				</div>
			)
		}
	}
)
