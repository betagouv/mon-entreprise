import { React, emoji } from 'Components'
import { Link } from 'react-router-dom'

export default () => (
	<div className="ui__ container">
		<p style={{ marginTop: '5rem' }}>
			Le <strong>dérèglement climatique</strong> n'est plus une menace mais une
			actualité. Comment éviter la catastrophe ? Chaque aspect de notre vie
			moderne a un impact. <Link to="/à-propos">En savoir plus</Link>.{' '}
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

let Suggestions = () => (
	<section style={{ marginTop: '4rem' }}>
		<h2>Suggestions </h2>
		<ul>
			<li>{emoji('🚿 ')}Mes douches</li>
			<li>{emoji('🚶‍♀️ 🚲 🚆 🚗 ')}Mes déplacements quotidien</li>
			<li>{emoji('🛫 ')} Mes voyages en avion</li>
			<li>{emoji('🏡 ')}Mon logement</li>
		</ul>
	</section>
)
