import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { usePersistingState } from '@/components/utils/persistState'
import { Button, Intro, Link, Message, Spacing } from '@/design-system'

import { FromTop } from './animate'

type WarningProps = {
	localStorageKey: string
	children: ReactNode
}

export default function Warning({ localStorageKey, children }: WarningProps) {
	const [folded, fold] = usePersistingState<boolean>(localStorageKey, false)

	const { t } = useTranslation()

	return (
		<>
			<Message type="info" icon>
				<div className="print-hidden">
					<Intro as="h2">
						{t('simulateurs.warning.titre', 'Avant de commencer…')}{' '}
						{folded && (
							<Link
								onPress={() => fold(false)}
								aria-expanded={false}
								aria-label={t(
									'simulateurs.warning.plus.aria-label',
									'Lire les précisions, ouvrir le message condensé.'
								)}
							>
								{t('simulateurs.warning.plus.texte', 'Lire les précisions')}
							</Link>
						)}
					</Intro>
					{!folded && (
						<FromTop>
							<div id="warning-text">{children}</div>
							<div className="print-hidden">
								<Button
									size="XS"
									aria-expanded
									light
									color="tertiary"
									onPress={() => fold(true)}
									aria-label={t(
										'simulateurs.warning.fermer.aria-label',
										'J’ai compris, fermer le message condensé.'
									)}
								>
									{t('simulateurs.warning.fermer.texte', 'J’ai compris')}
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
