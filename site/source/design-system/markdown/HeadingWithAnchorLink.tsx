import React from 'react'
import { styled } from 'styled-components'

import useScrollToHash from '@/components/utils/Scroll/useScrollToHash'
import { H1, H2, H3, H4, H5, H6, Link } from '@/design-system'
import { useNavigation } from '@/lib/navigation'
import { isIterable } from '@/utils'

type Props = {
	level: number
	children: React.ReactNode
}

export default function HeadingWithAnchorLink({ level, children }: Props) {
	useScrollToHash()
	const { currentPath } = useNavigation()
	const headingId = flatMapChildren(children)
		.join(' ')
		.toLowerCase()
		.replace(emojiesRegex, '')
		.replace(/:|,/g, '')
		.trim()
		.replace(/\s+/g, '-')

	const childrenWithAnchor = headingId ? (
		<>
			<Link className="anchor-link" to={`${currentPath}#${headingId}`}>
				#
			</Link>
			{children}
		</>
	) : (
		children
	)

	return (
		<StyledHeading id={headingId} level={level}>
			{childrenWithAnchor}
		</StyledHeading>
	)
}

const flatMapChildren = (children: React.ReactNode): Array<string | number> => {
	return React.Children.toArray(children).flatMap((child) =>
		typeof child === 'string' || typeof child === 'number'
			? child
			: isIterable(child)
			? flatMapChildren(Array.from(child))
			: typeof child === 'object' && 'props' in child
			? // eslint-disable-next-line
			  (child.props?.value as string) ?? flatMapChildren(child.props?.children)
			: ''
	)
}

type HeadingProps = {
	level: number
	children: React.ReactNode
} & React.ComponentProps<'h1'>
const Heading = ({ level, children, ...otherProps }: HeadingProps) =>
	React.createElement(
		level === 1
			? H1
			: level === 2
			? H2
			: level === 3
			? H3
			: level === 4
			? H4
			: level === 5
			? H5
			: H6,
		otherProps,
		children
	)

const StyledHeading = styled(Heading)`
	position: relative;

	.anchor-link {
		display: none;
		position: absolute;
		top: 0;
		left: 0;
		transform: translateX(-100%);
		padding-right: 6px;
		color: var(--lighterTextColor);
		background-color: inherit;
		text-decoration: none;
		font-size: 0.8em;
	}
	&:hover .anchor-link {
		display: block;
	}
`

// https://stackoverflow.com/a/41164587/1652064
const emojiesRegex = new RegExp(
	`(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|
[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]
|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|
\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]
|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|
\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|
\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|
\u2935|[\u2190-\u21ff])`.replace(/\r?\n/g, ''),
	'g'
)
