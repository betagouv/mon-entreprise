import { Redirect } from 'react-router-dom'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import netlifyToml from '../netlify.toml'

interface NetlifyRedirect {
	from: string
	to: string
	status: number
}

// TODO : doesn't work when previewing netlify redirect in developpement mode (yarn run build:preview)
export default (netlifyToml as { redirects: NetlifyRedirect[] }).redirects
	.filter(({ from, status }) => status === 301 && !from.startsWith('https'))
	.map(({ from, to }) => ({
		from: decodeURIComponent(from.replace(/^:.*?\//, '/')),
		to: decodeURIComponent(to.replace(/^:.*?\//, '/').replace(':splat', '*')),
	}))
	.filter(({ from, to }) => from != to)
	.map((props) => <Redirect key={props.from} {...props} exact />)
