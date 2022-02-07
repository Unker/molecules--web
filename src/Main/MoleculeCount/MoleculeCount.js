import React, { useEffect, useState, useContext, useMemo } from 'react'
import { useContracts } from '@hooks'
import cn from 'classnames'
import s from './MoleculeCount.module.css'

const MoleculeCount = ({className}) => {
  const { tokenLimit, totalSupply } = useContracts()

  return (
    <div className={cn(className, s.moleculeCount)}>
      {totalSupply} / {tokenLimit} Molecules minted
    </div>
  )
}

export default MoleculeCount
