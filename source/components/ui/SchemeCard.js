/* @flow */
import React from 'react'
import emoji from 'react-easy-emoji'
import AnimatedTargetValue from './AnimatedTargetValue'
import './SchemeCard.css'
import type { Node } from 'react'

type Props = {
	title: Node,
	subtitle: Node,
	amount: number,
	modifier?: {
		stared?: boolean,
		inactive?: boolean
	},
	features: Array<Node>,
	icon: string
}
const SchemeCard = ({ title, subtitle, amount, icon, features }: Props) => (
	<div className="ui__ card scheme-card__container">
		<header className="scheme-card__header">
			<span className="scheme-card__icon">{emoji(icon)} </span>
			<h3 className="scheme-card__title">{title}</h3>
			<p className="scheme-card__subtitle">{subtitle}</p>
			<p className="ui__ lead">
				<AnimatedTargetValue value={amount} />
			</p>
		</header>
		<ul className="scheme-card__content">
			{features.map((feature, index) => (
				<li key={index}>{feature}</li>
			))}
		</ul>
		<p style={{ textAlign: 'center' }}>
			<button className="ui__ button plain">Choisir ce régime</button>
		</p>
	</div>
)

export default SchemeCard
