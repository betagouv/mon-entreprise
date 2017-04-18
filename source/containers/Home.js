import React, {Component} from 'react'
import './Home.css'
import {searchRules} from '../engine/rules.js'
import {Link} from 'react-router-dom'
import '../components/Rule.css'
import R from 'ramda'

export default class Home extends Component {
	state = {
		userSearch: '',
	};
	render() {
		return (
      <div id="home">
        <section id="brand">
          <img src={require('../images/logo.png')} />
          <span id="name">
            Système <br />
            Social
          </span>
          <span id="version">alpha</span>
        </section>
        <section id="description">
          <p>
            Les règles des taxes et cotisations sur le travail{' '}
            <span className="insist">lisibles</span>
            {' '}par un humain et{' '}
            <span className="insist">interprétables</span>
            {' '}par un programme.{' '}
            <a href="https://github.com/laem/syso/wiki" target="_blank">En savoir plus</a>
          </p>
        </section>
        <section id="roads">

          <section id="exploration">
						<h1><i className="fa fa-search" aria-hidden="true"></i>Explorez la base</h1>
            <input
              placeholder="Cherchez par ex. chomage"
              onChange={e => this.setState({userSearch: e.target.value})}
            />

            <section id="search-results">
              <ul>
                {this.state.userSearch != null &&
                  searchRules(this.state.userSearch).map(({type, name}) => R.contains(type, ['Indemnité', 'Cotisation']) && (
                    <li key={name}>
                      <span className="rule-type">
                        {type}
                      </span>
                      <span className="rule-name">
                        <Link to={`/regle/${name}`}>{name}</Link>
                      </span>
                    </li>
                  ))}
              </ul>
            </section>
          </section>
          <section id="simulation">
            <h1><i className="fa fa-calculator" aria-hidden="true"></i>Simulez vos droits et obligations</h1>
            <ul>
              <li key="cdd">
                <span className="simulateur">Surcoût du CDD</span>
                <Link to="/simulateurs/cdd"><button>Essayer</button></Link>
              </li>
              <li key="embauche">
                <span className="simulateur">Prix global de l'embauche</span>
                <a href="#"><button className="disabled">Bientôt disponible</button></a>
              </li>
            </ul>
          </section>
        </section>
      </div>
		)
	}
}
