/* @flow */
import withLanguage from 'Components/utils/withLanguage'
import React, { Component, PureComponent } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import './AnimatedTargetValue.css'

type Props = {
	value: ?number,
	language: string
}
type State = {
	difference: number
}
export default withLanguage(
	class AnimatedTargetValue extends Component<Props, State> {
		state = { difference: 0 }

		componentDidUpdate(prevProps) {
			if (prevProps.value === this.props.value) {
				return
			}
			this.setState({
				difference: (this.props.value || 0) - (prevProps.value || 0)
			})
		}
		format = value => {
			return value == null
				? ''
				: Intl.NumberFormat(this.props.language, {
						style: 'currency',
						currency: 'EUR',
						maximumFractionDigits: 0,
						minimumFractionDigits: 0
				  }).format(value)
		}
		render() {
			const formattedDifference = this.format(this.state.difference)
			const shouldDisplayDifference =
				Math.abs(this.state.difference) > 1 &&
				this.props.value != null &&
				!Number.isNaN(this.props.value)
			return (
				<>
					<span className="Rule-value">
						{shouldDisplayDifference && (
							<Evaporate
								style={{
									color: this.state.difference > 0 ? 'chartreuse' : 'red'
								}}>
								{(this.state.difference > 0 ? '+' : '') + formattedDifference}
							</Evaporate>
						)}{' '}
						<span>
							{Number.isNaN(this.props.value)
								? '—'
								: this.format(this.props.value)}
						</span>
					</span>
				</>
			)
		}
	}
)

class Evaporate extends PureComponent<{ children: string, style: Object }> {
	render() {
		return (
			<ReactCSSTransitionGroup
				transitionName="evaporate"
				transitionEnterTimeout={2500}
				transitionLeaveTimeout={1}>
				<span
					key={this.props.children}
					style={this.props.style}
					className="evaporate">
					{this.props.children}
				</span>
			</ReactCSSTransitionGroup>
		)
	}
}
