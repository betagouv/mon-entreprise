import { Button } from 'DesignSystem/buttons'
import { H3 } from 'DesignSystem/typography/heading'
import { ReactEventHandler, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

type CardProps = {
	title: string
	icon?: ReactNode
	children: ReactNode
	callToAction:
		| {
				to: string | { pathname: string; state?: any; search?: string }
				label: string
		  }
		| {
				callback: ReactEventHandler
				label: string
		  }
		| {
				href: string
				label: string
		  }
}

export const Card = ({ title, icon, children, callToAction }: CardProps) => {
	return (
		<StyledCardContainer>
			{icon && <IconContainer>{icon}</IconContainer>}
			<StyledHeader as="h2">{title}</StyledHeader>
			<CardBody>{children}</CardBody>
			{'to' in callToAction && (
				<Link to={callToAction.to}>
					<Button size="XS" color="primary">
						{callToAction.label}
					</Button>
				</Link>
			)}
			{'callback' in callToAction && (
				<Button size="XS" color="primary" onClick={callToAction.callback}>
					{callToAction.label}
				</Button>
			)}
			{'href' in callToAction && (
				<a href={callToAction.href} target="_blank" rel="noreferrer">
					<Button size="XS" color="primary">
						{callToAction.label}
					</Button>
				</a>
			)}
		</StyledCardContainer>
	)
}

const StyledHeader = styled(H3)`
	text-align: center;
`

const IconContainer = styled.div`
	transform: scale(2.3);
	padding: 1rem;
`

const CardBody = styled.div`
	flex-grow: 1;
`

export const StyledCardContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: ${({ theme }) => theme.colors.extended.grey[100]};
	border-radius: 0.375rem;
	box-shadow: ${({ theme }) => theme.elevations[2]};
	&:hover {
		box-shadow: ${({ theme }) => theme.elevations[3]};
	}
	padding: 1.5rem;
	width: 100%;
	height: 100%;
	transition: box-shadow 300ms;
`
