import React from 'react'
import './Card.css'
const Card = ({ children, className = '' }) => (
	<div className={'card ' + className}> {children}</div>
)
export default Card
