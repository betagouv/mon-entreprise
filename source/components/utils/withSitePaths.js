/* @flow */

import React, { Component, createContext } from 'react'
import type { ComponentType } from 'react'

export type SitePaths = Object

const SitePathsContext = createContext({})

export const SitePathProvider = SitePathsContext.Provider
export default function withSitePaths<Props: { sitePaths: SitePaths }>(
	WrappedComponent: ComponentType<Props>
) {
	class WithSitePaths extends Component<
		$Diff<Props, { sitePaths: SitePaths }>
	> {
		displayName = `withSitePaths(${WrappedComponent.displayName || ''})`
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
