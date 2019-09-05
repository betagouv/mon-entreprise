import withSitePaths from 'Components/utils/withSitePaths'
import { encodeRuleName, parentName } from 'Engine/rules.js'
import { compose, pick, take, sortBy } from 'ramda'
import React from 'react'
import Highlighter from 'react-highlight-words'
import { withTranslation } from 'react-i18next'
import { Link, Redirect } from 'react-router-dom'
import { capitalise0 } from '../utils'
import Worker from 'worker-loader!./SearchBar.worker.js'

const worker = new Worker()

class SearchBar extends React.Component {
	state = {
		selectedOption: null,
		input: '',
		results: []
	}
	componentDidMount() {
		worker.postMessage({
			rules: this.props.rules.map(
				pick(['title', 'espace', 'description', 'name', 'dottedName'])
			)
		})

		worker.onmessage = ({ data: results }) => this.setState({ results })
	}
	renderOptions = rules => {
		let options =
			(rules && sortBy(rule => rule.dottedName, rules)) ||
			take(5)(this.state.results)
		return <ul>{options.map(option => this.renderOption(option))}</ul>
	}
	renderOption = option => {
		let { title, dottedName, name } = option
		return (
			<li
				key={dottedName}
				css={`
					padding: 0.4rem;
					border-radius: 0.3rem;
					:hover {
						background: var(--colour);
						color: var(--textColour);
					}
					:hover a {
						color: var(--textColour);
					}
				`}
				onClick={() => this.setState({ selectedOption: option })}>
				<div
					style={{
						fontWeight: '300',
						fontSize: '85%',
						lineHeight: '.9em'
					}}>
					<Highlighter
						searchWords={[this.state.input]}
						textToHighlight={
							parentName(dottedName)
								? parentName(dottedName)
										.split(' . ')
										.map(capitalise0)
										.join(' - ')
								: ''
						}
					/>
				</div>
				<Link
					to={
						this.props.sitePaths.documentation.index +
						'/' +
						encodeRuleName(dottedName)
					}>
					<Highlighter
						searchWords={[this.state.input]}
						textToHighlight={title || capitalise0(name)}
					/>
				</Link>
			</li>
		)
	}
	render() {
		let { i18n, rules } = this.props,
			{ selectedOption, input, results } = this.state

		if (selectedOption != null) {
			this.props.finallyCallback && this.props.finallyCallback()
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
				<input
					type="text"
					value={input}
					placeholder={i18n.t('Entrez des mots clefs ici')}
					onChange={e => {
						let input = e.target.value
						this.setState({
							input
						})
						if (input.length > 2) worker.postMessage({ input })
					}}
				/>
				{input.length > 2 &&
					!results.length &&
					i18n.t('noresults', {
						defaultValue: "Nous n'avons rien trouvé…"
					})}
				{this.props.showDefaultList && !this.state.input
					? this.renderOptions(rules)
					: this.renderOptions()}
			</>
		)
	}
}

export default compose(
	withSitePaths,
	withTranslation()
)(SearchBar)
