import { React } from 'Components'
import { Link } from 'react-router-dom'
import Suggestions from './Suggestions'

export default () => (
	<div className="ui__ container">
		<p style={{ marginTop: '5rem' }}>
			Le <strong>dérèglement climatique</strong> n'est plus une menace lointaine
			et incertaine, c'est une <strong>actualité</strong>. Comment éviter la
			catastrophe ? Chaque aspect de notre vie moderne a un impact.{' '}
			<Link to="/à-propos">En savoir plus</Link>.{' '}
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
			<input
				style={{
					display: 'block',
					width: '80%',
					border: '1px solid black',
					fontSize: '2rem',
					borderRadius: '.3rem',
					boxShadow: '#06060624 4px 6px 15px'
				}}
				type="text"
				value={this.state.input}
				onChange={event => {
					console.log('Enregistrer la saisie dans un JSON en ligne') ||
						this.setState({ input: event.target.value })
				}}
			/>
		)
	}
}
