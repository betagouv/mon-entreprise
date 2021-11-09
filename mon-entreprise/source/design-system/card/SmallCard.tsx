import { GenericButtonOrLinkProps } from 'DesignSystem/buttons/Button'
import InfoBulle from 'DesignSystem/InfoBulle'
import { Strong } from 'DesignSystem/typography'
import { Link } from 'DesignSystem/typography/link'
import { ReactNode } from 'react'
import styled from 'styled-components'

type SmallCardProps = {
	icon?: ReactNode
	children?: ReactNode
	callToAction: GenericButtonOrLinkProps
	title?: string
	tooltip?: string
}

const Container = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	background-color: ${({ theme }) => theme.colors.extended.grey[100]};
	border-radius: 0.375rem;
	box-shadow: ${({ theme }) => theme.elevations[2]};
	&:hover {
		box-shadow: ${({ theme }) => theme.elevations[3]};
		text-decoration: none;
	}
	padding: 1.5rem;
	width: 100%;
	height: 100%;
	transition: box-shadow 300ms;
`

const IconPlaceholder = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 4.5rem;
	width: 4.5rem;
	flex-shrink: 0;
	border-radius: 100%;
	background-color: ${({ theme }) => theme.colors.bases.primary[200]};

	& > img {
		width: 40% !important;
		height: 40% !important;
	}
`

const Content = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	height: 100%;
	margin-left: 1rem;
`

export const SmallCard = ({
	icon,
	children,
	title,
	callToAction,
	tooltip,
}: SmallCardProps) => {
	return (
		<Container as={Link} {...callToAction}>
			<IconPlaceholder>{icon}</IconPlaceholder>
			<Content>
				{title && (
					<span>
						<Strong>{title}</Strong>
						{tooltip && <InfoBulle>{tooltip}</InfoBulle>}
					</span>
				)}
				{children}
			</Content>
		</Container>
	)
}
