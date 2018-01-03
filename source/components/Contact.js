import React from 'react'

export default () => (
	<div
		style={{
			color: '#333350',
			margin: '15% auto',
			width: '20em',
			textAlign: 'center'
		}}
	>
		<p>
			Pour nous écrire :{' '}
			<span style={{ fontWeight: 'bold' }}>contact@embauche.beta.gouv.fr</span>
		</p>
		{/* TODO: credits for the image to add: https://thenounproject.com/search/?q=post+card&i=715677 */}
		<img
			style={{ margin: '3%' }}
			width="200px"
			src={require('Images/contact.png')}
		/>
	</div>
)
