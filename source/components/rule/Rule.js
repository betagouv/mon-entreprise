import withColours from 'Components/utils/withColours'
import withLanguage from 'Components/utils/withLanguage'
import { getInputComponent } from 'Engine/generateQuestions'
import { createMarkdownDiv } from 'Engine/marked'
import {
	encodeRuleName,
	findRuleByDottedName,
	findRuleByNamespace
} from 'Engine/rules'
import { isEmpty } from 'ramda'
import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { reduxForm } from 'redux-form'
import {
	exampleAnalysisSelector,
	flatRulesSelector,
	noUserInputSelector,
	ruleAnalysisSelector
} from 'Selectors/analyseSelectors'
import Algorithm from './Algorithm'
import Examples from './Examples'
import RuleHeader from './Header'
import References from './References'
import './Rule.css'

@connect((state, props) => ({
	currentExample: state.currentExample,
	flatRules: flatRulesSelector(state),
	valuesToShow: !noUserInputSelector(state),
	analysedRule: ruleAnalysisSelector(state, props),
	analysedExample: exampleAnalysisSelector(state, props)
}))
@translate()
@withLanguage
class Rule extends Component {
	render() {
		let {
				dottedName,
				currentExample,
				flatRules,
				valuesToShow,
				analysedExample,
				analysedRule,
				language
			} = this.props,
			flatRule = findRuleByDottedName(flatRules, dottedName)

		let { type, name, title, description, question, ns, icon } = flatRule,
			namespaceRules = findRuleByNamespace(flatRules, dottedName)

		let displayedRule = analysedExample || analysedRule
		let showValues = valuesToShow || currentExample

		return (
			<div id="rule" className="ui__ container">
				<Helmet>
					<title>{title}</title>
					<meta name="description" content={description} />
				</Helmet>
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
						icon
					}}
				/>

				<section id="rule-content">
					{displayedRule.nodeValue ? (
						<div id="ruleValue">
							<i className="fa fa-calculator" aria-hidden="true" />{' '}
							{displayedRule.format === 'euros'
								? Intl.NumberFormat(language, {
										style: 'currency',
										currency: 'EUR'
								  }).format(displayedRule.nodeValue)
								: typeof displayedRule.nodeValue !== 'object'
									? displayedRule.nodeValue
									: null}
						</div>
					) : null}

					{displayedRule.defaultValue != null &&
					typeof displayedRule.defaultValue !== 'object' ? (
						<div id="ruleDefault">
							Valeur par défaut : {displayedRule.defaultValue}
						</div>
					) : null}

					{//flatRule.question &&
					// Fonctionnalité intéressante, à implémenter correctement
					false && <UserInput {...{ flatRules, dottedName }} />}
					{flatRule.ns && (
						<Algorithm rule={displayedRule} showValues={showValues} />
					)}
					{flatRule.note && (
						<section id="notes">
							<h3>Note: </h3>
							{createMarkdownDiv(flatRule.note)}
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
					{this.renderReferences(flatRule)}
				</section>
			</div>
		)
	}

	renderReferences = ({ références: refs }) =>
		refs ? (
			<div>
				<h2>
					<Trans>Références</Trans>
				</h2>
				<References refs={refs} />
			</div>
		) : null
}

let NamespaceRulesList = withColours(({ namespaceRules, colours }) => (
	<section>
		<h2>
			<Trans>Règles associées</Trans>
		</h2>
		<ul>
			{namespaceRules.map(r => (
				<li key={r.name}>
					<Link
						style={{
							color: colours.textColourOnWhite,
							textDecoration: 'underline'
						}}
						to={'../règle/' + encodeRuleName(r.dottedName)}>
						{r.title || r.name}
					</Link>
				</li>
			))}
		</ul>
	</section>
))

@reduxForm({
	form: 'conversation',
	destroyOnUnmount: false
})
class UserInput extends Component {
	render() {
		let { flatRules, dottedName } = this.props
		return getInputComponent(flatRules)(dottedName)
	}
}

export default Rule
