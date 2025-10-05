import React, { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import AQIBadge from '../components/ui/AQIBadge'
import { MapPin, Plus, Trash2, Star } from 'lucide-react'
import { useLocationStore, locationStore } from '../store/locationStore'
import { useCurrentAirQuality } from '../hooks/useAirQuality'

const LocationCard = ({ location, onSelect, onRemove, isActive }) => {
  const { data } = useCurrentAirQuality(location.lat, location.lon)

  return (
    <Card 
      hover
      className={`cursor-pointer transition-all ${
        isActive ? 'ring-2 ring-bright-cyan' : ''
      }`}
      onClick={() => onSelect(location)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-bright-cyan to-electric-blue flex items-center justify-center">
            {location.isPrimary ? (
              <Star className="w-5 h-5 text-white fill-white" />
            ) : (
              <MapPin className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{location.customName || location.name}</h3>
            <p className="text-sm text-white/60">{location.name}</p>
          </div>
        </div>
        {!location.isPrimary && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove(location.id)
            }}
            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
          >
            <Trash2 className="w-4 h-4 text-white/60 group-hover:text-red-400" />
          </button>
        )}
      </div>

      {data && (
        <>
          <div className="mb-3">
            <AQIBadge aqi={data.aqi} size="md" />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-white/60">Temperature</p>
              <p className="font-semibold text-white">{data.weather.temperature}°C</p>
            </div>
            <div>
              <p className="text-white/60">Dominant</p>
              <p className="font-semibold text-white">{data.dominantPollutant}</p>
            </div>
          </div>
        </>
      )}
    </Card>
  )
}

const DashboardLocations = ({ currentLocation, onLocationChange }) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newLocation, setNewLocation] = useState({ name: '', lat: '', lon: '' })
  
  const { savedLocations, addLocation, removeLocation, setCurrentLocation } = useLocationStore()

  const handleAddLocation = () => {
    if (newLocation.name && newLocation.lat && newLocation.lon) {
      const added = addLocation({
        name: newLocation.name,
        customName: newLocation.name,
        lat: parseFloat(newLocation.lat),
        lon: parseFloat(newLocation.lon),
      })
      setNewLocation({ name: '', lat: '', lon: '' })
      setShowAddForm(false)
      showToast.success(`${added.name} added successfully!`)
    }
  }

  const handleRemoveLocation = (id) => {
    removeLocation(id)
    showToast.success('Location removed')
  }
  
  const handleSelectLocation = (location) => {
    setCurrentLocation(location)
    if (onLocationChange) onLocationChange(location)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Locations</h1>
          <p className="text-white/60">Manage and monitor multiple locations</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-5 h-5 mr-2" />
          Add Location
        </Button>
      </div>

      {/* Add Location Form */}
      {showAddForm && (
        <Card>
          <h2 className="text-xl font-bold text-white mb-4">Add New Location</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">Location Name</label>
              <input
                type="text"
                value={newLocation.name}
                onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                placeholder="e.g., Home, Office"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-bright-cyan"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={newLocation.lat}
                  onChange={(e) => setNewLocation({ ...newLocation, lat: e.target.value })}
                  placeholder="37.7749"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-bright-cyan"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={newLocation.lon}
                  onChange={(e) => setNewLocation({ ...newLocation, lon: e.target.value })}
                  placeholder="-122.4194"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-bright-cyan"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddLocation}>Add Location</Button>
              <Button variant="secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Location Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedLocations.map((location) => (
          <LocationCard
            key={location.id}
            location={location}
            onSelect={onLocationChange}
            onRemove={handleRemoveLocation}
            isActive={currentLocation?.id === location.id}
          />
        ))}
      </div>

      {savedLocations.length === 0 && (
        <Card className="text-center py-12">
          <MapPin className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No locations saved</h3>
          <p className="text-white/60 mb-6">Add your first location to start monitoring</p>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Add Location
          </Button>
        </Card>
      )}
    </div>
  )
}

export default DashboardLocations