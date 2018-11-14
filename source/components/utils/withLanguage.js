import React, { Component } from 'react'
import { withI18n } from 'react-i18next'

export default function withLanguage(WrappedComponent) {
	return withI18n()(
		class WithLanguage extends Component {
			static displayName = `withLanguage(${Component.displayName ||
				Component.name})`
			render() {
				return (
					<WrappedComponent
						{...this.props}
						language={this.props.i18n.language + ''}
					/>
				)
			}
		}
	)
}
