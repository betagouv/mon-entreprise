import React, { useRef, useState } from 'react'
import icon from 'Images/share.svg'

export default (props) =>
	navigator.share ? (
		<button
			css="margin: 0 auto; display: block"
			onClick={() =>
				navigator
					.share(props)
					.then(() => console.log('Successful share'))
					.catch((error) => console.log('Error sharing', error))
			}
		>
			<img css="width: 4em" src={icon} title="Partager" />
			{/* Created by Barracuda from the Noun Project */}
		</button>
	) : (
		<DesktopShareButton {...props} />
	)

const DesktopShareButton = (props) => {
	const [copySuccess, setCopySuccess] = useState('')
	const textAreaRef = useRef(null)

	function copyToClipboard(e) {
		textAreaRef.current.select()
		document.execCommand('copy')
		// This is just personal preference.
		// I prefer to not show the the whole text area selected.
		e.target.focus()
		setCopySuccess('Copié !')
	}

	return (
		<div>
			<img
				css="width: 2em; vertical-align: middle; margin-right: 1rem; "
				src={icon}
				title="Partager"
			/>
			Partager mes résultats
			<form>
				<input
					css={`
						box-shadow: inset 0 1px 2px rgba(27, 31, 35, 0.075);
						border-radius: 0.3rem;
    border: 1px solid var(--color);
    padding: 0.2rem 0.4rem;
    width: 60%;
    margin: 0 0 0.4rem;
    background: #fffffff2;
}
					`}
					readOnly
					ref={textAreaRef}
					value={props.url}
				/>
			</form>
			{
				/* Logical shortcut for only displaying the 
          button if the copy command exists */
				document.queryCommandSupported('copy') && (
					<div>
						<button className="ui__ button small" onClick={copyToClipboard}>
							Copier le lien
						</button>{' '}
						{copySuccess}
					</div>
				)
			}
		</div>
	)
}
