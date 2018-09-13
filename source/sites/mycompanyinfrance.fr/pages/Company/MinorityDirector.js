/* @flow */
import { directorIsInAMinority } from 'Actions/companyStatusActions'
import React from 'react'
import { connect } from 'react-redux'
import { SkipButton } from 'Ui/Button'

type Props = {
	directorIsInAMinority: (?boolean) => void
}

const MinorityDirector = ({ directorIsInAMinority }: Props) => (
	<>
		<h2>Chairman or managing director </h2>
		<p>
			Some special rules apply depending on the amount of shares owned by the
			director.
		</p>
		<ul>
			<li>
				<strong>Chairman </strong>: The director is in majority, or is part of a
				managing board that is in majority.
			</li>
			<li>
				<strong>Managing director</strong>: The director is in minority (or
				equality), or is part of a managing board that is in minority (or
				equality).
			</li>
		</ul>

		<div className="ui__ answer-group">
			<button
				onClick={() => {
					directorIsInAMinority(false)
				}}
				className="ui__ button">
				Chairman
			</button>
			<button
				onClick={() => {
					directorIsInAMinority(true)
				}}
				className="ui__ button">
				Managing director
			</button>
			<SkipButton onClick={() => directorIsInAMinority(null)} />
		</div>
	</>
)

export default connect(
	null,
	{ directorIsInAMinority }
)(MinorityDirector)
