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
  const { walletAddress } = useWeb3()
  const { smilesMolecule, ownerOf, fetchNameById, setName, setPrice, clearPrice, getTokenPrice, buyToken } = useContracts()
  const [smiles, setSmiles] = useState()
  const [owner, setOwner] = useState()
  const [moleculeName, setMoleculeName] = useState('')
  const [moleculePrice, setMoleculePrice] = useState('')
  const [buyPrice, setBuyPrice] = useState('')
  const [processingRequest, setProcessingRequest] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [settingPrice, setSettingPrice] = useState(false)
  const [clearingPrice, setClearingPrice] = useState(false)
  const [buyingToken, setBuyingToken] = useState(false)
  const { id } = useParams()

  useEffect(async () => {
    if (!fetchNameById) return

    // setMoleculeName(await fetchNameById(id))
    fetchNameById(id)
    .then((name) => setMoleculeName(name))
    .catch(() => setMoleculeName(""))
  }, [setMoleculeName, fetchNameById])

  useEffect(async () => {
    if (!getTokenPrice) return

    // setBuyPrice(await getTokenPrice(id))
    getTokenPrice(id)
    .then((price) => setBuyPrice(price))
    .catch(() => setBuyPrice("0"))
    

  }, [setBuyPrice, getTokenPrice])

  useEffect(async () => {
    if (!smilesMolecule) return

    // setSmiles(await smilesMolecule(id))
    smilesMolecule(id)
    .then((smiles) => setSmiles(smiles))
    .catch(() => setSmiles(""))
  }, [smilesMolecule])

  useEffect(async () => {
    if (!ownerOf) return

    // setOwner(await ownerOf(id))
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
          content={`${process.env.PUBLIC_URL_SERVER}/molecules/${id}/preview`}
        />
        <meta
          property="og:description"
          content={`Check out this NFT Molecule #${id}`}
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
                ` : ${utils.fromWei(buyPrice, "ether")} BNB` 
                : ' not set'}{' '}
            </span>
          </h2>
          <h3 className={s.h3}>Owned by {owner}</h3>
          <Token token={smiles} id={id} key={id} name={moleculeName} showId={false} />
          {owner == walletAddress ? (
            <>
              <Button
                className={s.saveButton}
                onClick={() => {
                  setEditingName(true)
                }}
              >
                Edit name!
              </Button>

              <Button
                className={s.saveButton}
                onClick={() => {
                  setSettingPrice(true)
                }}
              >
                Set price
              </Button>

              {buyPrice>0?(
                <Button
                  className={s.saveButton}
                  onClick={() => {
                    setClearingPrice(true)
                  }}
                >
                  Clear price
                </Button>
                ):null
              }
            </>
          ) : (
            <>
            {buyPrice ? (
              <Button
                className={s.saveButton}
                onClick={() => {
                  setBuyingToken(true)
                }}
              >
                Buy molecule
              </Button>
            ) : null
            }
            </>
          )
          }
          <Modal
            isOpen={editingName}
            style={customStyles}
            onRequestClose={() => setEditingName(false)}
          >
            {processingRequest ? (
              <div>
                <div className={s.processingCopy}>
                  We are currently processing your request, check your metamask
                  for whenever the transaction will complete.
                </div>
                <Button
                  className={s.okay}
                  onClick={() => {
                    setEditingName(false)
                    setProcessingRequest(false)
                  }}
                >
                  Okay
                </Button>
              </div>
            ) : (
              <div>
                <h2 className={cn(s.h2, s.modalTitle)}>
                  {"Name your molecule"}
                </h2>
                <div className={s.processingCopy}>
                  {'Name cannot be longer than 50 characters and should contain only "a-z,A-Z,0-9,\'-\'" characters and spaces'}
                </div>
                <div className={s.inputWrapper}>
                  <input
                    className={s.editMolecule}
                    value={moleculeName}
                    onChange={(e) => setMoleculeName(e.target.value)}
                  />
                  <Button
                    className={s.saveButton}
                    onClick={async () => {
                      setProcessingRequest(true)
                      await setName(id, moleculeName)
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}
          </Modal>
          
          <Modal
            isOpen={settingPrice}
            style={customStyles}
            onRequestClose={() => setSettingPrice(false)}
          >
            {processingRequest ? (
              <div>
                <div className={s.processingCopy}>
                  We are currently processing your request, check your metamask
                  for whenever the transaction will complete.
                </div>
                <Button
                  className={s.okay}
                  onClick={() => {
                    setSettingPrice(false)
                    setProcessingRequest(false)
                  }}
                >
                  Okay
                </Button>
              </div>
            ) : (
              <div>
                <h2 className={cn(s.h2, s.modalTitle)}>
                  {"Request your price for the molecule, BNB"}
                </h2>
                <div className={s.inputWrapper}>
                  <input
                    className={s.editMolecule}
                    value={moleculePrice}
                    onChange={(e) => setMoleculePrice(e.target.value)}
                  />
                  <Button
                    className={s.saveButton}
                    onClick={async () => {
                      setProcessingRequest(true)
                      await setPrice(id, moleculePrice)
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}
          </Modal>

          <Modal
            isOpen={clearingPrice}
            style={customStyles}
            onRequestClose={() => setClearingPrice(false)}
          >
            {processingRequest ? (
              <div>
                <div className={s.processingCopy}>
                  We are currently processing your request, check your metamask
                  for whenever the transaction will complete.
                </div>
                <Button
                  className={s.okay}
                  onClick={() => {
                    setClearingPrice(false)
                    setProcessingRequest(false)
                  }}
                >
                  Okay
                </Button>
              </div>
            ) : (
              <div>
                <h2 className={cn(s.h2, s.modalTitle)}>
                  {"Are you sure to abort selling this molecule?"}
                </h2>
                <div className={s.inputWrapper}>
                  <Button
                    className={s.saveButton}
                    onClick={async () => {
                      setProcessingRequest(true)
                      await clearPrice(id)
                    }}
                  >
                    Yes
                  </Button>
                  <Button
                    className={s.saveButton}
                    onClick={async () => {
                      setClearingPrice(false)
                      setProcessingRequest(false)
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Modal>

          <Modal
            isOpen={buyingToken}
            style={customStyles}
            onRequestClose={() => setBuyingToken(false)}
          >
            {processingRequest ? (
              <div>
                <div className={s.processingCopy}>
                  We are currently processing your request, check your metamask
                  for whenever the transaction will complete.
                </div>
                <Button
                  className={s.okay}
                  onClick={() => {
                    setBuyingToken(false)
                    setProcessingRequest(false)
                  }}
                >
                  Okay
                </Button>
              </div>
            ) : (
              <div>
                <h2 className={cn(s.h2, s.modalTitle)}>
                  You are going to buy this molecule at {utils.fromWei(buyPrice, "ether")} BNB
                </h2>
                <div className={s.inputWrapper}>
                  <Button
                    className={s.saveButton}
                    onClick={async () => {
                      setProcessingRequest(true)
                      await buyToken(id,buyPrice)
                    }}
                  >
                    Buy
                  </Button>
                </div>
              </div>
            )}
          </Modal>
        </Card>
      ) : null}
    </>
  )
}

export default Molecule
