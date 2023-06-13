import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import FeedbackForm from '@/components/Feedback/FeedbackForm'
import { Message, PopoverWithTrigger } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Emoji } from '@/design-system/emoji'

export default function ActivityNotFound({ job }: { job: string }) {
	const [hide, setHide] = useState(false)
	const { t } = useTranslation()

	useEffect(() => {
		if (job.length > 0) {
			setHide(true)
		}
	}, [job.length])

	return (
		<>
			<PopoverWithTrigger
				trigger={(buttonProps) =>
					// eslint-disable-next-line react/jsx-props-no-spreading
					hide ? (
						<Button
							{...buttonProps}
							size="XS"
							color="tertiary"
							aria-haspopup="dialog"
							light
						>
							<Emoji emoji="🖐️" />{' '}
							<Trans i18nKey="search-code-ape.cant-find-my-activity">
								Je ne trouve pas mon activité
							</Trans>
						</Button>
					) : (
						<></>
					)
				}
				small
			>
				{() => (
					<>
						<FeedbackForm
							title={t('Quelle est votre activité ?')}
							infoSlot={
								<Message border={false} type="info" icon>
									<Trans i18nKey="search-code-ape.feedback.info">
										Nous ne sommes pas en mesure de répondre aux questions
										concernant le code APE de votre entreprise.
									</Trans>
								</Message>
							}
							description={
								<Trans i18nKey="search-code-ape.feedback.description">
									Décrivez-nous votre activité ainsi que les termes de recherche
									que vous avez utilisés qui n'ont pas donné de bons résultats.
									<br />
									Nous utiliserons ces informations pour améliorer cet outil.
								</Trans>
							}
							placeholder={t(
								`Bonjour, je suis boulanger et je n'ai pas trouvé en cherchant "pain" ou "viennoiserie".`
							)}
							tags={['code-ape']}
							hideShare
						/>
					</>
				)}
			</PopoverWithTrigger>
		</>
	)
}
