/**
 * Application State Context
 */

import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'

type AppContextType = {
  isAuthenticated: boolean
  setAuthenticated?: Dispatch<SetStateAction<boolean>>
}

const AppContext = createContext<AppContextType>({ isAuthenticated: false })

type Props = {
  children?: JSX.Element
}

export default function AppContextComp({ children }: Props): JSX.Element {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false)

  return (
    <AppContext.Provider value={{ isAuthenticated: isAuthenticated, setAuthenticated: setAuthenticated }}>
      {children}
    </AppContext.Provider>
  )
}

// Custom hook that shorthands the context!
export const useAppState = () => useContext(AppContext)
