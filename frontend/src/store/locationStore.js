import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// This would use zustand if installed, but for now we'll use a simple store
// Using a simple object store since we may not have zustand installed yet

const createStore = (initialState) => {
  let state = initialState
  const listeners = new Set()

  const setState = (partial) => {
    state = { ...state, ...partial }
    listeners.forEach((listener) => listener(state))
  }

  const getState = () => state

  const subscribe = (listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  return { getState, setState, subscribe }
}

// Location store
export const locationStore = createStore({
  savedLocations: [
    {
      id: 'default',
      name: 'San Francisco',
      customName: 'Home',
      lat: 37.7749,
      lon: -122.4194,
      isPrimary: true,
    },
  ],
  currentLocation: null,
})

// Settings store
export const settingsStore = createStore({
  theme: 'dark',
  units: 'metric',
  language: 'en',
  notifications: {
    push: true,
    email: false,
    sms: false,
  },
  alertThreshold: 100,
})

// Helper hooks for React
import { useState, useEffect } from 'react'

export const useStore = (store, selector = (state) => state) => {
  const [state, setState] = useState(() => selector(store.getState()))

  useEffect(() => {
    const unsubscribe = store.subscribe((newState) => {
      setState(selector(newState))
    })
    return unsubscribe
  }, [store, selector])

  return state
}

export const useLocationStore = (selector) => useStore(locationStore, selector)
export const useSettingsStore = (selector) => useStore(settingsStore, selector)