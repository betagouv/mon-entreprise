/* @flow */
import { React } from 'Components'
import './button.css'
import type { ElementConfig } from 'react'

export const LinkButton = (props: ElementConfig<'button'>) => (
	<button {...props} className={'ui__ link-button ' + props.className} />
)

export const Button = (props: ElementConfig<'button'>) => (
	<button {...props} className={'ui__ button ' + props.className} />
)
