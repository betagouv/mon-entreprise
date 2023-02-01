import { ComponentPropsWithoutRef } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import Meta from '@/components/utils/Meta'
import { useIsEmbedded } from '@/components/utils/useIsEmbedded'
import useSearchParamsSimulationSharing from '@/components/utils/useSearchParamsSimulationSharing'
import useSimulationConfig from '@/components/utils/useSimulationConfig'
import { Chip } from '@/design-system'
import { Emoji } from '@/design-system/emoji'
import { Spacing } from '@/design-system/layout'
import { H1 } from '@/design-system/typography/heading'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import { DeepWriteable } from '@/pages/Simulateurs/cout-creation-entreprise/_config'
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
	simulation?: ExtractFromSimuData<'simulation'>
	tracking: ExtractFromSimuData<'tracking'>
	tooltip?: ExtractFromSimuData<'tooltip'>
	iframePath: ExtractFromSimuData<'iframePath'>
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
		simulation,
		title,
		tracking,
		tooltip,
		beta,
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
	const year = typeof année === 'number' ? `Année ${année}` : ''

	const inIframe = useIsEmbedded()
	const config = simulation as DeepWriteable<typeof simulation>
	useSimulationConfig({ path, config })
	useSearchParamsSimulationSharing()

	const trackInfo = {
		chapter1:
			typeof tracking !== 'string' && tracking && 'chapter1' in tracking
				? tracking.chapter1
				: ('simulateurs' as const),
		...(typeof tracking === 'string' ? { chapter2: tracking } : tracking),
	} as ComponentPropsWithoutRef<typeof TrackChapter>

	return (
		<CurrentSimulatorDataProvider value={props}>
			<TrackChapter {...trackInfo}>
				{meta && <Meta page={`simulateur.${title ?? ''}`} {...meta} />}

				{beta && <BetaBanner />}
				{title && !inIframe && (
					<>
						<H1>
							<StyledSpan>{title}</StyledSpan>
							{year && (
								<Chip type="secondary" icon={<Emoji emoji="📆" />}>
									{year}
								</Chip>
							)}
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

const StyledBody = styled(Body)`
	height: 500px;

	div {
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;

		span {
			margin-right: ${({ theme }) => theme.spacings.sm};
		}
	}
`

const StyledSpan = styled.span`
	margin-right: ${({ theme }) => theme.spacings.sm};
`
