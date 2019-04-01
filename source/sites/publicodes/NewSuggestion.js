import { React, emoji } from 'Components'
import { useState } from 'react'
import { toPairs } from 'ramda'

let formStyle = `
label {
	display: block;
	margin-bottom: 1em;
}
label input, label textArea {
	display: block;
	border-radius: .3em;
	padding: .3em ;
	border: 1px solid var(--colour);
	box-shadow: none;
	margin-top: .6em;
	width: 20em;
	font-size: 100%

}
label textArea {
	height: 6em
}`

let createIssue = (title, body, setURL) =>
	fetch(
		'https://publicodes.netlify.com/.netlify/functions/createIssue?' +
			toPairs({ repo: 'laem/futureco-data', title, body })
				.map(([k, v]) => k + '=' + v)
				.join('&'),
		{ mode: 'cors' }
	)
		.then(response => response.json())
		.then(json => setURL(json.url))

export default ({ input }) => {
	let [sujet, setSujet] = useState(input)

	let [source, setSource] = useState('')
	let [URL, setURL] = useState(null)

	return (
		<>
			<div
				css={`
					display: flex;
					align-items: center;
					justify-content: center;
				`}>
				Contribuer
				<button
					css={`
						border-radius: 10em;
						box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
							0px 6px 10px 0px rgba(0, 0, 0, 0.14),
							0px 1px 18px 0px rgba(0, 0, 0, 0.12);
						height: 2.5em;
						width: 2.5em;
						padding: 0em;
						background: var(--colour);
						color: white;
						font-weight: 400;
						font-size: 180%;
						margin: 0.3em;
					`}>
					{emoji('✍️')}
				</button>
			</div>
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
						<textArea
							value={source}
							onChange={e => setSource(e.target.value)}
							name="source"
							placeholder="Vos notes"
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
		</>
	)
}
