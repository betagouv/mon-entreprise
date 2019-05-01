import { React, emoji } from 'Components'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import scenarios from './scenarios.yaml'
import { StoreContext } from './StoreContext'
import { withRouter } from 'react-router'

export default withRouter(({ location }) => {
	let {
			state: { scenario: scenarioName }
		} = useContext(StoreContext),
		scenario = scenarios[scenarioName],
		displayIntro = location.pathname === '/'

	return (
		<section
			css={`
				display: flex;
				align-items: center;
				justify-content: center;
				padding-top: 2.6em;
			`}>
			<div
				css={`
					position: fixed;
					width: 100%;
					left: 0;
					top: 0;
					background: yellow;
					text-align: center;
					font-size: 90%;
					padding: 0.2em 0;
				`}>
				{emoji('')} Version beta : n'hésitez pas à tester ce site, mais sachez
				que les données ne sont pas encore validées
			</div>
			<Link to="/">
				<img
					css={`
						width: ${displayIntro ? '6rem' : '5em'};
						@media (min-width: 800px) {
							width: ${displayIntro ? '8em' : '5em'};
						}
						margin-right: 1em;
					`}
					src={require('./logo.png')}
				/>
			</Link>
			{displayIntro && (
				<p id="intro" css="max-width: 28rem">
					La <strong>catastrophe climatique</strong> n'est plus une menace
					lointaine et incertaine, c'est une <strong>actualité</strong>. Comment
					l'éviter ? Chacun de nos gestes a un impact, découvrez-le !{' '}
					<Link to="/à-propos">En savoir plus</Link>.{' '}
				</p>
			)}
			{!displayIntro && (
				<div
					className="ui__ card"
					css={`
						.key {
							font-size: 80%;
						}
					`}>
					<div>
						<span className="key">Scénario choisi : </span>
						<Link to="/scénarios" css={``}>
							« {scenario.titre} »
						</Link>
					</div>
					<div
						css={`
							img {
								font-size: 140%;
							}
							display: flex;
							align-items: center;
						`}>
						<span className="key">Futur : &nbsp;</span>
						<Link to="/scénarios">{emoji(scenario.icône)}</Link>
					</div>
				</div>
			)}
		</section>
	)
})
