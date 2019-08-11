import Fuse from 'fuse.js'
import { pick } from 'ramda'
import React from 'react'
import Highlighter from 'react-highlight-words'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
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
		this.inputElement.focus()
	}
	UNSAFE_componentWillMount() {
		this.fuse = new Fuse(airports.map(pick(['ville', 'nom', 'pays'])), {
			keys: searchWeights
		})
	}
	state = {
		selectedOption: null,
		inputValue: null
	}
	handleChange = selectedOption => {
		this.setState({ selectedOption })
	}
	renderOption = ({ nom, ville, pays }) => (
		<span>
			<Highlighter
				searchWords={[this.state.inputValue]}
				textToHighlight={nom}
			/>
			<span style={{ opacity: 0.6, fontSize: '75%', marginLeft: '.6em' }}>
				<Highlighter
					searchWords={[this.state.inputValue]}
					textToHighlight={ville + ' - ' + pays}
				/>
			</span>
		</span>
	)
	filterOptions = (options, filter) => this.fuse.search(filter)
	render() {
		let { selectedOption } = this.state

		if (selectedOption != null) {
			return <div>yo</div>
		}
		return (
			<>
				<Select
					value={selectedOption}
					onChange={this.handleChange}
					onInputChange={inputValue => this.setState({ inputValue })}
					labelKey="0"
					options={airports}
					filterOptions={this.filterOptions}
					optionRenderer={this.renderOption}
					placeholder={'hihi'}
					noResultsText={'nonono'}
					ref={el => {
						this.inputElement = el
					}}
				/>
			</>
		)
	}
}

export default SearchBar
