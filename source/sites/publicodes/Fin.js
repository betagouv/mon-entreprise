import React from 'react'
import { useParams } from 'react-router'

export default ({}) => {
	const { score } = useParams()

	return <div>Fin {score} kilos</div>
}

