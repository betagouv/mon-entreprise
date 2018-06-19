import { connect } from 'react-redux'
export default component =>
	connect(
		state => ({ colours: state.themeColours }),
		{}
	)(component)
