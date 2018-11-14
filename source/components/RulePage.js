import { setExample } from 'Actions/actions'
import { ScrollToTop } from 'Components/utils/Scroll'
import { encodeRuleName } from 'Engine/rules'
import {
	decodeRuleName,
	findRuleByDottedName,
	findRulesByName
} from 'Engine/rules.js'
import { compose, head, path } from 'ramda'
import React, { Component } from 'react'
import { Trans, withI18n } from 'react-i18next'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link, Redirect } from 'react-router-dom'
import {
	flatRulesSelector,
	noUserInputSelector
} from 'Selectors/analyseSelectors'
import Namespace from './rule/Namespace'
import Rule from './rule/Rule'
import './RulePage.css'
import SearchButton from './SearchButton'

export default compose(
	connect(state => ({
		themeColours: state.themeColours,
		valuesToShow: !noUserInputSelector(state),
		flatRules: flatRulesSelector(state)
	})),
	withI18n()
)(
	class RulePage extends Component {
		render() {
			let { flatRules } = this.props,
				name = path(['match', 'params', 'name'], this.props),
				decodedRuleName = decodeRuleName(name)

			if (decodedRuleName.includes(' . ')) {
				if (!findRuleByDottedName(flatRules, decodedRuleName))
					return <Redirect to="/404" />

				return this.renderRule(decodedRuleName)
			}

			let rules = findRulesByName(flatRules, decodedRuleName)
			if (!rules.length) return <Redirect to="/404" />
			if (rules.length > 1)
				return <DisambiguateRuleQuery rules={rules} flatRules={flatRules} />
			let dottedName = head(rules).dottedName
			return this.renderRule(dottedName)
		}
		renderRule(dottedName) {
			return (
				<div id="RulePage">
					<ScrollToTop />
					<div className="rule-page__header ui__ container">
						<BackToSimulation
							visible={this.props.valuesToShow}
							colour={this.props.themeColours.colour}
						/>
						<SearchButton
							className="rule-page__search"
							rulePageBasePath="../règle"
						/>
					</div>
					<Rule dottedName={dottedName} />
				</div>
			)
		}
	}
)

const BackToSimulation = compose(
	connect(
		null,
		dispatch => ({
			setExample: compose(
				dispatch,
				setExample
			)
		})
	),
	withRouter,
	withI18n()
)(
	// Triggers rerender when the language changes
	class BackToSimulation extends Component {
		render() {
			let { colour, setExample, visible } = this.props
			return (
				<Link
					id="toSimulation"
					to="../simulation"
					onClick={() => {
						setExample(null)
					}}
					style={{ color: colour, visibility: visible ? 'visible' : 'hidden' }}>
					<i className="fa fa-arrow-left" aria-hidden="true" />
					<Trans i18nKey="back">Reprendre la simulation</Trans>
				</Link>
			)
		}
	}
)

let DisambiguateRuleQuery = ({ rules, flatRules }) => (
	<div className="centeredMessage">
		<p>
			<Trans i18nKey="ambiguous">
				Plusieurs règles de la base ont ce nom. Laquelle voulez-vous afficher ?
			</Trans>
		</p>
		<ul>
			{rules.map(({ dottedName, ns, title }) => (
				<li key={dottedName}>
					<Namespace ns={ns} flatRules={flatRules} />
					<Link to={'../règle/' + encodeRuleName(dottedName)}>{title}</Link>
				</li>
			))}
		</ul>
	</div>
)
