import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

// Using a placeholder key for development purposes
// In production, this should be replaced with a valid API key and stored in environment variables
const GOOGLE_MAPS_API_KEY = 'AIzaSyD2ye0BEvMZZEMQ9LKQl6XQxLw7UiRZYXM'; // Mock API key for demonstration

const MapComponent = ({ academics = [], center = { lat: 23.6850, lng: 90.3563 }, zoom = 2 }) => {
  const [selectedAcademic, setSelectedAcademic] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const markersRef = useRef({});

  const mapContainerStyle = {
    width: '100%',
    height: '600px',
  };

  const options = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: true,
    fullscreenControl: true,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
      },
    ],
  };

  // Group academics by city to show count when zoomed out
  const groupByCity = useCallback(() => {
    if (!academics || academics.length === 0) return [];
    
    const groupedAcademics = {};
    
    academics.forEach(academic => {
      if (!academic || !academic.city || !academic.country) return;
      
      const key = `${academic.city}_${academic.country}`;
      if (!groupedAcademics[key]) {
        groupedAcademics[key] = {
          city: academic.city,
          country: academic.country,
          latitude: academic.latitude,
          longitude: academic.longitude,
          academics: [],
        };
      }
      groupedAcademics[key].academics.push(academic);
    });
    
    return Object.values(groupedAcademics);
  }, [academics]);

  const cityGroups = groupByCity();

  const handleMarkerClick = (academic) => {
    setSelectedAcademic(academic);
  };

  const handleInfoWindowClose = () => {
    setSelectedAcademic(null);
  };

  const handleViewProfile = (id) => {
    navigate(`/academics/${id}`);
  };

  const onMapLoad = (map) => {
    setMapInstance(map);
  };

  // Update markers when map zoom changes
  useEffect(() => {
    if (!mapInstance) return;

    const zoomChangedListener = mapInstance.addListener('zoom_changed', () => {
      const currentZoom = mapInstance.getZoom();
      // Adjust marker size based on zoom level
      Object.values(markersRef.current).forEach(marker => {
        if (marker && marker.setIcon) {
          const size = currentZoom > 5 ? 8 : 12; // Smaller when zoomed in
          marker.setIcon({
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: size,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          });
        }
      });
    });

    return () => {
      window.google.maps.event.removeListener(zoomChangedListener);
    };
  }, [mapInstance]);

  // Set marker ref when created
  const setMarkerRef = (id, marker) => {
    if (marker) {
      markersRef.current[id] = marker;
    }
  };

  if (!academics || academics.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No academics found for the selected criteria.</p>
      </div>
    );
  }

  return (
    <div className="map-container rounded-lg overflow-hidden shadow-lg">
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          options={options}
          onLoad={onMapLoad}
        >
          {cityGroups.map((group) => (
            <Marker
              key={`${group.city}_${group.country}`}
              position={{ lat: group.latitude, lng: group.longitude }}
              onClick={() => {
                // If zoomed in enough, show individual academics
                if (mapInstance && mapInstance.getZoom() > 5) {
                  if (group.academics.length === 1) {
                    handleMarkerClick(group.academics[0]);
                  } else {
                    // Center on this city and zoom in more
                    mapInstance.setCenter({ lat: group.latitude, lng: group.longitude });
                    mapInstance.setZoom(mapInstance.getZoom() + 1);
                  }
                } else {
                  // Show group info
                  setActiveInfoWindow({
                    position: { lat: group.latitude, lng: group.longitude },
                    content: (
                      <div>
                        <h3>{group.city}, {group.country}</h3>
                        <p>{group.academics.length} academics</p>
                        <button 
                          onClick={() => {
                            mapInstance.setCenter({ lat: group.latitude, lng: group.longitude });
                            mapInstance.setZoom(8);
                          }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Zoom in
                        </button>
                      </div>
                    )
                  });
                }
              }}
              onLoad={(marker) => setMarkerRef(`${group.city}_${group.country}`, marker)}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: group.academics.length > 5 ? 14 : (group.academics.length > 1 ? 10 : 8),
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
              }}
              label={group.academics.length > 1 ? {
                text: group.academics.length.toString(),
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold'
              } : null}
            />
          ))}

          {mapInstance && mapInstance.getZoom() > 7 && academics.map((academic) => (
            <Marker
              key={academic.id}
              position={{ lat: academic.latitude, lng: academic.longitude }}
              onClick={() => handleMarkerClick(academic)}
              onLoad={(marker) => setMarkerRef(academic.id, marker)}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
              }}
            />
          ))}

          {selectedAcademic && (
            <InfoWindow
              position={{ lat: selectedAcademic.latitude, lng: selectedAcademic.longitude }}
              onCloseClick={handleInfoWindowClose}
            >
              <div className="infowindow">
                <h3 className="text-md font-semibold">{selectedAcademic.name}</h3>
                <p className="text-sm text-gray-600">{selectedAcademic.university}</p>
                <p className="text-sm text-gray-600">{selectedAcademic.research_field}</p>
                <button
                  onClick={() => handleViewProfile(selectedAcademic.id)}
                  className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600"
                >
                  View Profile
                </button>
              </div>
            </InfoWindow>
          )}

          {activeInfoWindow && (
            <InfoWindow
              position={activeInfoWindow.position}
              onCloseClick={() => setActiveInfoWindow(null)}
            >
              <div className="infowindow">
                {activeInfoWindow.content}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapComponent;
