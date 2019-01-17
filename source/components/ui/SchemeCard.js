/* @flow */
import classnames from 'classnames'
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
	amountDesc: Node,
	onSchemeChoice: () => void,
	amountNotice: Node,
	onAmountClick: () => void,
	disabled?: ?Node,
	featured?: Node,
	icon: string
}
const SchemeCard = ({
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
}: Props) => (
	<div
		className={classnames('scheme-card__container', {
			'ui__ card coloured': featured,
			'ui__ card disabled': disabled
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
			<span className="scheme-card__icon">{emoji(icon)} </span>
			<h3 className="scheme-card__title">{title}</h3>
			{amount && (
				<div onClick={onAmountClick}>
					<div className="ui__ card plain scheme-card__amount">
						{amountDesc}
						<p className="ui__ lead" style={{ margin: '0.6rem 0 0' }}>
							<AnimatedTargetValue value={amount} />
						</p>
					</div>
					<p className="ui__ notice" style={{ marginTop: '-0.6rem' }}>
						{amountNotice}
					</p>
				</div>
			)}
			<h4 className="scheme-card__subtitle">{subtitle}</h4>
			<ul className="scheme-card__content">
				{features.map((feature, index) => (
					<li key={index}>{feature}</li>
				))}
			</ul>
			<p style={{ textAlign: 'center' }}>
				<button
					onClick={onSchemeChoice}
					className={'ui__ button ' + (disabled ? 'simple' : ' plain')}>
					Choisir ce régime
				</button>
			</p>
		</div>
	</div>
)

export default SchemeCard
