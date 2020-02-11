import { SitePathsContext } from 'Components/utils/withSitePaths'
import { encodeRuleName, parentName } from 'Engine/rules.js'
import { pick, sortBy, take } from 'ramda'
import React, { useContext, useEffect, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { useTranslation } from 'react-i18next'
import { Link, Redirect } from 'react-router-dom'
import { Rule } from 'Types/rule'
import Worker from 'worker-loader!./SearchBar.worker.js'
import { capitalise0 } from '../utils'

const worker = new Worker()

type SearchBarProps = {
	rules: Array<Rule>
	showDefaultList: boolean
	finallyCallback?: () => void
}

type Option = Pick<Rule, 'dottedName' | 'name' | 'title'>

export default function SearchBar({
	rules,
	showDefaultList,
	finallyCallback
}: SearchBarProps) {
	const sitePaths = useContext(SitePathsContext)
	const [input, setInput] = useState('')
	const [selectedOption, setSelectedOption] = useState<Option | null>(null)
	const [results, setResults] = useState([])
	const { i18n } = useTranslation()

	useEffect(() => {
		worker.postMessage({
			rules: rules.map(
				pick(['title', 'espace', 'description', 'name', 'dottedName'])
			)
		})

		worker.onmessage = ({ data: results }) => setResults(results)
	}, [rules])

	let renderOptions = (rules?: Array<Rule>) => {
		let options =
			(rules && sortBy(rule => rule.dottedName, rules)) || take(5)(results)
		return <ul>{options.map(option => renderOption(option))}</ul>
	}

	let renderOption = (option: Option) => {
		let { title, dottedName, name } = option
		return (
			<li
				key={dottedName}
				css={`
					padding: 0.4rem;
					border-radius: 0.3rem;
					:hover {
						background: var(--color);
						color: var(--textColor);
					}
					:hover a {
						color: var(--textColor);
					}
				`}
				onClick={() => setSelectedOption(option)}
			>
				<div
					style={{
						fontWeight: 300,
						fontSize: '85%',
						lineHeight: '.9em'
					}}
				>
					<Highlighter
						searchWords={[input]}
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
					to={sitePaths.documentation.index + '/' + encodeRuleName(dottedName)}
				>
					<Highlighter
						searchWords={[input]}
						textToHighlight={title || capitalise0(name) || ''}
					/>
				</Link>
			</li>
		)
	}

	if (selectedOption !== null) {
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
			<input
				type="text"
				value={input}
				placeholder={i18n.t('Entrez des mots clefs ici')}
				onChange={e => {
					let input = e.target.value
					setInput(input)
					if (input.length > 2) worker.postMessage({ input })
				}}
			/>
			{input.length > 2 &&
				!results.length &&
				i18n.t('noresults', {
					defaultValue: "Nous n'avons rien trouvé…"
				})}
			{showDefaultList && !input ? renderOptions(rules) : renderOptions()}
		</>
	)
}
