#!/usr/bin/env python3
"""
Comprehensive backend API test suite for Saishubh Holidays
Tests all public and admin endpoints with proper authentication
"""

import requests
import json
import sys

# Base URL from environment
BASE_URL = "https://travel-3d-cinema.preview.emergentagent.com/api"

# Admin credentials
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

# Test results tracking
test_results = []
admin_token = None
test_package_id = None
test_testimonial_id = None
test_gallery_id = None


def log_test(test_name, passed, details=""):
    """Log test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    test_results.append({"name": test_name, "passed": passed, "details": details})
    print(f"{status}: {test_name}")
    if details:
        print(f"   Details: {details}")


def test_health():
    """Test 1: GET /api/health"""
    try:
        resp = requests.get(f"{BASE_URL}/health", timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 200
            and data.get("ok") is True
            and data.get("service") == "saishubh-holidays-api"
        )
        log_test(
            "GET /api/health",
            passed,
            f"Status: {resp.status_code}, Response: {json.dumps(data)}"
        )
        return passed
    except Exception as e:
        log_test("GET /api/health", False, f"Exception: {str(e)}")
        return False


def test_get_packages():
    """Test 2: GET /api/packages - should return 12 packages"""
    global test_package_id
    try:
        resp = requests.get(f"{BASE_URL}/packages", timeout=10)
        data = resp.json()
        
        passed = resp.status_code == 200 and data.get("count") == 12
        
        if passed and data.get("packages"):
            # Verify package structure
            pkg = data["packages"][0]
            test_package_id = pkg.get("id")
            required_fields = [
                "id", "name", "category", "duration", "startingLocation",
                "bestTimeToVisit", "highlights", "itinerary", "inclusions",
                "exclusions", "gallery", "isActive"
            ]
            missing_fields = [f for f in required_fields if f not in pkg]
            if missing_fields:
                passed = False
                log_test(
                    "GET /api/packages",
                    False,
                    f"Missing fields: {missing_fields}"
                )
            else:
                log_test(
                    "GET /api/packages",
                    True,
                    f"Count: {data['count']}, First package ID: {test_package_id}"
                )
        else:
            log_test(
                "GET /api/packages",
                False,
                f"Status: {resp.status_code}, Count: {data.get('count')}"
            )
        return passed
    except Exception as e:
        log_test("GET /api/packages", False, f"Exception: {str(e)}")
        return False


def test_get_packages_pilgrimage():
    """Test 3: GET /api/packages?category=Pilgrimage - should return 6"""
    try:
        resp = requests.get(f"{BASE_URL}/packages?category=Pilgrimage", timeout=10)
        data = resp.json()
        passed = resp.status_code == 200 and data.get("count") == 6
        log_test(
            "GET /api/packages?category=Pilgrimage",
            passed,
            f"Status: {resp.status_code}, Count: {data.get('count')}"
        )
        return passed
    except Exception as e:
        log_test("GET /api/packages?category=Pilgrimage", False, f"Exception: {str(e)}")
        return False


def test_get_packages_domestic():
    """Test 4: GET /api/packages?category=Domestic - should return 6"""
    try:
        resp = requests.get(f"{BASE_URL}/packages?category=Domestic", timeout=10)
        data = resp.json()
        passed = resp.status_code == 200 and data.get("count") == 6
        log_test(
            "GET /api/packages?category=Domestic",
            passed,
            f"Status: {resp.status_code}, Count: {data.get('count')}"
        )
        return passed
    except Exception as e:
        log_test("GET /api/packages?category=Domestic", False, f"Exception: {str(e)}")
        return False


def test_get_package_by_id():
    """Test 5: GET /api/packages/:id with valid ID"""
    if not test_package_id:
        log_test("GET /api/packages/:id (valid)", False, "No package ID available")
        return False
    
    try:
        resp = requests.get(f"{BASE_URL}/packages/{test_package_id}", timeout=10)
        data = resp.json()
        passed = resp.status_code == 200 and "package" in data
        log_test(
            "GET /api/packages/:id (valid)",
            passed,
            f"Status: {resp.status_code}, Package name: {data.get('package', {}).get('name')}"
        )
        return passed
    except Exception as e:
        log_test("GET /api/packages/:id (valid)", False, f"Exception: {str(e)}")
        return False


def test_get_package_by_invalid_id():
    """Test 6: GET /api/packages/:id with bogus ID - should return 404"""
    try:
        bogus_id = "507f1f77bcf86cd799439011"  # Valid 24-char hex but non-existent
        resp = requests.get(f"{BASE_URL}/packages/{bogus_id}", timeout=10)
        passed = resp.status_code == 404
        log_test(
            "GET /api/packages/:id (invalid)",
            passed,
            f"Status: {resp.status_code}"
        )
        return passed
    except Exception as e:
        log_test("GET /api/packages/:id (invalid)", False, f"Exception: {str(e)}")
        return False


def test_get_testimonials():
    """Test 7: GET /api/testimonials - should return 5 active testimonials"""
    try:
        resp = requests.get(f"{BASE_URL}/testimonials", timeout=10)
        data = resp.json()
        passed = resp.status_code == 200 and data.get("count") == 5
        
        # Verify all are active
        if passed and data.get("testimonials"):
            all_active = all(t.get("isActive") for t in data["testimonials"])
            if not all_active:
                passed = False
                log_test("GET /api/testimonials", False, "Not all testimonials are active")
            else:
                log_test("GET /api/testimonials", True, f"Count: {data['count']}, all active")
        else:
            log_test("GET /api/testimonials", False, f"Status: {resp.status_code}, Count: {data.get('count')}")
        return passed
    except Exception as e:
        log_test("GET /api/testimonials", False, f"Exception: {str(e)}")
        return False


def test_get_gallery():
    """Test 8: GET /api/gallery - should return 5 items"""
    try:
        resp = requests.get(f"{BASE_URL}/gallery", timeout=10)
        data = resp.json()
        passed = resp.status_code == 200 and data.get("count") == 5
        log_test(
            "GET /api/gallery",
            passed,
            f"Status: {resp.status_code}, Count: {data.get('count')}"
        )
        return passed
    except Exception as e:
        log_test("GET /api/gallery", False, f"Exception: {str(e)}")
        return False


def test_get_gallery_pilgrimage():
    """Test 9: GET /api/gallery?category=Pilgrimage"""
    try:
        resp = requests.get(f"{BASE_URL}/gallery?category=Pilgrimage", timeout=10)
        data = resp.json()
        passed = resp.status_code == 200 and data.get("count") == 3
        log_test(
            "GET /api/gallery?category=Pilgrimage",
            passed,
            f"Status: {resp.status_code}, Count: {data.get('count')}"
        )
        return passed
    except Exception as e:
        log_test("GET /api/gallery?category=Pilgrimage", False, f"Exception: {str(e)}")
        return False


def test_post_enquiry_valid():
    """Test 10: POST /api/enquiry with valid data"""
    try:
        payload = {
            "name": "Test User",
            "phone": "+91 9945883774",
            "email": "test@test.com",
            "message": "Interested in Bali",
            "packageName": "Mysore Sightseeing - 1 Day"
        }
        resp = requests.post(f"{BASE_URL}/enquiry", json=payload, timeout=10)
        data = resp.json()
        passed = resp.status_code == 201 and data.get("ok") is True and "enquiry" in data
        log_test(
            "POST /api/enquiry (valid)",
            passed,
            f"Status: {resp.status_code}, Enquiry ID: {data.get('enquiry', {}).get('id')}"
        )
        return passed
    except Exception as e:
        log_test("POST /api/enquiry (valid)", False, f"Exception: {str(e)}")
        return False


def test_post_enquiry_missing_phone():
    """Test 11: POST /api/enquiry with missing phone - should return 400"""
    try:
        payload = {"name": "NoPhone"}
        resp = requests.post(f"{BASE_URL}/enquiry", json=payload, timeout=10)
        passed = resp.status_code == 400
        log_test(
            "POST /api/enquiry (missing phone)",
            passed,
            f"Status: {resp.status_code}"
        )
        return passed
    except Exception as e:
        log_test("POST /api/enquiry (missing phone)", False, f"Exception: {str(e)}")
        return False


def test_post_enquiry_invalid_email():
    """Test 12: POST /api/enquiry with invalid email - should return 400"""
    try:
        payload = {
            "name": "X",
            "phone": "9999999999",
            "email": "not-an-email"
        }
        resp = requests.post(f"{BASE_URL}/enquiry", json=payload, timeout=10)
        passed = resp.status_code == 400
        log_test(
            "POST /api/enquiry (invalid email)",
            passed,
            f"Status: {resp.status_code}"
        )
        return passed
    except Exception as e:
        log_test("POST /api/enquiry (invalid email)", False, f"Exception: {str(e)}")
        return False


def test_admin_login_success():
    """Test 13: POST /api/admin/login with valid credentials"""
    global admin_token
    try:
        payload = {"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD}
        resp = requests.post(f"{BASE_URL}/admin/login", json=payload, timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 200
            and "token" in data
            and "admin" in data
        )
        if passed:
            admin_token = data["token"]
            log_test(
                "POST /api/admin/login (valid)",
                True,
                f"Status: {resp.status_code}, Token received"
            )
        else:
            log_test(
                "POST /api/admin/login (valid)",
                False,
                f"Status: {resp.status_code}, Response: {json.dumps(data)}"
            )
        return passed
    except Exception as e:
        log_test("POST /api/admin/login (valid)", False, f"Exception: {str(e)}")
        return False


def test_admin_login_wrong_password():
    """Test 14: POST /api/admin/login with wrong password - should return 401"""
    try:
        payload = {"username": ADMIN_USERNAME, "password": "WRONG"}
        resp = requests.post(f"{BASE_URL}/admin/login", json=payload, timeout=10)
        passed = resp.status_code == 401
        log_test(
            "POST /api/admin/login (wrong password)",
            passed,
            f"Status: {resp.status_code}"
        )
        return passed
    except Exception as e:
        log_test("POST /api/admin/login (wrong password)", False, f"Exception: {str(e)}")
        return False


def test_admin_login_missing_fields():
    """Test 15: POST /api/admin/login with missing fields - should return 400"""
    try:
        payload = {}
        resp = requests.post(f"{BASE_URL}/admin/login", json=payload, timeout=10)
        passed = resp.status_code == 400
        log_test(
            "POST /api/admin/login (missing fields)",
            passed,
            f"Status: {resp.status_code}"
        )
        return passed
    except Exception as e:
        log_test("POST /api/admin/login (missing fields)", False, f"Exception: {str(e)}")
        return False


def test_admin_enquiries_no_auth():
    """Test 16: GET /api/admin/enquiries without auth - should return 401"""
    try:
        resp = requests.get(f"{BASE_URL}/admin/enquiries", timeout=10)
        passed = resp.status_code == 401
        log_test(
            "GET /api/admin/enquiries (no auth)",
            passed,
            f"Status: {resp.status_code}"
        )
        return passed
    except Exception as e:
        log_test("GET /api/admin/enquiries (no auth)", False, f"Exception: {str(e)}")
        return False


def test_admin_enquiries_invalid_token():
    """Test 17: GET /api/admin/enquiries with invalid token - should return 401"""
    try:
        headers = {"Authorization": "Bearer INVALID_TOKEN"}
        resp = requests.get(f"{BASE_URL}/admin/enquiries", headers=headers, timeout=10)
        passed = resp.status_code == 401
        log_test(
            "GET /api/admin/enquiries (invalid token)",
            passed,
            f"Status: {resp.status_code}"
        )
        return passed
    except Exception as e:
        log_test("GET /api/admin/enquiries (invalid token)", False, f"Exception: {str(e)}")
        return False


def test_admin_enquiries_valid():
    """Test 18: GET /api/admin/enquiries with valid token"""
    if not admin_token:
        log_test("GET /api/admin/enquiries (valid)", False, "No admin token available")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        resp = requests.get(f"{BASE_URL}/admin/enquiries", headers=headers, timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 200
            and "total" in data
            and "count" in data
            and "enquiries" in data
        )
        log_test(
            "GET /api/admin/enquiries (valid)",
            passed,
            f"Status: {resp.status_code}, Total: {data.get('total')}, Count: {data.get('count')}"
        )
        return passed
    except Exception as e:
        log_test("GET /api/admin/enquiries (valid)", False, f"Exception: {str(e)}")
        return False


def test_admin_packages_non_allowed_name():
    """Test 19: POST /api/admin/packages with non-allowed name - should return 400"""
    if not admin_token:
        log_test("POST /api/admin/packages (non-allowed name)", False, "No admin token")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {
            "name": "Bali Holiday",
            "category": "International",
            "duration": "5 Days",
            "startingLocation": "Bengaluru",
            "bestTimeToVisit": "Year-round",
            "highlights": [],
            "itinerary": [],
            "inclusions": [],
            "exclusions": [],
            "gallery": []
        }
        resp = requests.post(f"{BASE_URL}/admin/packages", json=payload, headers=headers, timeout=10)
        data = resp.json()
        passed = resp.status_code == 400 and "allowedForCategory" in data
        log_test(
            "POST /api/admin/packages (non-allowed name)",
            passed,
            f"Status: {resp.status_code}, Has allowedForCategory: {'allowedForCategory' in data}"
        )
        return passed
    except Exception as e:
        log_test("POST /api/admin/packages (non-allowed name)", False, f"Exception: {str(e)}")
        return False


def test_admin_packages_duplicate_name():
    """Test 20: POST /api/admin/packages with existing allowed name - should return 409"""
    if not admin_token:
        log_test("POST /api/admin/packages (duplicate)", False, "No admin token")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {
            "name": "Mysore Sightseeing - 1 Day",
            "category": "Domestic",
            "duration": "1 Day",
            "startingLocation": "Bengaluru",
            "bestTimeToVisit": "Oct-Mar",
            "highlights": [],
            "itinerary": [],
            "inclusions": [],
            "exclusions": [],
            "gallery": []
        }
        resp = requests.post(f"{BASE_URL}/admin/packages", json=payload, headers=headers, timeout=10)
        passed = resp.status_code == 409
        log_test(
            "POST /api/admin/packages (duplicate)",
            passed,
            f"Status: {resp.status_code}"
        )
        return passed
    except Exception as e:
        log_test("POST /api/admin/packages (duplicate)", False, f"Exception: {str(e)}")
        return False


def test_admin_packages_update():
    """Test 21: PUT /api/admin/packages/:id with valid update"""
    if not admin_token or not test_package_id:
        log_test("PUT /api/admin/packages/:id", False, "No admin token or package ID")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {"duration": "1 Day Updated"}
        resp = requests.put(
            f"{BASE_URL}/admin/packages/{test_package_id}",
            json=payload,
            headers=headers,
            timeout=10
        )
        data = resp.json()
        passed = resp.status_code == 200 and "package" in data
        log_test(
            "PUT /api/admin/packages/:id (valid update)",
            passed,
            f"Status: {resp.status_code}"
        )
        
        # Restore original duration
        if passed:
            restore_payload = {"duration": "1 Day"}
            requests.put(
                f"{BASE_URL}/admin/packages/{test_package_id}",
                json=restore_payload,
                headers=headers,
                timeout=10
            )
        
        return passed
    except Exception as e:
        log_test("PUT /api/admin/packages/:id (valid update)", False, f"Exception: {str(e)}")
        return False


def test_admin_packages_update_non_allowed_name():
    """Test 22: PUT /api/admin/packages/:id with non-allowed name - should return 400"""
    if not admin_token or not test_package_id:
        log_test("PUT /api/admin/packages/:id (non-allowed name)", False, "No admin token or package ID")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {"name": "XYZ Random"}
        resp = requests.put(
            f"{BASE_URL}/admin/packages/{test_package_id}",
            json=payload,
            headers=headers,
            timeout=10
        )
        passed = resp.status_code == 400
        log_test(
            "PUT /api/admin/packages/:id (non-allowed name)",
            passed,
            f"Status: {resp.status_code}"
        )
        return passed
    except Exception as e:
        log_test("PUT /api/admin/packages/:id (non-allowed name)", False, f"Exception: {str(e)}")
        return False


def test_admin_packages_delete_invalid_id():
    """Test 23: DELETE /api/admin/packages/:id with bogus ID - should return 404"""
    if not admin_token:
        log_test("DELETE /api/admin/packages/:id (invalid)", False, "No admin token")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        bogus_id = "507f1f77bcf86cd799439011"
        resp = requests.delete(
            f"{BASE_URL}/admin/packages/{bogus_id}",
            headers=headers,
            timeout=10
        )
        passed = resp.status_code == 404
        log_test(
            "DELETE /api/admin/packages/:id (invalid)",
            passed,
            f"Status: {resp.status_code}"
        )
        return passed
    except Exception as e:
        log_test("DELETE /api/admin/packages/:id (invalid)", False, f"Exception: {str(e)}")
        return False


def test_admin_testimonials_create():
    """Test 24: POST /api/admin/testimonials with valid data"""
    global test_testimonial_id
    if not admin_token:
        log_test("POST /api/admin/testimonials (valid)", False, "No admin token")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {
            "name": "Test",
            "message": "Great",
            "rating": 5,
            "location": "BLR"
        }
        resp = requests.post(f"{BASE_URL}/admin/testimonials", json=payload, headers=headers, timeout=10)
        data = resp.json()
        passed = resp.status_code == 201 and "testimonial" in data
        if passed:
            test_testimonial_id = data["testimonial"].get("id")
            log_test(
                "POST /api/admin/testimonials (valid)",
                True,
                f"Status: {resp.status_code}, ID: {test_testimonial_id}"
            )
        else:
            log_test(
                "POST /api/admin/testimonials (valid)",
                False,
                f"Status: {resp.status_code}"
            )
        return passed
    except Exception as e:
        log_test("POST /api/admin/testimonials (valid)", False, f"Exception: {str(e)}")
        return False


def test_admin_testimonials_invalid_rating():
    """Test 25: POST /api/admin/testimonials with rating=6 - should return 400"""
    if not admin_token:
        log_test("POST /api/admin/testimonials (invalid rating)", False, "No admin token")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {
            "name": "Test",
            "message": "Great",
            "rating": 6,
            "location": "BLR"
        }
        resp = requests.post(f"{BASE_URL}/admin/testimonials", json=payload, headers=headers, timeout=10)
        passed = resp.status_code == 400
        log_test(
            "POST /api/admin/testimonials (invalid rating)",
            passed,
            f"Status: {resp.status_code}"
        )
        return passed
    except Exception as e:
        log_test("POST /api/admin/testimonials (invalid rating)", False, f"Exception: {str(e)}")
        return False


def test_admin_testimonials_update():
    """Test 26: PUT /api/admin/testimonials/:id to deactivate"""
    if not admin_token or not test_testimonial_id:
        log_test("PUT /api/admin/testimonials/:id", False, "No admin token or testimonial ID")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {"isActive": False}
        resp = requests.put(
            f"{BASE_URL}/admin/testimonials/{test_testimonial_id}",
            json=payload,
            headers=headers,
            timeout=10
        )
        passed = resp.status_code == 200
        log_test(
            "PUT /api/admin/testimonials/:id",
            passed,
            f"Status: {resp.status_code}"
        )
        return passed
    except Exception as e:
        log_test("PUT /api/admin/testimonials/:id", False, f"Exception: {str(e)}")
        return False


def test_admin_testimonials_delete():
    """Test 27: DELETE /api/admin/testimonials/:id"""
    if not admin_token or not test_testimonial_id:
        log_test("DELETE /api/admin/testimonials/:id", False, "No admin token or testimonial ID")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        resp = requests.delete(
            f"{BASE_URL}/admin/testimonials/{test_testimonial_id}",
            headers=headers,
            timeout=10
        )
        passed = resp.status_code == 200
        log_test(
            "DELETE /api/admin/testimonials/:id",
            passed,
            f"Status: {resp.status_code}"
        )
        return passed
    except Exception as e:
        log_test("DELETE /api/admin/testimonials/:id", False, f"Exception: {str(e)}")
        return False


def test_admin_gallery_create():
    """Test 28: POST /api/admin/gallery with valid data"""
    global test_gallery_id
    if not admin_token:
        log_test("POST /api/admin/gallery (valid)", False, "No admin token")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {
            "imageUrl": "https://images.unsplash.com/photo-test.jpg",
            "category": "Test"
        }
        resp = requests.post(f"{BASE_URL}/admin/gallery", json=payload, headers=headers, timeout=10)
        data = resp.json()
        passed = resp.status_code == 201 and "gallery" in data
        if passed:
            test_gallery_id = data["gallery"].get("id")
            log_test(
                "POST /api/admin/gallery (valid)",
                True,
                f"Status: {resp.status_code}, ID: {test_gallery_id}"
            )
        else:
            log_test(
                "POST /api/admin/gallery (valid)",
                False,
                f"Status: {resp.status_code}"
            )
        return passed
    except Exception as e:
        log_test("POST /api/admin/gallery (valid)", False, f"Exception: {str(e)}")
        return False


def test_admin_gallery_invalid_url():
    """Test 29: POST /api/admin/gallery with invalid URL - should return 400"""
    if not admin_token:
        log_test("POST /api/admin/gallery (invalid URL)", False, "No admin token")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {
            "imageUrl": "not-a-url",
            "category": "Test"
        }
        resp = requests.post(f"{BASE_URL}/admin/gallery", json=payload, headers=headers, timeout=10)
        passed = resp.status_code == 400
        log_test(
            "POST /api/admin/gallery (invalid URL)",
            passed,
            f"Status: {resp.status_code}"
        )
        return passed
    except Exception as e:
        log_test("POST /api/admin/gallery (invalid URL)", False, f"Exception: {str(e)}")
        return False


def test_admin_gallery_delete():
    """Test 30: DELETE /api/admin/gallery/:id"""
    if not admin_token or not test_gallery_id:
        log_test("DELETE /api/admin/gallery/:id", False, "No admin token or gallery ID")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        resp = requests.delete(
            f"{BASE_URL}/admin/gallery/{test_gallery_id}",
            headers=headers,
            timeout=10
        )
        passed = resp.status_code == 200
        log_test(
            "DELETE /api/admin/gallery/:id",
            passed,
            f"Status: {resp.status_code}"
        )
        return passed
    except Exception as e:
        log_test("DELETE /api/admin/gallery/:id", False, f"Exception: {str(e)}")
        return False


def print_summary():
    """Print test summary"""
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed = sum(1 for t in test_results if t["passed"])
    failed = sum(1 for t in test_results if not t["passed"])
    total = len(test_results)
    
    print(f"\nTotal Tests: {total}")
    print(f"Passed: {passed} ✅")
    print(f"Failed: {failed} ❌")
    print(f"Success Rate: {(passed/total*100):.1f}%\n")
    
    if failed > 0:
        print("Failed Tests:")
        for t in test_results:
            if not t["passed"]:
                print(f"  ❌ {t['name']}")
                if t["details"]:
                    print(f"     {t['details']}")
    
    print("="*80)
    return failed == 0


def main():
    """Run all tests"""
    print("="*80)
    print("SAISHUBH HOLIDAYS BACKEND API TEST SUITE")
    print("="*80)
    print(f"Base URL: {BASE_URL}\n")
    
    # Public API tests
    print("\n--- PUBLIC API TESTS ---\n")
    test_health()
    test_get_packages()
    test_get_packages_pilgrimage()
    test_get_packages_domestic()
    test_get_package_by_id()
    test_get_package_by_invalid_id()
    test_get_testimonials()
    test_get_gallery()
    test_get_gallery_pilgrimage()
    test_post_enquiry_valid()
    test_post_enquiry_missing_phone()
    test_post_enquiry_invalid_email()
    
    # Admin authentication tests
    print("\n--- ADMIN AUTHENTICATION TESTS ---\n")
    test_admin_login_success()
    test_admin_login_wrong_password()
    test_admin_login_missing_fields()
    test_admin_enquiries_no_auth()
    test_admin_enquiries_invalid_token()
    test_admin_enquiries_valid()
    
    # Admin package enforcement tests
    print("\n--- ADMIN PACKAGE ENFORCEMENT TESTS ---\n")
    test_admin_packages_non_allowed_name()
    test_admin_packages_duplicate_name()
    test_admin_packages_update()
    test_admin_packages_update_non_allowed_name()
    test_admin_packages_delete_invalid_id()
    
    # Admin testimonials tests
    print("\n--- ADMIN TESTIMONIALS TESTS ---\n")
    test_admin_testimonials_create()
    test_admin_testimonials_invalid_rating()
    test_admin_testimonials_update()
    test_admin_testimonials_delete()
    
    # Admin gallery tests
    print("\n--- ADMIN GALLERY TESTS ---\n")
    test_admin_gallery_create()
    test_admin_gallery_invalid_url()
    test_admin_gallery_delete()
    
    # Print summary
    all_passed = print_summary()
    
    sys.exit(0 if all_passed else 1)


if __name__ == "__main__":
    main()
