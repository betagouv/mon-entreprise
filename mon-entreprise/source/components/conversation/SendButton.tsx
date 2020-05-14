import React, { useCallback, useEffect } from 'react'
import { Trans } from 'react-i18next'

type SendButtonProps = {
	disabled: boolean
	onSubmit: (cause: string) => void
}

export default function SendButton({ disabled, onSubmit }: SendButtonProps) {
	const getAction = useCallback(cause => (!disabled ? onSubmit(cause) : null), [
		disabled,
		onSubmit
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
			className="ui__ plain button "
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
