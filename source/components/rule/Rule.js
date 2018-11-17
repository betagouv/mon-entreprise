import withColours from 'Components/utils/withColours'
import withLanguage from 'Components/utils/withLanguage'
import { getInputComponent } from 'Engine/generateQuestions'
import { createMarkdownDiv } from 'Engine/marked'
import {
	encodeRuleName,
	findRuleByDottedName,
	findRuleByNamespace
} from 'Engine/rules'
import { compose, isEmpty } from 'ramda'
import React, { Component, Suspense } from 'react'
import Helmet from 'react-helmet'
import { Trans, withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { reduxForm } from 'redux-form'
import {
	exampleAnalysisSelector,
	flatRulesSelector,
	noUserInputSelector,
	ruleAnalysisSelector
} from 'Selectors/analyseSelectors'
import Algorithm from './Algorithm'
import Examples from './Examples'
import RuleHeader from './Header'
import References from './References'
import './Rule.css'
import { AttachDictionary } from '../AttachDictionary'
import knownMecanisms from 'Engine/known-mecanisms.yaml'
import emoji from 'react-easy-emoji'

let LazySource = React.lazy(() => import('./RuleSource'))

export default compose(
	connect((state, props) => ({
		currentExample: state.currentExample,
		flatRules: flatRulesSelector(state),
		valuesToShow: !noUserInputSelector(state),
		analysedRule: ruleAnalysisSelector(state, props),
		analysedExample: exampleAnalysisSelector(state, props)
	})),
	AttachDictionary(knownMecanisms),
	withNamespaces(),
	withLanguage
)(
	class Rule extends Component {
		state = { viewSource: false }
		render() {
			let {
					dottedName,
					currentExample,
					flatRules,
					valuesToShow,
					analysedExample,
					analysedRule,
					language
				} = this.props,
				flatRule = findRuleByDottedName(flatRules, dottedName)

			let { type, name, title, description, question, ns, icon } = flatRule,
				namespaceRules = findRuleByNamespace(flatRules, dottedName)

			let displayedRule = analysedExample || analysedRule

			return (
				<>
					{this.state.viewSource ? (
						<>
							{this.renderToggleSourceButton()}
							<Suspense fallback={<div>Chargement du code source...</div>}>
								<LazySource dottedName={dottedName} />
							</Suspense>
						</>
					) : (
						<div id="rule" className="ui__ container">
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
									title,
									icon,
									valuesToShow
								}}
							/>

							{this.renderToggleSourceButton()}
							<section id="rule-content">
								{displayedRule.nodeValue ? (
									<div id="ruleValue">
										<i className="fa fa-calculator" aria-hidden="true" />{' '}
										{displayedRule.format === 'euros' || displayedRule.formule
											? Intl.NumberFormat(language, {
													style: 'currency',
													currency: 'EUR'
											  }).format(displayedRule.nodeValue)
											: typeof displayedRule.nodeValue !== 'object'
											? displayedRule.nodeValue
											: null}
									</div>
								) : null}

								{displayedRule.defaultValue != null &&
								typeof displayedRule.defaultValue !== 'object' ? (
									<div id="ruleDefault">
										Valeur par défaut : {displayedRule.defaultValue}
									</div>
								) : null}

								{//flatRule.question &&
								// Fonctionnalité intéressante, à implémenter correctement
								false && <UserInput {...{ flatRules, dottedName }} />}
								<Algorithm
									rule={displayedRule}
									showValues={valuesToShow || currentExample}
								/>
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
									<NamespaceRulesList {...{ namespaceRules }} />
								)}
								{this.renderReferences(flatRule)}
							</section>
						</div>
					)}
				</>
			)
		}

		renderToggleSourceButton() {
			let { viewSource } = this.state
			return (
				<button
					id="toggleRuleSource"
					onClick={() => this.setState({ viewSource: !viewSource })}>
					{emoji(viewSource ? '📖' : '✍️')}
				</button>
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
)

let NamespaceRulesList = withColours(({ namespaceRules, colours }) => (
	<section>
		<h2>
			<Trans>Règles associées</Trans>
		</h2>
		<ul>
			{namespaceRules.map(r => (
				<li key={r.name}>
					<Link
						style={{
							color: colours.textColourOnWhite,
							textDecoration: 'underline'
						}}
						to={'../règle/' + encodeRuleName(r.dottedName)}>
						{r.title || r.name}
					</Link>
				</li>
			))}
		</ul>
	</section>
))

const UserInput = reduxForm({
	form: 'conversation',
	destroyOnUnmount: false
})(
	class UserInput extends Component {
		render() {
			let { flatRules, dottedName } = this.props
			return getInputComponent(flatRules)(dottedName)
		}
	}
)
