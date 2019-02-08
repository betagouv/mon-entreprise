import { React, emoji } from 'Components'
import { connect } from 'react-redux'
import simulateurs from './simulateurs.yaml'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import { findRuleByDottedName } from 'Engine/rules'
import { Link } from 'react-router-dom'

export default connect(state => ({ rules: flatRulesSelector(state) }))(
	({ rules }) => (
		<section style={{ marginTop: '4rem' }}>
			<h2>Suggestions :</h2>
			<ul css="display: flex; flex-wrap: wrap ">
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
	<li
		key={dottedName}
		css={`
			font-size: 135%;
			list-style-type: none;
			border: 3px solid var(--colour);
			padding: 1rem;
			margin: 1rem;
			width: 12rem;
			min-height: 6em;
			text-align: center;
			position: relative;
			${formule ? '' : 'filter: grayscale(70%); opacity: 0.6'}
		`}>
		<div css=" img { width: 2rem !important; height: 2rem !important}}">
			{icônes && emoji(icônes + ' ')}
		</div>
		<Link to={formule ? '/simulateur/' + dottedName : '#'}>{title}</Link>
		{!formule && (
			<div css="position: absolute; bottom: 0; left: 0; width: 100%; background: var(--colour); color: white; font-size: 80%">
				Prochainement !
			</div>
		)}
	</li>
)
