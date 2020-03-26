import React, { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { parsedRulesSelector } from 'Selectors/analyseSelectors'
import Overlay from './Overlay'
import SearchBar from './SearchBar'

type SearchButtonProps = {
	invisibleButton?: boolean
}

export default function SearchButton({ invisibleButton }: SearchButtonProps) {
	const rules = useSelector(parsedRulesSelector)
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
			<SearchBar showDefaultList={false} finally={close} rules={rules} />
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
