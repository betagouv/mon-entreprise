import { useEffect, useRef, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { useLocation } from 'react-router'
import Overlay from './Overlay'
import SearchRulesAndSimulators from './search/SearchRulesAndSimulators'

type SearchButtonProps = {
	invisibleButton?: boolean
}

export default function SearchButton({ invisibleButton }: SearchButtonProps) {
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
			{!invisibleButton && (
				<button
					className="ui__ simple small button"
					onClick={() => setVisible(true)}
				>
					{emoji('🔍')} <Trans>Rechercher</Trans>
				</button>
			)}
		</>
	)
}
