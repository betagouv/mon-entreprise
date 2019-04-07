import { React, emoji } from 'Components'
import { useState } from 'react'
import { toPairs } from 'ramda'

let formStyle = `
label {
	display: block;
	margin-bottom: 1em;
}
label input, label textarea {
	display: block;
	border-radius: .3em;
	padding: .3em ;
	border: 1px solid var(--colour);
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
		'https://publicodes.netlify.com/.netlify/functions/createIssue?' +
			toPairs({ repo: 'laem/futureco-data', title, body })
				.map(([k, v]) => k + '=' + encodeURIComponent(v))
				.join('&'),
		{ mode: 'cors' }
	)
		.then(response => response.json())
		.then(json => setURL(json.url))

export default ({ match }) => {
	let input = match.params.input
	let [sujet, setSujet] = useState(input)

	let [source, setSource] = useState('')
	let [URL, setURL] = useState(null)

	return (
		<div className="ui__ container">
			<h1>Contribuer</h1>
			{!URL ? (
				<form css={formStyle}>
					<label>
						Votre sujet :
						<input
							value={sujet}
							onChange={e => setSujet(e.target.value)}
							type="text"
							name="sujet"
							placeholder="Croisière transatlantique, choucroute, étagère en bois..."
							required
						/>
					</label>
					<label>
						Donnez-nous une base de travail :
						<ul>
							<li>
								une source <strong>chiffrée</strong> (par exemple le lien d'un
								article de presse)
							</li>
							<li>ou une ébauche de calcul faite par vos soins</li>
						</ul>
						<textarea
							value={source}
							onChange={e => setSource(e.target.value)}
							name="source"
							required
						/>
					</label>
					<button
						className="ui__ button"
						type="submit"
						onClick={e => {
							e.preventDefault()
							createIssue(sujet, source, setURL)
						}}>
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
