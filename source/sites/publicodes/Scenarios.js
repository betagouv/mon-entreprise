import { React, emoji } from 'Components'
import { useContext } from 'react'
import scenarios from './scenarios.yaml'
import { StoreContext } from './StoreContext'
import { Link } from 'react-router-dom'

export default () => {
	let { state, dispatch } = useContext(StoreContext)

	return (
		<section id="scenarios">
			<h1>Quel futur souhaitez vous ?</h1>
			<p>
				Le jeu est simple : plus on émet de gaz à effet de serre, plus on se
				dirige vers une catastrophe climatique. Ces émissions se mesurent en{' '}
				<Link to="/à-propos">kilos équivalent CO₂</Link>. Pour mieux comprendre
				l'impact de notre quotidien sur le climat,{' '}
				<strong>nous l'avons converti en temps</strong>.
			</p>
			<p>
				<em>
					Si un voyage en avion en émet 500 kg et que la limite acceptable par
					personne et par an est de 6 tonnes, alors ce vol consomme un douzième
					de notre crédit à l'année : sur 2 petites heures de vol, j'ai grillé 1
					mois de mon crédit annuel !
				</em>
			</p>
			<p>
				Mais quelle doit être cette limite par personne ? Voici trois scénarios,
				à vous de choisir ! &nbsp;{emoji('👇')}
			</p>
			<ul
				css={`
					list-style-type: none;
					display: flex;
					flex-wrap: wrap;
					width: 80vw;
					position: absolute;
					left: 10vw;
					justify-content: center;
				`}>
				{Object.entries(scenarios).map(([nom, s]) => (
					<li
						className="ui__ card"
						css={`
							width: 16vw;
							min-width: 16em;
							margin: 1em;
							border: 2px solid var(--colour);

							h2 {
								margin-top: 0;
								font-size: 140%;
							}
							p {
								font-style: italic;
								font-size: 90%;
							}
							label {
								cursor: pointer;
								display: block;
							}

							:hover {
								background: var(--colour);
								color: var(--textColour);
							}
						`}>
						<label>
							<input
								css="width: 100%"
								type="radio"
								name="scenario"
								value={nom}
								checked={state.scenario === nom}
								onChange={() =>
									dispatch({ type: 'SET_SCENARIO', scenario: nom })
								}
							/>
							<h2>
								<span>{emoji(s.icône)}</span>&nbsp;
								{s.titre}
							</h2>
							<div title="Réchauffement à la fin du siècle">
								<strong>
									{emoji('🌡️ ')} {s.réchauffement}
								</strong>
							</div>
							<div>
								{emoji('💰 ')}
								{s['crédit carbone par personne']}&nbsp;t de CO₂ / tête / an
							</div>
							<div css="margin-top: 1em">
								<p>{s.description}</p>
							</div>
						</label>
					</li>
				))}
			</ul>
		</section>
	)
}
