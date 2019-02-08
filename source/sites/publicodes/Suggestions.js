import { React, emoji } from 'Components'
import { connect } from 'react-redux'
import simulateurs from './simulateurs.yaml'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import { findRuleByDottedName } from 'Engine/rules'
import { Link } from 'react-router-dom'

export default connect(state => ({ rules: flatRulesSelector(state) }))(
	({ rules }) => (
		<section style={{ marginTop: '4rem' }}>
			<h2>Suggestions </h2>
			<ul>
				{simulateurs
					.map(dottedName => findRuleByDottedName(rules, dottedName))
					.map(r => (
						<Suggestion key={r.dottedName} {...r} />
					))}
			</ul>
		</section>
	)
)

let Suggestion = ({ dottedName, formule, title, icônes }) => (
	<li key={dottedName} css="background: red">
		<Link
			className={formule ? '' : 'comingSoon'}
			to={formule ? '/simulateur/' + dottedName : '#'}>
			{icônes && emoji(icônes + ' ')}
			{title}
		</Link>
	</li>
)
