import { toPairs } from 'ramda'
import React from 'react'
import Microlink from '@microlink/react'

export default ({ refs }) => {
	let references = Array.isArray(refs) ? refs : Object.values(refs)
	return (
		<ul className="references">
			{references.map(link => (
				<li
					key={link}
					css={`
						list-style-type: none;
						a {
							max-width: 100%;
						}
					`}>
					<Microlink url={link} style={{ width: '100%' }} />
				</li>
			))}
		</ul>
	)
}
