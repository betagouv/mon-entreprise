import styled from 'styled-components'

export default function PublicodesBlock({ source }: { source: string }) {
	const baseURL =
		location.hostname === 'localhost' ? '/publicodes' : 'https://publi.codes'
	return (
		<div
			style={{
				position: 'relative',
			}}
		>
			<pre className="ui__ code">
				<code>{source}</code>
			</pre>
			<LaunchButton
				href={`${baseURL}/studio?code=${encodeURIComponent(source)}`}
				target="_blank"
			>
				⚡ Lancer le calcul
			</LaunchButton>
		</div>
	)
}

export const LaunchButton = styled.a`
	position: absolute;
	bottom: 5px;
	right: 10px;
	color: white !important;
`
