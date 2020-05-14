import ContactImage from 'Images/contact.png'
import React from 'react'
const Contact = () => (
	<div className="centeredMessage">
		<p>
			Pour nous écrire :{' '}
			<span style={{ fontWeight: 'bold' }}>contact@embauche.beta.gouv.fr</span>
		</p>
		{/* TODO: credits for the image to add: https://thenounproject.com/search/?q=post+card&i=715677 */}
		<img style={{ margin: '3%' }} width="200px" src={ContactImage} />
	</div>
)

export default Contact
