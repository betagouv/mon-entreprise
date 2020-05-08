import { ParsedRules } from 'publicodes'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { DottedName } from 'Rules'
import Worker from 'worker-loader!./SearchBar.worker.js'
import RuleLink from './RuleLink'
import './SearchBar.css'

const worker = new Worker()

type SearchBarProps = {
	rules: ParsedRules<DottedName>
	showDefaultList: boolean
}

type SearchItem = {
	title: string
	dottedName: DottedName
	espace: Array<string>
}

type Matches = Array<{
	key: string
	value: string
	indices: Array<[number, number]>
}>

function highlightMatches(str: string, matches: Matches) {
	if (!matches?.length) {
		return str
	}
	const indices = matches[0].indices
		.sort(([a], [b]) => a - b)
		.map(([x, y]) => [x, y + 1])
		.reduce(
			(acc, value) =>
				acc[acc.length - 1][1] <= value[0] ? [...acc, value] : acc,
			[[0, 0]]
		)
		.flat()
	return [...indices, str.length].reduce(
		([highlight, prevIndice, acc], currentIndice, i) => {
			const currentStr = str.slice(prevIndice, currentIndice)
			return [
				!highlight,
				currentIndice,
				[
					...acc,
					<span
						style={highlight ? { fontWeight: 'bold' } : {}}
						className={highlight ? 'ui__ light-bg' : ''}
						key={i}
					>
						{currentStr}
					</span>
				]
			] as [boolean, number, Array<React.ReactNode>]
		},
		[false, 0, []] as [boolean, number, Array<React.ReactNode>]
	)[2]
}
export default function SearchBar({ rules, showDefaultList }: SearchBarProps) {
	const [input, setInput] = useState('')
	const [results, setResults] = useState<
		Array<{
			item: SearchItem
			matches: Matches
		}>
	>([])
	const { i18n } = useTranslation()

	const searchIndex: Array<SearchItem> = useMemo(
		() =>
			Object.values(rules).map(rule => ({
				title:
					rule.title ??
					rule.name + (rule.acronyme ? ` (${rule.acronyme})` : ''),
				dottedName: rule.dottedName,
				espace: rule.dottedName.split(' . ').reverse()
			})),
		[rules]
	)

	useEffect(() => {
		worker.postMessage({
			rules: searchIndex
		})

		worker.onmessage = ({ data: results }) => setResults(results)
		return () => {
			worker.onmessage = null
		}
	}, [searchIndex, setResults])

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
				onChange={e => {
					const input = e.target.value
					if (input.length > 0) worker.postMessage({ input })
					setInput(input)
				}}
			/>
			{!!input.length && !showDefaultList && !results.length ? (
				<p
					className="ui__ notice light-bg"
					css={`
						padding: 0.4rem;
						border-radius: 0.3rem;
						margin-top: 0.6rem;
					`}
				>
					<Trans i18nKey="noresults">
						Aucun résultat ne correspond à cette recherche
					</Trans>
				</p>
			) : (
				<ul
					css={`
						padding: 0;
						margin: 0;
						list-style: none;
					`}
				>
					{(showDefaultList && !results.length
						? searchIndex.map(item => ({ item, matches: [] }))
						: results
					)
						.slice(0, 6)
						.map(({ item, matches }) => (
							<li key={item.dottedName}>
								<RuleLink
									dottedName={item.dottedName}
									style={{ width: '100%', textDecoration: 'none' }}
								>
									<small>
										{item.espace
											.slice(1)
											.reverse()
											.map(name => (
												<span key={name}>
													{highlightMatches(
														name,
														matches.filter(
															m => m.key === 'espace' && m.value === name
														)
													)}{' '}
													›{' '}
												</span>
											))}
									</small>{' '}
									<br />
									{highlightMatches(
										item.title,
										matches.filter(m => m.key === 'title')
									)}
								</RuleLink>
							</li>
						))}
				</ul>
			)}
		</>
	)
}
