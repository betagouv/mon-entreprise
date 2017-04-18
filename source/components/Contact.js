import React from 'react'

export default () =>
  <div style={{color: '#333350', margin: '15% auto', width: '20em', textAlign: 'center'}}>
    <p style={{fontWeight: 'bold'}}>
      Pour nous écrire : contact@embauche.beta.gouv.fr
    </p>
    {/* TODO: credits for the image to add: https://thenounproject.com/search/?q=post+card&i=715677 */}
    <img style={{margin: '3%'}} width="200px" src={require('../images/contact.png')} />
  </div>
