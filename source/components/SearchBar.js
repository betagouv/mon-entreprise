import withSitePaths from 'Components/utils/withSitePaths'
import { encodeRuleName } from 'Engine/rules.js'
import Fuse from 'fuse.js'
import { compose, pick, sortBy } from 'ramda'
import React from 'react'
import Highlighter from 'react-highlight-words'
import { withTranslation } from 'react-i18next'
import { Link, Redirect } from 'react-router-dom'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import { capitalise0 } from '../utils'

class SearchBar extends React.Component {
	componentDidMount() {
		this.inputElement.focus()
	}
	UNSAFE_componentWillMount() {
		let { rules } = this.props
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
		let { i18n, rules } = this.props,
			{ selectedOption } = this.state

		if (selectedOption != null) {
			this.props.finally && this.props.finally()
			return (
				<Redirect
					to={
						this.props.sitePaths.documentation.index +
						'/' +
						encodeRuleName(selectedOption.dottedName)
					}
				/>
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
					placeholder={i18n.t('Entrez des mots clefs ici')}
					noResultsText={i18n.t('noresults', {
						defaultValue: "Nous n'avons rien trouvé…"
					})}
					ref={el => {
						this.inputElement = el
					}}
				/>
				{this.props.showDefaultList && !this.state.inputValue && (
					<ul>
						{sortBy(rule => rule.title, rules).map(rule => (
							<li key={rule.dottedName}>
								<Link
									to={
										this.props.sitePaths.documentation.index +
										'/' +
										encodeRuleName(rule.name)
									}>
									{rule.title || capitalise0(rule.name)}
								</Link>
							</li>
						))}
					</ul>
				)}
			</>
		)
	}
}

export default compose(
	withSitePaths,
	withTranslation()
)(SearchBar)
