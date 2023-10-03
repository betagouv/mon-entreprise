import { BadNews } from '@/components/BadNews'
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
				{/* <div style={{ display: 'flex', justifyContent: 'center' }}>
					<BadNews />
				</div> */}
				<FeedbackButton isEmbedded />
				<Spacing md />
				<Privacy noUnderline={false} />
				<Spacing lg />
			</div>
		</>
	)
}
