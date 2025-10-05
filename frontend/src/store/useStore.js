import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Location Store with persistence
export const useLocationStore = create(
  persist(
    (set, get) => ({
      savedLocations: [
        {
          id: 'default',
          name: 'San Francisco',
          customName: 'Home',
          lat: 37.7749,
          lon: -122.4194,
          isPrimary: true,
          addedAt: new Date().toISOString(),
        },
      ],
      currentLocation: null,
      
      addLocation: (location) => {
        const locations = get().savedLocations
        const newLocation = {
          ...location,
          id: `loc_${Date.now()}`,
          addedAt: new Date().toISOString(),
          isPrimary: locations.length === 0,
        }
        set({ savedLocations: [...locations, newLocation] })
        return newLocation
      },
      
      removeLocation: (id) => {
        const locations = get().savedLocations.filter(loc => loc.id !== id)
        set({ savedLocations: locations })
      },
      
      updateLocation: (id, updates) => {
        const locations = get().savedLocations.map(loc => 
          loc.id === id ? { ...loc, ...updates } : loc
        )
        set({ savedLocations: locations })
      },
      
      setCurrentLocation: (location) => set({ currentLocation: location }),
      
      setPrimaryLocation: (id) => {
        const locations = get().savedLocations.map(loc => ({
          ...loc,
          isPrimary: loc.id === id
        }))
        set({ savedLocations: locations })
      },
    }),
    {
      name: 'skyphoria-locations',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Settings Store with persistence
export const useSettingsStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      units: 'metric',
      language: 'en',
      notifications: {
        push: true,
        email: false,
        sms: false,
      },
      alertThreshold: 100,
      accessibility: {
        reducedMotion: false,
        highContrast: false,
        fontSize: 'medium',
      },
      
      setTheme: (theme) => set({ theme }),
      setUnits: (units) => set({ units }),
      setLanguage: (language) => set({ language }),
      setNotifications: (notifications) => set({ notifications }),
      setAlertThreshold: (threshold) => set({ alertThreshold: threshold }),
      setAccessibility: (accessibility) => set({ accessibility }),
      
      updateSetting: (key, value) => set({ [key]: value }),
    }),
    {
      name: 'skyphoria-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// UI Store (non-persistent)
export const useUIStore = create((set) => ({
  sidebarCollapsed: false,
  showSearchModal: false,
  activeModal: null,
  toast: null,
  
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setShowSearchModal: (show) => set({ showSearchModal: show }),
  setActiveModal: (modal) => set({ activeModal: modal }),
  showToast: (toast) => set({ toast }),
  clearToast: () => set({ toast: null }),
}))