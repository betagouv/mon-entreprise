import { React, emoji } from 'Components'
import { connect } from 'react-redux'
import simulateurs from './simulateurs.yaml'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import { findRuleByDottedName } from 'Engine/rules'
import { Link } from 'react-router-dom'

export default connect(state => ({ rules: flatRulesSelector(state) }))(
	({ rules }) => (
		<section style={{ marginTop: '3rem' }}>
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
			font-size: 120%;
			list-style-type: none;
			border-radius: 1.5rem;
			padding: 1rem;
			margin: 1rem;
			width: 12rem;
			min-height: 7em;
			position: relative;
			display: flex;
			align-items: center;
			justify-content: middle;
			text-align: center;
			flex-wrap: wrap;
			${formule ? '' : 'filter: grayscale(70%); opacity: 0.6;'}

			background: var(--colour);
			color: white;
			:hover {
				box-shadow: 0 1px 6px rgba(32, 33, 36, 0.5);
			}
			a {
				color: white;
				text-decoration: none;
			}
		`}>
		<div css="width: 100%; img { width: 1.8rem !important; height: 1.8rem !important}}">
			{icônes && emoji(icônes + ' ')}
		</div>
		<Link css="width: 100%" to={formule ? '/simulateur/' + dottedName : '#'}>
			{title}
		</Link>
		{!formule && (
			<>
				<div css="visibility: hidden">placeholder</div>
				<div
					css={`
						position: absolute;
						border-bottom-left-radius: 1.2rem;
						border-bottom-right-radius: 1.2rem;
						bottom: 0;
						left: 0;
						width: 100%;
						background: var(--colour);
						color: white;
						font-size: 80%;
					`}>
					Prochainement !
				</div>
			</>
		)}
	</li>
)
