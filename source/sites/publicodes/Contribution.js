import { toPairs } from 'ramda'
import React, { useState } from 'react'
import emoji from 'react-easy-emoji'

let formStyle = `
label {
	display: block;
	margin-bottom: 1em;
}
label input, label textarea {
	display: block;
	border-radius: .3em;
	padding: .3em ;
	border: 1px solid var(--color);
	box-shadow: none;
	margin-top: .6em;
	font-size: 100%;
	width: 80%

}
label textarea {
	height: 6em;
}`

let createIssue = (title, body, setURL) =>
	fetch(
		'https://publicodes.netlify.app/.netlify/functions/createIssue?' +
			toPairs({ repo: 'betagouv/ecolab-data', title, body })
				.map(([k, v]) => k + '=' + encodeURIComponent(v))
				.join('&'),
		{ mode: 'cors' }
	)
		.then((response) => response.json())
		.then((json) => setURL(json.url))

export default ({ match }) => {
	let input = match.params.input
	let [sujet, setSujet] = useState(input)

	let [source, setSource] = useState('')
	let [URL, setURL] = useState(null)

	return (
		<div className="ui__ container">
			<h1>Contribuer</h1>
			<p>
				{emoji('➡ ')}Vous connaissez Github ? Dans ce cas, venez contribuer
				directement sur le projet{' '}
				<a href="https://github.com/betagouv/ecolab-data/blob/master/CONTRIBUTING.md">
					en suivant ce guide
				</a>
				.
			</p>
			<p>
				{emoji('➡ ')}Sinon, laissez-nous un message via le formulaire suivant.
			</p>
			{!URL ? (
				<form css={formStyle}>
					<label css="color: var(--color)">
						Le titre bref de votre question, remarque, correction
						<input
							value={sujet}
							onChange={(e) => setSujet(e.target.value)}
							type="text"
							name="sujet"
							required
						/>
					</label>
					<label css="color: var(--color)">
						<p>La description complète de votre remarque</p>
						<p>
							<em>
								N'hésitez pas à inclure des chiffres, des sources, des articles
								de presse, une ébauche de calcul par vos soins etc.
							</em>
						</p>
						<textarea
							value={source}
							onChange={(e) => setSource(e.target.value)}
							name="source"
							required
						/>
					</label>
					<p>
						<em>
							Cette contribution sera publique : n'y mettez pas d'informations
							sensibles
						</em>
					</p>
					<button
						className="ui__ button"
						type="submit"
						onClick={(e) => {
							e.preventDefault()
							createIssue(sujet, source, setURL)
						}}
					>
						Valider
					</button>
				</form>
			) : (
				<p>
					Merci {emoji('😍')} ! Suivez l'avancement de votre suggestion en
					cliquant sur <a href={URL}>ce lien</a>.
				</p>
			)}
		</div>
	)
}
