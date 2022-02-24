import React from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import Button from '@components/Button'
import { useWeb3 } from 'eth-react'
import addresses from '@shared/addresses'
import ConnectButton from './ConnectButton'
import s from './Navigation.module.css'

const baseURI =
  process.env.BNB_NET == 'test'
    ? 'https://testnet.bscscan.com/address/'
    : 'https://bscscan.com/address/'
const etherscanURL = `${baseURI}${addresses.contract}`

const scrollTo = (id) => {
  document
    .getElementById(id)
    .scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' })
}

const navigateToAbout = (pathname, history) => {
  if (pathname.match(/\/(my)?molecules/)) {
    history.push('/')
    return
  }

  scrollTo('about')
}

const navigateToMyMolecules = (pathname, history, walletAddress) => {
  if (pathname.match(/\/(my)?molecules/)) {
    history.push(`/mymolecules/${walletAddress}`)
    return
  }

  scrollTo('mymolecules')
}

const Navigation = () => {
  const { walletAddress } = useWeb3()
  const history = useHistory()
  const { pathname } = useLocation()

  return (
    <nav className={s.navigation}>
      <div className={s.spacer} />
      <Button
        className={s.button}
        onClick={() => navigateToAbout(pathname, history)}
      >
        About
      </Button>
      <Button
        className={s.button}
        onClick={() => navigateToMyMolecules(pathname, history, walletAddress)}
      >
        My Molecules
      </Button>
      <Button
        className={s.button}
        onClick={() => window.open(etherscanURL, '_blank')}
      >
        bscscan
      </Button>
      {/*<Button
        className={s.button}
        onClick={() =>
          window.open(`${process.env.OPENSEA_URL}`, '_blank')
        }
      >
        OpenSea
      </Button>*/}
      <ConnectButton />
    </nav>
  )
}

export default Navigation
