import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import cn from 'classnames'
import { Helmet } from 'react-helmet'
import useContracts from '@hooks/useContracts'
import { useWeb3 } from 'eth-react'
import Button from '@components/Button'
import Card from '@components/Card'
import Token from '@components/Token'
import { useParams } from 'react-router-dom'

import { utils } from 'web3'

import s from './Molecule.module.css'

const customStyles = {
  content: {
    backgroundColor: 'var(--baby-powder)',
    bottom: 'auto',
    boxShadow: '4px 5px var(--mandarin)',
    left: '50%',
    marginRight: '-50%',
    padding: '32px',
    right: 'auto',
    top: '50%',
    transform: 'translate(-50%, -100%)',
    borderRadius: '10px',
  },
}

const Molecule = () => {
  const { smilesMolecule, ownerOf, fetchNameById } = useContracts()
  const [smiles, setSmiles] = useState()
  const [owner, setOwner] = useState()
  const { id } = useParams()
  const [moleculeName, setMoleculeName] = useState('')

  const [moleculePrice, setMoleculePrice] = useState('')
  const [buyPrice, setBuyPrice] = useState('')
  const [processingRequest, setProcessingRequest] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [settingPrice, setSettingPrice] = useState(false)
  const [clearingPrice, setClearingPrice] = useState(false)
  const [buyingToken, setBuyingToken] = useState(false)

  useEffect(async () => {
    if (!fetchNameById) return
    fetchNameById(id)
    .then((name) => setMoleculeName(name))
    .catch(() => setMoleculeName(""))
  }, [setMoleculeName, fetchNameById])

  useEffect(async () => {
    if (!smilesMolecule) return
    smilesMolecule(id)
    .then((smiles) => setSmiles(smiles))
    .catch(() => setSmiles(""))
  }, [smilesMolecule])

  useEffect(async () => {
    if (!ownerOf) return
    ownerOf(id)
    .then((owner) => setOwner(owner))
    .catch(() => setOwner(""))
  }, [ownerOf])

  return (
    <>
      <Helmet>
        <meta
          name="twitter:image"
          content={`${process.env.PUBLIC_URL_SERVER}/molecules/${id}/preview`}
        />
        <meta
          name="twitter:title"
          content={`NFT Molecule #${id}${
            moleculeName?.length ? ` — ${moleculeName}` : ''
          }`}
        />
        <meta
          name="twitter:description"
          content={`Check out this NFT Molecule #${id}`}
        />
        <meta name="og:url" content={`${process.env.PUBLIC_URL_SERVER}/molecules/${id}`} />
        <meta
          name="og:title"
          content={`NFT Molecule #${id}${
            moleculeName?.length ? ` — ${moleculeName}` : ''
          }`}
        />
        <title>
          NFT Molecule #{id}
          {moleculeName?.length ? ` — ${moleculeName}` : ''}
        </title>
        <meta
          name="og:image"
          content={`${process.env.PUBLIC_URL_SERVER}`+`/molecules/`+`${id}`+`/preview`}
        />
        <meta
          property="og:description"
          content={`Check out this NFT Molecule #`+`${id}`}
        />
      </Helmet>
      {smiles ? (
        <Card className={s.card}>
          <h2 className={s.h2}>
            <span>
              #{id}
              {moleculeName ? ':' : null}{' '}
            </span>
            <span>{moleculeName}</span>
          </h2>
          <h2 className={s.h2}>
            <span>
              Price 
              {buyPrice ? 
                ` : `+`${utils.fromWei(buyPrice, "ether")}`+` ETH` 
                : ' not set'}{' '}
            </span>
          </h2>
          <h3 className={s.h3}>Owned by {owner}</h3>
          <Token token={smiles} id={id} key={id} name={moleculeName} showId={false} />
          
        </Card>
      ) : null}
    </>
  )
}

export default Molecule
