import React, { Component } from 'react'
import { isEmpty, path, last } from 'ramda'
import { connect } from 'react-redux'
import './Rule.css'
import { capitalise0 } from '../../utils'
import References from './References'
import Algorithm from './Algorithm'
import Examples from './Examples'
import Helmet from 'react-helmet'
import { createMarkdownDiv } from 'Engine/marked'
import Destinataire from './Destinataire'
import { Link } from 'react-router-dom'
import { findRuleByNamespace, encodeRuleName, findRuleByDottedName } from 'Engine/rules'
import withColours from '../withColours'

import SearchButton from 'Components/SearchButton'

@connect(state => ({
	form: state.form,
	rules: state.parsedRules,
	flatRules: state.flatRules,
	currentExample: state.currentExample
}))
export default class Rule extends Component {
	render() {
		let { form, rule, currentExample, rules, flatRules } = this.props,
			flatRule = findRuleByDottedName(flatRules, rule.dottedName),
			conversationStarted = !isEmpty(form)

		let { type, name, title, description, question, ns } = flatRule,
			namespaceRules = findRuleByNamespace(rules, rule.dottedName)

		return (
			<div id="rule">
				<Helmet>
					<title>{title}</title>
					<meta name="description" content={description} />
				</Helmet>
				<SearchButton />
				<RuleMeta
					{...{
						ns,
						type,
						description,
						question,
						rule,
						name
					}}
				/>

				<section id="rule-content">
					<Algorithm
						rules={rules}
						currentExample={currentExample}
						rule={rule}
						showValues={conversationStarted || currentExample}
					/>
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
				<h2>Références</h2>
				<References refs={refs} />
			</div>
		) : null
}

let NamespaceRulesList = withColours(({ namespaceRules, rule, colours }) => (
	<section>
		<h2>
			Règles attachées<small>
				Ces règles sont dans l'espace de nom `{rule.name}`
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
						to={'/règle/' + encodeRuleName(r.dottedName)}
					>
						{r.name}
					</Link>
				</li>
			))}
		</ul>
	</section>
))

let RuleMeta = ({ ns, type, description, question, rule, name }) => (
	<section id="rule-meta">
		<div id="meta-header">
			{ns && <Namespace {...{ ns }} />}
			<h1>{capitalise0(name)}</h1>
		</div>
		<div id="meta-content">
			<div id="meta-paragraph">
				{type && (
					<span className="rule-type">
						<span>{type}</span>
					</span>
				)}
				{createMarkdownDiv(description || question)}
			</div>
			<Destinataire destinataire={path([type, 'destinataire'])(rule)} />
		</div>
	</section>
)

export let Namespace = withColours(({ ns, colours }) => (
	<ul id="namespace">
		{ns
			.split(' . ')
			.reduce(
				(memo, next) => [
					...memo,
					[...(memo.length ? memo.reverse()[0] : []), next]
				],
				[]
			)
			.map(fragments => (
				<li key={fragments.join()}>
					<Link
						style={{
							color: colours.textColourOnWhite,
							textDecoration: 'underline'
						}}
						to={'/règle/' + encodeRuleName(fragments.join(' . '))}
					>
						{capitalise0(last(fragments))}
					</Link>
					<i
						style={{ margin: '0 .6em', fontSize: '85%' }}
						className="fa fa-chevron-right"
						aria-hidden="true"
					/>
				</li>
			))}
	</ul>
))

let ReportError = () => (
	<button id="reportError">
		<a
			href={
				'mailto:contact@embauche.beta.gouv.fr?subject=Erreur dans une règle ' +
				name
			}
		>
			<i
				className="fa fa-exclamation-circle"
				aria-hidden="true"
				style={{ marginRight: '.6em' }}
			/>Signaler une erreur
		</a>
	</button>
)
