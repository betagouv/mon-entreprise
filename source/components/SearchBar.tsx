import { SitePathsContext } from 'Components/utils/withSitePaths'
import { parentName } from 'Engine/ruleUtils.js'
import { pick, sortBy, take } from 'ramda'
import React, { useContext, useEffect, useState } from 'react'
import FuzzyHighlighter, { Highlighter } from 'react-fuzzy-highlighter'
import { useTranslation } from 'react-i18next'
import { Link, Redirect, useHistory } from 'react-router-dom'
import { DottedName, Rule } from 'Types/rule'
import Worker from 'worker-loader!./SearchBar.worker.js'
import { capitalise0 } from '../utils'
import './SearchBar.css'

const worker = new Worker()

type SearchBarProps = {
	rules: { [name in DottedName]: Rule }
	showDefaultList: boolean
	finally?: () => void
}

type Option = Pick<Rule, 'dottedName' | 'name' | 'title'>
type Result = Pick<Rule, 'dottedName'>

export default function SearchBar({
	rules,
	showDefaultList,
	finally: finallyCallback
}: SearchBarProps) {
	const sitePaths = useContext(SitePathsContext)
	const [input, setInput] = useState('')
	const [selectedOption, setSelectedOption] = useState<Option | null>(null)
	const [results, setResults] = useState<Array<Result>>([])
	let [focusElem, setFocusElem] = useState(-1)
	const { i18n } = useTranslation()
	const history = useHistory()

	const handleKeyDown = e => {
		if (e.key === 'Enter' && results.length > 0) {
			finallyCallback && finallyCallback()
			history.push(
				sitePaths.documentation.rule(
					results[focusElem > 0 ? focusElem : 0].dottedName
				)
			)
		}

		if (
			e.key === 'ArrowDown' &&
			focusElem < (results.length > 5 ? 4 : results.length - 1)
		) {
			if (focusElem === -1) {
				setFocusElem(0)
			}
			setFocusElem(focusElem + 1)
		} else if (e.key === 'ArrowUp' && focusElem > 0) {
			setFocusElem(focusElem - 1)
		}
		return true
	}

	useEffect(() => {
		worker.postMessage({
			rules: Object.values(rules).map(
				pick(['title', 'espace', 'description', 'name', 'dottedName'])
			)
		})

		worker.onmessage = ({ data: results }) => setResults(results)
	}, [rules, results, focusElem])

	let onMouseOverHandler = () => setFocusElem(-1)

	const getDottedName = (href: String) => {
		const currentSlug = decodeURI(href.substring(href.lastIndexOf('/') + 1))
		return (
			[
				{
					slugs: ['salarié', 'assimilé-salarié'],
					dottedName: 'contrat salarié'
				},
				{
					slugs: ['indépendant', 'auto-entrepreneur'],
					dottedName: 'dirigeant'
				}
			].find(
				item => item.slugs.find(slug => slug === currentSlug) !== undefined
			)?.dottedName || ''
		)
	}

	let renderOptions = (rules?: Array<Rule>) => {
		const currentPage = getDottedName(window.location.href)
		let options = (rules && sortBy(rule => rule.dottedName, rules)) || results
		let currentOptions: Array<Pick<Rule, 'dottedName'>> = []
		let notCurrentOptions: Array<Pick<Rule, 'dottedName'>> = []
		options.forEach(option => {
			if (option.dottedName.startsWith(currentPage)) {
				currentOptions.push(option)
			} else {
				notCurrentOptions.push(option)
			}
		})
		return (
			<ul>
				{take(5)([...currentOptions, ...notCurrentOptions]).map((option, idx) =>
					renderOption(option, idx)
				)}
			</ul>
		)
	}

	let renderOption = (option: Option, idx: number) => {
		let { title, dottedName, name } = option
		let espace = parentName(dottedName)
			? parentName(dottedName)
					.split(' . ')
					.map(capitalise0)
					.join(' - ')
			: ''
		return (
			<li
				key={dottedName}
				className={focusElem === idx ? 'active' : `${focusElem}-inactive`}
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
				onMouseOver={() => onMouseOverHandler()}
			>
				<div
					style={{
						fontWeight: 300,
						fontSize: '85%',
						lineHeight: '.9em'
					}}
				>
					<FuzzyHighlighter
						query={input}
						data={[
							{
								title: espace
							}
						]}
						options={{
							includeMatches: true,
							threshold: 0.2,
							minMatchCharLength: 1,
							keys: ['title']
						}}
					>
						{({ results, formattedResults, timing }) => {
							return (
								<>
									{formattedResults.length === 0 && <span>{espace}</span>}
									{formattedResults.map((formattedResult, resultIndex) => {
										if (formattedResult.formatted.title === undefined) {
											return null
										}

										return (
											<span key={resultIndex}>
												<Highlighter text={formattedResult.formatted.title} />
											</span>
										)
									})}
								</>
							)
						}}
					</FuzzyHighlighter>
				</div>

				<FuzzyHighlighter
					query={input}
					data={[{ title: title || capitalise0(name) || '' }]}
					options={{
						includeMatches: true,
						threshold: 0.3,
						keys: ['title', 'name']
					}}
				>
					{({ results, formattedResults, timing }) => {
						return (
							<>
								{formattedResults.length === 0 && (
									<Link to={sitePaths.documentation.rule(dottedName)}>
										{title || capitalise0(name) || ''}
									</Link>
								)}
								{formattedResults.map((formattedResult, resultIndex) => {
									if (formattedResult.formatted.title === undefined) {
										return null
									}

									return (
										<Link
											to={sitePaths.documentation.rule(dottedName)}
											key={resultIndex}
										>
											<Highlighter text={formattedResult.formatted.title} />
										</Link>
									)
								})}
							</>
						)
					}}
				</FuzzyHighlighter>
			</li>
		)
	}

	if (selectedOption !== null) {
		finallyCallback && finallyCallback()
		return (
			<Redirect to={sitePaths.documentation.rule(selectedOption.dottedName)} />
		)
	}

	return (
		<>
			<input
				type="search"
				css={`
					padding: 0.4rem;
					margin: 0.2rem 0;
					width: 100%;
					border: 1px solid var(--lighterTextColor);
					border-radius: 0.3rem;
					color: inherit;
					font-size: inherit;
					transition: border-color 0.1s;
					position: relative;

					:focus {
						border-color: var(--color);
					}
				`}
				value={input}
				placeholder={i18n.t('Entrez des mots clefs ici')}
				onKeyDown={e => handleKeyDown(e)}
				onChange={e => {
					let input = e.target.value
					setInput(input)
					if (input.length > 0) worker.postMessage({ input })
				}}
			/>
			{input.length > 2 &&
				!results.length &&
				i18n.t('noresults', {
					defaultValue: "Nous n'avons rien trouvé…"
				})}
			{showDefaultList && !input
				? renderOptions(Object.values(rules))
				: renderOptions()}
		</>
	)
}
