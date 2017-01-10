import React from 'react'

export default (option) => (
  <div className="select-option">
    <span className="option-title-container">
      {option['Nature du risque']}
    </span>
    <span className="option-secondary-container">
      <span>{option['Taux net'] + ' %'}</span>
    </span>
    <span className="option-label-container">
      {option['Catégorie']}
    </span>
  </div>
)
