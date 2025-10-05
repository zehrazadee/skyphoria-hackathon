import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import { useSensors } from '../hooks/useAirQuality'
import Card from '../components/ui/Card'
import AQIBadge from '../components/ui/AQIBadge'
import { Layers, Maximize2 } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const DashboardMap = ({ currentLocation }) => {
  const [showHeatMap, setShowHeatMap] = useState(true)
  const [showSensors, setShowSensors] = useState(true)

  const { data: sensorsData } = useSensors(
    currentLocation?.lat || 37.7749,
    currentLocation?.lon || -122.4194,
    50
  )

  const center = [currentLocation?.lat || 37.7749, currentLocation?.lon || -122.4194]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Live Air Quality Map</h1>
          <p className="text-white/60">Interactive visualization of real-time air quality data</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHeatMap(!showHeatMap)}
            className={`px-4 py-2 rounded-lg transition-all ${
              showHeatMap 
                ? 'bg-bright-cyan text-white' 
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <Layers className="w-4 h-4 inline-block mr-2" />
            Heat Map
          </button>
          <button
            onClick={() => setShowSensors(!showSensors)}
            className={`px-4 py-2 rounded-lg transition-all ${
              showSensors 
                ? 'bg-bright-cyan text-white' 
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Sensors
          </button>
        </div>
      </div>

      {/* Map Container */}
      <Card className="p-0 overflow-hidden h-[600px]">
        <MapContainer
          center={center}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="map-tiles"
          />

          {/* Current Location Marker */}
          <Marker position={center}>
            <Popup>
              <div className="text-deep-space p-2">
                <p className="font-bold">{currentLocation?.name || 'Current Location'}</p>
                <p className="text-sm">Your selected location</p>
              </div>
            </Popup>
          </Marker>

          {/* Sensor Markers */}
          {showSensors && sensorsData?.sensors?.map((sensor) => (
            <Marker key={sensor.id} position={[sensor.lat, sensor.lon]}>
              <Popup>
                <div className="text-deep-space p-2">
                  <p className="font-bold mb-1">{sensor.name}</p>
                  <div className="mb-2">
                    <AQIBadge aqi={sensor.aqi} size="sm" showLabel={false} />
                    <span className="ml-2 text-sm">{sensor.category}</span>
                  </div>
                  <p className="text-xs text-gray-600">{sensor.type.toUpperCase()}</p>
                  <p className="text-xs text-gray-500">Updated {sensor.lastUpdate}</p>
                </div>
              </Popup>
              {showHeatMap && (
                <Circle
                  center={[sensor.lat, sensor.lon]}
                  radius={5000}
                  fillColor={sensor.aqi <= 50 ? '#00E676' : sensor.aqi <= 100 ? '#FFEB3B' : '#FF9800'}
                  fillOpacity={0.2}
                  stroke={false}
                />
              )}
            </Marker>
          ))}
        </MapContainer>
      </Card>

      {/* Map Legend */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">AQI Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            { range: '0-50', label: 'Good', color: '#00E676' },
            { range: '51-100', label: 'Moderate', color: '#FFEB3B' },
            { range: '101-150', label: 'Unhealthy (Sensitive)', color: '#FF9800' },
            { range: '151-200', label: 'Unhealthy', color: '#F44336' },
            { range: '201-300', label: 'Very Unhealthy', color: '#9C27B0' },
            { range: '301+', label: 'Hazardous', color: '#880E4F' },
          ].map((item) => (
            <div key={item.range} className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div>
                <p className="text-xs font-semibold text-white">{item.range}</p>
                <p className="text-xs text-white/60">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default DashboardMap