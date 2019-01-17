/* @flow */
import classnames from 'classnames'
import React, { useState } from 'react'
import emoji from 'react-easy-emoji'
import Animate from 'Ui/animate'
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
	amountDesc: Node,
	onSchemeChoice: () => void,
	amountNotice: Node,
	onAmountClick: () => void,
	disabled?: ?Node,
	featured?: Node,
	icon: string
}
function SchemeCard({
	title,
	subtitle,
	amount,
	amountDesc,
	onSchemeChoice,
	icon,
	amountNotice,
	disabled,
	onAmountClick,
	featured,
	features
}: Props) {
	const [descriptionVisibility, setDescriptionVisibility] = useState(false)
	const toggleDescriptionVisibility = () =>
		setDescriptionVisibility(!descriptionVisibility)
	return (
		<div
			className={classnames('scheme-card__container', {
				'ui__ card disabled scheme-card__container--disabled': disabled,
				'ui__ card coloured scheme-card__container--featured': featured
			})}>
			<div
				className={`scheme-card__top-text scheme-card__top-text--${
					featured ? 'featured' : disabled ? 'disabled' : 'hidden'
				}`}
				style={{ visibility: featured || disabled ? 'visible' : 'hidden' }}>
				{featured || disabled || 'nop'}
			</div>
			<div
				className={classnames('scheme-card__inside', {
					'ui__ card': !featured && !disabled
				})}>
				<header
					className="scheme-card__header"
					onClick={toggleDescriptionVisibility}>
					<span className="scheme-card__icon">{emoji(icon)} </span>
					<h3
						className={
							'scheme-card__title ' +
							(descriptionVisibility ? 'scheme-card__title--unfold' : '')
						}>
						{title}
					</h3>
					<h4 className="scheme-card__subtitle">{subtitle}</h4>
				</header>
				{amount && (
					<Animate.fromBottom>
						<div onClick={onAmountClick}>
							<div className="ui__ card plain scheme-card__amount">
								{amountDesc}
								<p className="ui__ lead">
									<AnimatedTargetValue value={amount} />
								</p>
							</div>
							<p className="ui__ notice" style={{ marginTop: '-0.6rem' }}>
								{amountNotice}
							</p>
						</div>
					</Animate.fromBottom>
				)}
				<ul
					className={
						'scheme-card__content ' +
						(descriptionVisibility ? 'scheme-card__content--visible' : '')
					}>
					{features.map((feature, index) => (
						<li key={index}>{feature}</li>
					))}
				</ul>
				<p
					className={
						'scheme-card__cta ' +
						(descriptionVisibility ? 'scheme-card__cta--visible' : '')
					}>
					<button
						onClick={onSchemeChoice}
						className={'ui__ button ' + (disabled ? 'simple' : ' plain')}>
						Choisir ce régime
					</button>
				</p>
			</div>
		</div>
	)
}

export default SchemeCard
