import { PopoverWithTrigger } from '@/design-system'
import { Button } from '@/design-system/buttons'
import React from 'react'
import { Trans } from 'react-i18next'
import Answers from './AnswerList'

export default function SeeAnswersButton({
	children,
	label,
}: {
	children?: React.ReactNode
	label?: React.ReactNode
}) {
	return (
		<>
			<PopoverWithTrigger
				trigger={(buttonProps) => (
					<Button
						{...buttonProps}
						size="XS"
						color="secondary"
						aria-haspopup="dialog"
					>
						{label ?? <Trans>Modifier mes réponses</Trans>}
					</Button>
				)}
			>
				{(close) => <Answers onClose={close}>{children}</Answers>}
			</PopoverWithTrigger>
		</>
	)
}
