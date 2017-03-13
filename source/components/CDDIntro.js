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
        , apportant à l'employeur plus de souplesse dans un cadre législatif précis, qui prévoit notamment une contrepartie financière.
      </p>
      <p>
        Ce simulateur calcule pour vous les 4 éléments de ce surcoût :
        <ul>
          <li>l'indemnité de fin de contrat</li>
          <li>le CIF</li>
          <li>la majoration chômage</li>
          <li>l'indemnité compensatrice de congés payés</li>
        </ul>
      </p>
      <p>
        Sur ce simulateur 17.0, <span className="insist">vous avez le droit de ne pas savoir</span> : certains termes utilisés dans la simulation ne sont pas évidents : cliquez simplement sur le symbôle • qui les suit pour ouvrir une aide contextuelle.
      </p>
      <p>
        Et n'hésitez pas à nous écrire <i style={{cursor: 'pointer'}} className="fa fa-envelope-o" /> ! La loi française est complexe, souvent à raison. Nous ne la changerons pas, mais pouvons la rendre plus transparente.
      </p>
      <Link id="action" to="/cdd"><button>C'est parti !</button></Link>
    </section>
  </div>
)
