import React from 'react'
import colours from './themeColours'
import PageTypeIcon from './PageTypeIcon'
import './CDDIntro.css'
import {Link} from 'react-router'

export default () => (
  <div id="CDDIntro">
    <PageTypeIcon type="simulation" />
    <h1>Simulateur CDD</h1>
    <div className="subtitle">
      Découvrir le surcoût pour l'employeur du CDD par rapport au CDI
    </div>
    <section id="introduction">
      <p>
        En France, le contrat à durée déterminée <span className="insist">est un contrat d'exception au CDI</span>
        qui apporte à l'employeur plus de souplesse dans un cadre législatif précis, comportant en particulier des contreparties financières.
      </p>
      <p>
        Ce simulateur calcule pour vous les 4 éléments de ce surcoût :
        <ul>
          <li key="1">l'indemnité de fin de contrat</li>
          <li key="2">le CIF</li>
          <li key="3">la majoration chômage</li>
          <li key="4">l'indemnité compensatrice de congés payés</li>
        </ul>
      </p>
      <p>Par simplification, ces éléments sont tous calculés par mois de contrat.</p>
      <p>
        Tout au long de la simulation, cliquez sur les chaque résultat pour <span className="insist">obtenir une explication du calcul</span>. Aussi, vous avez le droit de ne pas savoir: certains termes utilisés dans la simulation ne sont pas évidents : cliquez simplement sur le symbôle • qui les suit pour ouvrir une aide contextuelle.
      </p>
      <Link id="action" to="/cdd"><button>C'est parti !</button></Link>
      <p className="italic">
        Et n'hésitez pas à nous écrire &nbsp;<i style={{cursor: 'pointer'}} className="fa fa-envelope-o" /> ! La loi française est complexe, car très ciblée. Nous ne la changerons pas, mais pouvons la rendre plus transparente.
      </p>
    </section>
  </div>
)
