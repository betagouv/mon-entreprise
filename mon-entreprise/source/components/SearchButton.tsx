import PopoverWithTrigger from 'DesignSystem/PopoverWithTrigger'
import { useEffect, useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import styled from 'styled-components'
import SearchRulesAndSimulators from './search/SearchRulesAndSimulators'

const SearchTriggerButton = styled.button`
	display: flex;
	border: 0px solid;
	border-color: rgb(41, 117, 209);
	padding: 0.6rem;
	font-size: 2rem;
	align-items: center;
	justify-items: center;
	color: rgb(31, 42, 106);
	margin: auto;
`

export default function SearchButton() {
	const { pathname } = useLocation()
	const pathnameRef = useRef(pathname)
	const { t } = useTranslation()
	useEffect(() => {
		if (pathname !== pathnameRef.current) {
			pathnameRef.current = pathname
			close()
		}
	}, [pathname])

	return (
		<PopoverWithTrigger
			title={t('Que cherchez-vous ?')}
			trigger={(propsToDispatch) => (
				<SearchTriggerButton {...propsToDispatch} id="search-display-button">
					<svg
						style={{ height: '2rem' }}
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="square"
							strokeLinejoin="round"
							strokeWidth={3}
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					<div className="sr-only">
						<Trans>Rechercher</Trans>
					</div>
				</SearchTriggerButton>
			)}
		>
			<SearchRulesAndSimulators />
		</PopoverWithTrigger>
	)
}
