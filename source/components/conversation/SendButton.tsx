import React, { useCallback, useEffect } from 'react'
import { Trans } from 'react-i18next'

type SendButtonProps = {
	disabled: boolean
	submit: (cause: string) => void
}

export default function SendButton({ disabled, submit }: SendButtonProps) {
	const getAction = useCallback(cause => (!disabled ? submit(cause) : null), [
		disabled,
		submit
	])
	useEffect(() => {
		const handleKeyDown = ({ key }: KeyboardEvent) => {
			if (key !== 'Enter') return
			getAction('enter')
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [getAction])

	return (
		<button
			className="ui__ button plain"
			css="margin-left: 1.2rem"
			disabled={disabled}
			onClick={() => getAction('accept')}
		>
			<span className="text">
				<Trans>Suivant</Trans> →
			</span>
		</button>
	)
}
