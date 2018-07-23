/* @flow */
import * as React from 'react'
import './button.css'
export const SkipButton = (props: React.ElementConfig<'button'>) => (
	<button {...props} className={'ui__ skip-button ' + props.className}>
		{props.children || 'Skip ›'}
	</button>
)

export const LinkButton = (props: React.ElementConfig<'button'>) => (
	<button {...props} className={'ui__ link-button ' + props.className} />
)

export const Button = (props: React.ElementConfig<'button'>) => (
	<button {...props} className={'ui__ button ' + props.className} />
)
