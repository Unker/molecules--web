import React, { useEffect, useState, useContext, useMemo } from 'react'
import { useWeb3 } from 'eth-react'
import { ContractsContext } from '@contexts/Contracts'
import sortBy from 'lodash/fp/sortBy'
import { Link } from 'react-router-dom'
import cn from 'classnames'
import Card from '@components/Card'
import formatURI from '@utils/formatURI'
import { useContracts } from '@hooks'
import Token from '@components/Token'
import MoleculeCount from '../MoleculeCount'
import s from './Showcase.module.css'

const MoleculeList = ({ nfts }) =>
  nfts.map(({ molecule, id, name }) => <Token token={molecule} name={name} id={id} key={id} />)

const Showcase = () => {
  const { connected, walletAddress } = useWeb3()
  const { nfts, tokenLimit, totalSupply } = useContracts()

  return (
    <Card className={cn(s.showcaseContainer,s.bg)} id="mymolecules">
      <div className={s.flex}>
        <div className={s.titleContainer}>
          <h2 className={s.h2}>Your Molecules</h2>
          {walletAddress > 0  ? (
            <Link to={`/mymolecules/${walletAddress}`} target="_blank">
              <i className={cn('fas fa-external-link-alt', s.shareButton)}></i>
            </Link>
            ) : null
          }
        </div>

        <MoleculeCount className={s.moleculeCount} />
      </div>
      <div className={s.showcase}>
        {connected && nfts.length > 0 ? (
          <MoleculeList nfts={nfts} />
        ) : (
          "You don't have any molecules yet :("
        )}
      </div>
    </Card>
  )
}

export default Showcase
