import { Redirect } from 'react-router-dom'
import netlifyToml from '../netlify.toml'

export default netlifyToml.redirects
	.filter(({ from, status }) => status === 301 && !from.startsWith('https'))
	.map(({ from, to }) => ({
		from: decodeURIComponent(from.replace(/^:.*?\//, '/')),
		to: decodeURIComponent(to.replace(/^:.*?\//, '/').replace(':splat', '*')),
	}))
	.filter(({ from, to }) => from != to)
	.map((props) => <Redirect key={props.from} {...props} exact />)
