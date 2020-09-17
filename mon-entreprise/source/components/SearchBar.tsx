import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { DottedName } from 'Rules'
import Worker from 'worker-loader!./SearchBar.worker.js'
import RuleLink from './RuleLink'
import './SearchBar.css'
import { EngineContext } from './utils/EngineContext'
import { utils } from 'publicodes'

const worker = new Worker()

type SearchBarProps = {
	showListByDefault?: boolean
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
export default function SearchBar({
	showListByDefault = false
}: SearchBarProps) {
	const rules = useContext(EngineContext).getParsedRules()
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
			Object.values(rules)
				.filter(utils.ruleWithDedicatedDocumentationPage)
				.map(rule => ({
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
				className="ui__"
				value={input}
				placeholder={i18n.t('Entrez des mots clefs ici')}
				onChange={e => {
					const input = e.target.value
					if (input.length > 0) worker.postMessage({ input })
					setInput(input)
				}}
			/>
			{!!input.length && !results.length ? (
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
					{(showListByDefault && !results.length && !input.length
						? searchIndex
								.filter(item => item.espace.length === 2)
								.map(item => ({ item, matches: [] }))
						: results
					)
						.slice(0, showListByDefault ? 100 : 6)
						.map(({ item, matches }) => (
							<li key={item.dottedName}>
								<RuleLink
									dottedName={item.dottedName}
									style={{
										width: '100%',
										textDecoration: 'none',
										lineHeight: '1.5rem'
									}}
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
										<br />
									</small>
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
