import React, { createContext, useReducer } from "react"

export const ACTION_TYPES = {
  SET_COORDINATE: "SET_COORDINATE",
  SET_COFFEE_STORES: "SET_COFFEE_STORES"
}

const storeReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_COORDINATE: {
      return { ...state, coordinate: action.payload }
    }
    case ACTION_TYPES.SET_COFFEE_STORES: {
      return { ...state, coffeeStores: action.payload }
    }

    default: {
      throw new Error("Unhandled Action Type")
    }
  }
}

export const StoreContext = createContext()

const StoreProvider = ({ children }) => {
  const initalState = {
    coordinate: { lat: "", lon: "" },
    coffeeStores: []
  }

  const [state, dispatch] = useReducer(storeReducer, initalState)
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>
}

export default StoreProvider
