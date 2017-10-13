import React, { Component } from "react"
import { rules, encodeRuleName, nameLeaf } from "Engine/rules.js"
import { Link } from "react-router-dom"
import './RulesList.css'
import {capitalise0} from '../utils'

export default class RulesList extends Component {
	render() {
		return (
			<div id="RulesList">
				<h1>Notre base de règles</h1>
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
