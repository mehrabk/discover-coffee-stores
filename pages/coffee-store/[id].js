import React, { useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Head from "next/head"
import Image from "next/image"
import cls from "classnames"
import useSWR from "swr"

import styles from "../../styles/coffee-store.module.css"
import { fetchCoffeeStores } from "../../lib/coffee-stores"
import { StoreContext } from "../../store/store-context"
import { fetcher, isEmpty } from "../../utils"

export async function getStaticPaths(props) {
  console.log("getStaticPaths = ", props)
  const coffeeStoresData = await fetchCoffeeStores()
  const paths = coffeeStoresData.map(coffeeStore => {
    return {
      params: {
        id: String(coffeeStore.id)
      }
    }
  })
  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps(staticProps) {
  console.log("getStaticProps = ", staticProps)

  const { params } = staticProps
  const coffeeStoresData = await fetchCoffeeStores()

  return {
    props: {
      coffeeStore: coffeeStoresData.find(coffeeStore => Number(coffeeStore.id) === Number(params.id)) || {}
    }
  }
}

const CoffeeStore = props => {
  console.log("CoffeeStore props (SSG) = ", props)
  const router = useRouter()
  const id = router.query.id

  if (router.isFallback) {
    return <div>loading ...</div>
  }

  const [coffeeStore, setCoffeeStore] = useState(props.coffeeStore || {})
  const { state } = useContext(StoreContext)
  const { coffeeStores } = state

  const handleCreateCoffeeStore = async coffeeStore => {
    try {
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        body: JSON.stringify(coffeeStore),
        headers: { "Content-Type": "application/json" }
      })
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (isEmpty(props.coffeeStore)) {
      if (coffeeStores.length > 0) {
        console.log("asdasdasdas")
        const CoffeeStoreFromContext = coffeeStores.find(coffeeStore => Number(coffeeStore.id) === Number(id))
        if (CoffeeStoreFromContext) {
          setCoffeeStore(CoffeeStoreFromContext)
          handleCreateCoffeeStore(CoffeeStoreFromContext)
        }
      }
    } else {
      //SSG
      handleCreateCoffeeStore(props.coffeeStore)
    }
  }, [id, props, props.coffeeStore])

  const { name, address, neighbourhood, voting, imgURL } = coffeeStore
  console.log({ name })

  const [votingCount, setVotingCount] = useState()

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher)

  useEffect(() => {
    if (data && data.length > 0) {
      console.log("data", data[0])
      setCoffeeStore(data[0])
      setVotingCount(data[0].voting)
    }
  }, [data])

  if (error) return <p>Somithing went wrong while retrieving coffee store page </p>

  const handleUpvoteButton = async () => {
    try {
      const upVoteResponse = await fetch("/api/favoriteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id
        })
      })

      const upVoteResult = await upVoteResponse.json()
      console.log(upVoteResult)
      setVotingCount(votingCount + 1)
    } catch (error) {
      console.log("UpVoting Error", error)
    }
    console.log("up vote...")
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href={"/"}>
              <a>⬅️Back to home</a>
            </Link>
          </div>

          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>

          <Image
            src="/static/images/place.jpg"
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>

        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/location.svg" width={30} height={24} />
            <p className={styles.text}>{address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/pin.svg" width={30} height={24} />
            <p className={styles.text}>{neighbourhood}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" width={30} height={24} />
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up Vote
          </button>
        </div>
      </div>
    </div>
  )
}

export default CoffeeStore
