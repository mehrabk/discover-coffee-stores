import React, { useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Head from "next/head"
import Image from "next/image"
import cls from "classnames"

import styles from "../../styles/coffee-store.module.css"
import { fetchCoffeeStores } from "../../lib/coffee-stores"
import { StoreContext } from "../../store/store-context"
import { isEmpty } from "../../utils"

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
        body: JSON.stringify({
          id: coffeeStore.id,
          name: coffeeStore.poi.name,
          address: coffeeStore.address.freeformAddress,
          neighbourhood: coffeeStore.info || "",
          imgURL: "http://image.com",
          voting: 0
        }),
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
    }
  }, [id])

  const { address, poi, info } = coffeeStore

  const handleUpvoteButton = () => {
    console.log("up vote...")
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{poi?.name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href={"/"}>
              <a>⬅️Back to home</a>
            </Link>
          </div>

          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{poi?.name}</h1>
          </div>

          <Image
            src="/static/images/place.jpg"
            width={600}
            height={360}
            className={styles.storeImg}
            alt={poi?.name}
          />
        </div>

        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/location.svg" width={30} height={24} />
            <p className={styles.text}>{address?.freeformAddress}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/pin.svg" width={30} height={24} />
            <p className={styles.text}>{info}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" width={30} height={24} />
            <p className={styles.text}>1</p>
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
