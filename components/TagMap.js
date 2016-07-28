import React from 'react'
import R from 'ramda'

let TagMap = ({data}) =>
	<ul className="tag-map">
		{R.unless(R.isArrayLike, R.toPairs)(data).map(([name, value]) => <li key={name}>
			<span>{name}</span> :
			<span className="tag-value">{value}</span>
		</li>)
		}
	</ul>

export default TagMap
