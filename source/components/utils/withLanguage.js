import React, { Component } from 'react'
import { withNamespaces } from 'react-i18next'

export default function withLanguage(WrappedComponent) {
	return withNamespaces()(
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
