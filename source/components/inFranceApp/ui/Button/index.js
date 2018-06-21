/* @flow */
import * as React from 'react'
import './button.css'
export const SkipButton = (props: React.ElementConfig<'button'>) => (
	<button className="ui__skip-button" {...props}>
		Skip ›
	</button>
)
