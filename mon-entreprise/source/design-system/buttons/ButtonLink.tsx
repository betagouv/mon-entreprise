import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from './Button'

type Size = 'XL' | 'MD' | 'XS'
type Color = 'primary' | 'secondary' | 'tertiary'

type ButtonProps = {
	color: Color
	size: Size
	to: string
	light?: boolean
	children: ReactNode
}

export const ButtonLink = (props: ButtonProps) => {
	const { to, ...otherProps } = props
	return (
		<Link to={to}>
			<Button {...otherProps} />
		</Link>
	)
}
