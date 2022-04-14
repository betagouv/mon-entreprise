import { usePersistingState } from '@/components/utils/persistState'
import { Message } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Spacing } from '@/design-system/layout'
import { Link } from '@/design-system/typography/link'
import { Intro } from '@/design-system/typography/paragraphs'
import { ReactNode } from 'react'
import { Trans } from 'react-i18next'
import { Appear } from './animate'

type WarningProps = {
	localStorageKey: string
	children: ReactNode
}

export default function Warning({ localStorageKey, children }: WarningProps) {
	const [folded, fold] = usePersistingState<boolean>(localStorageKey, false)

	return (
		<>
			<Message type="info">
				<Intro as="h2" className={folded ? 'print-hidden' : ''}>
					<Trans i18nKey="simulateurs.warning.titre">
						Avant de commencer...
					</Trans>{' '}
					{folded && (
						<Link
							onPress={() => fold(false)}
							aria-expanded={false}
							aria-controls="warning-text"
						>
							<Trans i18nKey="simulateurs.warning.plus">
								Lire les précisions
							</Trans>
						</Link>
					)}
				</Intro>
				{!folded && (
					<Appear>
						<div id="warning-text">{children}</div>
						<div className="ui__ answer-group print-hidden">
							<Button
								size="XS"
								aria-expanded
								aria-controls="warning-text"
								light
								color="tertiary"
								onPress={() => fold(true)}
							>
								<Trans>J'ai compris</Trans>
							</Button>
							<Spacing md />
						</div>
					</Appear>
				)}
			</Message>
			<Spacing lg />
		</>
	)
}
