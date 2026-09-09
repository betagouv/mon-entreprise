import FeedbackButton from '@/components/Feedback'
import PrivacyPolicy from '@/components/layout/Footer/PrivacyPolicy'
import { LogoWithLink } from '@/components/Logo'
import { Spacing } from '@/design-system'
import { useCurrentSimulatorData } from '@/hooks/useCurrentSimulatorData'

export default function IframeFooter() {
	const { currentSimulatorData } = useCurrentSimulatorData()

	return (
		<>
			<div
				style={{
					textAlign: 'center',
				}}
			>
				<Spacing md />
				{!currentSimulatorData?.disableIframeFeedback && (
					<>
						<FeedbackButton isEmbedded />
						<Spacing md />
					</>
				)}
				<PrivacyPolicy noUnderline={false} />
				<Spacing lg />
				{!currentSimulatorData?.pathId.startsWith('simulateur') && (
					<LogoWithLink />
				)}
			</div>
		</>
	)
}
