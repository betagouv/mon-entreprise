import React from 'react'

/* Simple way for a visual stack : using two h1,
hinting at the fact that it is a group result */
export default ({text, onClick, folded, themeColours: {colour, textColourOnWhite}}) =>
		<div className="group-title" onClick={onClick}>
			{folded &&
				<h1 style={{
					color: 'transparent',
					position: 'absolute',
					left: '.15em',
					top: '.20em',
					border: '1px solid #aaa',
					borderTop: 'none',
					borderLeft: 'none',
				}}>
				{text}
				</h1>
			}
			<h1 style={folded ? {
				cursor: 'pointer',
				border: '1px solid #aaa',
			} : {
				border: '1px solid ' + colour,
				color: textColourOnWhite,
			}}>
				{text}
			</h1>
		</div>
