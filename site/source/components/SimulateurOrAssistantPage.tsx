import { useLocation } from 'react-router-dom'
import { styled } from 'styled-components'

import Meta from '@/components/utils/Meta'
import { Chip, Emoji, H1, Intro } from '@/design-system'
import {
	MergedSimulatorDataValues,
	useCurrentSimulatorData,
} from '@/hooks/useCurrentSimulatorData'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import { ExternalLink } from '@/pages/simulateurs/_configs/types'
import { Merge } from '@/types/utils'

import NextSteps from '../pages/simulateurs/NextSteps'
import { TrackChapter, TrackingChapters } from './ATInternetTracking'
import DateChip from './DateChip'

type Props = {
	additionalExternalLinks?: ExternalLink[]
}

export default function SimulateurOrAssistantPage({
	additionalExternalLinks = [],
}: Props) {
	const { currentSimulatorData } = useCurrentSimulatorData()
	const { pathname } = useLocation()
	if (!currentSimulatorData) {
		throw new Error(`No simulator found with url: ${pathname}`)
	}

	const {
		meta,
		title,
		tracking,
		tooltip,
		beta,
		iframePath,
		private: privateIframe,
		component: Component,
		seoExplanations: SeoExplanations,
		nextSteps,
		externalLinks = [],
		hideDate,
		withPublicodes,
	} = currentSimulatorData

	const inIframe = useIsEmbedded()

	const { chapter1, chapter2, chapter3 } = tracking as TrackingChapters

	const { ogTitle, ogDescription, ogImage } = meta as Merge<
		MergedSimulatorDataValues['meta']
	>

	const allExternalLinks = additionalExternalLinks.concat(externalLinks)

	return (
		<TrackChapter chapter1={chapter1} chapter2={chapter2} chapter3={chapter3}>
			{meta && (
				<Meta
					title={meta.title}
					description={meta.description}
					ogTitle={ogTitle}
					ogDescription={ogDescription}
					ogImage={ogImage}
				/>
			)}

			{/* {beta && <BetaBanner />} */}

			{title && !inIframe && (
				<>
					<H1>
						<StyledSpan>{title}</StyledSpan>{' '}
						{withPublicodes !== false && !hideDate && <DateChip />}
						{beta && (
							<Chip type="info" icon={<Emoji emoji="🚧" />}>
								Version bêta
							</Chip>
						)}
					</H1>
					{tooltip && <Intro>{tooltip}</Intro>}
				</>
			)}

			<Component />

			{!inIframe && (
				<>
					{SeoExplanations && (
						<section>
							<SeoExplanations />
						</section>
					)}
					<NextSteps
						iframePath={privateIframe ? undefined : iframePath}
						nextSteps={nextSteps}
						externalLinks={allExternalLinks}
					/>
				</>
			)}
		</TrackChapter>
	)
}

const StyledSpan = styled.span`
	margin-right: ${({ theme }) => theme.spacings.sm};
`
