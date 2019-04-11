import { T } from 'Components';
import withColours from 'Components/utils/withColours';
import withLanguage from 'Components/utils/withLanguage';
import withSitePaths from 'Components/utils/withSitePaths';
import { getInputComponent } from 'Engine/generateQuestions';
import knownMecanisms from 'Engine/known-mecanisms.yaml';
import { createMarkdownDiv } from 'Engine/marked';
import { encodeRuleName, findRuleByDottedName, findRuleByNamespace } from 'Engine/rules';
import { compose, isEmpty, isNil } from 'ramda';
import React, { Component, Suspense } from 'react';
import emoji from 'react-easy-emoji';
import { Helmet } from 'react-helmet';
import { Trans, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reduxForm } from 'redux-form';
import { exampleAnalysisSelector, flatRulesSelector, noUserInputSelector, ruleAnalysisSelector } from 'Selectors/analyseSelectors';
import Animate from 'Ui/animate';
import Montant from 'Ui/Montant';
import { AttachDictionary } from '../AttachDictionary';
import Algorithm from './Algorithm';
import Examples from './Examples';
import RuleHeader from './Header';
import References from './References';
import './Rule.css';

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
	withTranslation(),
	withSitePaths,
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
					sitePaths,
					analysedExample,
					analysedRule
				} = this.props,
				flatRule = findRuleByDottedName(flatRules, dottedName)
			let { type, name, title, description, question, ns, icon } = flatRule,
				namespaceRules = findRuleByNamespace(flatRules, dottedName)

			let displayedRule = analysedExample || analysedRule
			let ruleFormat = displayedRule.format || displayedRule.explanation?.format
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
						<div id="rule">
							<Animate.fromBottom>
								<Helmet
									title={title}
									meta={[
										{
											name: 'description',
											content: description
										}
									]}
								/>
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

								<section id="rule-content">
									{!isNil(displayedRule.nodeValue) && (
										<div id="ruleValue">
											{['euros', 'pourcentage'].includes(ruleFormat) ||
											displayedRule.formule ? (
												<Montant
													type={
														ruleFormat === 'euros'
															? 'currency'
															: ruleFormat === 'pourcentage'
															? 'percent'
															: 'decimal'
													}>
													{displayedRule.nodeValue}
												</Montant>
											) : typeof displayedRule.nodeValue !== 'object' ? (
												displayedRule.nodeValue
											) : null}
										</div>
									)}
									{displayedRule.defaultValue != null &&
									typeof displayedRule.defaultValue !== 'object' ? (
										<div id="ruleDefault">
											Valeur par défaut : {displayedRule.defaultValue}
										</div>
									) : null}
									{!valuesToShow && (
										<div style={{ textAlign: 'center', marginTop: '1em' }}>
											<Link
												className="ui__ plain button"
												to={
													sitePaths.sécuritéSociale
														? sitePaths.sécuritéSociale.index
														: sitePaths.index
												}>
												<T>Faire une simulation</T>
											</Link>
										</div>
									)}
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
								{this.renderToggleSourceButton()}
							</Animate.fromBottom>
						</div>
					)}
				</>
			)
		}

		renderToggleSourceButton() {
			let { viewSource } = this.state
			let { t } = this.props
			return (
				<button
					id="toggleRuleSource"
					className="ui__ link-button"
					onClick={() => this.setState({ viewSource: !viewSource })}>
					{emoji(
						viewSource
							? `📖 ${t('Revenir à la documentation')}`
							: `✍️ ${t('Voir le code source')}`
					)}
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

let NamespaceRulesList = compose(
	withColours,
	withSitePaths
)(({ namespaceRules, colours, sitePaths }) => {
	return (
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
							to={
								sitePaths.documentation.index +
								'/' +
								encodeRuleName(r.dottedName)
							}>
							{r.title || r.name}
						</Link>
					</li>
				))}
			</ul>
		</section>
	)
})

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
