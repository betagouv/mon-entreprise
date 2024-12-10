import { formatValue } from 'publicodes'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import LectureGuide from '@/components/Simulation/LectureGuide'
import { Grid } from '@/design-system/layout'
import { Body } from '@/design-system/typography/paragraphs'

type Props = {
	value: number
	label: string
	idPrefix: string
}

export default function RépartitionValue({ value, label, idPrefix }: Props) {
	const language = useTranslation().i18n.language

	return (
		<StyledValue>
			<Grid
				container
				style={{
					alignItems: 'baseline',
					justifyContent: 'space-between',
				}}
				spacing={2}
			>
				<Grid item md="auto" sm={9} xs={8}>
					<StyledBody id={`${idPrefix}-label`}>{label}</StyledBody>
				</Grid>

				<LectureGuide />

				<Grid item>
					<StyledBody id={`${idPrefix}-value`}>
						{formatValue(value, {
							displayedUnit: '€',
							precision: 2,
							language,
						})}
					</StyledBody>
				</Grid>
			</Grid>
		</StyledValue>
	)
}

const StyledValue = styled.div`
	position: relative;
	z-index: 1;
	padding: ${({ theme }) => theme.spacings.xxs} 0;

	@media print {
		padding: 0;
	}
`

const StyledBody = styled(Body)`
	color: ${({ theme }) => theme.colors.extended.grey[100]};
	margin: 0;
	padding: ${({ theme }) => `${theme.spacings.xs} ${theme.spacings.sm} 0 0`};
`
