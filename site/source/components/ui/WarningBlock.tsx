import { ReactNode } from 'react'
import { Trans } from 'react-i18next'

import { usePersistingState } from '@/components/utils/persistState'
import { Message } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Spacing } from '@/design-system/layout'
import { Link } from '@/design-system/typography/link'
import { Intro } from '@/design-system/typography/paragraphs'

import { FromTop } from './animate'

type WarningProps = {
	localStorageKey: string
	children: ReactNode
}

export default function Warning({ localStorageKey, children }: WarningProps) {
	const [folded, fold] = usePersistingState<boolean>(localStorageKey, false)

	return (
		<>
			<Message type="info">
				<div className="print-hidden">
					<Intro as="h2">
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
						<FromTop>
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
						</FromTop>
					)}
				</div>
				<div className="print-only">{children}</div>
			</Message>
			<Spacing lg />
		</>
	)
}
