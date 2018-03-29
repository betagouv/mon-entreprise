import React, { Component } from 'react'
import { connect } from 'react-redux'
import { encodeRuleName } from 'Engine/rules.js'
import { Link } from 'react-router-dom'
import './RulesList.css'
import './Pages.css'
import { capitalise0 } from '../../utils'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import Fuse from 'fuse.js'
import { Redirect } from 'react-router-dom'
import Highlighter from 'react-highlight-words'
import { pick } from 'ramda'

@connect(
	state => ({
		flatRules: state.flatRules
	})
)
export default class RulesList extends Component {
	render() {
		let { flatRules } = this.props;
		return (
			<div id="RulesList" className="page">
				<h1>Explorez notre base de règles</h1>
				<SearchBar showDefaultList={true} rules={flatRules} />
			</div>
		)
	}
}

export class SearchBar extends React.Component {
	componentDidMount() {
		this.inputElement.focus()
	}
	componentWillMount() {
		var options = {
			keys: [
				{
					name: 'name',
					weight: 0.3
				},
				{
					name: 'title',
					weight: 0.3
				},
				{
					name: 'espace',
					weight: 0.2
				},
				{
					name: 'description',
					weight: 0.2
				}
			]
		}
		this.fuse = new Fuse(
			rules.map(pick(['title', 'espace', 'description', 'name', 'dottedName'])),
			options
		)
	}
	state = {
		selectedOption: null,
		inputValue: null
	}
	handleChange = selectedOption => {
		this.setState({ selectedOption })
	}
	renderOption = ({ title, dottedName }) => (
		<span>
			<Highlighter
				searchWords={[this.state.inputValue]}
				textToHighlight={title}
			/>
			<span style={{ opacity: 0.6, fontSize: '75%', marginLeft: '.6em' }}>
				<Highlighter
					searchWords={[this.state.inputValue]}
					textToHighlight={dottedName}
				/>
			</span>
		</span>
	)
	filterOptions = (options, filter) => this.fuse.search(filter)
	render() {
		let { selectedOption } = this.state

		if (selectedOption != null) {
			this.props.finally && this.props.finally()
			return (
				<Redirect to={'/règle/' + encodeRuleName(selectedOption.dottedName)} />
			)
		}
		return (
			<>
				<Select
					value={selectedOption && selectedOption.dottedName}
					onChange={this.handleChange}
					onInputChange={inputValue => this.setState({ inputValue })}
					valueKey="dottedName"
					labelKey="title"
					options={rules}
					filterOptions={this.filterOptions}
					optionRenderer={this.renderOption}
					placeholder="Entrez des mots clefs ici"
					noResultsText="Nous n'avons rien trouvé..."
					ref={el => {
						this.inputElement = el
					}}
				/>
				{this.props.showDefaultList &&
					!this.state.inputValue && (
						<ul>
							{rules.map(rule => (
								<li key={rule.dottedName}>
									<Link to={'/règle/' + encodeRuleName(rule.name)}>
										{capitalise0(rule.name)}
									</Link>
								</li>
							))}
						</ul>
					)}
			</>
		)
	}
}
