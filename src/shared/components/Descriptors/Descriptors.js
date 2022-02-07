import React, { useState, useEffect } from 'react'
import cn from 'classnames'
import { Link } from 'react-router-dom'
import s from './Descriptors.module.css'
import ReactTooltip from 'react-tooltip'

// import {
//     Accordion,
//     AccordionItem,
//     AccordionItemHeading,
//     AccordionItemButton,
//     AccordionItemPanel,
// } from 'react-accessible-accordion';
// import 'react-accessible-accordion/dist/fancy-example.css';

import Accordion from 'react-bootstrap/Accordion';
import "bootstrap/dist/css/bootstrap.css";

import { OverlayTrigger, Button } from 'react-bootstrap';
import Popover from 'react-bootstrap/Popover'

import usePromise from 'react-promise';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';

import { useUncontrolled } from 'uncontrollable';

import fetch from 'node-fetch'
//import axios from 'axios';

const URL_JSON = `${process.env.PUBLIC_URL_SERVER}/json/`;


// Unker
// async function getDescriptors() {
//   let response = await fetch(`${process.env.PUBLIC_URL_SERVER}/json`);
//   const desc = await response.json()
//   return desc
// }

function getDescriptors() {
  const desc = fetch(URL_JSON)
  .then((response) => response.json())
  .then((desc) => desc )
  return desc
}



const popover = (headText,bodyText) => (
  <Popover className={s.popover} id="popover-basic">
    <Popover.Header as="h3">{headText}</Popover.Header>
    <Popover.Body>
      {bodyText}
    </Popover.Body>
  </Popover>
);


const BtnAbout = (props) => (

  <OverlayTrigger 
    trigger="focus" 
    placement="right" 
    overlay={popover(props.headText,props.bodyText)}
  >
    <Button variant="light">?</Button>
  </OverlayTrigger>

);



const Descriptors = ({values}) => {

  const [descriptors, setDescriptors] = useState([])
  const [value, setValue] = useState([])

  // useEffect(async () => {
  //   const desc = await getDescriptors()
  //   setDescriptors(desc)
  // }, [])

  useEffect( () => {
    getDescriptors()
    .then((desc) => setDescriptors(desc))
  }, [])

  useEffect( () => {
    values.then((val) => {
      //console.log("input val",val)
      setValue(val)
    })
  }, [])

  // console.log("input values json",values)


  const [showA, setShowA] = useState(true);

  const toggleShowA = () => setShowA(!showA);


  return (
    <div className={s.tokenContainer}>
      
      <center>  
      <h1>Descriptors</h1>
      </center>

      <Accordion>
        {Object.keys(descriptors).map((key,id) => {
            return (

              descriptors[key].isShow ? (
                <Accordion.Item key={id} eventKey={id} > 
                    <Accordion.Header 
                      data-tip={descriptors[key].about} 
                      data-for={String(id)}
                      data-delay-hide='100'
                    >
                              {key}   
                    </Accordion.Header>
                    <ReactTooltip className={s.tooltip} 
                      multiline={true} 
                      id={String(id)}
                    />
                    <Accordion.Body>
      
                      {Object.keys(descriptors[key].Descriptors).map((key2,id) => {
                        const desc = descriptors[key].Descriptors[key2]
                        return (
                          <div key={key2} >
                          <p key={key2}                       
                            
                            data-for={String(key2)}
                          >
                            <BtnAbout headText={desc.Description} bodyText={desc.Info} />
                            {key2} = {value[key2]===undefined?"coming soon":value[key2]}
                          </p>
                          <ReactTooltip className={s.tooltip} 
                            multiline={true} 
                            id={String(key2)}
                          />
                          </div>
                          )
                      })}
                    </Accordion.Body>

                </Accordion.Item>
              ) : (
                ""
              )
            )
        })}
      </Accordion>  

      
    </div>
  )
}

export default Descriptors
