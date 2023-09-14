import { keyframes, styled } from 'styled-components'

type SkeletonProps = {
	width?: number
	height?: number
}

const skeletonKeyframes = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
` as unknown as string // keyframes type are outdated, see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/48907

export default function Skeleton({ width, height }: SkeletonProps) {
	return (
		<StyledSpan
			style={{
				width,
				height,
			}}
		>
			&zwnj;
		</StyledSpan>
	)
}

const StyledSpan = styled.span`
	background-color: #eee;
	background-image: linear-gradient(90deg, #eee, #f5f5f5, #eee);
	background-size: 200px 100%;
	background-repeat: no-repeat;
	border-radius: 4px;
	display: inline-block;
	line-height: 1;
	animation: ${skeletonKeyframes} 1.2s ease-in-out infinite;
`