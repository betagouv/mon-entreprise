import React from 'react'
import './button.css'

export const LinkButton = (props: React.HTMLAttributes<HTMLButtonElement>) => (
	<button {...props} className={'ui__ link-button ' + props.className} />
)

export const Button = (props: React.HTMLAttributes<HTMLButtonElement>) => (
	<button {...props} className={'ui__ button ' + props.className} />
)
