import { styled } from 'styled-components'

import { TrackPage } from '@/components/PianoAnalytics'
import Meta from '@/components/utils/Meta'
import { Link, MDXWrapper } from '@/design-system'

export interface DocumentationPageProps {
	title: string
	children: React.ReactNode
	backToDocumentationUrl?: string
	backToSimulatorUrl?: string
	backToDocumentationLabel?: string
	backToSimulatorLabel?: string
}

export const DocumentationPage = ({
	title,
	children,
	backToDocumentationUrl,
	backToSimulatorUrl,
	backToDocumentationLabel = '← Retour à la documentation',
	backToSimulatorLabel = 'Simulateur',
}: DocumentationPageProps) => {
	return (
		<>
			<TrackPage name={`Documentation - ${title}`} />
			<Meta title={title} description={`Documentation - ${title}`} />

			{(backToDocumentationUrl || backToSimulatorUrl) && (
				<NavigationContainer>
					{backToDocumentationUrl && (
						<Link to={backToDocumentationUrl}>{backToDocumentationLabel}</Link>
					)}
					{backToDocumentationUrl && backToSimulatorUrl && ' | '}
					{backToSimulatorUrl && (
						<Link to={backToSimulatorUrl}>{backToSimulatorLabel}</Link>
					)}
				</NavigationContainer>
			)}

			<MDXWrapper>{children}</MDXWrapper>
		</>
	)
}

export const NavigationContainer = styled.nav`
	margin-bottom: 2rem;
`
