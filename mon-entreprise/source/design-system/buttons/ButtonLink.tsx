import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from './Button'

type Size = 'XL' | 'MD' | 'XS'
type Color = 'primary' | 'secondary' | 'tertiary'

type ButtonProps =
	| {
			color: Color
			size: Size
			to: string
			light?: boolean
			children: ReactNode
	  }
	| {
			color: Color
			size: Size
			href: string
			light?: boolean
			children: ReactNode
	  }

export const ButtonLink = (props: ButtonProps) => {
	if ('to' in props) {
		const { to, ...otherProps } = props
		return (
			<Link to={to}>
				<Button {...otherProps} />
			</Link>
		)
	} else if ('href' in props) {
		const { href, ...otherProps } = props
		return (
			<a href={href} target="_blank" rel="noreferrer">
				<Button {...otherProps} />
			</a>
		)
	}
	return null
}
