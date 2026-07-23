import { FeedbackButton } from '@/components/Feedback/FeedbackButton'
import PrivacyPolicy from '@/components/layout/Footer/PrivacyPolicy'
import { LogoWithLink } from '@/components/Logo'
import { Spacing } from '@/design-system'

type Props = {
	avecAvis?: boolean
	avecLogo?: boolean
}

export default function IframeFooter({
	avecAvis = true,
	avecLogo = false,
}: Props) {
	return (
		<>
			<div
				style={{
					textAlign: 'center',
				}}
			>
				<Spacing md />
				{avecAvis && (
					<>
						<FeedbackButton isEmbedded />
						<Spacing md />
					</>
				)}
				<PrivacyPolicy noUnderline={false} />
				<Spacing lg />
				{avecLogo && <LogoWithLink />}
			</div>
		</>
	)
}
