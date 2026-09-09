import { formatValue } from 'publicodes'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import LectureGuide from '@/components/LectureGuide'
import { Grid, SmallBody } from '@/design-system'

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
					<StyledSmallBody id={`${idPrefix}-label`}>{label}</StyledSmallBody>
				</Grid>

				<LectureGuide />

				<Grid item>
					<StyledSmallBody id={`${idPrefix}-value`}>
						{formatValue(value, {
							displayedUnit: '€',
							precision: 2,
							language,
						})}
					</StyledSmallBody>
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

const StyledSmallBody = styled(SmallBody)`
	color: ${({ theme }) => theme.colors.extended.grey[100]};
	margin: 0;
	padding: ${({ theme }) => `${theme.spacings.xs} ${theme.spacings.sm} 0 0`};
`
