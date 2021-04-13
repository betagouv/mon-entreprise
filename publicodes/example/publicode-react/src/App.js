import './App.css'
import logo from './logo.png'
import Publicodes from './Publicodes.js'

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>Publicodes example</p>
				<a
					className="App-link"
					href="https://publi.codes"
					target="_blank"
					rel="noopener noreferrer"
				>
					Voir la documentation
				</a>
				<Publicodes />
			</header>
		</div>
	)
}

export default App
