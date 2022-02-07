import React from 'react'
import cn from 'classnames'
import { Link } from 'react-router-dom'
import s from './Token.module.css'
import ReactTooltip from 'react-tooltip'

import Descriptors from '@components/Descriptors'
import fetch from 'node-fetch'
import axios from 'axios';

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


const Token = ({ token, name, id, showId = true }) => {

  let Info = {
    width: 500,
    height: 400,
    debug: false,
    j2sPath: "/jmol/jsmol/jsmol/j2s",
    // color: "0xC0C0C0", // "0xfcfef6",
    color: "white", 
    disableJ2SLoadMonitor: true,
    disableInitialConsole: true,
    addSelectionOptions: false,
    // serverURL: "https://chemapps.stolaf.edu/jmol/jsmol/php/jsmol.php",
    serverURL: "/jmol/jsmol/jsmol/php/jsmol.php",
    use: "HTML5",
    readyFunction: null,
    spinRateX: 0.2,
    spinRateY: 0.5,
    spinFPS: 20,
    spin: true,
    // script: 'load :smiles:CC/C=C/CC'
    // script: `load :smiles:${token}`
    script: `load $${token}`,
    // script: "load $caffeine"

  }
  // console.log("Info", `load $${token}`);

  // let res = Jmol.getAppletHtml("jmolApplet0",Info);
  // console.log("res", res);

  const [jmol, setJmol] = useState([])
  const [jmolWdgts, setJmolWdgts] = useState([])
  useEffect(() => {
    console.log("create jmol id", id);
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

      <pre className={s.token}
        data-tip="Simplified Molecular Input Line Entry System"
      >
        SMILES: {token}
      </pre>
      <ReactTooltip />

      
      <img className={s.imgToken} src={imageToken} alt="" /> 
      <br/>
      <a  href={`https://chemapps.stolaf.edu/jmol/jmol.php?model=${token}&image2d`}>2D model</a>
      <br/>
      <a  href={`https://chemapps.stolaf.edu/jmol/jmol.php?model=${token}`}>3D model</a>
      <br/>
      <h2 className={s.h2}>3D Conformer</h2>
      <div dangerouslySetInnerHTML={{ __html: jmol }} /> 
      <div dangerouslySetInnerHTML={{ __html: jmolWdgts }} /> 
      {/*<div dangerouslySetInnerHTML={{ __html: 
        Jmol.jmolCheckbox(`jmolApplet${id}`,'spin on','spin off','spin on/off')
       }} /> */}


      <Descriptors values={getValues(token)}/>

    </div>
  )
}

export default Token
