import { React, emoji } from 'Components'
import { Link } from 'react-router-dom'

export default () => (
	<div className="ui__ container">
		<p>
			Le <strong>dérèglement climatique</strong> n'est plus une menace mais une
			actualité. <Link to="/à-propos">En savoir plus</Link>.{' '}
		</p>
		<p>
			Comment éviter la catastrophe ? Chaque aspect de notre vie moderne a un
			impact.
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
					margin: '0 auto',
					border: '1px solid black',
					fontSize: '2rem',
					borderRadius: '.3rem'
				}}
				type="text"
				value={this.state.input}
				onChange={input => this.setState({ input })}
			/>
		)
	}
}

let Suggestions = () => (
	<>
		<h2>Suggestions </h2>
		<ul>
			<li>{emoji('🚿 ')}Mes douches</li>
			<li>{emoji('🚶‍♀️ 🚲 🚆 🚗 ')}Mes déplacements quotidien</li>
			<li>{emoji('🛫 ')} Mes voyages en avion</li>
			<li>{emoji('🏡 ')}Mon logement</li>
		</ul>
	</>
)
