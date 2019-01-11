import { goBackToSimulation } from 'Actions/actions'
import { ScrollToTop } from 'Components/utils/Scroll'
import { encodeRuleName } from 'Engine/rules'
import {
	decodeRuleName,
	findRuleByDottedName,
	findRulesByName
} from 'Engine/rules.js'
import { compose, head, path } from 'ramda'
import React, { Component } from 'react'
import { Trans, withNamespaces } from 'react-i18next'
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
		// situationBranch:
		// 	state.simulationConfig?.branches[state.situationBranch]?.nom
	})),
	withNamespaces()
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
			if (rules.find(({ ns }) => ns == null))
				return this.renderRule(decodedRuleName)
			if (rules.length > 1)
				return <DisambiguateRuleQuery rules={rules} flatRules={flatRules} />
			let dottedName = head(rules).dottedName
			return this.renderRule(dottedName)
		}
		renderRule(dottedName) {
			let { situationBranch } = this.props
			return (
				<div id="RulePage">
					<ScrollToTop key={situationBranch + dottedName} />
					<div className="rule-page__header ui__ container">
						<BackToSimulation
							visible={this.props.valuesToShow}
							colour={this.props.themeColours.colour}
						/>
						{situationBranch && (
							<span id="situationBranch">{situationBranch}</span>
						)}
						<SearchButton className="rule-page__search" rulePageBasePath="" />
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
		{ goBackToSimulation }
	),
	withRouter,
	withNamespaces()
)(
	// Triggers rerender when the language changes
	class BackToSimulation extends Component {
		render() {
			let { goBackToSimulation, visible } = this.props
			return (
				<button
					to="../simulation"
					className="ui__ link-button"
					onClick={goBackToSimulation}
					style={{ visibility: visible ? 'visible' : 'hidden' }}>
					<i
						className="fa fa-arrow-left"
						aria-hidden="true"
						style={{ paddingRight: '0.2rem' }}
					/>
					<Trans i18nKey="back">Reprendre la simulation</Trans>
				</button>
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
					<Link to={'' + encodeRuleName(dottedName)}>{title}</Link>
				</li>
			))}
		</ul>
	</div>
)
