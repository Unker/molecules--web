import React, { useEffect, useState } from 'react'
import { hot } from 'react-hot-loader/root'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { Provider as Web3Provider } from "eth-react";
import { ContractsProvider } from "@contexts/Contracts";
import 'noty/lib/noty.css'
import './noty-theme.css'

import Navigation from './Navigation'
import Title from './Title'
import Main from './Main'
import Stars from './Stars'
import MyMolecules from './MyMolecules'
import Molecule from './Molecule'
import ErrorPage from './ErrorPage'
import s from './App.module.css'
import './fonts.css'
import './reset.css'
import './index.css'
import './fontawesome/css/all.css'

import cn from 'classnames'


const App = () => {

  return (
    <Router>
      <Web3Provider>
        <ContractsProvider>
          <Navigation />
          <div className={s.background}>
            {/* <Stars /> */}
            <Title />
            <Switch>
              <Route path="/mymolecules/:address" exact>
                <MyMolecules />
              </Route>
              <Route path="/molecules/:id" exact>
                <Molecule />
              </Route>
              <Route path="/" exact>
                <Main />
              </Route>
              <Route path="/">
                <ErrorPage />
              </Route>
            </Switch>
          </div>
        </ContractsProvider>
      </Web3Provider>
    </Router>
  )
}

export default hot(App)
