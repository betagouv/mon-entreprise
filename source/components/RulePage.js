import { goBackToSimulation } from 'Actions/actions'
import { ScrollToTop } from 'Components/utils/Scroll'
import withSitePaths from 'Components/utils/withSitePaths'
import { encodeRuleName } from 'Engine/rules'
import {
	decodeRuleName,
	findRuleByDottedName,
	findRulesByName
} from 'Engine/rules.js'
import { compose, head, path } from 'ramda'
import React, { Component } from 'react'
import emoji from 'react-easy-emoji'
import { Trans, withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link, Redirect } from 'react-router-dom'
import {
	flatRulesSelector,
	noUserInputSelector,
	situationBranchNameSelector
} from 'Selectors/analyseSelectors'
import Namespace from './rule/Namespace'
import Rule from './rule/Rule'
import './RulePage.css'
import SearchButton from './SearchButton'

export default compose(
	connect(state => ({
		valuesToShow: !noUserInputSelector(state),
		flatRules: flatRulesSelector(state),
		brancheName: situationBranchNameSelector(state)
	})),
	withSitePaths,
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
			let { brancheName, sitePaths } = this.props
			return (
				<div id="RulePage">
					<ScrollToTop key={brancheName + dottedName} />
					<div className="rule-page__header">
						{this.props.valuesToShow ? (
							<BackToSimulation />
						) : (
							<span>
								{emoji('🧾')}{' '}
								<Link to={sitePaths.sécuritéSociale.index}>
									Calculer vos cotisations
								</Link>
							</span>
						)}
						{brancheName && <span id="situationBranch">{brancheName}</span>}
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
			let { goBackToSimulation } = this.props
			return (
				<button
					className="ui__ link-button"
					onClick={goBackToSimulation}>
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
