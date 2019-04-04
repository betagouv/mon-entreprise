import React, { useEffect, useState } from 'react'
import { ReactReduxContext } from 'react-redux'
export default (asyncMapStateToProps, initialProps = {}) => WrappedComponent =>
	function AsyncConnect(ownProps) {
		return (
			<ReactReduxContext.Consumer>
				{({ store }) => (
					<MapStateToProps
						asyncMapStateToProps={asyncMapStateToProps}
						initialProps={initialProps}
						store={store}
						ownProps={ownProps}>
						{props => <WrappedComponent {...ownProps} {...props} />}
					</MapStateToProps>
				)}
			</ReactReduxContext.Consumer>
		)
	}

const MapStateToProps = ({
	store,
	asyncMapStateToProps,
	ownProps,
	children,
	initialProps = {}
}) => {
	const [props, setProps] = useState(initialProps)
	useEffect(() => {
		return store.subscribe(() => {
			const state = store.getState()
			asyncMapStateToProps(state, ownProps).then(props =>
				setProps({ ...initialProps, ...props })
			)
		})
	})
	return children(props)
}
