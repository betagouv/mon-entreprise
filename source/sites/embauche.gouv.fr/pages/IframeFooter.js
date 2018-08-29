import LangSwitcher from 'Components/LangSwitcher'
import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import screenfull from 'screenfull'

@translate()
export default class IframeFooter extends Component {
	componentDidMount() {
		screenfull.onchange(() => this.forceUpdate())
	}
	render() {
		return (
			<div
				className="ui__ container"
				style={{
					textAlign: 'right',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between'
				}}>
				<LangSwitcher className="ui__ button simple" />
				{screenfull.enabled &&
					!screenfull.isFullscreen && (
						<button
							className="ui__ button small"
							onClick={() => {
								screenfull.toggle()
							}}>
							🖵&nbsp;
							<Trans>Plein écran</Trans>
						</button>
					)}
			</div>
		)
	}
}
