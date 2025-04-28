import requests
import sys
import uuid
from datetime import datetime

class BangladeshAcademicNetworkTester:
    def __init__(self, base_url="https://60033f48-a690-4b39-a4b4-35817b3748c7.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                if response.status_code != 204:  # No content
                    try:
                        return success, response.json()
                    except:
                        return success, {}
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

    def test_register_user(self):
        """Test user registration"""
        # Generate a unique email to avoid conflicts
        unique_id = datetime.now().strftime('%Y%m%d%H%M%S')
        test_email = f"test_user_{unique_id}@example.com"
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "register",
            200,
            data={
                "name": f"Test User {unique_id}",
                "email": test_email,
                "password": "TestPassword123!",
                "role": "user"
            }
        )
        
        if success:
            print(f"Created test user with email: {test_email}")
            return test_email, "TestPassword123!"
        return None, None

    def test_login(self, email, password):
        """Test login and get token"""
        # Using form data format for OAuth2PasswordRequestForm
        url = f"{self.api_url}/token"
        headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        data = {
            "username": email,
            "password": password
        }
        
        self.tests_run += 1
        print(f"\n🔍 Testing User Login...")
        
        try:
            response = requests.post(url, data=data, headers=headers)
            
            success = response.status_code == 200
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                response_data = response.json()
                self.token = response_data['access_token']
                self.user_id = response_data.get('user_id')
                print(f"Logged in as user ID: {self.user_id}")
                return True
            else:
                print(f"❌ Failed - Expected 200, got {response.status_code}")
                try:
                    error_detail = response.json().get('detail', 'No detail provided')
                    print(f"Error: {error_detail}")
                except:
                    print("Could not parse error response")
                return False
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False

    def test_get_academics(self, params=None):
        """Test getting academics with optional filters"""
        filter_desc = ", ".join([f"{k}={v}" for k, v in (params or {}).items()]) if params else "no filters"
        success, response = self.run_test(
            f"Get Academics (with {filter_desc})",
            "GET",
            "academics",
            200,
            params=params
        )
        
        if success:
            print(f"Found {len(response)} academics matching the criteria")
            return response
        return []

    def test_get_keywords(self):
        """Test getting all keywords"""
        success, response = self.run_test(
            "Get Keywords",
            "GET",
            "keywords",
            200
        )
        
        if success:
            print(f"Found {len(response)} keywords")
            return response
        return []

    def test_get_stats(self):
        """Test getting statistics"""
        # Test academics by city
        success1, city_stats = self.run_test(
            "Get Academics by City",
            "GET",
            "stats/academics-by-city",
            200
        )
        
        # Test academics by field
        success2, field_stats = self.run_test(
            "Get Academics by Field",
            "GET",
            "stats/academics-by-field",
            200
        )
        
        return success1 and success2, {"city_stats": city_stats, "field_stats": field_stats}

    def test_create_academic_profile(self):
        """Test creating an academic profile"""
        if not self.token or not self.user_id:
            print("❌ Cannot create profile: Not logged in")
            return False
        
        success, response = self.run_test(
            "Create Academic Profile",
            "POST",
            "academics",
            200,
            data={
                "user_id": self.user_id,
                "university": "Test University",
                "research_field": "Computer Science",
                "sub_field": "Artificial Intelligence",
                "keywords": ["AI", "Machine Learning"],
                "bio": "This is a test academic profile",
                "country": "Bangladesh",
                "city": "Dhaka",
                "latitude": 23.8103,
                "longitude": 90.4125,
                "contact_email": "test_academic@example.com",
                "profile_picture_url": "https://example.com/profile.jpg"
            }
        )
        
        if success:
            print(f"Created academic profile with ID: {response.get('id')}")
            return response.get('id')
        return None

def main():
    # Setup
    tester = BangladeshAcademicNetworkTester()
    
    # Test root endpoint
    if not tester.test_root_endpoint():
        print("❌ Root API test failed, stopping tests")
        return 1
    
    # Test registration
    email, password = tester.test_register_user()
    if not email:
        print("❌ Registration failed, stopping tests")
        return 1
    
    # Test login
    if not tester.test_login(email, password):
        print("❌ Login failed, stopping tests")
        return 1
    
    # Test getting academics (no filters)
    academics = tester.test_get_academics()
    
    # Test getting academics with research field filter
    filtered_academics = tester.test_get_academics({"research_field": "Computer Science"})
    
    # Test getting keywords
    keywords = tester.test_get_keywords()
    
    # Test getting stats
    stats_success, stats = tester.test_get_stats()
    
    # Test creating an academic profile
    profile_id = tester.test_create_academic_profile()
    
    # Print results
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())