import { T } from 'Components'
import PeriodSwitch from 'Components/PeriodSwitch'
import withColours from 'Components/utils/withColours'
import withSitePaths from 'Components/utils/withSitePaths'
import Value from 'Components/Value'
import knownMecanisms from 'Engine/known-mecanisms.yaml'
import {
	encodeRuleName,
	findRuleByDottedName,
	findRuleByNamespace
} from 'Engine/rules'
import { compose, isEmpty } from 'ramda'
import React, { Suspense, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
	exampleAnalysisSelector,
	flatRulesSelector,
	noUserInputSelector,
	ruleAnalysisSelector
} from 'Selectors/analyseSelectors'
import Animate from 'Ui/animate'
import { AttachDictionary } from '../AttachDictionary'
import RuleLink from '../RuleLink'
import { Markdown } from '../utils/markdown'
import Algorithm from './Algorithm'
import Examples from './Examples'
import RuleHeader from './Header'
import References from './References'
import './Rule.css'

let LazySource = React.lazy(() => import('./RuleSource'))

export default compose(
	connect((state, props) => ({
		currentExample: state.currentExample,
		flatRules: flatRulesSelector(state),
		valuesToShow: !noUserInputSelector(state),
		analysedRule: ruleAnalysisSelector(state, props),
		analysedExample: exampleAnalysisSelector(state, props)
	})),
	AttachDictionary(knownMecanisms),
	withSitePaths
)(function Rule({
	dottedName,
	currentExample,
	flatRules,
	valuesToShow,
	sitePaths,
	analysedExample,
	analysedRule
}) {
	const [viewSource, setViewSource] = useState(false)
	const { t } = useTranslation()

	let flatRule = findRuleByDottedName(flatRules, dottedName)
	let { type, name, title, description, question, ns, icon } = flatRule,
		namespaceRules = findRuleByNamespace(flatRules, dottedName)
	let displayedRule = analysedExample || analysedRule

	const renderToggleSourceButton = () => {
		return (
			<button
				id="toggleRuleSource"
				className="ui__ link-button"
				onClick={() => setViewSource(!viewSource)}>
				{emoji(
					viewSource
						? `📖 ${t('Revenir à la documentation')}`
						: `✍️ ${t('Voir le code source')}`
				)}
			</button>
		)
	}

	const renderReferences = ({ références: refs }) =>
		refs ? (
			<div>
				<h2>
					<Trans>Références</Trans>
				</h2>
				<References refs={refs} />
			</div>
		) : null

	return (
		<>
			{viewSource ? (
				<>
					{renderToggleSourceButton()}
					<Suspense fallback={<div>Chargement du code source...</div>}>
						<LazySource dottedName={dottedName} />
					</Suspense>
				</>
			) : (
				<div id="rule">
					<Animate.fromBottom>
						<Helmet
							title={title}
							meta={[
								{
									name: 'description',
									content: description
								}
							]}
						/>
						<RuleHeader
							{...{
								ns,
								type,
								description,
								question,
								flatRule,
								flatRules,
								name,
								title,
								icon,
								valuesToShow
							}}
						/>

						<section id="rule-content">
							<div
								id="ruleValue"
								css={`
									display: flex;
									justify-content: center;
									flex-wrap: wrap;
									align-items: center;

									> .value {
										font-size: 220%;
									}

									margin: 0.6em 0;
									> * {
										margin: 0 0.6em;
									}
								`}>
								<Value
									{...displayedRule}
									nilValueSymbol={
										displayedRule.parentDependency?.nodeValue == false
											? '-'
											: null
									}
								/>
								<Period
									period={flatRule['période']}
									valuesToShow={valuesToShow}
								/>
							</div>
							{displayedRule.defaultValue != null && (
								<div id="ruleDefault">
									par défaut :{' '}
									<Value
										{...displayedRule}
										nodeValue={displayedRule.defaultValue}
									/>
								</div>
							)}
							{!valuesToShow && (
								<div style={{ textAlign: 'center', marginTop: '1em' }}>
									<Link
										className="ui__ cta plain button"
										target="_parent"
										to={
											dottedName.includes('contrat salarié')
												? sitePaths.sécuritéSociale.salarié
												: dottedName.includes('auto-entrepreneur')
												? sitePaths.sécuritéSociale['auto-entrepreneur']
												: dottedName.includes('indépendant')
												? sitePaths.sécuritéSociale.indépendant
												: // otherwise
												  sitePaths?.sécuritéSociale?.index
										}>
										<T>Faire une simulation</T>
									</Link>
								</div>
							)}
							<Algorithm
								rule={displayedRule}
								showValues={valuesToShow || currentExample}
							/>
							{displayedRule['rend non applicable'] && (
								<section id="non-applicable">
									<h3>
										<T>Rend non applicable les règles suivantes</T> :{' '}
									</h3>
									<ul>
										{displayedRule['rend non applicable'].map(ruleName => (
											<li key={ruleName}>
												<RuleLink dottedName={ruleName} />
											</li>
										))}
									</ul>
								</section>
							)}
							{flatRule.note && (
								<section id="notes">
									<h3>Note : </h3>
									<Markdown source={flatRule.note} />
								</section>
							)}
							<Examples
								currentExample={currentExample}
								situationExists={valuesToShow}
								rule={displayedRule}
							/>
							{renderReferences(flatRule)}
							{!isEmpty(namespaceRules) && (
								<NamespaceRulesList {...{ namespaceRules }} />
							)}
						</section>
						{renderToggleSourceButton()}
					</Animate.fromBottom>
				</div>
			)}
		</>
	)
})

let NamespaceRulesList = compose(
	withColours,
	withSitePaths
)(({ namespaceRules, colours, sitePaths }) => {
	return (
		<section>
			<h2>
				<Trans>Pages associées</Trans>
			</h2>
			<ul>
				{namespaceRules.map(r => (
					<li key={r.name}>
						<Link
							style={{
								color: colours.textColourOnWhite,
								textDecoration: 'underline'
							}}
							to={
								sitePaths.documentation.index +
								'/' +
								encodeRuleName(r.dottedName)
							}>
							{r.title || r.name}
						</Link>
					</li>
				))}
			</ul>
		</section>
	)
})

let Period = ({ period, valuesToShow }) =>
	period ? (
		valuesToShow && period === 'flexible' ? (
			<PeriodSwitch />
		) : (
			<span className="inlineMecanism">
				<span
					className="name"
					data-term-definition="période"
					style={{ background: '#8e44ad' }}>
					{period}
				</span>
			</span>
		)
	) : null
