import React from 'react'
import R from 'ramda'

export let NodeValue = ({data}) => do {
	let valeur = data == null ?
			'?'
		: ( R.is(Number)(data) ?
					Math.round(data)
				: ( data ? 'oui' : 'non')
		)

	;<span className={"value " + valeur}>←&nbsp;
		{valeur}
	</span>
}
