// TODO: The webpack configuration of the publi.codes site remains in the
// mon-entreprise.fr and should be dissociated.
import 'core-js/stable'
import { render } from 'react-dom'
import 'regenerator-runtime/runtime'
import '../../removeServiceWorker'
import App from './components/App'

const anchor = document.querySelector('#js')
render(<App />, anchor)
