/* @flow */
import * as React from 'react'
import './button.css'
export const SkipButton = (props: React.ElementConfig<'button'>) => (
	<button className="ui__ skip-button" {...props}>
		{props.children || 'Skip ›'}
	</button>
)
