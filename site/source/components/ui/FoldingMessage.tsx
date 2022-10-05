import { Message, MessageType } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Spacing } from '@/design-system/layout'
import { Link } from '@/design-system/typography/link'
import { Intro } from '@/design-system/typography/paragraphs'
import { ReactNode, useState } from 'react'
import { Trans } from 'react-i18next'
import { FromTop } from './animate'

type FoldingMessageProps = {
	title: string
	children: ReactNode
	isDefaultFolded?: boolean
	unfoldButtonLabel: string
	type?: MessageType | undefined
}

export default function FoldingMessage({
	title,
	children,
	isDefaultFolded = true,
	unfoldButtonLabel,
	type = 'primary',
	...props
}: FoldingMessageProps) {
	const [isFolded, setIsFolded] = useState<boolean>(isDefaultFolded)

	return (
		<Message type={type} {...props}>
			<div className="print-hidden">
				<Intro as="h2">
					<Trans>{title}</Trans>{' '}
					{isFolded && (
						<Link
							onPress={() => setIsFolded(false)}
							aria-expanded={false}
							aria-controls="warning-text"
						>
							<Trans i18nKey="simulateurs.warning.plus">
								{unfoldButtonLabel}
							</Trans>
						</Link>
					)}
				</Intro>
				{!isFolded && (
					<FromTop>
						<div id="warning-text">{children}</div>
						<div className="ui__ answer-group print-hidden">
							<Button
								size="XS"
								aria-expanded
								aria-controls="warning-text"
								light
								color="primary"
								onPress={() => setIsFolded(true)}
							>
								<Trans>Fermer</Trans>
							</Button>
							<Spacing md />
						</div>
					</FromTop>
				)}
			</div>
			<div className="print-only">{children}</div>
		</Message>
	)
}
