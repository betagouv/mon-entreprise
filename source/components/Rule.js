import React, { Component } from 'react'
// import {findRuleByName} from '../engine/rules.js'
import {analyseSituation} from '../engine/traverse'
import './Rule.css'
import JSONTree from 'react-json-tree'
import R from 'ramda'
import PageTypeIcon from './PageTypeIcon'

export default class Rule extends Component {
	render() {
		let {
			name
		} = this.props.params,
			rule = analyseSituation(
				v => ({'A': 'non', 'B': 'oui', 'C': 'oui', 'Z': 'non', 'X': 'non'}[v])
			)[0]

		return (
			<div id="rule">
				Pourquoi cette règle me concerne ? Comment est-elle calculée ?
				<PageTypeIcon type="comprendre"/>
				<h1>
					<span className="rule-type">{rule.type}</span>
					<span className="rule-name">{name}</span>
				</h1>
				<section id="rule-meta" style={{display: 'none'}}>
					<div id="meta-paragraph">
						<p>
							{rule.description}
						</p>
					</div>
					<div>
						<h2>Propriétés</h2>
						{this.renderObject({
							...rule.attributs,
							'contexte': rule['attache']
						})}
						<h2>Références</h2>
						{this.renderReferences(rule)}
					</div>
				</section>
				<section id="rule-rules">
					{ do {
						let cond =
							R.toPairs(rule).find(([,v]) => v.rulePropType == 'cond')
						cond != null && <section id="declenchement">
							<h2>Conditions de déclenchement</h2>
							<RuleProp {...cond[1]} />
						</section>
					}}
					<section id="formule">
						<h2>Formule</h2>
						{this.renderObject(rule['formule'])}
					</section>
				</section>

				{/* <pre>
						{this.renderObject(rule)}
				</pre> */}
			</div>
		)
	}
	renderObject(o, rootKey){

		return <JSONTree
			getItemString={() => ''}
			theme={theme}
			hideRoot="true"
			shouldExpandNode={() => true}
			data={rootKey ? {[rootKey]: o} : o} />
	}

	renderReferences(rule) {
		return (
			rule['référence'] && <div>{rule['référence']}</div>)
		|| (
			rule['références'] && <ul id="rule-references">
				{R.toPairs(rule['références']).map(
					([name, link]) =>
						<li key={name}>
							{link.indexOf('legifrance.gouv') >= 0 &&
								<i className="fa fa-gavel" aria-hidden="true"></i>
							}
							<a href={link} target="_blank">
								{name}
							</a>
						</li>
				)}
			</ul>
		)
	}
}

let RuleProp = ({nodeValue, explanation, name}) =>
<div className="ruleProp node" >
	<div>
		<span className="name">{name}</span>
		<NodeValue data={nodeValue}/>
	</div>
	{
		explanation.category == 'mecanism' && <Mecanism {...explanation}/>
	}
	{
		explanation.category == 'expression' && <Expression {...explanation}/>
	}
</div>

let Mecanism = ({nodeValue, name, explanation}) =>
<div className="mecanism node" >
	<div>
		<span className="name">{name}</span>
		<NodeValue data={nodeValue}/>
	</div>
	<ul>
		{explanation.map(item => <li key={item.expression + item.name}>
			{item.category == 'expression' ?
				<Expression {...item} /> : <Mecanism {...item} />
			}
		</li>)}
	</ul>
</div>

let Expression = ({nodeValue, expression}) =>
<div className="expression node" >
	<div>
		<span className="name">{expression}</span>
		<NodeValue data={nodeValue}/>
	</div>
</div>

let NodeValue = ({data}) => do {
	let valeur = data == null ? '?' : (
		data ? 'oui' : 'non'
	);
	<span className={"value " + valeur}>←&nbsp;
		{valeur}
	</span>
}




var theme =  {
	scheme: 'atelier forest',
	author: 'bram de haan (http://atelierbram.github.io/syntax-highlighting/atelier-schemes/forest)',
	base00: '#1b1918',
	base01: '#2c2421',
	base02: '#68615e',
	base03: '#766e6b',
	base04: '#9c9491',
	base05: '#a8a19f',
	base06: '#e6e2e0',
	base07: '#f1efee',
	base08: '#f22c40',
	base09: '#df5320',
	base0A: '#d5911a',
	base0B: '#5ab738',
	base0C: '#00ad9c',
	base0D: '#407ee7',
	base0E: '#6666ea',
	base0F: '#c33ff3'
}
