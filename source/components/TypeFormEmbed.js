import React from 'react'
import Helmet from 'react-helmet'

let createQueryParams = params =>
	Object.keys(params)
		.map(k => `${k}=${encodeURI(params[k])}`)
		.join('&')

let url = hiddenVariables =>
	'https://embauchegouv.typeform.com/to/dvbINf?' +
	createQueryParams(hiddenVariables)

export default ({ hiddenVariables }) => (
	<div>
		<div
			className="typeform-widget"
			data-url={url(hiddenVariables)}
			data-mode="popup"
			data-auto-open={true}
			data-hide-headers={true}
			data-hide-footer={true}
			target="_blank"
		/>
		<Helmet
			script={[
				{
					type: 'text/javascript',
					innerHTML:
						'(function() { var qs,js,q,s,d=document, gi=d.getElementById, ce=d.createElement, gt=d.getElementsByTagName, id="typef_orm_share", b="https://embed.typeform.com/"; if(!gi.call(d,id)){ js=ce.call(d,"script"); js.id=id; js.src=b+"embed.js"; q=gt.call(d,"script")[0]; q.parentNode.insertBefore(js,q) } })() '
				}
			]}
		/>
	</div>
)
