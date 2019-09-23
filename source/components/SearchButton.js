import { compose } from 'ramda'
import React, { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import Overlay from './Overlay'
import SearchBar from './SearchBar'

export default compose(
	connect(state => ({
		flatRules: flatRulesSelector(state)
	}))
)(function SearchButton({ flatRules, invisibleButton }) {
	const [visible, setVisible] = useState(false)
	useEffect(() => {
		const handleKeyDown = e => {
			if (!(e.ctrlKey && e.key === 'k')) return
			setVisible(true)
			e.preventDefault()
			e.stopPropagation()
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
			<h2>
				<Trans>Chercher dans la documentation</Trans>
			</h2>
			<SearchBar showDefaultList={false} finally={close} rules={flatRules} />
		</Overlay>
	) : invisibleButton ? null : (
		<button
			className="ui__ simple small button"
			onClick={() => setVisible(true)}>
			{emoji('🔍')} <Trans>Rechercher</Trans>
		</button>
	)
})
