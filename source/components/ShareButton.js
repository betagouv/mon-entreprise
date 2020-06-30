import React, { useRef, useState } from 'react'

export default (props) =>
	navigator.share ? (
		<button
			css={`
				margin: 0 auto;
				display: flex;
				align-items: center;
				color: ${props.color || 'black'};
			`}
			onClick={() =>
				navigator
					.share(props)
					.then(() => console.log('Successful share'))
					.catch((error) => console.log('Error sharing', error))
			}
		>
			<Icon color={props.color} />
			{props.label && <span>{props.label}</span>}
			{/* Created by Barracuda from the Noun Project */}
		</button>
	) : (
		<DesktopShareButton {...props} />
	)

const DesktopShareButton = (props) => {
	const [copySuccess, setCopySuccess] = useState(false)
	const textAreaRef = useRef(null)

	function copyToClipboard(e) {
		textAreaRef.current.select()
		document.execCommand('copy')
		// This is just personal preference.
		// I prefer to not show the the whole text area selected.
		e.target.focus()
		setCopySuccess(true)
		e.preventDefault()
		return null
	}

	return (
		<div>
			<div
				css={`
					display: flex;
					align-items: center;
					justify-content: center;
					color: ${props.color || 'black'};
					svg {
						width: 2rem;
					}
				`}
			>
				<Icon color={props.color} />
				{props.label && <span>{props.label}</span>}
			</div>
			<form css="text-align: center">
				<input
					css={`
						box-shadow: inset 0 1px 2px rgba(27, 31, 35, 0.075);
						border-radius: 0.3rem;
						border-top-right-radius: 0;
						border-bottom-right-radius: 0;
    border: 1px solid var(--color);
    padding: 0.2rem 0.4rem;
    width: 60%;
    margin: 0 0 0.4rem;
    background: #fffffff2;
	height: 1.6rem;
	
}
					`}
					readOnly
					ref={textAreaRef}
					value={props.url}
				/>
				{
					/* Logical shortcut for only displaying the 
          button if the copy command exists */
					document.queryCommandSupported('copy') && (
						<button
							css={`
								border-radius: 0.3rem;
								border-bottom-left-radius: 0;
								border-top-left-radius: 0;
								border: 1px solid var(--color);
								margin-left: -1px;
								height: 1.6rem;
								background: #ffffffb3;
								box-shadow: 0 1px 0 rgba(27, 31, 35, 0.04),
									inset 0 1px 0 hsla(0, 0%, 100%, 0.25);
							`}
							onClick={copyToClipboard}
						>
							{!copySuccess ? 'Copier le lien' : 'Copié'}
						</button>
					)
				}
			</form>
		</div>
	)
}

const Icon = ({ color = 'black' }) => (
	<svg version="1.1" x="0px" y="0px" viewBox="0 0 100 100" width="4rem">
		<g transform="translate(0,-952.36218)">
			<path
				css={`
					text-indent: 0;
					text-transform: none;
					direction: ltr;
					block-progression: tb;
					baseline-shift: baseline;
					color: ${color};
					enable-background: accumulate;
				`}
				d="m 67,971.36217 c -5.4991,0 -10,4.50082 -10,10 0,1.123 0.1857,2.20885 0.5312,3.21875 l -17.125,11.125 c -1.8339,-2.03453 -4.4689,-3.34375 -7.4062,-3.34375 -5.4991,0 -10,4.50082 -10,10.00003 0,5.4992 4.5009,10 10,10 2.9494,0 5.6028,-1.2946 7.4375,-3.3437 l 17.0937,11.1249 c -0.3515,1.0177 -0.5312,2.0857 -0.5312,3.2188 0,5.4992 4.5009,10 10,10 5.4991,0 10,-4.5008 10,-10 0,-5.4992 -4.5009,-10 -10,-10 -2.9373,0 -5.5723,1.3092 -7.4062,3.3438 l -17.125,-11.125 c 0.3455,-1.0099 0.5312,-2.0958 0.5312,-3.2188 0,-1.1331 -0.1797,-2.2011 -0.5312,-3.21873 l 17.0937,-11.12505 c 1.8347,2.04912 4.4881,3.34375 7.4375,3.34375 5.4991,0 10,-4.50082 10,-10 0,-5.49918 -4.5009,-10 -10,-10 z m 0,4 c 3.3373,0 6,2.66262 6,6 0,3.33738 -2.6627,6 -6,6 -3.3373,0 -6,-2.66262 -6,-6 0,-3.33738 2.6627,-6 6,-6 z m -34,21 c 3.3373,0 6,2.6626 6,6.00003 0,3.3374 -2.6627,6 -6,6 -3.3373,0 -6,-2.6626 -6,-6 0,-3.33743 2.6627,-6.00003 6,-6.00003 z m 34,21.00003 c 3.3373,0 6,2.6626 6,6 0,3.3374 -2.6627,6 -6,6 -3.3373,0 -6,-2.6626 -6,-6 0,-3.3374 2.6627,-6 6,-6 z"
				fill={color}
				fillOpacity="1"
				stroke="none"
				marker="none"
				visibility="visible"
				display="inline"
				overflow="visible"
			/>
		</g>
	</svg>
)
