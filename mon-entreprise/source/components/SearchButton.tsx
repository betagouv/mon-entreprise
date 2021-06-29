import { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import Overlay from './Overlay'
import SearchRulesAndSimulators from './search/SearchRulesAndSimulators'

type SearchButtonProps = {
	invisibleButton?: boolean
}

export default function SearchButton({ invisibleButton }: SearchButtonProps) {
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

	return visible ? (
		<Overlay onClose={close}>
			<h1>
				<Trans>Chercher dans la documentation</Trans>
			</h1>
			<SearchRulesAndSimulators />
		</Overlay>
	) : invisibleButton ? null : (
		<button
			className="ui__ simple small button"
			onClick={() => setVisible(true)}
		>
			{emoji('🔍')} <Trans>Rechercher</Trans>
		</button>
	)
}
