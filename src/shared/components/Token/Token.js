import React from 'react'
import Modal from 'react-modal'
import cn from 'classnames'
import { Link } from 'react-router-dom'
import s from './Token.module.css'
import ReactTooltip from 'react-tooltip'
import Button from '@components/Button'
import useContracts from '@hooks/useContracts'
import Descriptors from '@components/Descriptors'
import fetch from 'node-fetch'
import { useWeb3 } from 'eth-react'

import { utils } from 'web3'
import { Helmet } from 'react-helmet'
import { useEffect, useState } from 'react'

const URL_DESCRIPTORS_VALUES = `${process.env.PUBLIC_URL_SERVER}/values/`;
const URL_IMAGES = `${process.env.PUBLIC_URL_SERVER}/images/`;

async function getSmiles(id) {
  let response = await fetch("http://localhost:3333/?seed=123123333");
    
  if(response.status != 200) {
    throw new Error("Server Error");
  }
    
  // read response stream as text
  let text_data = await response.text();
  console.log("id=",id,text_data);
  return text_data;
}


async function getValues(token) {
  const keccak256 = require('keccak256')
  const hash = keccak256(token).toString('hex');
  const url = URL_DESCRIPTORS_VALUES+`${hash}`;
  // console.log("url_values", URL_DESCRIPTORS_VALUES);
  // console.log("url", url);
  let ret = fetch(url)
    .then((response) => response.json())
    .then((ret) => {
      // console.log("getValues ret", ret)
      return ret
    })
    return ret
}


async function getSrcImage(token) {

  const keccak256 = require('keccak256')

  const hash = keccak256(token).toString('hex');
  const url = URL_IMAGES+`0x${hash}`
  // console.log("request img", url)

  let response = await fetch(url);
  // const blob = await response.blob()
  // return URL.createObjectURL(blob)
  console.log("ret img", response.url)
  return response.url
}

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


const Token = ({ token, name, id, showId = true }) => {

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

  const iAmContractOwner = walletAddress === process.env.OWNER_CONTRACT

  useEffect(async () => {
    if (!fetchNameById) return
    fetchNameById(id)
    .then((name) => setMoleculeName(name))
    .catch(() => setMoleculeName(""))
  }, [setMoleculeName, fetchNameById])

  useEffect(async () => {
    if (!getTokenPrice) return
    getTokenPrice(id)
    .then((price) => setBuyPrice(price))
    .catch(() => setBuyPrice("0"))
  }, [setBuyPrice, getTokenPrice])

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

  const jmol_isReady = function(applet) {
    document.title = (applet._id + " - Jmol " + Jmol.___JmolVersion)
    // Jmol._getElement(applet, "appletdiv").style.border="1px solid blue"
  }

  let Info = {
    width: '400',
    height: '350',
    debug: false,
    // j2sPath: "/jmol/jsmol/jsmol/j2s",
    j2sPath: "/jmol/jsmol/j2s",
    // color: "0xC0C0C0", // "0xfcfef6",
    color: "white", 
    disableJ2SLoadMonitor: true,
    disableInitialConsole: true,
    addSelectionOptions: false,
    // serverURL: "https://chemapps.stolaf.edu/jmol/jsmol/php/jsmol.php",
    // serverURL: "/jmol/jsmol/jsmol/php/jsmol.php",
    serverURL: "/jmol/jsmol/php/jsmol.php",
    use: "HTML5",
    readyFunction: null,
    spinRateX: 0.2,
    spinRateY: 0.5,
    spinFPS: 20,
    spin: true,

    // serverURL: "https://chemapps.stolaf.edu/jmol/jsmol/php/jsmol.php",
    use: "WEBGL HTML5",
    j2sPath: "./jmol/jsmol/j2s",
    readyFunction: jmol_isReady,

    // script: 'load :smiles:CC/C=C/CC'
    // script: `load :smiles:${token}`
    // script: `load $${token}`,
    // script: "load $caffeine",
    // script: "set antialiasDisplay;load jmol/jsmol/data/caffeine.mol",
    script: `set antialiasDisplay;load ASYNC $${token}`,
    // script: `set antialiasDisplay;load ASYNC jmol/jsmol/data/taxol.mol`,
    // script: `set antialiasDisplay;load ASYNC jmol/example1.mol`,

  }
  // console.log("Info", `load $${token}`);

  // let res = Jmol.getAppletHtml("jmolApplet0",Info);
  // console.log("res", res);

  const [jmol, setJmol] = useState([])
  const [jmolWdgts, setJmolWdgts] = useState([])
  useEffect(() => {
    console.log("creating jmol id", id);
    setJmol(Jmol.getAppletHtml(`jmolApplet${id}`,Info));
    // setJmolWdgts(Jmol.jmolCheckbox(`jmolApplet${id}`,'spin on','spin off','spin on/off'));
  }, [])
  // console.log("jmolWdgts", jmolWdgts);



  const [btn, setBtn] = useState([])

  useEffect(() => {
    // Jmol.jmolButton(jmolApplet0, "spin on","spin ON");
    // console.log("btn", btn);
  }, [])

  const [imageToken, setImageToken] = useState([])
  useEffect(() => {
    getSrcImage(token)
    .then((ret) =>{
      setImageToken(ret)
    })
  }, [])


  return (
    <div className={s.tokenContainer}>
      
      {showId ? (
        <div className={s.tokenId}>
          <span>Token #{id}</span>

          <Link className={s.link} to={`/molecules/${id}`} target="_blank">
            <i className={cn('fas fa-external-link-alt', s.shareButton)}></i>
          </Link>
          <br/>
        </div>
      ) : null}

      {name && showId ? (
        <>
          <div
            className={s.tokenId}
          >Name: {name}
          </div>
        </>
      ) : null}

      <h2 className={cn(s.h2)}
        data-tip="Simplified Molecular Input Line Entry System"
      >
        SMILES
      </h2>
      <pre className={s.token}
        data-tip="Simplified Molecular Input Line Entry System"
      >
        {token}
      </pre>

      <ReactTooltip />

      <h2 className={cn(s.h2)}>
        Name
      </h2>
      <pre className={s.token}>
        {name ? (
          <>{name}</>
        ) : <>-</>}
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
          </>
        ) : null
        }
      </pre>

      <ReactTooltip />


      <h2 className={s.h2}>2D Conformer</h2>
      <img className={s.imgToken} src={imageToken} alt="" /> 
      <h2 className={s.h2}>3D Conformer</h2>
      <div dangerouslySetInnerHTML={{ __html: jmol }} /> 
      <div dangerouslySetInnerHTML={{ __html: jmolWdgts }} /> 
      {/*<div dangerouslySetInnerHTML={{ __html: 
        Jmol.jmolCheckbox(`jmolApplet${id}`,'spin on','spin off','spin on/off')
       }} /> */}


      <Descriptors values={getValues(token)}/>


      <h2 className={cn(s.h2)}>
        Price
      </h2>
      <pre className={s.token}>
        {buyPrice>0?(
         <>{utils.fromWei(buyPrice, "ether")} ETH</>
        ) : <>not set</>}

        {owner == walletAddress ? (
          <>
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
          {buyPrice>0 ? (
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
      </pre>


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
              {"Request your price for the molecule, ETH"}
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
              You are going to buy this molecule at {utils.fromWei(buyPrice, "ether")} ETH
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

    </div>
  )
}

export default Token
