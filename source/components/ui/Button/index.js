/* @flow */
import { React, T } from 'Components'
import type { ElementConfig } from 'react'
import './button.css'

export const SkipButton = (props: ElementConfig<'button'>) => (
	<button {...props} className={'ui__ skip-button ' + props.className}>
		{props.children || (
			<>
				<T>Passer</T> ›
			</>
		)}
	</button>
)

export const LinkButton = (props: ElementConfig<'button'>) => (
	<button {...props} className={'ui__ link-button ' + props.className} />
)

export const Button = (props: ElementConfig<'button'>) => (
	<button {...props} className={'ui__ button ' + props.className} />
)
