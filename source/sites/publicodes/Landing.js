import { React } from 'Components'
import { Link } from 'react-router-dom'
import Suggestions from './Suggestions'
import emoji from 'react-easy-emoji'
import { useState } from 'react'

let jsonBinUrl = 'https://api.jsonbin.io/b/5c93d3257726fe2562cd71bd'

export default () => (
	<div className="ui__ container">
		<section
			id="intro"
			css={`
				margin-top: 1em;
				display: flex;
				align-items: center;
			`}>
			<img css="width: 6em; margin-right: 1em;" src={require('./logo.png')} />
			<p>
				Le <strong>dérèglement climatique</strong> n'est plus une menace
				lointaine et incertaine, c'est une <strong>actualité</strong>. Comment
				éviter la catastrophe ? Chaque aspect de notre vie moderne a un impact.
				Il suffit de le connaître ! <Link to="/à-propos">En savoir plus</Link>.{' '}
			</p>
		</section>
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
					let value = event.target.value
					value !== '' && collectUserQuestions(event.target.value)
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

let collectUserQuestions = debounced(1000, input => {
	fetch(jsonBinUrl + '/latest', {
		method: 'GET'
	}).then(res =>
		res.json().then(pastBin =>
			fetch(jsonBinUrl, {
				method: 'PUT',
				body: JSON.stringify([...pastBin, input]),
				headers: { 'Content-type': 'application/json' }
			})
		)
	)
})

function debounced(delay, fn) {
	let timerId
	return function(...args) {
		if (timerId) {
			clearTimeout(timerId)
		}
		timerId = setTimeout(() => {
			fn(...args)
			timerId = null
		}, delay)
	}
}
