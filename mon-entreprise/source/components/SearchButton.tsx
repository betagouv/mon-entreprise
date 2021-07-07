import { useEffect, useRef, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { useLocation } from 'react-router'
import styled from 'styled-components'
import Overlay from './Overlay'
import SearchRulesAndSimulators from './search/SearchRulesAndSimulators'
import { breakpoints } from './ui/breakpoints'

const SearchTriggerButton = styled.button`
	display: flex;
	margin: 5px auto auto auto;
	border-radius: 3em;
	border: 1px solid;
	border-color: rgb(41, 117, 209);
	border-color: var(--color);
	padding: 0.6rem 1.4rem;
	font-size: 1.1em;
	align-items: center;
	justify-items: center;
	transform: scale(0.9);

	@media (min-width: ${breakpoints.tablet}) {
		margin-top: -3em;
	}
`

export default function SearchButton() {
	const { pathname } = useLocation()
	const pathnameRef = useRef(pathname)
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!(e.ctrlKey && e.key === 'k')) return
			setVisible(true)

			e.preventDefault()
			return false
		}

		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

	const close = () => setVisible(false)

	useEffect(() => {
		if (pathname !== pathnameRef.current) {
			pathnameRef.current = pathname
			close()
		}
	}, [pathname])

	return (
		<>
			{visible && (
				<Overlay onClose={close}>
					<h1>
						<Trans>Que recherchez vous?</Trans>
					</h1>
					<SearchRulesAndSimulators />
				</Overlay>
			)}

			<SearchTriggerButton onClick={() => setVisible(true)}>
				{emoji('🔍')}{' '}
				<div style={{ margin: 'auto', marginLeft: '4px' }}>
					<Trans>Rechercher</Trans>
				</div>
			</SearchTriggerButton>
		</>
	)
}
