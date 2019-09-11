import { compose } from 'ramda'
import React, { useEffect } from 'react'
import { Trans, withTranslation } from 'react-i18next'

export default compose(withTranslation())(function SendButton({
	disabled,
	submit
}) {
	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

	const getAction = () => {
		return cause => (!disabled ? submit(cause) : null)
	}

	const handleKeyDown = ({ key }) => {
		if (key !== 'Enter') return
		getAction()('enter')
	}
	return (
		<button
			className="ui__ button plain"
			css="margin-left: 1.2rem"
			disabled={disabled}
			onClick={() => getAction()('accept')}>
			<span className="text">
				<Trans>Suivant</Trans> →
			</span>
		</button>
	)
})
