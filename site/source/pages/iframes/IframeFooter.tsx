import BadNews from '@/components/BadNews'
import FeedbackButton from '@/components/Feedback'
import Privacy from '@/components/layout/Footer/Privacy'
import { Spacing } from '@/design-system/layout'

export default function IframeFooter() {
	return (
		<>
			<div
				style={{
					textAlign: 'center',
				}}
			>
				<Spacing md />
				<BadNews />
				<FeedbackButton isEmbedded />
				<Spacing md />
				<Privacy noUnderline={false} />
				<Spacing lg />
			</div>
		</>
	)
}
