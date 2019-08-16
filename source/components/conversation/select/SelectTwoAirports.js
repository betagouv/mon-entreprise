import Fuse from 'fuse.js'
import { pick } from 'ramda'
import React from 'react'
import Highlighter from 'react-highlight-words'
import airports from './airports.csv'

let searchWeights = [
	{
		name: 'ville',
		weight: 0.4
	},
	{
		name: 'nom',
		weight: 0.3
	},
	{
		name: 'pays',
		weight: 0.3
	}
]

class SearchBar extends React.Component {
	componentDidMount() {
		this.inputElement?.focus()
	}
	UNSAFE_componentWillMount() {
		this.fuse = new Fuse(airports.map(pick(['ville', 'nom', 'pays'])), {
			keys: searchWeights
		})
	}
	state = {
		depuis: {},
		vers: {}
	}
	renderOption = ({ result: { nom, ville, pays }, inputValue }) => (
		<span>
			<Highlighter searchWords={[inputValue]} textToHighlight={nom} />
			<span style={{ opacity: 0.6, fontSize: '75%', marginLeft: '.6em' }}>
				<Highlighter
					searchWords={[inputValue]}
					textToHighlight={ville + ' - ' + pays}
				/>
			</span>
		</span>
	)
	filterOptions = (options, filter) => this.fuse.search(filter)
	render() {
		let { depuis, vers } = this.state

		return (
			<div>
				<div>
					<label>
						Depuis :
						<input
							type="text"
							value={depuis.inputValue}
							onChange={e => {
								let v = e.target.value
								let results = this.fuse.search(v)
								this.setState({ depuis: { inputValue: v, result: results[0] } })
							}}
						/>
					</label>
					{depuis.result && this.renderOption(depuis)}
				</div>
				<div>
					<label>
						Vers :
						<input
							type="text"
							value={vers.inputValue}
							onChange={e => {
								let v = e.target.value
								let results = this.fuse.search(v)
								this.setState({ vers: { inputValue: v, result: results[0] } })
							}}
						/>
					</label>
					{vers.result && this.renderOption(vers)}
				</div>
			</div>
		)
	}
}

export default SearchBar
