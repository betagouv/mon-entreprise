import { ThemeColorsContext } from 'Components/utils/colors'
import { EngineContext, useEvaluation } from 'Components/utils/EngineContext'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { formatValue } from 'Engine/format'
import mecanisms from 'Engine/mecanisms.yaml'
import { serializeUnit } from 'Engine/units'
import { filter, isEmpty } from 'ramda'
import React, { Suspense, useContext, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Animate from 'Ui/animate'
import { AttachDictionary } from '../AttachDictionary'
import RuleLink from '../RuleLink'
import { Markdown } from '../utils/markdown'
import Algorithm from './Algorithm'
import Examples from './Examples'
import RuleHeader from './Header'
import References from './References'
import { UseDefaultValuesContext } from './UseDefaultValuesContext'

let LazySource = React.lazy(() => import('./RuleSource'))

export default AttachDictionary(mecanisms)(function Rule({ dottedName }) {
	const [currentExample, setCurrentExample] = useState(null)
	const rules = useContext(EngineContext).getParsedRules()
	const useDefaultValues = useContext(UseDefaultValuesContext)
	const rule = useEvaluation(dottedName, { useDefaultValues })
	const [viewSource, setViewSource] = useState(false)
	const { t, i18n } = useTranslation()
	let { type, name, acronyme, title, description, question, icon } = rule,
		namespaceRules = filter(
			rule =>
				rule.dottedName.startsWith(dottedName) &&
				rule.dottedName.split(' . ').length ===
					dottedName.split(' . ').length + 1,
			rules
		)

	const renderReferences = ({ références: refs }) =>
		refs ? (
			<div>
				<h2>
					<Trans>Références</Trans>
				</h2>
				<References refs={refs} />
			</div>
		) : null

	return (
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
						dottedName,
						type,
						description,
						question,
						flatRule: rule,
						name,
						acronyme,
						title,
						icon
					}}
				/>
				{(rule.nodeValue || rule.defaultValue || rule.unit) && (
					<>
						<p
							className="ui__ lead card light-bg"
							css={`
								display: inline-block;
							`}
						>
							{rule.nodeValue != null && (
								<>
									{formatValue({ ...rule, language: i18n.language })}
									<br />
								</>
							)}
							{rule.defaultValue?.nodeValue != null && (
								<>
									<small>
										Valeur par défaut :{' '}
										{formatValue({
											...rule.defaultValue,
											language: i18n.language
										})}
									</small>
									<br />
								</>
							)}
							{rule.nodeValue == null && !rule.defaultValue?.unit && rule.unit && (
								<>
									<small>Unité : {serializeUnit(rule.unit)}</small>
								</>
							)}
						</p>
					</>
				)}

				<Algorithm rule={rule} />

				{viewSource === dottedName ? (
					<Suspense fallback={<div>Chargement du code source...</div>}>
						<LazySource dottedName={dottedName} />
					</Suspense>
				) : (
					<div
						css={`
							text-align: right;
							margin-top: 1rem;
						`}
					>
						<button
							className="ui__ small simple button"
							onClick={() => setViewSource(dottedName)}
						>
							{emoji('✍️')} {t('Afficher la description publicode')}
						</button>
					</div>
				)}

				{rule['rend non applicable'] && (
					<>
						<h3>
							<Trans>Rend non applicable les règles suivantes</Trans> :{' '}
						</h3>
						<ul>
							{rule['rend non applicable'].map(ruleName => (
								<li key={ruleName}>
									<RuleLink dottedName={ruleName} />
								</li>
							))}
						</ul>
					</>
				)}
				{rule.note && (
					<>
						<h3>Note</h3>
						<div className="ui__ notice">
							<Markdown source={rule.note} />
						</div>
					</>
				)}
				{renderReferences(rule)}
				<Examples
					currentExample={currentExample}
					rule={rule}
					setCurrentExample={setCurrentExample}
				/>

				{!isEmpty(namespaceRules) && (
					<NamespaceRulesList {...{ namespaceRules }} />
				)}
			</Animate.fromBottom>
		</div>
	)
})

function NamespaceRulesList({ namespaceRules }) {
	const colors = useContext(ThemeColorsContext)
	const sitePaths = useContext(SitePathsContext)
	const useDefaultValues = useContext(UseDefaultValuesContext)
	return (
		<section>
			<h2>
				<Trans>Pages associées</Trans>
			</h2>
			<ul>
				{Object.values(namespaceRules).map(r => (
					<li key={r.name}>
						<Link
							style={{
								color: colors.textColorOnWhite,
								textDecoration: 'underline'
							}}
							to={{
								pathname: sitePaths.documentation.rule(r.dottedName),
								state: { useDefaultValues }
							}}
						>
							{r.title || r.name}
						</Link>
					</li>
				))}
			</ul>
		</section>
	)
}
