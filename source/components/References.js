import React from 'react'
import references from '../../règles/références/références.yaml'
import './References.css'
import R from 'ramda'

export default ({refs}) => (
	<ul className="references">
		{R.toPairs(refs).map(
			([name, link]) => {
				let refkey = Object.keys(references).find(r => link.indexOf(r) > -1),
					refData = refkey && references[refkey] || {},
					domain = (link.indexOf("://") > -1
						? link.split('/')[2]
						: link.split('/')[0]).replace('www.', '')

				return <li key={name}>
					<span className="meta">
						<span className="url">
							{domain}
							{refData.image &&
								<img src={require('../../règles/références/' + refData.image)}/> }
						</span>
					</span>
					<a href={link} target="_blank">
						{name}
					</a>
				</li>
		})}
	</ul>
)
