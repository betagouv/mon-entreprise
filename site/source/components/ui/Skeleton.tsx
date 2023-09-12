import { keyframes } from 'styled-components'

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
		<span
			style={{
				backgroundColor: '#eee',
				backgroundImage: 'linear-gradient(90deg, #eee, #f5f5f5, #eee)',
				backgroundSize: '200px 100%',
				backgroundRepeat: 'no-repeat',
				borderRadius: '4px',
				display: 'inline-block',
				lineHeight: '1',
				animation: `${skeletonKeyframes} 1.2s ease-in-out infinite`,
				width,
				height,
			}}
		>
			&zwnj;
		</span>
	)
}
