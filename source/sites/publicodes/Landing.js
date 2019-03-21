import { React } from 'Components'
import { Link } from 'react-router-dom'
import Suggestions from './Suggestions'
import emoji from 'react-easy-emoji'
import { useState } from 'react'

export default () => (
	<div className="ui__ container">
		<p style={{ marginTop: '5rem' }}>
			Le <strong>dérèglement climatique</strong> n'est plus une menace lointaine
			et incertaine, c'est une <strong>actualité</strong>. Comment éviter la
			catastrophe ? Chaque aspect de notre vie moderne a un impact. Il suffit de
			le savoir ! <Link to="/à-propos">En savoir plus</Link>.{' '}
		</p>
		<h1>Quel est l'impact de ...</h1>
		<Search />
		<Suggestions />
	</div>
)

function Search() {
	const [input, setInput] = useState('')

	return (
		<div
			css={`
				display: flex;
				align-items: flex-end;
			`}>
			<input
				css={`
					display: inline-block;
					width: 80%;
					border: 1px solid #ddd;
					font-size: 200%;
					border-radius: 1rem;
					padding: 0 0.6rem;
				`}
				type="text"
				value={input}
				onChange={event => {
					console.log('Enregistrer la saisie dans un JSON en ligne') ||
						setInput(event.target.value)
				}}
			/>
			<span
				css={`
					margin-left: 1em;
					img {
						width: 1.6em !important;
						height: 1.6em !important;
					}
				`}>
				{emoji('🔍')}
			</span>
		</div>
	)
}
