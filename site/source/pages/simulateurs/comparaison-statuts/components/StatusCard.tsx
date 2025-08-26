import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { StatutTag, StatutType } from '@/components/StatutTag'
import { CardContainer, Emoji, Grid } from '@/design-system'

type StatutCardType = {
	statut: StatutType[]
	footerContent?: ReactNode
	isBestOption?: boolean
	children: ReactNode
}

const StatusCard = ({
	statut: status,
	children,
	footerContent,
	isBestOption,
}: StatutCardType) => {
	const { t } = useTranslation()

	return (
		<StyledCardContainer $inert>
			<CardBody>
				<Grid container spacing={1}>
					{status.map((statusString) => (
						<Grid item key={statusString}>
							<StatutTag statut={statusString} text="acronym" showIcon />
						</Grid>
					))}
				</Grid>
				{children}
			</CardBody>
			{isBestOption && (
				<AbsoluteSpan
					title={t(
						'pages.simulateurs.comparaison-statuts.meilleure-option',
						'Option la plus avantageuse.'
					)}
				>
					<StyledEmoji emoji="🥇" />
				</AbsoluteSpan>
			)}
			{footerContent && <CardFooter>{footerContent}</CardFooter>}
		</StyledCardContainer>
	)
}

export default StatusCard

const StyledCardContainer = styled(CardContainer)`
	position: relative;
	align-items: flex-start;
	padding: 0;
`

const AbsoluteSpan = styled.span`
	position: absolute;
	top: 0;
	right: 1.5rem;
`
const StyledEmoji = styled(Emoji)`
	font-size: 1.5rem;
`

const CardBody = styled.div`
	padding: 1.5rem;
	flex: 1;
	display: flex;
	flex-direction: column;
	width: 100%;
`

const CardFooter = styled.div`
	width: 100%;
	border-top: 1px solid ${({ theme }) => theme.colors.extended.grey[300]};
	padding: 1.5rem;
`
