import withSitePaths from 'Components/utils/withSitePaths'
import { encodeRuleName } from 'Engine/rules.js'
import Fuse from 'fuse.js'
import { compose, pick, sortBy } from 'ramda'
import React, { useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { withTranslation } from 'react-i18next'
import { Link, Redirect } from 'react-router-dom'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import { capitalise0 } from '../utils'

function SearchBar({
	i18n,
	rules,
	showDefaultList,
	finally: finallyCallback,
	sitePaths
}) {
	const [inputValue, setInputValue] = useState(null)
	const [selectedOption, setSelectedOption] = useState(null)
	const inputElementRef = useRef()
	const fuse = useRef()

	const options = {
		keys: [
			{ name: 'name', weight: 0.3 },
			{ name: 'title', weight: 0.3 },
			{ name: 'espace', weight: 0.2 },
			{ name: 'description', weight: 0.2 }
		]
	}
	if (!fuse.current) {
		// This operation is expensive, we don't want to do it everytime we re-render, so we cache its result in a reference
		fuse.current = new Fuse(
			rules.map(pick(['title', 'espace', 'description', 'name', 'dottedName'])),
			options
		)
	}

	const handleChange = selectedOption => {
		setSelectedOption(selectedOption)
	}
	const renderOption = ({ title, dottedName }) => (
		<span>
			<Highlighter searchWords={[inputValue]} textToHighlight={title} />
			<span style={{ opacity: 0.6, fontSize: '75%', marginLeft: '.6em' }}>
				<Highlighter searchWords={[inputValue]} textToHighlight={dottedName} />
			</span>
		</span>
	)
	const filterOptions = (options, filter) => fuse.current.search(filter)

	if (selectedOption != null) {
		finallyCallback && finallyCallback()
		return (
			<Redirect
				to={
					sitePaths.documentation.index +
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
				onChange={handleChange}
				onInputChange={inputValue => setInputValue(inputValue)}
				valueKey="dottedName"
				labelKey="title"
				options={rules}
				filterOptions={filterOptions}
				optionRenderer={renderOption}
				placeholder={i18n.t('Entrez des mots clefs ici')}
				noResultsText={i18n.t('noresults', {
					defaultValue: "Nous n'avons rien trouvé…"
				})}
				ref={inputElementRef}
			/>
			{showDefaultList && !inputValue && (
				<ul>
					{sortBy(rule => rule.title, rules).map(rule => (
						<li key={rule.dottedName}>
							<Link
								to={
									sitePaths.documentation.index +
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

export default compose(
	withSitePaths,
	withTranslation()
)(SearchBar)
