import { ReactNode } from 'react'
import { styled } from 'styled-components'

import { StatutTag, StatutType } from '@/components/StatutTag'
import { CardContainer, Grid } from '@/design-system'

type StatutCardType = {
	statut: StatutType[]
	footerContent?: ReactNode
	children: ReactNode
}

const StatusCard = ({
	statut: status,
	children,
	footerContent,
}: StatutCardType) => {
	return (
		<StyledCardContainer inert>
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
