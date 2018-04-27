import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import chai from 'chai'
import sinonChai from 'sinon-chai'

chai.use(sinonChai)
Enzyme.configure({ adapter: new Adapter() })

// Setup Intl in "en" and "fr" for testing
// var areIntlLocalesSupported = require('intl-locales-supported')

// var localesMyAppSupports = ['en', 'fr']
global.Intl = require('intl')
require('intl/locale-data/jsonp/en.js')
require('intl/locale-data/jsonp/fr.js')
