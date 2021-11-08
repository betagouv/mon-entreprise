import Emoji from 'Components/utils/Emoji'
import { usePersistingState } from 'Components/utils/persistState'
import { Button } from 'DesignSystem/buttons'
import { Link } from 'DesignSystem/typography/link'
import { Intro } from 'DesignSystem/typography/paragraphs'
import { ReactNode } from 'react'
import { Trans } from 'react-i18next'

type WarningProps = {
	localStorageKey: string
	children: ReactNode
}

export default function Warning({ localStorageKey, children }: WarningProps) {
	const [folded, fold] = usePersistingState(localStorageKey, false)
	return (
		<section>
			<Intro className={folded ? 'ui__ print-display-none' : ''}>
				<Emoji emoji="🚩 " />
				<Trans i18nKey="simulateurs.warning.titre">
					Avant de commencer...
				</Trans>{' '}
				{folded && (
					<Link onClick={() => fold(false)}>
						<Trans i18nKey="simulateurs.warning.plus">
							Lire les précisions
						</Trans>
					</Link>
				)}
			</Intro>
			{!folded && (
				<div>
					{children}
					<div className="ui__ answer-group print-display-none">
						<Button size="XS" onClick={() => fold(true)}>
							<Trans>J'ai compris</Trans>
						</Button>
					</div>
				</div>
			)}
		</section>
	)
}
