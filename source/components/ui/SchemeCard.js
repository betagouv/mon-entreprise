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
	amountNotice: Node,
	onAmountClick: () => void,
	featured?: Node,
	icon: string
}
const SchemeCard = ({
	title,
	subtitle,
	amount,
	amountDesc,
	icon,
	amountNotice,
	onAmountClick,
	featured,
	features
}: Props) => (
	<div
		className={classnames(
			'scheme-card__container',
			featured ? 'ui__ card coloured' : null
		)}>
		<div
			className="scheme-card__featured-text"
			style={{ visibility: featured ? 'visible' : 'hidden' }}>
			{featured || 'nop'}
		</div>
		<div
			className={classnames('scheme-card__inside', {
				'ui__ card': !featured
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
				<button className="ui__ button plain">Choisir ce régime</button>
			</p>
		</div>
	</div>
)

export default SchemeCard
