/* @flow */
import { React, T } from 'Components'
import './button.css'
import type { ElementConfig } from 'react'

export const SkipButton = (props: ElementConfig<'button'>) => (
	<button {...props} className={'ui__ simple skip button ' + props.className}>
		{props.children || (
			<>
				<T>Passer</T> →
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
