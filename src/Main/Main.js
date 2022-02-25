import React from 'react'
import Card from '@components/Card'
import MintButton from '@components/MintButton'
import { useWeb3 } from 'eth-react'
import useContracts from '@hooks/useContracts'
import MintedTokens from './MintedTokens'
import Showcase from './Showcase'
import LinkWalletButton from './LinkWalletButton'
import cn from 'classnames'
import s from './Main.module.css'


import parse from 'html-react-parser';
import { Helmet } from 'react-helmet'
import FAQ from './FAQ'
import RoadMap from './RoadMap'
// import { Text, StyleSheet } from "react-native";
import { useEffect, useState } from 'react'


const Intro = () => {
  const { connected } = useWeb3()
  const { nfts } = useContracts()


  return (
    <>

      <Card className={s.card}>
        <h2 className={s.h2}>          
          We propose the drug-likeness molecules produced by artificial intelligence (AI) 
          using the Generative adversarial network (GAN). 
          Each molecule will be registered on an ERC721 compatible smart contract on the Binance Smart Chain, 
          or in other words will be an non-fungible token (NFT).
        </h2>

        <table className={s.table}>
        <tbody>
        <tr>
          <td className={cn(s.tleft, s.bg)}>
            
          </td>
          {/*<td className={s.tright}>
            <br/>
            It is your molecule that could save millions of lives...
            <br /> 
            ...or happen to be kind of a new Highly Hazardous Chemical!
            <br/><br/><br/><br/>The future is already here
          </td>*/}

        </tr>
        </tbody>
        </table>

        <div className={s.flex}>
          <div className={s.left}>
            It is your molecule that could save millions of lives...
            <br /> 
            ...or happen to be kind of a new Highly Hazardous Chemical!
          </div>
          <div className={s.right}>
            <br /> 
            The future is already here
          </div>
        </div>

      </Card>

      <MintedTokens />
      <MintButton />



      <Card className={cn(s.card, s.bgAbout)} id="about">
        <h2 className={s.h2}>About</h2>
        <p className={s.p}>
          The main part of the efforts to discover modern medicines is <b>a creation of 
          new chemical compounds</b>. It is currently made in a semi-manual mode, when 
          experienced chemists suggest modifying basically and original structures. 
          The images of molecules from the current set are often projected onto a screen, 
          while experienced chemists suggest modified the structure of the molecule's nucleus. 
            A variety of the proposed molecules is synthesized and tested in a laboratory. 
          The process is being repeated until a appropriate molecule is found or the program is been shut down.
        </p>
        <p className={s.p}>
          At the same time, human participation does not only complement, but also severely 
          restricts this process. There are not very many gifted and experienced leading chemists 
          in the world, so the process of developing new molecules cannot go beyond a few laboratories. 
          Our generative model of molecular structures helps to overcome these limitations and <b>is able 
          to discover new chemical directions</b> missed by chemists.
        </p>
      </Card>

      <Card className={cn(s.card, s.bgPrice)}>
        <h2 className={s.h2}>Pricing</h2>
        <p className={s.p}>
          There will be 4096 Molecules minted. They are priced on the following
          stages:
          <br />
          <br />
          >   1 -  511: 0.25 BNB
          <br />
          >  512 - 1023: 0.50 BNB
          <br />
          > 1024 - 2047: 0.75 BNB
          <br />
          > 2048 - 3071: 1.5 BNB
          <br />
          > 3072 - 4096: 3.0 BNB
        </p>
      </Card>

      <Showcase />

      <Card className={s.card} id="faq">
        <h2 className={s.h2}>FAQ</h2>
        <FAQ />
      </Card>

      <Card className={s.card} id="specs">
        <h2 className={s.h2}>Specs</h2>

        <p className={s.p}>
          When a user mints a token the generative algorithm randomly
          produces a drug-likness Molecule and emits an event that
          contains it. You can see an example{' '}
          <a href={process.env.GENERATED_EVENT_URL} target="_blank">
            here
          </a>
          .{' '} 
        </p>
        <p className={s.p}>
          After a Molecule has been minted, at any time someone can query the smart
          contract on-chain and call "getSmiles" with the given tokenID. Calling 
          will return the Simplified Molecular Input Line Entry System (SMILES), 
          it doesn't cost gas to call. Thus anyone can view the Molecule
          on chain at any time, for free. Molecule value is linked to the Binance Smart Chain. 
          So long as the Binance Smart Chain survives, so too will the Molecules.
        </p>
        <p className={s.p}>
          As a sort of "fallback" mechanism, and to ensure that the NFT Molecules
          are easily viewable on all other NFT platforms, we also expose a
          standard ERC721-Metadata compliant `tokenURI` function. This tokenURI
          function returns a URL to our server, which responds with metadata
          about the Molecule (including an 3D confirmer representing the Molecule).
          However, this function is not necessary to view the Molecule on-chain.
        </p>
        <p className={s.p}>
          There will only be 4096 of these molecules ever minted, so get
          yours while you can.
        </p>
      </Card>

      <Card className={s.card} id="roadmap">
        <h2 className={s.h2}>And what will happen next?</h2>
        <RoadMap />
      </Card>

      {connected ? <MintButton /> : <LinkWalletButton />}
 
      <Card className={s.card}>
        <h2 className={s.h2}>Powered by</h2>
        <p className={s.p}>

        </p>

      </Card>

    </>
  )
}

export default Intro
