import { usePersistingState } from 'Components/utils/persistState'
import React, { ReactNode } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'

type WarningProps = {
	localStorageKey: string
	children: ReactNode
}

export default function Warning({ localStorageKey, children }: WarningProps) {
	const [folded, fold] = usePersistingState(localStorageKey, false)
	return (
		<div
			css={`
				margin-bottom: 1rem;
			`}
		>
			<p>
				{emoji('🚩 ')}
				<strong>
					<Trans i18nKey="simulateurs.warning.titre">
						Avant de commencer...
					</Trans>
				</strong>{' '}
				{folded && (
					<button
						className="ui__ button simple small"
						onClick={() => fold(false)}
					>
						<Trans i18nKey="simulateurs.warning.plus">
							Lire les précisions
						</Trans>
					</button>
				)}
			</p>
			{!folded && (
				<div
					className="ui__ card light-bg"
					css="padding-top: 1rem; padding-bottom: 0.4rem"
				>
					{children}
					<div className="ui__ answer-group">
						<button
							className="ui__ button simple small"
							onClick={() => fold(true)}
						>
							<Trans>J'ai compris</Trans>
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
