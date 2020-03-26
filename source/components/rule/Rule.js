import { ThemeColorsContext } from 'Components/utils/colors'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import Value from 'Components/Value'
import mecanisms from 'Engine/mecanisms.yaml'
import { filter, isEmpty } from 'ramda'
import React, { Suspense, useContext, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
	exampleAnalysisSelector,
	noUserInputSelector,
	parsedRulesSelector,
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

export default AttachDictionary(mecanisms)(function Rule({ dottedName }) {
	const currentExample = useSelector(state => state.currentExample)
	const rules = useSelector(parsedRulesSelector)
	const valuesToShow = !useSelector(noUserInputSelector)
	const analysedRule = useSelector(state =>
		ruleAnalysisSelector(state, { dottedName })
	)
	const analysedExample = useSelector(state =>
		exampleAnalysisSelector(state, { dottedName })
	)
	const sitePaths = useContext(SitePathsContext)
	const [viewSource, setViewSource] = useState(false)
	const { t } = useTranslation()

	let rule = rules[dottedName]
	let { type, name, acronyme, title, description, question, icon } = rule,
		namespaceRules = filter(
			rule =>
				rule.dottedName.startsWith(dottedName) &&
				rule.dottedName.split(' . ').length ===
					dottedName.split(' . ').length + 1,
			rules
		)
	let displayedRule = analysedExample || analysedRule
	const renderToggleSourceButton = () => {
		return (
			<button
				id="toggleRuleSource"
				className="ui__ link-button"
				onClick={() => setViewSource(!viewSource)}
			>
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
								dottedName,
								type,
								description,
								question,
								flatRule: rule,
								flatRules: rules,
								name,
								acronyme,
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
								`}
							>
								<Value
									{...displayedRule}
									nilValueSymbol={displayedRule.parentDependencies.some(
										parent => parent?.nodeValue == false
									)}
								/>
							</div>
							{displayedRule.defaultValue != null && (
								<div id="ruleDefault">
									par défaut :{' '}
									<Value
										{...displayedRule}
										nodeValue={displayedRule.defaultValue}
										unit={displayedRule.unit || displayedRule.defaultUnit}
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
												? sitePaths.simulateurs.salarié
												: dottedName.includes('auto-entrepreneur')
												? sitePaths.simulateurs['auto-entrepreneur']
												: dottedName.includes('indépendant')
												? sitePaths.simulateurs.indépendant
												: // otherwise
												  sitePaths.simulateurs.index
										}
									>
										<Trans>Faire une simulation</Trans>
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
										<Trans>Rend non applicable les règles suivantes</Trans> :{' '}
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
							{rule.note && (
								<section id="notes">
									<h3>Note : </h3>
									<Markdown source={rule.note} />
								</section>
							)}
							<Examples
								currentExample={currentExample}
								situationExists={valuesToShow}
								rule={displayedRule}
							/>
							{!isEmpty(namespaceRules) && (
								<NamespaceRulesList {...{ namespaceRules }} />
							)}
							{renderReferences(rule)}
						</section>
						{renderToggleSourceButton()}
					</Animate.fromBottom>
				</div>
			)}
		</>
	)
})

function NamespaceRulesList({ namespaceRules }) {
	const colors = useContext(ThemeColorsContext)
	const sitePaths = useContext(SitePathsContext)
	return (
		<section>
			<h2>
				<Trans>Pages associées</Trans>
			</h2>
			<ul>
				{Object.values(namespaceRules).map(r => (
					<li key={r.name}>
						<Link
							style={{
								color: colors.textColorOnWhite,
								textDecoration: 'underline'
							}}
							to={sitePaths.documentation.rule(r.dottedName)}
						>
							{r.title || r.name}
						</Link>
					</li>
				))}
			</ul>
		</section>
	)
}
