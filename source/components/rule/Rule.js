import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { isEmpty } from 'ramda'
import { connect } from 'react-redux'
import './Rule.css'
import References from './References'
import Algorithm from './Algorithm'
import Examples from './Examples'
import Helmet from 'react-helmet'
import { createMarkdownDiv } from 'Engine/marked'
import RuleHeader from './Header'
import { Link } from 'react-router-dom'
import {
	findRuleByNamespace,
	encodeRuleName,
	findRuleByDottedName
} from 'Engine/rules'
import withColours from '../withColours'
import {
	noUserInputSelector,
	flatRulesSelector,
	ruleAnalysisSelector,
	exampleAnalysisSelector
} from 'Selectors/analyseSelectors'

@connect((state, props) => ({
	currentExample: state.currentExample,
	flatRules: flatRulesSelector(state),
	valuesToShow: !noUserInputSelector(state),
	analysedRule: ruleAnalysisSelector(state, props),
	analysedExample: exampleAnalysisSelector(state, props)
}))
@translate()
export default class Rule extends Component {
	render() {
		let {
				dottedName,
				currentExample,
				flatRules,
				valuesToShow,
				analysedExample,
				analysedRule
			} = this.props,
			flatRule = findRuleByDottedName(flatRules, dottedName)

		let { type, name, title, description, question, ns } = flatRule,
			namespaceRules = findRuleByNamespace(flatRules, dottedName)

		let displayedRule = analysedExample || analysedRule

		return (
			<div id="rule">
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
						title
					}}
				/>

				<section id="rule-content">
					{flatRule.ns && (
						<Algorithm
							rule={displayedRule}
							showValues={valuesToShow || currentExample}
						/>
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
						<NamespaceRulesList {...{ flatRule, namespaceRules }} />
					)}
					{this.renderReferences(flatRule)}
				</section>
				<ReportError name={name} />
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

let NamespaceRulesList = withColours(
	({ namespaceRules, flatRule, colours }) => (
		<section>
			<h2>
				<Trans>Règles attachées</Trans>
				<small>
					<Trans i18nKey="inspace">Ces règles sont dans l’espace de nom</Trans>{' '}
					`{flatRule.title}`
				</small>
			</h2>
			<ul>
				{namespaceRules.map(r => (
					<li key={r.name}>
						<Link
							style={{
								color: colours.textColourOnWhite,
								textDecoration: 'underline'
							}}
							to={'/règle/' + encodeRuleName(r.dottedName)}>
							{r.title || r.name}
						</Link>
					</li>
				))}
			</ul>
		</section>
	)
)

let ReportError = ({ name }) => (
	<div className="reportErrorContainer">
		<a
			className="reportError"
			href={
				'mailto:contact@embauche.beta.gouv.fr?subject=Erreur dans la règle : ' +
				name
			}>
			<i
				className="fa fa-exclamation-circle"
				aria-hidden="true"
				style={{ marginRight: '.6em' }}
			/>
			<Trans i18nKey="reportError">Signaler une erreur</Trans>
		</a>
	</div>
)
