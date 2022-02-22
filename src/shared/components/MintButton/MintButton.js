import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import { utils } from 'web3'
import Button from '@components/Button'
import { useContracts } from '@hooks'
import cn from 'classnames'
import s from './MintButton.module.css'

import fetch from 'node-fetch' // Unker

const customStyles = {
  content: {
    backgroundColor: 'var(--baby-powder)',
    bottom: 'auto',
    boxShadow: '4px 5px var(--mandarin)',
    left: '50%',
    marginRight: '-50%',
    right: 'auto',
    top: '50%',
    transform: 'translate(-50%, -100%)',
    borderRadius: '10px',
  },
}

const URL_SEED = `${process.env.PUBLIC_URL_SERVER}/seed/`;


// Unker
// async function getSmiles(seed) {
//   let response = await fetch(`http://localhost:3333/?seed=${seed}`);
    
//   if(response.status != 200) {
//     throw new Error("Server Error");
//   }
    
//   // read response stream as text
//   let smiles = await response.text();
//   console.log("seed=",seed,smiles);
//   return smiles;
// }

async function getSmiles(seed) {
  let ret = fetch(URL_SEED+`${seed}`)
    .then((response) => response.text())
    .then((smiles) => {
        console.log("seed=",seed,smiles);
      return smiles;
    })
    return ret
}

Modal.setAppElement('#app')

const MintButton = () => {
  const {
    createMolecule,
    startPauseSale,
    withdraw,
    saleStarted,
    tokenLimit,
    totalSupply,
    currentPrice,
    walletAddress,
  } = useContracts()
  const [modalOpen, setModalOpen] = useState(false)
  const [seed, setSeed] = useState(0)

  const saleEnded = tokenLimit === totalSupply

  const iAmOwner = walletAddress === process.env.OWNER_CONTRACT

  let buttonCopy
  let buttonStartText

  if (saleStarted) {
    if (!saleEnded) {
      buttonCopy = `Mint 1 Molecule for ${utils.fromWei(currentPrice,'ether')}`+` BNB`
      buttonStartText = 'Pause sale'
    } else {
      buttonCopy = 'All Molecules have been sold out!'
      buttonStartText = buttonCopy
    }
  } else if (saleStarted !== null) {
    buttonCopy = "Sale hasn't started yet! Check back later."
    buttonStartText = 'Start sale'
  } else {
    buttonCopy = "It appears we cannot connect to web3, please connect your wallet and refresh the page."
    buttonStartText = buttonCopy
  }

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 1000000000000))
  }, [])

  // console.log("wallet",walletAddress)
  // console.log("wallet",iAmOwner)

  return (
    <>
      <Button
        className={cn(s.largeButton, {
          [s.mintButton]: saleStarted,
          [s.salePausedButton]: !saleStarted,
        })}
        disabled={!saleStarted || saleEnded}
        onClick={() => {
          setModalOpen(true)
        }}
      >
        {buttonCopy}
      </Button>

      {
        iAmOwner ? (
        <>
          <Button
            className={cn(s.largeButton, {
              [s.mintButton]: saleStarted,
              [s.salePausedButton]: !saleStarted,
            })}
            onClick={() => {
              withdraw()
            }}
          >
            withdraw
          </Button>

          <Button
            className={cn(s.largeButton, {
              [s.mintButton]: !saleStarted,
              [s.salePausedButton]: saleStarted,
            })}
            disabled={!iAmOwner}
            onClick={() => {
              startPauseSale()
            }}
          >
            {buttonStartText}
          </Button>
        </>
        ) : null
      }
      <Modal
        isOpen={modalOpen}
        style={customStyles}
        onRequestClose={() => setModalOpen(false)}
        onAfterOpen={() => setSeed(Math.floor(Math.random() * 1000000000000))}
      >
        <p>What seed number would you like to use to generate your molecule?</p>
        <p className={s.warning}>Warning: Do not use decimals, the seed must be an integer</p>
        <div>
          <div className={s.row}>
            <input
              className={s.input}
              placeholder="Seed value..."
              type="number"
              value={seed}
              onChange={(e) =>
                setSeed((x) => {
                  if (!(e.nativeEvent.data || e.target.value)) return 0

                  return e.target.value.toString()
                })
              }
            />
            <button
              className={s.generateButton}
              onClick={() => {
                setSeed(Math.floor(Math.random() * 1000000000000))
              }}
            >
              Generate random number
            </button>
          </div>
          <button
            className={s.submit}
            onClick={async () => {
              let smiles = await getSmiles(seed)
              console.log("truing mint",smiles)
              await createMolecule(smiles)
              setModalOpen(false)
              setSeed(Math.floor(Math.random() * 1000000000000))
            }}
          >
            Submit
          </button>
        </div>
      </Modal>
    </>
  )
}

export default MintButton
