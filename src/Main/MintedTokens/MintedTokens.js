import React, { useState, useEffect } from 'react'
import cn from 'classnames'
import sortBy from 'lodash/fp/sortBy'
import Card from '@components/Card'
import Token from '@components/Token'
import useContracts from '@hooks/useContracts'
import s from './MintedTokens.module.css'
import MoleculeCount from '../MoleculeCount'

const TOKEN_SHOW = 4

const MintedTokens = () => {
  const { fetchTokensById, totalSupply } = useContracts()
  const [ids, setIds] = useState([])
  const [tokens, setTokens] = useState([])

  const rangeFrom = (x) => {
    const endingId = x + TOKEN_SHOW

    return [...Array(totalSupply + 1).keys()].slice(x, endingId)
  }

  useEffect(async () => {
    if (!totalSupply) return

    const startingId = ids[0] != null ? ids[0] : 1
    console.log("mintedTokens ~~~~~ ids=",ids)
    const newIds = rangeFrom(startingId)
    const tokens = await fetchTokensById(newIds)


    setTokens(tokens)
    if (ids[0] == null) setIds(newIds)

  }, [ids, totalSupply, fetchTokensById])

  if (tokens.length == 0) return(
    <Card className={cn(s.card, s.bg)}>
      <div className={s.flex}>
        <h2 className={s.h2}>Example</h2>
      </div>
      <div className={s.container}>
        <Token token={"CC(C)(C)CC(O)=C1C[C@@H](C(C#N)CO)NCCC=C1O"} 
          name={"Example 1"} id={"0"} showId={false}/>
        <Token token={"CCN1CCCN(CC2CCC(CCNC(C)=O)N2CCNC(C)=O)C1"} 
          name={"Example 2"} id={"1"} showId={false}/>
      </div>
    </Card>
    // null
  ) 
  // todo example

  else return (
    <Card className={cn(s.card, s.bg)}>
      <div className={s.flex}>
        <h2 className={s.h2}>Minted Molecules</h2>
        <MoleculeCount className={s.moleculeCount} />
      </div>
      <div className={s.container}>
        <button
          className={cn('fas fa-arrow-left', s.button, s.leftButton)}
          onClick={() => {
            setIds((ids) => {
              if (ids[0] == 1) return rangeFrom(totalSupply - 3)

              return rangeFrom(ids[0] - TOKEN_SHOW)
            })
          }}
        />
        {tokens.map(({ token, id, name }) => (
          <Token token={token} name={name} id={id} key={id} />
        ))}
        <button
          className={cn('fas fa-arrow-right', s.button, s.rightButton)}
          onClick={() => {
            setIds((ids) => {
              if (ids[ids.length - 1] == totalSupply) return []

              return rangeFrom(ids[ids.length - 1] + 1)
            })
          }}
        />
      </div>
    </Card>
  )
}

export default MintedTokens
