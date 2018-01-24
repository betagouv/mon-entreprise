import React, { Component } from 'react'
import { isEmpty, path } from 'ramda'
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
import { findRuleByNamespace } from 'Engine/rules'
import withColours from '../withColours'

@connect(state => ({
	form: state.form,
	textColourOnWhite: state.themeColours.textColourOnWhite,
	rules: state.parsedRules
}))
export default class Rule extends Component {
	state = {
		example: null,
		showValues: true
	}
	render() {
		let { form, rule, textColourOnWhite } = this.props,
			conversationStarted = !isEmpty(form),
			situationExists = conversationStarted || this.state.example != null

		let { type, name, title, description, question, ns } = rule,
			situationOrExampleRule = path(['example', 'rule'])(this.state) || rule,
			namespaceRules = findRuleByNamespace(this.props.rules, rule.dottedName)

		return (
			<div id="rule">
				<Helmet>
					<title>{title}</title>
					<meta name="description" content={description} />
				</Helmet>

				<RuleMeta
					{...{
						textColourOnWhite,
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
						rule={situationOrExampleRule}
						showValues={situationExists}
					/>
					<Examples
						situationExists={conversationStarted}
						rule={rule}
						focusedExample={this.state.example}
						showValues={this.state.showValues}
						inject={example =>
							this.state.example != null
								? this.setState({ example: null })
								: this.setState({ example, showValues: true })
						}
					/>
					{!isEmpty(namespaceRules) && (
						<NamespaceRules {...{ rule, namespaceRules }} />
					)}
					{this.renderReferences(rule)}
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

let NamespaceRules = withColours(({ namespaceRules, rule, colours }) => (
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
						to={'/règle/' + r.name}
					>
						{r.name}
					</Link>
				</li>
			))}
		</ul>
	</section>
))

let RuleMeta = ({
	textColourOnWhite,
	ns,
	type,
	description,
	question,
	rule,
	name
}) => (
	<section id="rule-meta">
		<div id="meta-header">
			{ns && <Namespace {...{ textColourOnWhite, ns }} />}
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

let Namespace = ({ ns, textColourOnWhite }) => (
	<ul id="namespace">
		{ns.split(' . ').map(fragment => (
			<li key={fragment}>
				<Link
					style={{
						color: textColourOnWhite,
						textDecoration: 'underline'
					}}
					to={'/règle/' + fragment}
				>
					{capitalise0(fragment)}
				</Link>
				<i
					style={{ margin: '0 .6em', fontSize: '85%' }}
					className="fa fa-chevron-right"
					aria-hidden="true"
				/>
			</li>
		))}
	</ul>
)

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
