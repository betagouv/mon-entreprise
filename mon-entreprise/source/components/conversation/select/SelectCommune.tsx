import * as Animate from 'Components/ui/animate'
import React, { useCallback, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { debounce } from '../../../utils'
import styled, { css } from 'styled-components'
import { InputCommonProps } from '../RuleInput'

export type ApiCommuneJson = {
	_score: number
	code: string
	codesPostaux: Array<string>
	departement: {
		code: string
		nom: string
	}
	nom: string
	region: {
		code: string
		nom: string
	}
}

type Commune = {
	code: string
	codePostal: string
	nom: string
}

async function tauxVersementTransport(codeCommune: Commune['code']) {
	const response = await fetch(
		'https://versement-transport.netlify.app/.netlify/functions/taux-par-code-commune?codeCommune=' +
			codeCommune
	)
	if (!response.ok) {
		return null
	}
	const json = await response.json()
	return json.taux
}
function formatCommune(value: Commune) {
	return value && `${value.nom} (${value.codePostal})`
}
async function searchCommunes(input: string): Promise<Array<Commune> | null> {
	const number = /[\d]+/.exec(input)?.join('') ?? ''
	const text = /[^\d]+/.exec(input)?.join(' ') ?? ''
	const response = await fetch(
		`https://geo.api.gouv.fr/communes?fields=nom,code,departement,region,codesPostaux${
			text ? `&nom=${text}` : ''
		}${/[\d]{5}/.exec(number) ? `&codePostal=${number}` : ''}&boost=population`
	)
	if (!response.ok) {
		return null
	}
	const json: Array<ApiCommuneJson> = await response.json()
	return json
		.flatMap(({ codesPostaux, ...commune }) =>
			codesPostaux
				.sort()
				.map(codePostal => ({ ...commune, codePostal }))
				.filter(({ codePostal }) => codePostal.startsWith(number))
		)
		.slice(0, 10)
}

export default function Select({ onChange, value, id }: InputCommonProps) {
	const [name, setName] = useState(formatCommune(value))
	const [searchResults, setSearchResults] = useState<null | Array<Commune>>(
		null
	)
	const { t } = useTranslation()
	const [isLoading, setLoadingState] = useState(false)

	const handleSearch = useCallback(
		function(value) {
			searchCommunes(value).then(results => {
				setLoadingState(false)
				setSearchResults(results)
			})
		},
		[setSearchResults, setLoadingState]
	)
	const debouncedHandleSearch = useMemo(() => debounce(300, handleSearch), [
		handleSearch
	])

	const handleSubmit = useCallback(
		async (commune: Commune) => {
			setSearchResults(null)
			setName(formatCommune(commune))
			let taux: number | null = null
			try {
				taux = await tauxVersementTransport(commune.code)
			} catch (error) {
				console.log(
					'Erreur dans la récupération du taux de versement transport à partir du code commune',
					error
				)
			}
			// await
			// serialize to not mix our data schema and the API response's
			onChange({
				...commune,
				...(taux != null
					? {
							'taux du versement transport': taux
					  }
					: {})
			})
		},
		[setSearchResults, setName]
	)
	const noResult =
		!isLoading && searchResults != null && searchResults?.length === 0

	const [focusedElem, setFocusedElem] = useState(0)
	const submitFocusedElem = useCallback(() => {
		if (noResult || searchResults == null) {
			return
		}
		handleSubmit(searchResults[focusedElem])
	}, [searchResults, focusedElem, noResult, handleSubmit])

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setFocusedElem(0)
			setName(e.target.value)
			if (e.target.value.length < 2) {
				setSearchResults(null)
				return
			}
			setLoadingState(true)
			debouncedHandleSearch(e.target.value)
		},
		[debouncedHandleSearch]
	)

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			switch (e.key) {
				case 'ArrowDown':
				case 'ArrowUp':
					if (noResult || searchResults == null) {
						return
					}
					setFocusedElem(
						(focusedElem + (e.key === 'ArrowDown' ? 1 : -1)) %
							searchResults.length
					)
					e.preventDefault()
					break
				case 'Escape':
					setName('')
					setSearchResults(null)
					break
				case 'Enter':
					submitFocusedElem()
					e.preventDefault()
					e.stopPropagation()
					break
			}
		},
		[searchResults, focusedElem, setSearchResults, submitFocusedElem]
	)

	return (
		<div>
			<input
				role="combobox"
				type="search"
				id={id}
				aria-autocomplete="list"
				onBlur={submitFocusedElem}
				aria-readonly="true"
				css={noResult ? 'border-color: firebrick !important' : ''}
				className="ui__"
				onKeyDown={handleKeyDown}
				aria-controls="liste-commune"
				placeholder={t('Commune ou code postal')}
				value={name}
				onChange={handleChange}
			/>
			{noResult && (
				<p
					className="ui__ notice"
					css={`
						color: firebrick !important;
						margin-top: -0.4rem;
					`}
				>
					<Trans>Cette commune n'existe pas</Trans>
				</p>
			)}

			{!!searchResults && (
				<Animate.fromTop>
					<ul
						role="listbox"
						aria-expanded="true"
						id="liste-commune"
						css={`
							padding: 0;
						`}
					>
						{searchResults.map((result, i) => {
							const nom = formatCommune(result)
							return (
								<Option
									onMouseDown={
										// Prevent input blur and focus elem selection
										e => e.preventDefault()
									}
									onClick={() => handleSubmit(result)}
									role="option"
									focused={i === focusedElem}
									data-role="commune-option"
									key={nom}
									onFocus={() => setFocusedElem(i)}
								>
									{nom}
								</Option>
							)
						})}
					</ul>
				</Animate.fromTop>
			)}
		</div>
	)
}

const Option = styled.li<{ focused: boolean }>`
	text-align: left;
	display: block;
	color: inherit;
	background-color: var(--lightestColor) !important;
	width: 100%;
	border-radius: 0.3rem;
	:hover,
	:focus {
		background-color: var(--lighterColor) !important;
	}
	background: white;
	transition: background-color 0.2s;
	width: 25rem;
	max-width: 100%;
	margin-bottom: 0.3rem;
	font-size: 100%;
	padding: 0.6rem;
	${props =>
		props.focused &&
		css`
			background-color: var(--lighterColor) !important;
			border: 1px solid var(--color) !important;
		`}
`
