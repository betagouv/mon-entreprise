import { KeyboardEvent, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { css, styled } from 'styled-components'

import {
	Commune,
	fetchCommuneDetails,
	SearchCommune,
	searchCommunes,
} from '@/api/commune'
import { Body, TextField } from '@/design-system'
import { debounce } from '@/utils'

function formatCommune(value: SearchCommune) {
	return value && `${value.nom} (${value['code postal']})`
}

type SelectCommuneProps = {
	onChange: (c: Commune) => void
	value: string | undefined | null
	missing?: boolean
	id?: string
	autoFocus?: boolean
}

export default function Select({
	onChange,
	value,
	id,
	missing,
	autoFocus,
}: SelectCommuneProps) {
	const [name, setName] = useState(missing ? '' : value ?? undefined)
	const [searchResults, setSearchResults] =
		useState<null | Array<SearchCommune>>(null)
	const { t } = useTranslation()
	const [isLoading, setLoadingState] = useState(false)

	const handleSearch = useCallback(
		function (value: string) {
			void searchCommunes(value).then((results) => {
				setLoadingState(false)
				setSearchResults(results)
			})
		},
		[setSearchResults, setLoadingState]
	)
	const debouncedHandleSearch = useMemo(
		() => debounce(300, handleSearch),
		[handleSearch]
	)

	const handleSubmit = useCallback(
		async (commune: SearchCommune) => {
			setSearchResults(null)
			setName(formatCommune(commune))
			try {
				const communeWithDetails = await fetchCommuneDetails(
					commune['code commune'],
					commune['code postal']
				)
				if (!communeWithDetails) {
					return
				}
				onChange(communeWithDetails)
			} catch (error) {
				// eslint-disable-next-line no-console
				console.warn(
					'Erreur dans la récupération du taux de versement mobilité à partir du code commune',
					error
				)
			}
		},
		[setSearchResults, setName, onChange]
	)
	const noResult =
		!isLoading && searchResults != null && searchResults?.length === 0

	const [focusedElem, setFocusedElem] = useState(0)
	const submitFocusedElem = useCallback(() => {
		if (noResult || searchResults == null) {
			return
		}
		void handleSubmit(searchResults[focusedElem])
	}, [searchResults, focusedElem, noResult, handleSubmit])

	const handleChange = useCallback(
		(value: string) => {
			setFocusedElem(0)
			setName(value)
			if (value.length < 2) {
				setSearchResults(null)

				return
			}
			setLoadingState(true)
			debouncedHandleSearch(value)
		},
		[debouncedHandleSearch]
	)

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			switch (e.key) {
				case 'ArrowDown':
				case 'ArrowUp':
					if (noResult || searchResults == null) {
						return
					}
					setFocusedElem(
						(focusedElem) =>
							(focusedElem +
								(e.key === 'ArrowDown'
									? 1
									: focusedElem === 0
									? searchResults.length - 1
									: -1)) %
							searchResults.length
					)
					e.preventDefault()
					break
				case 'Escape':
				case 'Tab':
					setName('')
					setSearchResults(null)
					break
				case 'Enter':
					submitFocusedElem()
					e.preventDefault()
					break
			}
		},
		[searchResults, setSearchResults, submitFocusedElem, noResult]
	)

	return (
		<Container>
			<TextField
				role="combobox"
				id={id}
				label={t('Commune ou code postal')}
				value={name}
				autoFocus={autoFocus}
				autoComplete="off"
				aria-controls="liste-commune"
				aria-expanded={!!searchResults}
				aria-activedescendant={
					searchResults && searchResults.length > 0
						? `commune-${focusedElem}`
						: undefined
				}
				aria-autocomplete="list"
				onBlur={submitFocusedElem}
				onKeyDown={handleKeyDown}
				onChange={handleChange}
				errorMessage={noResult ? t('Cette commune n’existe pas') : ''}
			/>

			{!!searchResults && (
				<OptionList
					role="listbox"
					id="liste-commune"
					tabIndex={0}
					aria-label={t('Communes et code postaux correspondants')}
					aria-activedescendant={`commune-${focusedElem}`}
				>
					{searchResults.map((result, i) => {
						const nom = formatCommune(result)

						return (
							<Option
								as="li"
								role="option"
								id={`commune-${i}`}
								aria-selected={i === focusedElem}
								focused={i === focusedElem}
								key={nom}
								data-role="commune-option"
								onMouseDown={
									// Prevent input blur and focus elem selection
									(e: React.MouseEvent) => e.preventDefault()
								}
								onClick={() => {
									void handleSubmit(result)
								}}
								onFocus={() => setFocusedElem(i)}
							>
								{nom}
							</Option>
						)
					})}
				</OptionList>
			)}
		</Container>
	)
}

const FocusedOption = css`
	background-color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.bases.primary[700]
			: theme.colors.bases.primary[100]} !important;
	border-color: ${({ theme }) => theme.colors.bases.primary[500]} !important;
`

const Container = styled.div`
	position: relative;
`

const OptionList = styled.ul`
	position: absolute;
	top: 100%;
	padding: 0;
	z-index: 900;
	background: ${({ theme }) =>
		theme.darkMode
			? theme.colors.bases.primary[800]
			: theme.colors.extended.grey[100]};
	border-radius: 0.3rem;
	box-shadow: 0 4px 8px #eee;
`

const Option = styled(Body)<{
	focused: boolean
}>`
	text-align: left;
	display: block;
	background-color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.bases.primary[800]
			: theme.colors.extended.grey[100]} !important;
	width: 100%;

	border-radius: 0.3rem;
	border: 2px solid transparent;
	&:hover,
	&:focus {
		${FocusedOption}
	}
	transition: background-color 0.2s;
	width: 25rem;
	max-width: 100%;
	margin-bottom: 0.3rem;
	font-size: 100%;
	padding: 0.6rem;
	${(props) => props.focused && FocusedOption}
`
