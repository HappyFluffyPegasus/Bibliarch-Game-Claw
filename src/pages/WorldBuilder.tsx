import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppStore } from '@/stores/appStore'
import { Plus, ChevronRight, ChevronDown, MapPin, Trash2 } from 'lucide-react'
import type { Location } from '@/types'

const locationTypes = [
  { value: 'world', label: 'World', icon: '🌍' },
  { value: 'continent', label: 'Continent', icon: '🗺️' },
  { value: 'country', label: 'Country', icon: '🏴' },
  { value: 'region', label: 'Region', icon: '🏞️' },
  { value: 'city', label: 'City', icon: '🏙️' },
  { value: 'building', label: 'Building', icon: '🏢' },
  { value: 'room', label: 'Room', icon: '🚪' }
]

export function WorldBuilder() {
  const { id } = useParams()
  const { locations, addLocation, deleteLocation, updateLocation } = useAppStore()
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null)
  const [showNewLocation, setShowNewLocation] = useState(false)
  const [newLocation, setNewLocation] = useState({
    name: '',
    type: 'world' as const,
    description: '',
    parentId: ''
  })
  
  const storyLocations = locations.filter((l) => l.storyId === id)
  const selectedLocation = storyLocations.find((l) => l.id === selectedLocationId)
  
  // Build hierarchy
  const rootLocations = storyLocations.filter((l) => !l.parentId)
  
  const getChildren = (parentId: string) => {
    return storyLocations.filter((l) => l.parentId === parentId)
  }
  
  const handleCreateLocation = () => {
    if (!newLocation.name.trim()) return
    
    addLocation({
      storyId: id!,
      name: newLocation.name,
      type: newLocation.type,
      description: newLocation.description,
      parentId: newLocation.parentId || undefined,
      children: []
    })
    
    setNewLocation({ name: '', type: 'world', description: '', parentId: '' })
    setShowNewLocation(false)
  }
  
  return (
    <div className="flex h-full">
      {/* Sidebar with location tree */}
      <div className="w-80 bg-slate-900 border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">World Map</h2>
            <button
              onClick={() => setShowNewLocation(true)}
              className="p-2 bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-2">
          {storyLocations.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-white/20" />
              <p className="text-white/40">No locations yet</p>
              <button
                onClick={() => setShowNewLocation(true)}
                className="mt-4 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
              >
                Create Your First Location
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {rootLocations.map((location) => (
                <LocationTreeItem
                  key={location.id}
                  location={location}
                  getChildren={getChildren}
                  selectedId={selectedLocationId}
                  onSelect={setSelectedLocationId}
                  level={0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 p-8">
        {selectedLocation ? (
          <div className="max-w-2xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">
                    {locationTypes.find((t) => t.value === selectedLocation.type)?.icon}
                  </span>
                  <input
                    type="text"
                    value={selectedLocation.name}
                    onChange={(e) => updateLocation(selectedLocation.id, { name: e.target.value })}
                    className="text-3xl font-bold bg-transparent border-none outline-none focus:border-b focus:border-purple-500"
                  />
                </div>
                <span className="text-white/50 capitalize ml-12">{selectedLocation.type}</span>
              </div>
              <button
                onClick={() => {
                  deleteLocation(selectedLocation.id)
                  setSelectedLocationId(null)
                }}
                className="p-2 text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 ml-12">
              <div>
                <label className="block text-sm text-white/60 mb-1">Description</label>
                <textarea
                  value={selectedLocation.description}
                  onChange={(e) => updateLocation(selectedLocation.id, { description: e.target.value })}
                  placeholder="Describe this location..."
                  className="w-full px-3 py-2 bg-white/5 rounded h-32 resize-none"
                />
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Sub-locations</h3>
                {getChildren(selectedLocation.id).length === 0 ? (
                  <p className="text-white/40">No sub-locations</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {getChildren(selectedLocation.id).map((child) => (
                      <button
                        key={child.id}
                        onClick={() => setSelectedLocationId(child.id)}
                        className="flex items-center gap-2 p-3 bg-white/5 rounded hover:bg-white/10 text-left"
                      >
                        <span>{locationTypes.find((t) => t.value === child.type)?.icon}</span>
                        <span>{child.name}</span>
                      </button>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => {
                    setNewLocation({ ...newLocation, parentId: selectedLocation.id })
                    setShowNewLocation(true)
                  }}
                  className="mt-3 flex items-center gap-2 px-4 py-2 bg-white/5 rounded hover:bg-white/10"
                >
                  <Plus className="w-4 h-4" />
                  Add Sub-location
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/40">Select a location or create a new one</p>
            </div>
          </div>
        )}
      </div>
      
      {/* New Location Modal */}
      {showNewLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Create New Location</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">Name</label>
                <input
                  type="text"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                  placeholder="Enter location name..."
                  className="w-full px-3 py-2 bg-white/5 rounded"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Type</label>
                <select
                  value={newLocation.type}
                  onChange={(e) => setNewLocation({ ...newLocation, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white/5 rounded"
                >
                  {locationTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Description</label>
                <textarea
                  value={newLocation.description}
                  onChange={(e) => setNewLocation({ ...newLocation, description: e.target.value })}
                  placeholder="Describe this location..."
                  className="w-full px-3 py-2 bg-white/5 rounded h-24 resize-none"
                />
              </div>
              {newLocation.parentId && (
                <div className="p-3 bg-purple-500/10 rounded">
                  <p className="text-sm text-purple-400">
                    Will be created inside: {storyLocations.find((l) => l.id === newLocation.parentId)?.name}
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowNewLocation(false)
                  setNewLocation({ name: '', type: 'world', description: '', parentId: '' })
                }}
                className="flex-1 px-4 py-2 border border-white/10 rounded hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateLocation}
                disabled={!newLocation.name.trim()}
                className="flex-1 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Recursive tree item component
function LocationTreeItem({
  location,
  getChildren,
  selectedId,
  onSelect,
  level
}: {
  location: Location
  getChildren: (id: string) => Location[]
  selectedId: string | null
  onSelect: (id: string) => void
  level: number
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const children = getChildren(location.id)
  const hasChildren = children.length > 0
  const isSelected = selectedId === location.id
  const typeInfo = locationTypes.find((t) => t.value === location.type)
  
  return (
    <div>
      <button
        onClick={() => onSelect(location.id)}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded text-left transition-colors ${
          isSelected ? 'bg-purple-600/30' : 'hover:bg-white/5'
        }`}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        {hasChildren ? (
          <span
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className="p-0.5 hover:bg-white/10 rounded cursor-pointer"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </span>
        ) : (
          <span className="w-5" />
        )}
        <span>{typeInfo?.icon}</span>
        <span className="truncate">{location.name}</span>
      </button>
      
      {isExpanded && hasChildren && (
        <div>
          {children.map((child) => (
            <LocationTreeItem
              key={child.id}
              location={child}
              getChildren={getChildren}
              selectedId={selectedId}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
