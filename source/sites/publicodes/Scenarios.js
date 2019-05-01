import { React, emoji } from 'Components'
import { useContext } from 'react'
import scenarios from './scenarios.yaml'
import { StoreContext } from './StoreContext'

export default () => {
	let { state, dispatch } = useContext(StoreContext)

	return (
		<section id="scenarios">
			<h1>Quel futur souhaitez vous ?</h1>
			<p>
				Pour mieux comprendre l'impact de notre quotidien sur le climat, nous
				l'avons converti en temps.
			</p>
			<p>
				Si un vol émet 500 kg d'équivalent CO₂ (c'est ainsi que l'on mesure la
				contribution au réchauffement climatique), et qu'on définit la limite
				acceptable par personne à 6 tonnes, alors ce vol consomme un douzième de
				notre crédit à l'année, soit exactement un mois : sur 2 petites heures
				de vol, j'ai grillé 1 mois de crédit annuel !
			</p>
			<p>
				Mais quelle doit être cette limite par personne ? Voici quatre
				scénarios, à vous de choisir ! &nbsp;{emoji('👇')}
			</p>
			<ul
				css={`
					list-style-type: none;
					display: flex;
					flex-wrap: wrap;
					width: 80vw;
					position: absolute;
					left: 10vw;
				`}>
				{Object.entries(scenarios).map(([nom, s]) => (
					<li
						className="ui__ card"
						css={`
							width: 16vw;
							min-width: 16em;
							margin: 1em;

							h2 {
								margin-top: 0;
							}
							p {
								font-style: italic;
								text-align: justify;
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
							<div>
								{emoji('🇫🇷')}&nbsp; Limite par tête :{' '}
								{s['crédit carbone par personne']}&nbsp;t
							</div>
							<div>
								{emoji('🌡️ ')} {s.réchauffement}
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
