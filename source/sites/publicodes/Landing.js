import { React } from 'Components'
import { Link } from 'react-router-dom'
import Suggestions from './Suggestions'
import { useState } from 'react'
import Search from './Search'
import ContributionButton from './ContributionButton'

export default () => {
	const [input, setInput] = useState('')
	return (
		<div>
			<h1 css="margin-top: 1rem; font-size: 140%; line-height: 1.2em">
				Découvre l'impact de chaque geste du quotidien !
			</h1>
			<Search {...{ input, setInput }} />
			<Suggestions {...{ input }} />
			<ContributionButton {...{ input }} />
		</div>
	)
}
