import React from 'react'
import cn from 'classnames'
import Accordion from 'react-bootstrap/Accordion';
import "bootstrap/dist/css/bootstrap.css";
import s from './FAQ.module.css'

import parse from 'html-react-parser';




const Title = () => {

  const fq = {
    "faq1": {
      "qst":"Why does it work?",
      "text":`All biological mechanisms are based on physical laws. Besides, majority 
        the most important experimental methods for studying protein structure have been 
        developed by physicists. In order to manipulate nanoscale systems (which proteins 
          is in fact) it is imperative to know theoretical and applied physics perfectly. 
        In addition, the deep learning algorithms used by us are similar to architectures 
        in the field of particle physics or physical modeling.
        `,
      },
    "faq2": {
      "qst":"Why do we use neural networks?",
      "text":`Machine learning algorithms are applied to everything, beginning from searching for 
            new galaxies up to classifying of subatomic interactions at the Large Hadron Collider. 
            One of the sources of these technological achievements was the emergence of the class 
            of machine learning methods known as deep neural networks. They able to see patterns 
            and trends in large data sets and make biggest scientific discoveries in the nearest future.
        `,
      },
    "faq3": {
      "qst":"Is virtual screening profitable?",
      "text":`Virtual screening can provide an efficient and cost-effective way to identify starting 
          points of the search for medicinal compounds. Instead of conducting expensive experimental 
          high-throughput screening (HTS), we can apply computational methods to virtually evaluate 
          billions of molecules.
        `,
      },
    "faq4": {
      "qst":"What is the basis for the conclusion that the molecules claims to be a new drug?",
      "text":parse(`To determine the similarity of molecules to known drugs, we use one of the most widespread 
          methods known as quantitative estimate of drug-likeness (
          <a href="https://www.nature.com/articles/nchem.1243" target="_blank">
            QED
          </a>
          ).
        `),
      },
    "faq5": {
      "qst":"And what about the toxicity of the molecules?",
      "text":`We use an additional neural network to predict the toxicity of the molecules. Each molecule 
          is subjected to enzymatic assay, which means checking whether the molecules binding to biological 
          targets from the Tox21 set. Each target represents a specific enzyme that is associated with toxic 
          reactions to the molecules of a potential drug. The proposed molecules contains both potential drugs 
          and very toxic molecules, which will be signaled by the infographics.
        `,
      },
    "faq6": {
      "qst":"What about the reliability of the generated molecules?",
      "text":parse(`One of the factors that we take into consideration when synthesizing a molecule is its size. 
          Molecules containing less than 10 atoms are unlikely to generate enough interaction energy 
          o produce a measurable response in the process a biological experiment. Large molecules containing 
          more than 50 atoms do not usually dissolve well in water and create additional problems in biological 
          experiments.
          <br />
          Also obvious factor is to monitor compliance with the standard rules of chemical valence.
          <br />
          And last but not least, we discard molecules containing unstable functional groups as they are 
          relatively weak or overly reactive. We apply filters with more than 1000 warnings of unstable 
          patterns created by the world's leading companies and research centers.
        `),
      },
    "faq7": {
      "qst":"How can I buy a Molecule?",
      "text":parse(`To buy a Molecule, you need to have an Ethereum wallet setup. A
          commonly recommended one is
          <a href="https://metamask.io/" target="_blank">
            Metamask
          </a>
          . Get the Metamask Chrome extension, set up your wallet, and fund it
          with binance BNB. Once you do that, you can use the "connect" button at the
          top of the page to connect your wallet to the site. Then mint to your
          heart's content!
        `),
      },
    "faq8": {
      "qst":"How can I see my Molecule?",
      "text":`After you use the site to mint, and once the transaction is confirmed,
          your newly adopted molecule will show up here. Since Molecules are an
          ERC721 compliant NFT, they will be viewable/tradeable on all major
          platforms.
        `,
      },
  }

	return (
		<>
		  <Accordion>
        {Object.keys(fq).map((key,id) => {
          return (

            <Accordion.Item key={id} eventKey={id} > 
              <Accordion.Header 
                className={s.h3}
                data-for={id}
                data-delay-hide='100'
              >
                <h3 className={cn(s.h3, s.pt)}> {fq[key]["qst"]} </h3>
              </Accordion.Header>
              <Accordion.Body className={s.p}>
                {fq[key]["text"]}
              </Accordion.Body>
            </Accordion.Item>
          )
        })}

      </Accordion>
		</>
	)
}

export default Title
