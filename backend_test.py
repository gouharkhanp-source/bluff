#!/usr/bin/env python3
"""
EXIT 52 Backend API Test Suite
Tests all /api endpoints with focus on Stripe checkout fallback mode
"""

import requests
import re
import sys

# Base URL from .env NEXT_PUBLIC_BASE_URL
BASE_URL = "https://bluff-and-exit.preview.emergentagent.com/api"

def test_get_config_with_payments_enabled():
    """Test 1: GET /api/config returns paymentsEnabled=false and correct structure"""
    print("\n=== Test 1: GET /api/config (with paymentsEnabled flag) ===")
    try:
        response = requests.get(f"{BASE_URL}/config", timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected 200, got {response.status_code}")
            return None
        
        data = response.json()
        print(f"Response: {data}")
        
        # Check required fields
        required_fields = ['batchLabel', 'batchGoal', 'reservedCount', 'percent', 'paymentsEnabled']
        for field in required_fields:
            if field not in data:
                print(f"❌ FAILED: Missing field '{field}'")
                return None
        
        # Check paymentsEnabled is false
        if data['paymentsEnabled'] != False:
            print(f"❌ FAILED: paymentsEnabled should be false, got {data['paymentsEnabled']}")
            return None
        
        # Check no _id field
        if '_id' in data:
            print(f"❌ FAILED: MongoDB _id field should not be present")
            return None
        
        # Check percent is computed
        expected_percent = min(100, round((data['reservedCount'] / data['batchGoal']) * 100))
        if data['percent'] != expected_percent:
            print(f"❌ FAILED: Percent should be {expected_percent}, got {data['percent']}")
            return None
        
        reserved_count = data['reservedCount']
        print(f"✅ PASSED: paymentsEnabled=false, reservedCount={reserved_count}, percent={data['percent']}%, no _id")
        return reserved_count
        
    except Exception as e:
        print(f"❌ FAILED: Exception - {str(e)}")
        return None


def test_post_checkout_valid(initial_count):
    """Test 2: POST /api/checkout with valid data in fallback mode"""
    print("\n=== Test 2: POST /api/checkout (valid data, fallback mode) ===")
    try:
        payload = {
            "edition": "core-starter",
            "name": "Alex Rivera",
            "email": "alex.rivera@example.com",
            "deposit": 10
        }
        response = requests.post(f"{BASE_URL}/checkout", json=payload, timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        print(f"Response keys: {data.keys()}")
        
        # Check mode is 'prototype'
        if data.get('mode') != 'prototype':
            print(f"❌ FAILED: mode should be 'prototype', got {data.get('mode')}")
            return False
        
        # Check reservation object
        reservation = data.get('reservation')
        if not reservation:
            print(f"❌ FAILED: Missing 'reservation' object")
            return False
        
        # Check reservation fields
        required_fields = ['id', 'code', 'status', 'deposit', 'edition', 'email']
        for field in required_fields:
            if field not in reservation:
                print(f"❌ FAILED: Missing reservation field '{field}'")
                return False
        
        # Check UUID format for id
        uuid_pattern = r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
        if not re.match(uuid_pattern, reservation['id']):
            print(f"❌ FAILED: id should be UUID format, got {reservation['id']}")
            return False
        
        # Check code format EX-XXXXXX
        code_pattern = r'^EX-[A-Z0-9]{6}$'
        if not re.match(code_pattern, reservation['code']):
            print(f"❌ FAILED: code should match ^EX-[A-Z0-9]{{6}}$, got {reservation['code']}")
            return False
        
        # Check status is 'reserved'
        if reservation['status'] != 'reserved':
            print(f"❌ FAILED: status should be 'reserved', got {reservation['status']}")
            return False
        
        # Check deposit is 10
        if reservation['deposit'] != 10:
            print(f"❌ FAILED: deposit should be 10, got {reservation['deposit']}")
            return False
        
        # Check edition
        if reservation['edition'] != 'core-starter':
            print(f"❌ FAILED: edition should be 'core-starter', got {reservation['edition']}")
            return False
        
        # Check email
        if reservation['email'] != 'alex.rivera@example.com':
            print(f"❌ FAILED: email mismatch")
            return False
        
        # Check no _id in reservation
        if '_id' in reservation:
            print(f"❌ FAILED: MongoDB _id should not be in reservation")
            return False
        
        # Check config object
        config = data.get('config')
        if not config:
            print(f"❌ FAILED: Missing 'config' object")
            return False
        
        # Check no _id in config
        if '_id' in config:
            print(f"❌ FAILED: MongoDB _id should not be in config")
            return False
        
        print(f"✅ PASSED: mode='prototype', reservation with id={reservation['id'][:8]}..., code={reservation['code']}, status='reserved', deposit=10, no _id fields")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception - {str(e)}")
        return False


def test_get_config_incremented(initial_count):
    """Test 3: GET /api/config should show reservedCount incremented by 1"""
    print("\n=== Test 3: GET /api/config (verify reservedCount incremented) ===")
    try:
        response = requests.get(f"{BASE_URL}/config", timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        new_count = data['reservedCount']
        print(f"Initial count: {initial_count}, New count: {new_count}")
        
        if new_count != initial_count + 1:
            print(f"❌ FAILED: reservedCount should be {initial_count + 1}, got {new_count}")
            return False
        
        print(f"✅ PASSED: reservedCount incremented from {initial_count} to {new_count}")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception - {str(e)}")
        return False


def test_post_checkout_missing_email():
    """Test 4: POST /api/checkout missing email should return 400"""
    print("\n=== Test 4: POST /api/checkout (missing email) ===")
    try:
        payload = {"edition": "core-starter"}
        response = requests.post(f"{BASE_URL}/checkout", json=payload, timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code != 400:
            print(f"❌ FAILED: Expected 400, got {response.status_code}")
            return False
        
        data = response.json()
        print(f"Response: {data}")
        print(f"✅ PASSED: Returns 400 for missing email")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception - {str(e)}")
        return False


def test_post_checkout_missing_edition():
    """Test 5: POST /api/checkout missing edition should return 400"""
    print("\n=== Test 5: POST /api/checkout (missing edition) ===")
    try:
        payload = {"email": "test@example.com"}
        response = requests.post(f"{BASE_URL}/checkout", json=payload, timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code != 400:
            print(f"❌ FAILED: Expected 400, got {response.status_code}")
            return False
        
        data = response.json()
        print(f"Response: {data}")
        print(f"✅ PASSED: Returns 400 for missing edition")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception - {str(e)}")
        return False


def test_post_checkout_invalid_deposit_7():
    """Test 6: POST /api/checkout with deposit=7 should coerce to 5"""
    print("\n=== Test 6: POST /api/checkout (deposit=7, should coerce to 5) ===")
    try:
        payload = {
            "edition": "digital-founders",
            "email": "jordan.smith@example.com",
            "deposit": 7
        }
        response = requests.post(f"{BASE_URL}/checkout", json=payload, timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        reservation = data.get('reservation', {})
        deposit = reservation.get('deposit')
        
        if deposit != 5:
            print(f"❌ FAILED: deposit should be coerced to 5, got {deposit}")
            return False
        
        print(f"✅ PASSED: deposit=7 coerced to 5")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception - {str(e)}")
        return False


def test_post_checkout_invalid_deposit_999():
    """Test 7: POST /api/checkout with deposit=999 should coerce to 5"""
    print("\n=== Test 7: POST /api/checkout (deposit=999, should coerce to 5) ===")
    try:
        payload = {
            "edition": "highway-hazard",
            "email": "casey.jones@example.com",
            "deposit": 999
        }
        response = requests.post(f"{BASE_URL}/checkout", json=payload, timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        reservation = data.get('reservation', {})
        deposit = reservation.get('deposit')
        
        if deposit != 5:
            print(f"❌ FAILED: deposit should be coerced to 5, got {deposit}")
            return False
        
        print(f"✅ PASSED: deposit=999 coerced to 5")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception - {str(e)}")
        return False


def test_get_checkout_verify_no_session_id():
    """Test 8: GET /api/checkout/verify without session_id should return 400"""
    print("\n=== Test 8: GET /api/checkout/verify (no session_id) ===")
    try:
        response = requests.get(f"{BASE_URL}/checkout/verify", timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code != 400:
            print(f"❌ FAILED: Expected 400, got {response.status_code}")
            return False
        
        data = response.json()
        print(f"Response: {data}")
        print(f"✅ PASSED: Returns 400 for missing session_id")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception - {str(e)}")
        return False


def test_get_checkout_verify_with_session_id():
    """Test 9: GET /api/checkout/verify with session_id should return 400 'Payments not configured'"""
    print("\n=== Test 9: GET /api/checkout/verify (with session_id, no Stripe key) ===")
    try:
        response = requests.get(f"{BASE_URL}/checkout/verify?session_id=cs_test_dummy", timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code != 400:
            print(f"❌ FAILED: Expected 400, got {response.status_code}")
            return False
        
        data = response.json()
        print(f"Response: {data}")
        
        error_msg = data.get('error', '')
        if error_msg != 'Payments not configured':
            print(f"❌ FAILED: Expected error 'Payments not configured', got '{error_msg}'")
            return False
        
        print(f"✅ PASSED: Returns 400 with error 'Payments not configured'")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception - {str(e)}")
        return False


def test_regression_put_config():
    """Test 10: Regression - PUT /api/config should update and recompute percent"""
    print("\n=== Test 10: Regression - PUT /api/config ===")
    try:
        payload = {
            "batchLabel": "BATCH 09",
            "batchGoal": 800,
            "reservedCount": 400
        }
        response = requests.put(f"{BASE_URL}/config", json=payload, timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        print(f"Response: {data}")
        
        # Check updated values
        if data.get('batchLabel') != 'BATCH 09':
            print(f"❌ FAILED: batchLabel should be 'BATCH 09', got {data.get('batchLabel')}")
            return False
        
        if data.get('batchGoal') != 800:
            print(f"❌ FAILED: batchGoal should be 800, got {data.get('batchGoal')}")
            return False
        
        if data.get('reservedCount') != 400:
            print(f"❌ FAILED: reservedCount should be 400, got {data.get('reservedCount')}")
            return False
        
        # Check percent is recomputed to 50
        expected_percent = 50  # 400/800 * 100
        if data.get('percent') != expected_percent:
            print(f"❌ FAILED: percent should be {expected_percent}, got {data.get('percent')}")
            return False
        
        print(f"✅ PASSED: Config updated, percent recomputed to 50%")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception - {str(e)}")
        return False


def test_regression_post_reservations():
    """Test 11: Regression - POST /api/reservations should create reservation and increment count"""
    print("\n=== Test 11: Regression - POST /api/reservations ===")
    try:
        # Get current count
        config_response = requests.get(f"{BASE_URL}/config", timeout=10)
        initial_count = config_response.json()['reservedCount']
        
        payload = {
            "edition": "core-starter",
            "email": "morgan.lee@example.com",
            "name": "Morgan Lee"
        }
        response = requests.post(f"{BASE_URL}/reservations", json=payload, timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        print(f"Response keys: {data.keys()}")
        
        # Check reservation object
        reservation = data.get('reservation')
        if not reservation:
            print(f"❌ FAILED: Missing 'reservation' object")
            return False
        
        # Check code format
        code_pattern = r'^EX-[A-Z0-9]{6}$'
        if not re.match(code_pattern, reservation.get('code', '')):
            print(f"❌ FAILED: code should match ^EX-[A-Z0-9]{{6}}$, got {reservation.get('code')}")
            return False
        
        # Check no _id
        if '_id' in reservation:
            print(f"❌ FAILED: MongoDB _id should not be in reservation")
            return False
        
        # Check config
        config = data.get('config')
        if not config:
            print(f"❌ FAILED: Missing 'config' object")
            return False
        
        # Check reservedCount incremented
        new_count = config.get('reservedCount')
        if new_count != initial_count + 1:
            print(f"❌ FAILED: reservedCount should be {initial_count + 1}, got {new_count}")
            return False
        
        print(f"✅ PASSED: Reservation created with code {reservation['code']}, reservedCount incremented")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception - {str(e)}")
        return False


def test_regression_get_reservations():
    """Test 12: Regression - GET /api/reservations should return sorted array without _id"""
    print("\n=== Test 12: Regression - GET /api/reservations ===")
    try:
        response = requests.get(f"{BASE_URL}/reservations", timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        print(f"Response: Array with {len(data)} reservations")
        
        if not isinstance(data, list):
            print(f"❌ FAILED: Response should be an array")
            return False
        
        # Check no _id in any reservation
        for i, reservation in enumerate(data):
            if '_id' in reservation:
                print(f"❌ FAILED: MongoDB _id found in reservation at index {i}")
                return False
        
        # Check sorted by createdAt descending (newest first)
        if len(data) > 1:
            for i in range(len(data) - 1):
                if 'createdAt' in data[i] and 'createdAt' in data[i+1]:
                    if data[i]['createdAt'] < data[i+1]['createdAt']:
                        print(f"❌ FAILED: Reservations not sorted by createdAt descending")
                        return False
        
        print(f"✅ PASSED: Returns array of {len(data)} reservations, sorted newest first, no _id fields")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception - {str(e)}")
        return False


def main():
    print("=" * 80)
    print("EXIT 52 Backend API Test Suite")
    print("Testing Stripe checkout fallback mode + regression tests")
    print("=" * 80)
    
    results = []
    
    # Test 1: GET /api/config with paymentsEnabled
    initial_count = test_get_config_with_payments_enabled()
    results.append(("GET /api/config (paymentsEnabled)", initial_count is not None))
    
    if initial_count is None:
        print("\n⚠️  Cannot proceed with tests that depend on initial reservedCount")
        sys.exit(1)
    
    # Test 2: POST /api/checkout valid
    results.append(("POST /api/checkout (valid, fallback)", test_post_checkout_valid(initial_count)))
    
    # Test 3: GET /api/config incremented
    results.append(("GET /api/config (incremented)", test_get_config_incremented(initial_count)))
    
    # Test 4: POST /api/checkout missing email
    results.append(("POST /api/checkout (missing email)", test_post_checkout_missing_email()))
    
    # Test 5: POST /api/checkout missing edition
    results.append(("POST /api/checkout (missing edition)", test_post_checkout_missing_edition()))
    
    # Test 6: POST /api/checkout deposit=7
    results.append(("POST /api/checkout (deposit=7→5)", test_post_checkout_invalid_deposit_7()))
    
    # Test 7: POST /api/checkout deposit=999
    results.append(("POST /api/checkout (deposit=999→5)", test_post_checkout_invalid_deposit_999()))
    
    # Test 8: GET /api/checkout/verify no session_id
    results.append(("GET /api/checkout/verify (no session_id)", test_get_checkout_verify_no_session_id()))
    
    # Test 9: GET /api/checkout/verify with session_id
    results.append(("GET /api/checkout/verify (no Stripe key)", test_get_checkout_verify_with_session_id()))
    
    # Test 10: Regression - PUT /api/config
    results.append(("PUT /api/config (regression)", test_regression_put_config()))
    
    # Test 11: Regression - POST /api/reservations
    results.append(("POST /api/reservations (regression)", test_regression_post_reservations()))
    
    # Test 12: Regression - GET /api/reservations
    results.append(("GET /api/reservations (regression)", test_regression_get_reservations()))
    
    # Summary
    print("\n" + "=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed!")
        sys.exit(0)
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")
        sys.exit(1)


if __name__ == "__main__":
    main()
