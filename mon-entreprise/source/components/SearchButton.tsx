import React, { useEffect, useState, useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import Overlay from './Overlay'
import { EngineContext } from 'Components/utils/EngineContext'
import SearchBar from './SearchBar'
import { useLocation } from 'react-router'

type SearchButtonProps = {
	invisibleButton?: boolean
}

export default function SearchButton({ invisibleButton }: SearchButtonProps) {
	const rules = useContext(EngineContext).getParsedRules()
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
			<SearchBar showDefaultList={false} rules={rules} />
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
