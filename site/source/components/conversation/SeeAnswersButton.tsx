import { Button } from '@/design-system/buttons'
import { PopoverWithTrigger } from '@/design-system'
import { Trans } from 'react-i18next'
import Answers from './AnswerList'

export default function SeeAnswersButton() {
	return (
		<PopoverWithTrigger
			trigger={(buttonProps) => (
				<Button {...buttonProps} size="XS" light>
					<Trans>Voir ma situation</Trans>
				</Button>
			)}
		>
			{(close) => <Answers onClose={close} />}
		</PopoverWithTrigger>
	)
}
