#!/usr/bin/env python3
"""
Backend Security Testing for Saishubh Holidays
Tests the new security hardening changes:
- Cookie-only HttpOnly authentication
- JWT secret hardening (no fallback)
- Rate limiting on login and enquiry
- SVG upload blocking
"""

import requests
import jwt
import time
import io
from datetime import datetime, timedelta

# Base URL from .env
BASE_URL = "https://travel-3d-cinema.preview.emergentagent.com/api"

# Admin credentials (new rotated password)
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "Saishubh#VlOkNvW50UOp"
OLD_PASSWORD = "admin123"

# Test results
results = {
    "passed": 0,
    "failed": 0,
    "tests": []
}

def log_test(name, passed, details=""):
    """Log test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {name}")
    if details:
        print(f"  Details: {details}")
    results["tests"].append({"name": name, "passed": passed, "details": details})
    if passed:
        results["passed"] += 1
    else:
        results["failed"] += 1

def print_summary():
    """Print test summary"""
    print("\n" + "="*80)
    print(f"BACKEND SECURITY TEST SUMMARY")
    print(f"Total: {results['passed'] + results['failed']} | Passed: {results['passed']} | Failed: {results['failed']}")
    print("="*80)
    if results["failed"] > 0:
        print("\nFailed Tests:")
        for test in results["tests"]:
            if not test["passed"]:
                print(f"  ❌ {test['name']}")
                if test["details"]:
                    print(f"     {test['details']}")

# ============================================================================
# SEC-001: Cookie-Only HttpOnly Authentication
# ============================================================================

def test_login_with_new_password():
    """Test login with new rotated password"""
    print("\n[SEC-001] Testing login with new password...")
    try:
        session = requests.Session()
        resp = session.post(f"{BASE_URL}/admin/login", json={
            "username": ADMIN_USERNAME,
            "password": ADMIN_PASSWORD
        })
        
        # Check status
        if resp.status_code != 200:
            log_test("Login with new password (status)", False, f"Expected 200, got {resp.status_code}")
            return None
        log_test("Login with new password (status)", True, "Returns 200")
        
        # Check response body
        data = resp.json()
        if "token" in data:
            log_test("Login response (no token field)", False, "Response contains 'token' field (should be cookie-only)")
            return None
        log_test("Login response (no token field)", True, "Token not in response body")
        
        if not data.get("ok"):
            log_test("Login response (ok field)", False, f"Expected ok:true, got {data}")
            return None
        log_test("Login response (ok field)", True, "Response has ok:true")
        
        if not data.get("admin"):
            log_test("Login response (admin field)", False, "Missing admin object")
            return None
        log_test("Login response (admin field)", True, f"Admin object present: {data['admin']}")
        
        # Check HttpOnly cookie
        cookie_header = resp.headers.get("Set-Cookie", "")
        if "sh_token=" not in cookie_header:
            log_test("Login cookie (sh_token present)", False, "sh_token cookie not set")
            return None
        log_test("Login cookie (sh_token present)", True, "sh_token cookie set")
        
        # Check HttpOnly flag
        if "HttpOnly" not in cookie_header:
            log_test("Login cookie (HttpOnly flag)", False, f"HttpOnly flag missing: {cookie_header}")
            return None
        log_test("Login cookie (HttpOnly flag)", True, "HttpOnly flag present")
        
        # Check Secure flag
        if "Secure" not in cookie_header:
            log_test("Login cookie (Secure flag)", False, f"Secure flag missing: {cookie_header}")
            return None
        log_test("Login cookie (Secure flag)", True, "Secure flag present")
        
        # Check SameSite
        if "SameSite" not in cookie_header:
            log_test("Login cookie (SameSite flag)", False, f"SameSite flag missing: {cookie_header}")
            return None
        log_test("Login cookie (SameSite flag)", True, "SameSite flag present")
        
        return session
    except Exception as e:
        log_test("Login with new password", False, f"Exception: {str(e)}")
        return None

def test_login_with_old_password():
    """Test that old password is rejected"""
    print("\n[SEC-001] Testing login with old password (must fail)...")
    try:
        resp = requests.post(f"{BASE_URL}/admin/login", json={
            "username": ADMIN_USERNAME,
            "password": OLD_PASSWORD
        })
        
        if resp.status_code == 401:
            log_test("Login with old password (rejected)", True, "Old password correctly rejected with 401")
        else:
            log_test("Login with old password (rejected)", False, f"Expected 401, got {resp.status_code}")
    except Exception as e:
        log_test("Login with old password", False, f"Exception: {str(e)}")

def test_login_with_wrong_password():
    """Test login with random wrong password"""
    print("\n[SEC-001] Testing login with wrong password...")
    try:
        resp = requests.post(f"{BASE_URL}/admin/login", json={
            "username": ADMIN_USERNAME,
            "password": "WrongPassword123!"
        })
        
        if resp.status_code == 401:
            log_test("Login with wrong password", True, "Wrong password rejected with 401")
        else:
            log_test("Login with wrong password", False, f"Expected 401, got {resp.status_code}")
    except Exception as e:
        log_test("Login with wrong password", False, f"Exception: {str(e)}")

def test_login_missing_fields():
    """Test login with missing username/password"""
    print("\n[SEC-001] Testing login with missing fields...")
    try:
        # Missing password
        resp = requests.post(f"{BASE_URL}/admin/login", json={
            "username": ADMIN_USERNAME
        })
        if resp.status_code == 400:
            log_test("Login missing password", True, "Missing password returns 400")
        else:
            log_test("Login missing password", False, f"Expected 400, got {resp.status_code}")
        
        # Missing username
        resp = requests.post(f"{BASE_URL}/admin/login", json={
            "password": ADMIN_PASSWORD
        })
        if resp.status_code == 400:
            log_test("Login missing username", True, "Missing username returns 400")
        else:
            log_test("Login missing username", False, f"Expected 400, got {resp.status_code}")
    except Exception as e:
        log_test("Login missing fields", False, f"Exception: {str(e)}")

def test_protected_endpoint_without_cookie(session):
    """Test protected endpoint without cookie"""
    print("\n[SEC-001] Testing protected endpoint without cookie...")
    try:
        # Create new session without cookie
        resp = requests.get(f"{BASE_URL}/admin/enquiries")
        
        if resp.status_code == 401:
            log_test("Protected endpoint without cookie", True, "Returns 401 without cookie")
        else:
            log_test("Protected endpoint without cookie", False, f"Expected 401, got {resp.status_code}")
    except Exception as e:
        log_test("Protected endpoint without cookie", False, f"Exception: {str(e)}")

def test_protected_endpoint_with_cookie(session):
    """Test protected endpoint with valid cookie"""
    print("\n[SEC-001] Testing protected endpoint with cookie...")
    try:
        resp = session.get(f"{BASE_URL}/admin/enquiries")
        
        if resp.status_code == 200:
            data = resp.json()
            log_test("Protected endpoint with cookie", True, f"Returns 200, got {data.get('total', 0)} enquiries")
        else:
            log_test("Protected endpoint with cookie", False, f"Expected 200, got {resp.status_code}")
    except Exception as e:
        log_test("Protected endpoint with cookie", False, f"Exception: {str(e)}")

def test_forged_jwt_fallback_secret():
    """Test that JWT signed with old fallback secret is rejected"""
    print("\n[SEC-001 CRITICAL] Testing forged JWT with fallback_dev_secret...")
    try:
        # Forge JWT with old fallback secret
        payload = {
            "sub": "forged_user",
            "username": "admin",
            "role": "admin",
            "exp": datetime.utcnow() + timedelta(hours=1)
        }
        forged_token = jwt.encode(payload, "fallback_dev_secret", algorithm="HS256")
        
        # Test 1: Send as Cookie
        resp = requests.get(
            f"{BASE_URL}/admin/enquiries",
            cookies={"sh_token": forged_token}
        )
        if resp.status_code == 401:
            log_test("Forged JWT (fallback_dev_secret) as Cookie", True, "Correctly rejected with 401")
        else:
            log_test("Forged JWT (fallback_dev_secret) as Cookie", False, f"SECURITY BREACH: Expected 401, got {resp.status_code}")
        
        # Test 2: Send as Bearer token
        resp = requests.get(
            f"{BASE_URL}/admin/enquiries",
            headers={"Authorization": f"Bearer {forged_token}"}
        )
        if resp.status_code == 401:
            log_test("Forged JWT (fallback_dev_secret) as Bearer", True, "Correctly rejected with 401")
        else:
            log_test("Forged JWT (fallback_dev_secret) as Bearer", False, f"SECURITY BREACH: Expected 401, got {resp.status_code}")
    except Exception as e:
        log_test("Forged JWT (fallback_dev_secret)", False, f"Exception: {str(e)}")

def test_forged_jwt_old_committed_secret():
    """Test that JWT signed with old committed secret is rejected"""
    print("\n[SEC-001 CRITICAL] Testing forged JWT with old committed secret...")
    try:
        # Forge JWT with old committed secret
        payload = {
            "sub": "forged_user",
            "username": "admin",
            "role": "admin",
            "exp": datetime.utcnow() + timedelta(hours=1)
        }
        forged_token = jwt.encode(payload, "saishubh_super_secret_key_change_in_production_2026", algorithm="HS256")
        
        # Test 1: Send as Cookie
        resp = requests.get(
            f"{BASE_URL}/admin/enquiries",
            cookies={"sh_token": forged_token}
        )
        if resp.status_code == 401:
            log_test("Forged JWT (old committed secret) as Cookie", True, "Correctly rejected with 401")
        else:
            log_test("Forged JWT (old committed secret) as Cookie", False, f"SECURITY BREACH: Expected 401, got {resp.status_code}")
        
        # Test 2: Send as Bearer token
        resp = requests.get(
            f"{BASE_URL}/admin/enquiries",
            headers={"Authorization": f"Bearer {forged_token}"}
        )
        if resp.status_code == 401:
            log_test("Forged JWT (old committed secret) as Bearer", True, "Correctly rejected with 401")
        else:
            log_test("Forged JWT (old committed secret) as Bearer", False, f"SECURITY BREACH: Expected 401, got {resp.status_code}")
    except Exception as e:
        log_test("Forged JWT (old committed secret)", False, f"Exception: {str(e)}")

# ============================================================================
# SEC-002: Rate Limiting
# ============================================================================

def test_login_rate_limit():
    """Test login rate limiting (>10 attempts/min)"""
    print("\n[SEC-002] Testing login rate limiting (>10 attempts/min)...")
    try:
        # Make 11 rapid login attempts
        rate_limited = False
        for i in range(12):
            resp = requests.post(f"{BASE_URL}/admin/login", json={
                "username": ADMIN_USERNAME,
                "password": "wrong_password"
            })
            if resp.status_code == 429:
                rate_limited = True
                retry_after = resp.headers.get("Retry-After")
                log_test("Login rate limiting (429 after limit)", True, f"Rate limited after {i+1} attempts, Retry-After: {retry_after}s")
                break
            time.sleep(0.1)  # Small delay between requests
        
        if not rate_limited:
            log_test("Login rate limiting", False, "Did not receive 429 after 12 attempts")
    except Exception as e:
        log_test("Login rate limiting", False, f"Exception: {str(e)}")

def test_enquiry_rate_limit():
    """Test enquiry rate limiting (>5 attempts/min)"""
    print("\n[SEC-002] Testing enquiry rate limiting (>5 attempts/min)...")
    try:
        # First, test a single valid enquiry works
        resp = requests.post(f"{BASE_URL}/enquiry", json={
            "name": "Rate Limit Test User",
            "phone": "+91-9876543210",
            "email": "ratelimit@test.com",
            "message": "Testing rate limit"
        })
        if resp.status_code == 201:
            log_test("Enquiry before rate limit", True, "Valid enquiry returns 201")
        else:
            log_test("Enquiry before rate limit", False, f"Expected 201, got {resp.status_code}")
        
        # Now flood with 6 more requests
        rate_limited = False
        for i in range(7):
            resp = requests.post(f"{BASE_URL}/enquiry", json={
                "name": f"Flood Test {i}",
                "phone": "+91-9876543210",
                "email": f"flood{i}@test.com"
            })
            if resp.status_code == 429:
                rate_limited = True
                retry_after = resp.headers.get("Retry-After")
                log_test("Enquiry rate limiting (429 after limit)", True, f"Rate limited after {i+1} more attempts, Retry-After: {retry_after}s")
                break
            time.sleep(0.1)
        
        if not rate_limited:
            log_test("Enquiry rate limiting", False, "Did not receive 429 after flooding")
    except Exception as e:
        log_test("Enquiry rate limiting", False, f"Exception: {str(e)}")

# ============================================================================
# SEC-004: Upload Security
# ============================================================================

def test_upload_svg_blocked(session):
    """Test that SVG upload is blocked"""
    print("\n[SEC-004] Testing SVG upload (must be blocked)...")
    try:
        # Create a fake SVG file
        svg_content = b'<svg xmlns="http://www.w3.org/2000/svg"><script>alert("XSS")</script></svg>'
        files = {
            'file': ('evil.svg', io.BytesIO(svg_content), 'image/svg+xml')
        }
        
        resp = session.post(f"{BASE_URL}/admin/upload", files=files)
        
        if resp.status_code == 400:
            data = resp.json()
            if "Unsupported file type" in data.get("error", ""):
                log_test("SVG upload blocked", True, f"SVG correctly rejected: {data['error']}")
            else:
                log_test("SVG upload blocked", False, f"Got 400 but wrong error: {data}")
        else:
            log_test("SVG upload blocked", False, f"SECURITY BREACH: Expected 400, got {resp.status_code}")
    except Exception as e:
        log_test("SVG upload blocked", False, f"Exception: {str(e)}")

def test_upload_png_allowed(session):
    """Test that PNG upload is allowed"""
    print("\n[SEC-004] Testing PNG upload (should work)...")
    try:
        # Create a minimal valid PNG (1x1 transparent pixel)
        png_content = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
        files = {
            'file': ('test.png', io.BytesIO(png_content), 'image/png')
        }
        
        resp = session.post(f"{BASE_URL}/admin/upload", files=files)
        
        if resp.status_code == 200:
            data = resp.json()
            if data.get("ok") and data.get("url"):
                log_test("PNG upload allowed", True, f"PNG uploaded successfully: {data['url']}")
            else:
                log_test("PNG upload allowed", False, f"Got 200 but unexpected response: {data}")
        else:
            log_test("PNG upload allowed", False, f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_test("PNG upload allowed", False, f"Exception: {str(e)}")

# ============================================================================
# Regression Tests: Verify existing endpoints still work
# ============================================================================

def test_public_endpoints():
    """Test public endpoints still work"""
    print("\n[REGRESSION] Testing public endpoints...")
    try:
        # Health check
        resp = requests.get(f"{BASE_URL}/health")
        if resp.status_code == 200 and resp.json().get("ok"):
            log_test("GET /api/health", True, "Returns ok")
        else:
            log_test("GET /api/health", False, f"Expected 200 with ok:true, got {resp.status_code}")
        
        # Packages list
        resp = requests.get(f"{BASE_URL}/packages")
        if resp.status_code == 200:
            data = resp.json()
            count = data.get("count", 0)
            if count == 12:
                log_test("GET /api/packages", True, f"Returns {count} packages")
            else:
                log_test("GET /api/packages", False, f"Expected 12 packages, got {count}")
        else:
            log_test("GET /api/packages", False, f"Expected 200, got {resp.status_code}")
        
        # Packages filter by category
        resp = requests.get(f"{BASE_URL}/packages?category=Pilgrimage")
        if resp.status_code == 200:
            data = resp.json()
            count = data.get("count", 0)
            if count == 6:
                log_test("GET /api/packages?category=Pilgrimage", True, f"Returns {count} packages")
            else:
                log_test("GET /api/packages?category=Pilgrimage", False, f"Expected 6 packages, got {count}")
        else:
            log_test("GET /api/packages?category=Pilgrimage", False, f"Expected 200, got {resp.status_code}")
        
        resp = requests.get(f"{BASE_URL}/packages?category=Domestic")
        if resp.status_code == 200:
            data = resp.json()
            count = data.get("count", 0)
            if count == 6:
                log_test("GET /api/packages?category=Domestic", True, f"Returns {count} packages")
            else:
                log_test("GET /api/packages?category=Domestic", False, f"Expected 6 packages, got {count}")
        else:
            log_test("GET /api/packages?category=Domestic", False, f"Expected 200, got {resp.status_code}")
        
        # Get first package by ID
        resp = requests.get(f"{BASE_URL}/packages")
        if resp.status_code == 200:
            packages = resp.json().get("packages", [])
            if packages:
                pkg_id = packages[0]["id"]
                resp = requests.get(f"{BASE_URL}/packages/{pkg_id}")
                if resp.status_code == 200:
                    log_test("GET /api/packages/:id (valid)", True, "Returns package details")
                else:
                    log_test("GET /api/packages/:id (valid)", False, f"Expected 200, got {resp.status_code}")
        
        # Bogus package ID
        resp = requests.get(f"{BASE_URL}/packages/507f1f77bcf86cd799439011")
        if resp.status_code == 404:
            log_test("GET /api/packages/:id (bogus)", True, "Returns 404 for bogus ID")
        else:
            log_test("GET /api/packages/:id (bogus)", False, f"Expected 404, got {resp.status_code}")
        
        # Testimonials
        resp = requests.get(f"{BASE_URL}/testimonials")
        if resp.status_code == 200:
            data = resp.json()
            log_test("GET /api/testimonials", True, f"Returns {len(data.get('testimonials', []))} testimonials")
        else:
            log_test("GET /api/testimonials", False, f"Expected 200, got {resp.status_code}")
        
        # Gallery
        resp = requests.get(f"{BASE_URL}/gallery")
        if resp.status_code == 200:
            data = resp.json()
            log_test("GET /api/gallery", True, f"Returns {len(data.get('images', []))} images")
        else:
            log_test("GET /api/gallery", False, f"Expected 200, got {resp.status_code}")
        
    except Exception as e:
        log_test("Public endpoints", False, f"Exception: {str(e)}")

def test_enquiry_validation():
    """Test enquiry validation still works"""
    print("\n[REGRESSION] Testing enquiry validation...")
    try:
        # Valid enquiry (before rate limit)
        resp = requests.post(f"{BASE_URL}/enquiry", json={
            "name": "John Doe",
            "phone": "+91-9876543210",
            "email": "john@example.com",
            "message": "Interested in Mysore package"
        })
        if resp.status_code == 201:
            log_test("POST /api/enquiry (valid)", True, "Valid enquiry returns 201")
        else:
            log_test("POST /api/enquiry (valid)", False, f"Expected 201, got {resp.status_code}")
        
        # Missing phone
        resp = requests.post(f"{BASE_URL}/enquiry", json={
            "name": "Jane Doe",
            "email": "jane@example.com"
        })
        if resp.status_code == 400:
            log_test("POST /api/enquiry (missing phone)", True, "Missing phone returns 400")
        else:
            log_test("POST /api/enquiry (missing phone)", False, f"Expected 400, got {resp.status_code}")
        
        # Invalid email
        resp = requests.post(f"{BASE_URL}/enquiry", json={
            "name": "Bob Smith",
            "phone": "+91-9876543210",
            "email": "invalid-email"
        })
        if resp.status_code == 400:
            log_test("POST /api/enquiry (invalid email)", True, "Invalid email returns 400")
        else:
            log_test("POST /api/enquiry (invalid email)", False, f"Expected 400, got {resp.status_code}")
    except Exception as e:
        log_test("Enquiry validation", False, f"Exception: {str(e)}")

def test_admin_crud_with_cookie(session):
    """Test admin CRUD operations with cookie auth"""
    print("\n[REGRESSION] Testing admin CRUD with cookie auth...")
    try:
        # Test POST /api/admin/packages with non-allowed name
        resp = session.post(f"{BASE_URL}/admin/packages", json={
            "name": "Random Unauthorized Trip",
            "category": "Domestic",
            "duration": "3 Days",
            "startingLocation": "Bangalore"
        })
        if resp.status_code == 400:
            data = resp.json()
            if "allowedForCategory" in data.get("error", ""):
                log_test("POST /api/admin/packages (non-allowed name)", True, "Non-allowed name rejected with 400")
            else:
                log_test("POST /api/admin/packages (non-allowed name)", False, f"Got 400 but wrong error: {data}")
        else:
            log_test("POST /api/admin/packages (non-allowed name)", False, f"Expected 400, got {resp.status_code}")
        
        # Test POST /api/admin/packages with already-seeded name
        resp = session.post(f"{BASE_URL}/admin/packages", json={
            "name": "Mysore Sightseeing - 1 Day",
            "category": "Domestic",
            "duration": "1 Day",
            "startingLocation": "Bangalore"
        })
        if resp.status_code == 409:
            log_test("POST /api/admin/packages (duplicate name)", True, "Duplicate name rejected with 409")
        else:
            log_test("POST /api/admin/packages (duplicate name)", False, f"Expected 409, got {resp.status_code}")
        
        # Test PUT /api/admin/packages/:id
        resp = session.get(f"{BASE_URL}/packages")
        if resp.status_code == 200:
            packages = resp.json().get("packages", [])
            if packages:
                pkg_id = packages[0]["id"]
                resp = session.put(f"{BASE_URL}/admin/packages/{pkg_id}", json={
                    "duration": "5 Days 4 Nights"
                })
                if resp.status_code == 200:
                    log_test("PUT /api/admin/packages/:id", True, "Package update returns 200")
                else:
                    log_test("PUT /api/admin/packages/:id", False, f"Expected 200, got {resp.status_code}")
        
        # Test testimonials CRUD
        resp = session.post(f"{BASE_URL}/admin/testimonials", json={
            "name": "Test User",
            "rating": 5,
            "comment": "Great service!",
            "packageName": "Mysore Sightseeing - 1 Day"
        })
        if resp.status_code == 201:
            testimonial_id = resp.json().get("testimonial", {}).get("id")
            log_test("POST /api/admin/testimonials", True, "Testimonial created")
            
            # Update
            resp = session.put(f"{BASE_URL}/admin/testimonials/{testimonial_id}", json={
                "isActive": False
            })
            if resp.status_code == 200:
                log_test("PUT /api/admin/testimonials/:id", True, "Testimonial updated")
            else:
                log_test("PUT /api/admin/testimonials/:id", False, f"Expected 200, got {resp.status_code}")
            
            # Delete
            resp = session.delete(f"{BASE_URL}/admin/testimonials/{testimonial_id}")
            if resp.status_code == 200:
                log_test("DELETE /api/admin/testimonials/:id", True, "Testimonial deleted")
            else:
                log_test("DELETE /api/admin/testimonials/:id", False, f"Expected 200, got {resp.status_code}")
        else:
            log_test("POST /api/admin/testimonials", False, f"Expected 201, got {resp.status_code}")
        
        # Test gallery CRUD
        resp = session.post(f"{BASE_URL}/admin/gallery", json={
            "imageUrl": "https://example.com/test.jpg",
            "title": "Test Image",
            "category": "Domestic"
        })
        if resp.status_code == 201:
            gallery_id = resp.json().get("image", {}).get("id")
            log_test("POST /api/admin/gallery", True, "Gallery image created")
            
            # Delete
            resp = session.delete(f"{BASE_URL}/admin/gallery/{gallery_id}")
            if resp.status_code == 200:
                log_test("DELETE /api/admin/gallery/:id", True, "Gallery image deleted")
            else:
                log_test("DELETE /api/admin/gallery/:id", False, f"Expected 200, got {resp.status_code}")
        else:
            log_test("POST /api/admin/gallery", False, f"Expected 201, got {resp.status_code}")
        
        # Test invalid gallery URL
        resp = session.post(f"{BASE_URL}/admin/gallery", json={
            "imageUrl": "not-a-url",
            "title": "Invalid",
            "category": "Domestic"
        })
        if resp.status_code == 400:
            log_test("POST /api/admin/gallery (invalid URL)", True, "Invalid URL rejected with 400")
        else:
            log_test("POST /api/admin/gallery (invalid URL)", False, f"Expected 400, got {resp.status_code}")
        
        # Test GET /api/admin/enquiries
        resp = session.get(f"{BASE_URL}/admin/enquiries")
        if resp.status_code == 200:
            data = resp.json()
            log_test("GET /api/admin/enquiries", True, f"Returns {data.get('total', 0)} enquiries")
        else:
            log_test("GET /api/admin/enquiries", False, f"Expected 200, got {resp.status_code}")
    except Exception as e:
        log_test("Admin CRUD with cookie", False, f"Exception: {str(e)}")

# ============================================================================
# Main Test Runner
# ============================================================================

def main():
    print("="*80)
    print("BACKEND SECURITY TESTING - Saishubh Holidays")
    print("="*80)
    
    # SEC-001: Cookie-Only HttpOnly Authentication
    session = test_login_with_new_password()
    if session:
        test_login_with_old_password()
        test_login_with_wrong_password()
        test_login_missing_fields()
        test_protected_endpoint_without_cookie(session)
        test_protected_endpoint_with_cookie(session)
        test_forged_jwt_fallback_secret()
        test_forged_jwt_old_committed_secret()
        
        # Regression tests with cookie auth
        test_public_endpoints()
        test_enquiry_validation()
        test_admin_crud_with_cookie(session)
        
        # SEC-004: Upload Security
        test_upload_svg_blocked(session)
        test_upload_png_allowed(session)
        
        # SEC-002: Rate Limiting (run LAST as they consume the per-IP budget)
        print("\n⚠️  Running rate limit tests last (they consume per-IP budget)...")
        time.sleep(2)  # Brief pause before rate limit tests
        test_enquiry_rate_limit()
        test_login_rate_limit()
    else:
        print("\n❌ Login failed, skipping remaining tests")
    
    # Print summary
    print_summary()
    
    # Exit with appropriate code
    if results["failed"] > 0:
        exit(1)
    else:
        exit(0)

if __name__ == "__main__":
    main()
