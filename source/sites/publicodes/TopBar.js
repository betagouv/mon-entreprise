import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import scenarios from './scenarios.yaml'
import { StoreContext } from './StoreContext'
import Logo from './logo.svg'

export default withRouter(({ location }) => {
	let {
			state: { scenario: scenarioName },
		} = useContext(StoreContext),
		scenario = scenarios[scenarioName],
		displayIntro = ['/', '/contribuer/', '/à-propos'].includes(
			location.pathname
		)

	return (
		<section
			css={`
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-top: ${displayIntro ? 3 : 1}rem;
			`}
		>
			<Link to="/" title="Revenir à l'accueil">
				<img
					width="5em"
					css={`
						width: ${displayIntro ? '8em' : '5em'};
						@media (max-width: 800px) {
							${displayIntro ? 'display: none;' : ''}
						}
						margin-right: 1em;
					`}
					src={Logo}
					alt=""
				/>
			</Link>
			{displayIntro && (
				<p
					id="intro"
					css="max-width: 60%; line-height: 1.4rem; margin-right: 1em; "
				>
					La catastrophe climatique n'est plus une menace lointaine, c'est une
					actualité.&nbsp;<Link to="/à-propos">En savoir plus</Link>.
				</p>
			)}
			{!location.pathname.includes('/scénarios') && (
				<div
					className="ui__ card"
					css={`
						text-align: center;
						padding: 0.6rem 1rem !important;
						margin-right: 0.6rem;
						background: var(--color) !important;
						color: white;
						a {
							color: inherit;
						}
					`}
				>
					Votre futur&nbsp;:
					<div
						css={`
							img {
								font-size: 250%;
							}
						`}
					>
						{emoji(scenario.icône)}
					</div>
					<Link to="/scénarios">changer</Link>
				</div>
			)}
		</section>
	)
})
