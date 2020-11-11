import React from 'react'
import emoji from 'react-easy-emoji'

export default function PublicodesBlock({ source }: { source: string }) {
	const baseURL =
		location.hostname === 'localhost' ? '/publicodes' : 'https://publi.codes'
	return (
		<div
			css={`
				position: relative;
			`}
		>
			<pre className="ui__ code">
				<code>{source}</code>
			</pre>
			<a
				href={`${baseURL}/studio?code=${encodeURIComponent(source)}`}
				target="_blank"
				css={`
					position: absolute;
					bottom: 5px;
					right: 10px;
					color: white !important;
				`}
			>
				{emoji('⚡')} Lancer le calcul
			</a>
		</div>
	)
}
