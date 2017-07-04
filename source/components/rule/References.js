import React from 'react'
import R from 'ramda'
import './References.css'
import references from 'Règles/ressources/références/références.yaml'

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
								<img src={require('Règles/ressources/références/' + refData.image)}/> }
						</span>
					</span>
					<a href={link} target="_blank">
						{R.head(name).toUpperCase() + R.tail(name)}
					</a>
				</li>
		})}
	</ul>
)
