import { React } from 'Components'
import { Link } from 'react-router-dom'
import Suggestions from './Suggestions'
import { useState } from 'react'
import Search from './Search'
import ContributionButton from './ContributionButton'

export default () => {
	const [input, setInput] = useState('')
	return (
		<div>
			<section
				id="intro"
				css={`
					margin-top: 1em;
					display: flex;
					align-items: center;
				`}>
				<img
					css={`
						width: 6em;
						@media (min-width: 800px) {
							width: 8em;
						}
						margin-right: 1em;
					`}
					src={require('./logo.png')}
				/>
				<p>
					La <strong>catastrophe climatique</strong> n'est plus une menace
					lointaine et incertaine, c'est une <strong>actualité</strong>. Comment
					l'éviter ? Chaque aspect de notre vie moderne a un impact,
					découvrez-le ! <Link to="/à-propos">En savoir plus</Link>.{' '}
				</p>
			</section>
			<h1>Quel est l'impact de ...</h1>
			<Search {...{ input, setInput }} />
			<Suggestions {...{ input }} />
			<ContributionButton {...{ input }} />
		</div>
	)
}
