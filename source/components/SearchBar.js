import withSitePaths from 'Components/utils/withSitePaths'
import { encodeRuleName } from 'Engine/rules'
import Fuse from 'fuse.js'
import { compose, pick, sortBy } from 'ramda'
import React, { useMemo, useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { useTranslation } from 'react-i18next'
import { Link, Redirect } from 'react-router-dom'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import { capitalise0 } from '../utils'

function SearchBar({
	rules,
	showDefaultList,
	finally: finallyCallback,
	sitePaths
}) {
	const [inputValue, setInputValue] = useState(null)
	const [selectedOption, setSelectedOption] = useState(null)
	const inputElementRef = useRef()
	// This operation is expensive, we don't want to do it everytime we re-render, so we cache its result
	const fuse = useMemo(() => {
		const list = rules.map(
			pick(['title', 'espace', 'description', 'name', 'dottedName'])
		)
		const options = {
			keys: [
				{ name: 'name', weight: 0.3 },
				{ name: 'title', weight: 0.3 },
				{ name: 'espace', weight: 0.2 },
				{ name: 'description', weight: 0.2 }
			]
		}
		return new Fuse(list, options)
	}, [rules])
	const { i18n } = useTranslation()

	const renderOption = ({ title, dottedName }) => (
		<span>
			<Highlighter searchWords={[inputValue]} textToHighlight={title} />
			<span style={{ opacity: 0.6, fontSize: '75%', marginLeft: '.6em' }}>
				<Highlighter searchWords={[inputValue]} textToHighlight={dottedName} />
			</span>
		</span>
	)
	const filterOptions = (options, filter) => fuse.search(filter)

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
				onChange={setSelectedOption}
				onInputChange={setInputValue}
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
									encodeRuleName(rule.dottedName)
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

export default compose(withSitePaths)(SearchBar)
