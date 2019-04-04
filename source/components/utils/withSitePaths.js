/* @flow */
import React, { Component, createContext } from 'react'
import i18n from '../../i18n'

const SitePathsContext: React$Context<SitePaths> = createContext({})

export const SitePathProvider = SitePathsContext.Provider
export default function withSitePaths<Props: { sitePaths: SitePaths }>(
	WrappedComponent: React$ComponentType<Props>
): React$ComponentType<$Diff<Props, { sitePaths: SitePaths }>> {
	class WithSitePaths extends Component<
		$Diff<Props, { sitePaths: SitePaths }>
	> {
		displayName = `withSitePaths(${WrappedComponent.displayName || ''})`
		constructor(props) {
			super(props)
			i18n.on('languageChanged', () => {
				this.forceUpdate()
			})
		}
		render() {
			return (
				<SitePathsContext.Consumer>
					{sitePaths => (
						<WrappedComponent {...this.props} sitePaths={sitePaths} />
					)}
				</SitePathsContext.Consumer>
			)
		}
	}
	return WithSitePaths
}

export type SitePaths = Object
