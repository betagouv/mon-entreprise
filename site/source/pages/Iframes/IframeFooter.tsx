import Privacy from 'Components/layout/Footer/Privacy'
import { Spacing } from 'DesignSystem/layout'

export default function IframeFooter() {
	return (
		<>
			<div
				style={{
					textAlign: 'center',
				}}
			>
				<Spacing xl />
				<Privacy />
				<Spacing lg />
			</div>
		</>
	)
}
