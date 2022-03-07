import React, { useCallback, useEffect, useState } from 'react'
import abis from '@abis'
import cn from 'classnames'
import useInterval from '@use-it/interval'
import { useWeb3 } from 'eth-react'
// import { useWeb3 } from 'react-eth'
import { Contract } from 'ethers'

import s from '@components/Button/NotificationButton.module.css'
import Noty from 'noty'
import Context from './Context'
import addresses from '../../addresses'

import { utils } from 'web3'
import Web3 from 'web3'

const Provider = ({ children }) => {
  const [nfts, setNfts] = useState([])
  const [totalSupply, setTotalSupply] = useState(0)
  const [tokenLimit, setTokenLimit] = useState(0)
  const [saleStarted, setSaleStarted] = useState(null)
  const [networkId, setNetworkId] = useState('')
  const [currentPrice, setCurrentPrice] = useState('')
  const [contract, setContract] = useState(
    new Contract(addresses.contract, abis.molecules)
  )
  
  // console.log("contract=",addresses.contract.toString(16))

  let web3;
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
    // console.log("is window.ethereum")
    web3 = window.web3

  } else {
    console.log("is non window.ethereum")
  }

  const { wallet, walletAddress } = useWeb3()

  // if(wallet) console.log("wallet=",wallet)
  // if(walletAddress) console.log("walletAddress=",walletAddress.toString(16))


  useEffect(() => {
    ;(async function () {
      if (!contract) return

      try {
        await contract.deployed()
        contract.on(
          'Generated',
          (tokenId, address, token, { transactionHash }) => {
            if (address == walletAddress) {
              const noty = new Noty({
                layout: 'bottom',
                buttons: [
                  Noty.button('bscscan', cn(s.button, s.small), () =>
                    window.open(
                      `${
                        process.env.ETHERSCAN_BASE || 'https://bscscan.com'
                      }`+`/tx/${transactionHash}`,
                      '_blank'
                    )
                  ),
                  /*
            Noty.button('Tweet', cn(s.button, s.small), () => {
              const encodedPunk = encodeURIComponent(token)
              const previewLink = `https://carbon.now.sh/?l=txt&code=${encodedPunk}&fm=Fira%20Code`
              const tweetBody = `Check out this new punk I just minted on https://asciipunks.com ${previewLink}`
              const tweetLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetBody)}`

              window.open(tweetLink, '_blank')
            }),
            */
                ],
                text: `Molecule #`+`${tokenId}`+` minted
          <div style="padding: 16px 0; display: flex; font-family: 'Unimono', monospace; justify-content: center;"><pre style="display: inline-block;">${token}</pre></div>`,
                timeout: 4000,
              }).show()
            }
          }
        )
      } catch (e) {}
    })()

    return () => contract.off('Generated')
  }, [contract])

  useEffect(() => {
    if (!!wallet && !contract.signer) {
      setContract(contract.connect(wallet))
    }
  }, [wallet, setContract, contract])

  const moleculesForUser = useCallback(
    async (userAddress) => {
      const address = userAddress || walletAddress
      if (!address || !contract.signer) return []
      let userMolecules = []
      let namedMolecules = []

      // console.log("===address=",address)
      const networkId = await web3.eth.net.getId()
      // console.log("++++++networkId=",networkId)
      // console.log("===contract=",contract)
      if(networkId==56) { // binance smart chain
        const balance = (await contract.balanceOf(address)).toNumber()
        for (let index = 0; index < balance; index++) {
          const id = (await contract.tokenOfOwnerByIndex(address, index)).toNumber()
          userMolecules.push({ molecule: await contract.getSmiles(id), id })
          // console.log("~~~molecule",await contract.getSmiles(id))

        }

        namedMolecules = await Promise.all(
          userMolecules.map(async (nft) => ({ ...nft, name: await fetchNameById(nft.id) }))
        )
      }

      setNetworkId(networkId)

      return namedMolecules
    },
    [contract, walletAddress, networkId]
  )

  const smilesMolecule = useCallback(async (id) => await contract.getSmiles(id), [contract])
  const ownerOf = useCallback(async (id) => await contract.ownerOf(id), [contract])
  const nameMolecule = useCallback(async (id) => await contract.tokenNameById(id), [contract]) // ?

  const totalMolecules = useCallback(async () => {
    if (!walletAddress || !contract.signer) return []

    const newTotalSupply = (await contract.totalSupply()).toNumber()
    const newTokenLimit = (await contract.TOKEN_LIMIT()).toNumber()

    return { totalSupply: newTotalSupply, tokenLimit: newTokenLimit }
  }, [contract, walletAddress])

  const getSaleStarted = useCallback(async () => {
    if (!walletAddress || !contract.signer) return null

    const started = await contract.hasSaleStarted()
    return started
  }, [contract, walletAddress])

  const calculateCurrentPrice = useCallback(async () => {
    const { totalSupply } = await totalMolecules()
    let currentPrice

    if (totalSupply < 512) {
      currentPrice = '250000000000000000'
    } else if (totalSupply >= 512 && totalSupply < 1024) {
      currentPrice = '500000000000000000'
    } else if (totalSupply >= 1024 && totalSupply < 2048) {
      currentPrice = '750000000000000000'
    } else if (totalSupply >= 2048 && totalSupply < 3072) {
      currentPrice = '1500000000000000000'
    } else {
      currentPrice = '3000000000000000000'
    }
    return currentPrice
  }, [totalMolecules])

  const fetchTokens = useCallback(async () => {
    const nfts = await moleculesForUser()
    const enrichedNfts = await Promise.all(
      nfts.map(async (nft) => ({ ...nft, name: await fetchNameById(nft.id) }))
    )
    setNfts(enrichedNfts)

    const { totalSupply, tokenLimit } = await totalMolecules()
    const started = await getSaleStarted()

    const currentPrice = await calculateCurrentPrice()
    setSaleStarted(started)
    setTotalSupply(totalSupply)
    setTokenLimit(tokenLimit)
    setCurrentPrice(currentPrice)
  }, [
    setTotalSupply,
    setTokenLimit,
    setSaleStarted,
    setNfts,
    setCurrentPrice,
    currentPrice,
    moleculesForUser,
    totalMolecules,
    getSaleStarted,
  ])

  const fetchNameById = useCallback(
    async (id) => {
      const name = await contract.tokenNameById(id);
      if (!name) return ''
      return name
    }
  )

  const setName = useCallback(
    async (id, name) => {
      console.log("id: ",id, "name: ".name)

      await contract.changeName(id, name, {
        value: contract.NAME_CHANGE_PRICE(), // todo price
        from: walletAddress,
        gasLimit: 400000,
      })

      setNfts(await moleculesForUser())
    }
  )

  const setPrice = useCallback(
    async (id, price) => {
      let priceWei = utils.toWei(price, "ether");

      await contract.allowBuy(id, priceWei, {
        // value: contract.NAME_CHANGE_PRICE(), // todo price
        from: walletAddress,
        gasLimit: 400000,
      })

      // setNfts(await moleculesForUser())
    }
  )

  const clearPrice = useCallback(
    async (id, price) => {
      console.log("cancel selling ")

      await contract.disallowBuy(id, {
        from: walletAddress,
        gasLimit: 400000,
      })

    }
  )

  const getTokenPrice = useCallback(
    async (id) => {
      let price = await contract.tokenPriceById(id); 
      price = price.toString()
      if (price == 0) return ''
      return price
      // return "123.333"
    }
  )

  const buyToken = useCallback(
    async (id,price) => {
      console.log("id: ",id, "buyToken price: ", price) // todo get price 

      await contract.buy(id, {
        value: price, // todo price
        from: walletAddress,
        gasLimit: 400000,
      })

      // setNfts(await moleculesForUser())
    }
  )

  const fetchTokensById = useCallback(
    async (ids) => {
      const nfts = await Promise.all(
        ids.map(async (id) => ({ id, token: await contract.getSmiles(id) }))
      )

      return await Promise.all(
        nfts.map(async (nft) => ({ ...nft, name: await contract.tokenNameById(nft.id) }))
      )
    },
    [contract]
  )

  useInterval(async () => {
    fetchTokens()
  }, 50000) // todo 5000

  useEffect(() => {
    fetchTokens()
  }, [fetchTokens])

  const createMolecule = useCallback(
    async (smiles) => {
      // console.log("~~~~~~~~~~~~~~~~",seed)
      let sts = await contract.createMolecule(smiles, {
        value: currentPrice,
        from: walletAddress,
        gasLimit: 400000,
      })
      console.log("sts",sts)

      const { totalSupply, tokenLimit } = await totalMolecules()
      setTotalSupply(totalSupply)
      setTokenLimit(tokenLimit)
      setNfts(await moleculesForUser())
    },
    [
      contract,
      currentPrice,
      walletAddress,
      totalMolecules,
      setTotalSupply,
      setTokenLimit,
      setNfts,
      moleculesForUser,
    ]
  )

  const startPauseSale = useCallback(
    async () => {
      // Unker
      if(!saleStarted) {
        let st = await contract.startSale({
              from: walletAddress, 
              //gasLimit: 200000,
            })
        console.log("********started******* ", st)
      } else {
        let st = await contract.pauseSale({
          from: walletAddress, 
          //gasLimit: 200000,
        })
        console.log("********paused******* ", st)
      }
    }
  )

  const withdraw = useCallback(
    async () => {
      let st = await contract.withdraw({
            from: walletAddress, 
            //gasLimit: 200000,
          })
      console.log("********withdraw******* ", st)

    }
  )

  return (
    <Context.Provider
      value={{
        createMolecule,
        startPauseSale,
        withdraw,
        currentPrice,
        smilesMolecule,
        fetchTokensById,
        fetchNameById,
        nfts,
        ownerOf,
        moleculesForUser,
        saleStarted,
        setName,
        setPrice,
        clearPrice,
        getTokenPrice,
        buyToken,
        tokenLimit,
        totalSupply,
        nameMolecule,
        walletAddress,
        networkId,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export default Provider
