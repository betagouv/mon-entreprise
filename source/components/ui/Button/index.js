/* @flow */
import * as React from 'react'
import './button.css'
export const SkipButton = (props: React.ElementConfig<'button'>) => (
	<button className="ui__ skip-button" {...props}>
		{props.children || 'Skip ›'}
	</button>
)

export const LinkButton = (props: React.ElementConfig<'button'>) => (
	<button className="ui__ link-button" {...props} />
)

export const Button = (props: React.ElementConfig<'button'>) => (
	<button className="ui__ button" {...props} />
)
