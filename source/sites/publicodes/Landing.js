import { React } from 'Components'
import { Link } from 'react-router-dom'
import Suggestions from './Suggestions'
import emoji from 'react-easy-emoji'

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

class Search extends React.Component {
	state = { input: '' }
	render() {
		return (
			<>
				{emoji('🔎')}
				<input
					css={`
						display: inline-block;
						width: 80%;
						border: 3px solid var(--colour);
						font-size: 2rem;
						border-radius: 0.3rem;
						box-shadow: #06060624 4px 6px 15px;
					`}
					type="text"
					value={this.state.input}
					onChange={event => {
						console.log('Enregistrer la saisie dans un JSON en ligne') ||
							this.setState({ input: event.target.value })
					}}
				/>
			</>
		)
	}
}
