import { Button } from 'DesignSystem/buttons'
import PopoverWithTrigger from 'DesignSystem/PopoverWithTrigger'
import { Trans } from 'react-i18next'
import Answers from './AnswerList'
import './conversation.css'

export default function SeeAnswersButton() {
	return (
		<PopoverWithTrigger
			trigger={(propsToDispatch) => (
				<Button {...propsToDispatch} light size="XS">
					<Trans>Voir mes paramètres</Trans>
				</Button>
			)}
		>
			{(close) => <Answers onClose={close} />}
		</PopoverWithTrigger>
	)
}
