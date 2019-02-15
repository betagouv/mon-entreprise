/* @flow */
import classnames from 'classnames'
import { isNil } from 'ramda'
import React, { useState } from 'react'
import emoji from 'react-easy-emoji'
import Animate from 'Ui/animate'
import { isIE } from '../../utils'
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
				'ui__ card coloured scheme-card__container--featured': featured,
				'is-IE': isIE()
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
					'ui__ card': !featured && !disabled,
					'is-IE': isIE()
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
				{!isNil(amount) && (
					<Animate.appear style={{ alignSelf: 'stretch' }}>
						<div
							className={
								'ui__ card scheme-card__amount plain ' +
								(Number.isNaN(amount) ? 'disabled' : '')
							}
							onClick={onAmountClick}>
							{amountDesc}&nbsp;:
							<span className="scheme-card__amount-separator" />
							<p className="ui__ lead">
								<AnimatedTargetValue value={amount} />
							</p>
						</div>
					</Animate.appear>
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
					<button onClick={onSchemeChoice} className={'ui__ button'}>
						Choisir ce régime
					</button>
				</p>
			</div>
		</div>
	)
}

export default SchemeCard
