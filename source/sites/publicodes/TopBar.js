import { React, emoji } from 'Components'
import { Link } from 'react-router-dom'

export default () => (
	<section
		id="intro"
		css={`
			margin-top: 1em;
			display: flex;
			align-items: center;
			justify-content: space-between;
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
		<p css="max-width: 28rem">
			La <strong>catastrophe climatique</strong> n'est plus une menace lointaine
			et incertaine, c'est une <strong>actualité</strong>. Comment l'éviter ?
			Chacun de nos gestes a un impact, découvrez-le !{' '}
			<Link to="/à-propos">En savoir plus</Link>.{' '}
		</p>
		<Link
			to="/scénarios"
			css={`
				font-size: 200%;
			`}>
			{emoji('⚙️')}
		</Link>
	</section>
)
