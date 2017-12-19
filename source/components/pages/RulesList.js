import React, { Component } from "react"
import { rules, encodeRuleName, nameLeaf } from "Engine/rules.js"
import { Link } from "react-router-dom"
import './RulesList.css'
import './Pages.css'
import {capitalise0} from '../../utils'
import Header from './Header'

export default class RulesList extends Component {
	render() {
		return (
			<div id="RulesList" className="page">
				<Header />
				<h1>Les règles aujourd'hui implémentées</h1>
				<ul>
					{rules.map(rule => (
						<li key={rule.name}>
							<Link to={"/regle/" + encodeRuleName(rule.name)}>{capitalise0(rule.name)}</Link>
						</li>
					))}
				</ul>
			</div>
		)
	}
}
