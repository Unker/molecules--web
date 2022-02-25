import React from 'react'
import cn from 'classnames'
import Accordion from 'react-bootstrap/Accordion';
import "bootstrap/dist/css/bootstrap.css";
import s from './RoadMap.module.css'

import parse from 'html-react-parser';

import enzPic from '/src/res/img/enz.png'


const Title = () => {


  console.log("enzPic",enzPic)
	return (
		<>
		  <table className={s.table}>
        <tbody>
        <tr>
          <td className={s.trmleft} rowSpan="2">
            <h3 className={s.h3}>
              After sales 1500+ molecules we are going to start 
              to predict binding of your molecules to proteins
            </h3>
          </td>
          <td className={s.trmright}>
            <h3 className={s.h3}>
              Binding of molecules to proteins
            </h3>
          </td>
        </tr>
        <tr>
          <td className={s.trmright}>
              <p className={s.p}>
                We are going to build a model for predicting the drug-like molecules bind to important 
                proteins in the human body.
                This problem is of fundamental importance when creating new medicines. Targeted exposure 
                to a specific protein gives a significant therapeutic effect often. For example, the breakthrough 
                cancer drug "Imatinib" binds strongly to the BCR-ABL protein, which is one of the reasons for its 
                effectiveness.
              </p>
          </td>
        </tr>
        <tr>
          <td className={s.trmleft} rowSpan="2">
            <h3 className={s.h3}>
              After sales 2500+ molecules we are going to start 
              to promote your molecules
            </h3>
          </td>
          <td className={s.trmright}>
            <h3 className={s.h3}>
              Promotion of your molecules in pharmaceutical companies
            </h3>
          </td>
        </tr>
        <tr>
          <td className={s.trmright}>
              <p className={s.p}>
                We are going to send letters to pharmaceutical companies engaged in drug development with a commercial 
                offer for your molecules.
              </p>
          </td>
        </tr>
        <tr>
          <td className={s.trmleft} rowSpan="2">
            <h3 className={s.h3}>
              After sales 3071 molecules we are going to start 
              produce Enzymes with our new GAN
            </h3>
          </td>
          <td className={s.trmright}>
            <h3 className={s.h3}>
              Produce Enzymes
            </h3>
          </td>
        </tr>
        <tr>
          <td className={s.trmright}>
              <p className={s.p}>
                Design of new enzymes and proteins is a major business these days. Engineered enzymes 
                are used widely in modern manufacturing. (There’s a good chance your laundry detergent 
                holds some enzymes!) However, in general, design of new enzymes has proven challenging. 
                Some early work has shown that deep models can have some success at predicting protein 
                function from sequence. It’s not unreasonable at all to envision using deep generative 
                models to suggest new protein sequences that might have desired properties. 
                <br/>
                The introduction of generative models for this purpose could be even more impactful than 
                for small molecule design. Unlike with small molecules, it can be very tricky for human 
                  experts to predict the downstream effects of mutations to a given protein. Using generative 
                models can allow for richer protein design, enabling directions beyond the capability of 
                human experts today.
              </p>
              <img src={`/build/`+enzPic}  />

          </td>
        </tr>
        </tbody>
        </table>
		</>
	)
}

export default Title
