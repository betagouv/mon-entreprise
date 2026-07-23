import { ReactNode } from 'react'
import { styled } from 'styled-components'

import BêtaChip from '@/components/BêtaChip'
import {
	TrackingChapters,
	TrackingChaptersProvider,
} from '@/components/PianoAnalytics/TrackingChaptersContext'
import { PublicodesDateChip } from '@/components/PublicodesDateChip'
import Loader from '@/components/utils/Loader'
import Meta, { OpenGraph } from '@/components/utils/Meta'
import { H1, Intro } from '@/design-system'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import {
	MergedSimulatorMetadata,
	SimulateurId,
} from '@/hooks/useSimulatorsMetadata'

import { ExternalLink } from './_configs/types'
import NextSteps from './NextSteps'

type Props = {
	children: ReactNode
	metadata: MergedSimulatorMetadata
	openGraph?: OpenGraph
	seoExplanations?: ReactNode
	isReady?: boolean
	showDate?: boolean
	nextSteps?: SimulateurId[]
	externalLinks?: ExternalLink[]
}

export default function SimulateurPageLayout({
	children,
	metadata,
	openGraph,
	seoExplanations,
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
		id,
		tracking,
		meta,
		title,
		beta,
		tooltip,
		private: privateIframe,
	} = metadata

	const { chapter1, chapter2, chapter3 } = tracking as TrackingChapters

	return (
		<TrackingChaptersProvider
			chapter1={chapter1}
			chapter2={chapter2}
			chapter3={chapter3}
		>
			{meta && (
				<Meta
					title={meta.title}
					description={meta.description}
					openGraph={openGraph}
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

			{inIframe ? <Conteneur>{children}</Conteneur> : children}

			{!inIframe && (
				<>
					{seoExplanations && <section>{seoExplanations}</section>}

					<NextSteps
						simulateur={privateIframe ? undefined : id}
						nextSteps={nextSteps}
						externalLinks={externalLinks}
					/>
				</>
			)}
		</TrackingChaptersProvider>
	)
}

const Conteneur = styled.div`
	padding: 0 ${({ theme }) => theme.spacings.xxxs};
`
const StyledSpan = styled.span`
	margin-right: ${({ theme }) => theme.spacings.sm};
`
