import { Link } from 'react-router-dom'
import styled from 'styled-components'
export default function CardSelection(props: {
	children: React.ReactNode
	onClick?: React.HTMLProps<HTMLButtonElement>['onClick']
	to?: React.ComponentProps<Link>['to']
}) {
	const StyledContainer = createStyledContainer(props.to ? 'link' : 'button')
	return (
		<StyledContainer
			className="ui__ interactive card"
			{...(props.to ? { to: props.to } : { onClick: props.onClick })}
		>
			<>
				{props.children}
				<div
					className="ui__ hide-mobile"
					css={`
						position: absolute;
						transition: transform 0.1s;
						right: 0.1rem;
						font-size: 2rem;
						height: 100%;
						color: var(--lighterTextColor);
						display: flex;
						align-items: center;
						will-change: transform;
					`}
				>
					〉
				</div>
			</>
		</StyledContainer>
	)
}

const createStyledContainer = (type: 'button' | 'link') => styled(
	type === 'button' ? type : Link
)`
	position: relative;
	display: flex;
	text-align: left;
	font-size: inherit;
	font-family: inherit;
	margin-top: 0.4rem;
	text-decoration: none;
	width: 100%;
	flex-direction: column;
	:hover > :last-child {
		transform: translateX(0.2rem);
	}
`
