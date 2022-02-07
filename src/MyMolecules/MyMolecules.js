import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import useContracts from '@hooks/useContracts'
import { useWeb3 } from 'eth-react'
import Token from '@components/Token'
import Card from '@components/Card'
import { useParams } from 'react-router-dom'

import s from './MyMolecules.module.css'

const MyMolecules = () => {
  const { connected } = useWeb3()
  const { moleculesForUser } = useContracts()
  const { address } = useParams()
  const [nfts, setNfts] = useState([])

  useEffect(async () => {
    setNfts(await moleculesForUser(address))
  }, [moleculesForUser])

  return (
    <>
      <Helmet>
        <meta
          name="twitter:image"
          content={`${process.env.PUBLIC_URL_SERVER}/mymolecules/${address}/preview`}
        />
        <meta
          name="twitter:title"
          content={`Molecules owned by  #${address}`}
        />
        <meta
          name="og:url"
          content={`${process.env.PUBLIC_URL_SERVER}/mymolecules/${address}`}
        />
        <meta name="og:title" content={`Molecules owned by ${address}`} />
        <meta
          name="og:image"
          content={`${process.env.PUBLIC_URL_SERVER}/mymolecules/${address}/preview`}
        />
      </Helmet>

      <Card className={s.card}>
        <h2 className={s.h2}>
          Molecules owned by
          <br />
          {address}
        </h2>
        <div className={s.container}>
          {connected && nfts.length > 0
            ? nfts.map(({ molecule, id, name }) => (
                <Token token={molecule} id={id} key={id} name={name} />
              ))
            : "You don't have any molecules yet :("}
        </div>
      </Card>
    </>
  )
}

export default MyMolecules
