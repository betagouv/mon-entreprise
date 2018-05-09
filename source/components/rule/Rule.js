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

@connect(state => ({
	analysis: state.analysis,
	rules: state.parsedRules,
	flatRules: state.flatRules,
	currentExample: state.currentExample
}))
@translate()
export default class Rule extends Component {
	render() {
		let { rule, currentExample, rules, flatRules, analysis } = this.props,
			flatRule = findRuleByDottedName(flatRules, rule.dottedName),
			conversationStarted = !isEmpty(analysis)

		let { type, name, title, description, question, ns } = flatRule,
			namespaceRules = findRuleByNamespace(flatRules, rule.dottedName)

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
						rule,
						flatRules,
						name,
						title
					}}
				/>

				<section id="rule-content">
					{flatRule.ns && (
						<Algorithm
							rules={rules}
							currentExample={currentExample}
							rule={rule}
							showValues={conversationStarted || currentExample}
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
						situationExists={conversationStarted}
						rule={flatRule}
					/>
					{!isEmpty(namespaceRules) && (
						<NamespaceRulesList {...{ flatRule, namespaceRules }} />
					)}
					{this.renderReferences(flatRule)}
				</section>
				<ReportError />
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

let ReportError = () => (
	<button id="reportError">
		<a
			href={
				'mailto:contact@embauche.beta.gouv.fr?subject=Erreur dans une règle ' +
				name
			}>
			<i
				className="fa fa-exclamation-circle"
				aria-hidden="true"
				style={{ marginRight: '.6em' }}
			/>
			<Trans i18nKey="reportError">Signaler une erreur</Trans>
		</a>
	</button>
)
