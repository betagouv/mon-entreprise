import Fuse from 'fuse.js'
import { pick, take } from 'ramda'
import React from 'react'
import Highlighter from 'react-highlight-words'
import airports from './airports.csv'
import GreatCircle from 'great-circle'
import { FormDecorator } from '../FormDecorator'

let searchWeights = [
	{
		name: 'ville',
		weight: 0.5
	},
	{
		name: 'nom',
		weight: 0.5
	}
]

export default FormDecorator('select')(
	class SelectTwoAirports extends React.Component {
		componentDidMount() {
			this.inputElement?.focus()
		}
		UNSAFE_componentWillMount() {
			this.fuse = new Fuse(
				airports.map(pick(['ville', 'nom', 'pays', 'latitude', 'longitude'])),
				{
					keys: searchWeights
				}
			)
		}
		state = {
			depuis: {},
			vers: {}
		}
		renderOptions = (whichInput, { results = [], inputValue }) => (
			<ul>{take(5, results.map(this.renderOption(whichInput)(inputValue)))}</ul>
		)

		renderOption = whichInput => inputValue => option => {
			let { nom, ville, pays } = option,
				inputState = this.state[whichInput],
				choice = inputState && inputState.choice

			let {
				input: { onChange },
				submit
			} = this.props

			return (
				<li
					key={nom}
					css={`
						padding: 0.2rem 0.6rem;
						border-radius: 0.3rem;
						${choice && choice.nom === nom
							? 'background: var(--colour); color: var(--textColour)'
							: ''};
					`}
					onClick={() => {
						let state = {
							...this.state,
							[whichInput]: { ...this.state[whichInput], choice: option }
						}
						let distance = this.computeDistance(state)
						if (distance) {
							onChange(distance)
						}
						this.setState(state)
					}}>
					<Highlighter searchWords={[inputValue]} textToHighlight={nom} />
					<span style={{ opacity: 0.6, fontSize: '75%', marginLeft: '.6em' }}>
						<Highlighter
							searchWords={[inputValue]}
							textToHighlight={ville + ' - ' + pays}
						/>
					</span>
				</li>
			)
		}

		filterOptions = (options, filter) => this.fuse.search(filter)
		render() {
			let { depuis, vers } = this.state
			let placeholder = 'Aéroport ou ville '
			let distance = this.computeDistance(this.state)

			return (
				<>
					<div
						css={`
							label {
								display: inline-block;
								margin: 1em;
							}
							label > span {
								display: inline-block;
							}
							ul {
								border-left: 1px solid #333;
							}
						`}>
						<div>
							<label>
								<span>Depuis : &nbsp;</span>
								<input
									type="text"
									value={depuis.inputValue}
									placeholder={placeholder}
									onChange={e => {
										let v = e.target.value
										if (v.length < 4)
											return this.setState({
												depuis: { inputValue: v, results: [] }
											})
										let results = this.fuse.search(v)
										this.setState({ depuis: { inputValue: v, results } })
									}}
								/>
							</label>
							{depuis.results && this.renderOptions('depuis', depuis)}
						</div>
						<div>
							<label>
								<span>Vers : &nbsp;</span>
								<input
									type="text"
									value={vers.inputValue}
									placeholder={placeholder}
									onChange={e => {
										let v = e.target.value
										if (v.length < 4)
											return this.setState({
												vers: { inputValue: v, results: [] }
											})
										let results = this.fuse.search(v)
										this.setState({ vers: { inputValue: v, results } })
									}}
								/>
							</label>
							{vers.results && this.renderOptions('vers', vers)}
						</div>
					</div>
					{distance && (
						<div>
							Distance : &nbsp;<strong>{distance + ' km'}</strong>
						</div>
					)}
				</>
			)
		}
		computeDistance({ depuis, vers }) {
			return (
				depuis.choice &&
				vers.choice &&
				Math.round(
					GreatCircle.distance(
						depuis.choice.latitude,
						depuis.choice.longitude,
						vers.choice.latitude,
						vers.choice.longitude,
						'KM'
					)
				)
			)
		}
	}
)
