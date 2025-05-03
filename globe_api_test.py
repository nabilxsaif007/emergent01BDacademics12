import requests
import sys
import json

def test_globe_data(base_url):
    """Test the globe-data endpoint"""
    url = f"{base_url}/api/globe-data"
    headers = {'Content-Type': 'application/json'}
    
    print(f"\n🔍 Testing Globe Data API...")
    print(f"URL: {url}")
    
    try:
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            print(f"✅ Passed - Status: {response.status_code}")
            data = response.json()
            
            # Validate the response structure
            if not isinstance(data, list):
                print("❌ Failed - Expected a list of academics")
                return False
            
            if len(data) == 0:
                print("❌ Failed - Expected non-empty list of academics")
                return False
            
            # Check if the first item has the expected fields
            first_item = data[0]
            required_fields = ["id", "name", "university", "field", "country", "city", "lat", "lng"]
            
            missing_fields = [field for field in required_fields if field not in first_item]
            if missing_fields:
                print(f"❌ Failed - Missing required fields: {', '.join(missing_fields)}")
                return False
            
            print(f"✅ Successfully retrieved {len(data)} academics")
            print(f"✅ Sample academic: {first_item['name']} from {first_item['university']}")
            
            # Print a few sample items
            print("\nSample academics data:")
            for i, academic in enumerate(data[:3]):  # Show first 3 academics
                print(f"{i+1}. {academic['name']} - {academic['university']} - {academic['field']}")
            
            return True
        else:
            print(f"❌ Failed - Expected 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False

    except Exception as e:
        print(f"❌ Failed - Error: {str(e)}")
        return False

def main():
    # Get the backend URL from the frontend .env file
    with open('/app/frontend/.env', 'r') as f:
        for line in f:
            if 'REACT_APP_BACKEND_URL' in line:
                backend_url = line.split('=')[1].strip()
                break
    
    print(f"Using backend URL: {backend_url}")
    
    # Run the globe data test
    success = test_globe_data(backend_url)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())