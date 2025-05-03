import requests
import sys
import os
from datetime import datetime

class GlobeVisualizationTester:
    def __init__(self, base_url="https://8befc1f2-b9a6-4acc-8420-8771f7c1c66f.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json().get('detail', 'No detail provided')
                    print(f"Error: {error_detail}")
                except:
                    print("Could not parse error response")
                return False, {}
                
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        success, response = self.run_test(
            "Root API Endpoint",
            "GET",
            "",
            200
        )
        return success

    def test_globe_data(self):
        """Test the globe data endpoint"""
        success, response = self.run_test(
            "Globe Data Endpoint",
            "GET",
            "globe-data",
            200
        )
        
        if success:
            print(f"Retrieved {len(response)} data points for the globe visualization")
            
            # Check if the data points have the expected color scheme properties
            # We're looking for green colors instead of blue
            green_colors_found = False
            for point in response:
                if "color" in point and "green" in str(point["color"]).lower():
                    green_colors_found = True
                    print(f"✅ Found green color in data point: {point['color']}")
                    break
            
            if not green_colors_found:
                print("⚠️ No explicit green colors found in the globe data. UI may be handling colors.")
        
        return success, response

def main():
    tester = GlobeVisualizationTester()
    
    # Test root endpoint
    if not tester.test_root_endpoint():
        print("❌ Root API test failed, stopping tests")
        return 1
    
    # Test globe data endpoint
    success, globe_data = tester.test_globe_data()
    
    # Print results
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())