import { ComponentPropsWithoutRef } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import Meta from '@/components/utils/Meta'
import { useIsEmbedded } from '@/components/utils/useIsEmbedded'
import useSearchParamsSimulationSharing from '@/components/utils/useSearchParamsSimulationSharing'
import useSimulationConfig from '@/components/utils/useSimulationConfig'
import { Chip } from '@/design-system'
import { Spacing } from '@/design-system/layout'
import { H1 } from '@/design-system/typography/heading'
import { Intro } from '@/design-system/typography/paragraphs'
import { situationSelector } from '@/selectors/simulationSelectors'

import { TrackChapter } from '../ATInternetTracking'
import { NextSteps } from '../pages/Simulateurs/NextSteps'
import {
	CurrentSimulatorDataProvider,
	ExtractFromSimuData,
} from '../pages/Simulateurs/metadata'
import BetaBanner from './BetaBanner'

export interface PageDataProps {
	meta: ExtractFromSimuData<'meta'>
	config?: ExtractFromSimuData<'config'>
	tracking: ExtractFromSimuData<'tracking'>
	tooltip?: ExtractFromSimuData<'tooltip'>
	description?: ExtractFromSimuData<'description'>
	iframePath?: ExtractFromSimuData<'iframePath'>
	seoExplanations?: ExtractFromSimuData<'seoExplanations'>
	beta?: ExtractFromSimuData<'beta'>
	nextSteps?: ExtractFromSimuData<'nextSteps'>
	path: ExtractFromSimuData<'path'>
	title: ExtractFromSimuData<'title'>
	private?: ExtractFromSimuData<'private'>
	component: ExtractFromSimuData<'component'>
	icône: ExtractFromSimuData<'icône'>
	pathId: ExtractFromSimuData<'pathId'>
	shortName: ExtractFromSimuData<'shortName'>
}

export default function PageData(props: PageDataProps) {
	const {
		meta,
		config,
		title,
		tracking,
		tooltip,
		beta,
		description,
		iframePath,
		private: privateIframe,
		component: Component,
		seoExplanations,
		nextSteps,
		path,
	} = props

	const situation = useSelector(situationSelector)
	const année =
		typeof situation.date === 'string' && new Date(situation.date).getFullYear()
	const year =
		typeof année === 'number' && année !== 2022 ? `Année ${année}` : ''

	const inIframe = useIsEmbedded()
	useSimulationConfig({ path, config })
	useSearchParamsSimulationSharing()

	const trackInfo = {
		chapter1:
			typeof tracking === 'string' || !('chapter1' in tracking)
				? ('simulateurs' as const)
				: tracking.chapter1,
		...(typeof tracking === 'string' ? { chapter2: tracking } : tracking),
	} as ComponentPropsWithoutRef<typeof TrackChapter>

	return (
		<CurrentSimulatorDataProvider value={props}>
			<TrackChapter {...trackInfo}>
				{meta && <Meta page={`simulateur.${title ?? ''}`} {...meta} />}

				{beta && (
					<StyledBetaContainer>
						<BetaBanner />
					</StyledBetaContainer>
				)}
				{title && !inIframe && (
					<>
						<H1>
							<StyledSpan>{title}</StyledSpan>
							{year && (
								<Chip type="secondary" icon="📆">
									{year}
								</Chip>
							)}
							{beta && (
								<Chip type="info" icon="🚧">
									Version bêta
								</Chip>
							)}
						</H1>
						{tooltip && <Intro>{tooltip}</Intro>}
					</>
				)}
				{description && !inIframe && description}

				<Component />

				{!inIframe && (
					<>
						<section>{seoExplanations}</section>
						<NextSteps
							iframePath={privateIframe ? undefined : iframePath}
							nextSteps={nextSteps}
						/>

						<Spacing lg />
					</>
				)}
			</TrackChapter>
		</CurrentSimulatorDataProvider>
	)
}
const StyledSpan = styled.span`
	margin-right: ${({ theme }) => theme.spacings.sm};
`
const StyledBetaContainer = styled.div`
	padding-top: ${({ theme }) => theme.spacings.xl};
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		padding-top: ${({ theme }) => theme.spacings.md};
	}
	margin-bottom: -${({ theme }) => theme.spacings.xl};
	position: sticky;
	top: 0;
	z-index: 3;
	background-color: ${({ theme }) =>
		!theme.darkMode ? 'rgba(255, 255, 255, 0.7)' : 'inherit'};
`
