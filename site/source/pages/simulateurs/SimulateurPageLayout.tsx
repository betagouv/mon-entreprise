import { ReactNode } from 'react'
import { styled } from 'styled-components'

import { TrackChapter, TrackingChapters } from '@/components/ATInternetTracking'
import BêtaChip from '@/components/BêtaChip'
import { PublicodesDateChip } from '@/components/PublicodesDateChip'
import Loader from '@/components/utils/Loader'
import Meta from '@/components/utils/Meta'
import { H1, Intro } from '@/design-system'
import { MergedSimulatorDataValues } from '@/hooks/useCurrentSimulatorData'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import { SimulateurId } from '@/hooks/useSimulatorsData'
import { Merge } from '@/types/utils'

import { ExternalLink } from './_configs/types'
import NextSteps from './NextSteps'

type Props = {
	children: ReactNode
	simulateurConfig: MergedSimulatorDataValues
	isReady?: boolean
	showDate?: boolean
	nextSteps?: SimulateurId[]
	externalLinks?: ExternalLink[]
}

export default function SimulateurPageLayout({
	children,
	simulateurConfig,
	isReady = true,
	showDate = true,
	nextSteps,
	externalLinks,
}: Props) {
	const inIframe = useIsEmbedded()

	if (!isReady) {
		return <Loader />
	}

	const {
		tracking,
		meta,
		title,
		beta,
		tooltip,
		iframePath,
		private: privateIframe,
		seoExplanations: SeoExplanations,
	} = simulateurConfig

	const { chapter1, chapter2, chapter3 } = tracking as TrackingChapters
	const metadata = meta as Merge<MergedSimulatorDataValues['meta']>

	return (
		<TrackChapter chapter1={chapter1} chapter2={chapter2} chapter3={chapter3}>
			{metadata && (
				<Meta
					title={metadata.title}
					description={metadata.description}
					ogTitle={metadata.ogTitle}
					ogDescription={metadata.ogDescription}
					ogImage={metadata.ogImage}
				/>
			)}

			{title && !inIframe && (
				<>
					<H1>
						<StyledSpan>{title}</StyledSpan>{' '}
						{showDate && <PublicodesDateChip />}
						{beta && <BêtaChip />}
					</H1>
					{tooltip && <Intro>{tooltip}</Intro>}
				</>
			)}

			{children}

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
						externalLinks={externalLinks}
					/>
				</>
			)}
		</TrackChapter>
	)
}

const StyledSpan = styled.span`
	margin-right: ${({ theme }) => theme.spacings.sm};
`
