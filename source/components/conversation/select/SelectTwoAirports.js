import { pick, take } from 'ramda'
import React from 'react'
import Highlighter from 'react-highlight-words'
import GreatCircle from 'great-circle'
import { FormDecorator } from '../FormDecorator'
import Worker from 'worker-loader!./SearchAirports.js'

const worker = new Worker()

export default FormDecorator('select')(
	class SelectTwoAirports extends React.Component {
		componentDidMount() {
			worker.onmessage = ({ data: { results, which } }) =>
				this.setState({ [which]: { ...this.state[which], results } })
		}
		state = {
			depuis: { inputValue: '' },
			vers: { inputValue: '' }
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
										this.setState({
											depuis: { ...this.state.depuis, inputValue: v }
										})
										if (v.length > 3)
											worker.postMessage({ input: v, which: 'depuis' })
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
										this.setState({
											vers: { ...this.state.vers, inputValue: v }
										})
										if (v.length > 3)
											worker.postMessage({ input: v, which: 'vers' })
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
