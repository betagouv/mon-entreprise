/* @flow */
import React from 'react'
import withColours from '../../withColours'
import './button.css'

const buttonCreator = (buttonClassName, coloursToStyle) =>
	withColours(({ className = '', style = {}, colours, ...props }) => (
		<button
			{...props}
			style={{
				...coloursToStyle(colours),
				...style
			}}
			className={buttonClassName + ' ' + className}
		/>
	))

export const LinkButton = buttonCreator(
	'ui-unstyledButton ui-linkButton',
	colours => ({ color: colours.textColourOnWhite })
)
export const SimpleButton = buttonCreator('ui-unstyledButton', colours => ({
	color: colours.textColourOnWhite
}))
const Button = buttonCreator('ui-unstyledButton ui-defaultButton', colours => ({
	color: colours.textColourOnWhite,
	borderColor: colours.colour
}))

export { default as BlueButton } from './BlueButton'

export default Button
