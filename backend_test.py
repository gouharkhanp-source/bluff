#!/usr/bin/env python3
"""
Backend API Tests for EXIT 52 Reservation System
Tests all /api endpoints with MongoDB backend
"""

import requests
import json
import sys

# Base URL from environment
BASE_URL = "https://bluff-and-exit.preview.emergentagent.com/api"

def print_test_header(test_name):
    print(f"\n{'='*80}")
    print(f"TEST: {test_name}")
    print(f"{'='*80}")

def print_result(passed, message):
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {message}")

def test_get_config():
    """Test 1: GET /api/config - should return 200 with config including computed percent"""
    print_test_header("GET /api/config - Reservation Tracker Config")
    
    try:
        response = requests.get(f"{BASE_URL}/config", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        # Check status code
        if response.status_code != 200:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return None
        
        data = response.json()
        
        # Check required fields
        required_fields = ['batchLabel', 'batchGoal', 'reservedCount', 'percent']
        missing_fields = [f for f in required_fields if f not in data]
        
        if missing_fields:
            print_result(False, f"Missing required fields: {missing_fields}")
            return None
        
        # Check percent is computed correctly
        expected_percent = min(100, round((data['reservedCount'] / data['batchGoal']) * 100))
        if data['percent'] != expected_percent:
            print_result(False, f"Percent mismatch: expected {expected_percent}, got {data['percent']}")
            return None
        
        # Check percent is in valid range
        if not (0 <= data['percent'] <= 100):
            print_result(False, f"Percent out of range: {data['percent']}")
            return None
        
        # Check no _id field
        if '_id' in data:
            print_result(False, "MongoDB _id field should not be present in response")
            return None
        
        print_result(True, f"Config returned correctly with {data['percent']}% computed from {data['reservedCount']}/{data['batchGoal']}")
        return data
        
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return None

def test_post_reservation_valid():
    """Test 2: POST /api/reservations with valid data - should return 200 with reservation and updated config"""
    print_test_header("POST /api/reservations - Create Valid Reservation")
    
    try:
        # First get current config to check reservedCount increment
        config_before = requests.get(f"{BASE_URL}/config", timeout=10).json()
        print(f"Config before reservation: reservedCount = {config_before.get('reservedCount')}")
        
        # Create reservation
        payload = {
            "edition": "core-starter",
            "name": "Alex Rivera",
            "email": "alex.rivera@example.com",
            "shipping": {
                "address": "1 Highway Rd",
                "city": "Metro",
                "country": "US"
            },
            "deposit": 5
        }
        
        response = requests.post(f"{BASE_URL}/reservations", json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        # Check status code
        if response.status_code != 200:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
        
        data = response.json()
        
        # Check response structure
        if 'reservation' not in data or 'config' not in data:
            print_result(False, "Response should contain 'reservation' and 'config' fields")
            return False
        
        reservation = data['reservation']
        config_after = data['config']
        
        # Check reservation fields
        required_fields = ['id', 'code', 'edition', 'email', 'name', 'shipping', 'deposit']
        missing_fields = [f for f in required_fields if f not in reservation]
        
        if missing_fields:
            print_result(False, f"Reservation missing required fields: {missing_fields}")
            return False
        
        # Check code format (EX-XXXXXX)
        if not reservation['code'].startswith('EX-') or len(reservation['code']) != 9:
            print_result(False, f"Code format incorrect: {reservation['code']} (expected EX-XXXXXX)")
            return False
        
        # Check no _id in reservation
        if '_id' in reservation:
            print_result(False, "MongoDB _id field should not be present in reservation")
            return False
        
        # Check no _id in config
        if '_id' in config_after:
            print_result(False, "MongoDB _id field should not be present in config")
            return False
        
        # Check reservedCount incremented by exactly 1
        expected_count = config_before['reservedCount'] + 1
        if config_after['reservedCount'] != expected_count:
            print_result(False, f"reservedCount should be {expected_count}, got {config_after['reservedCount']}")
            return False
        
        print_result(True, f"Reservation created with code {reservation['code']}, reservedCount incremented from {config_before['reservedCount']} to {config_after['reservedCount']}")
        return True
        
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_post_reservation_missing_email():
    """Test 3: POST /api/reservations missing email - should return 400"""
    print_test_header("POST /api/reservations - Missing Email (Validation)")
    
    try:
        payload = {
            "edition": "core-starter"
        }
        
        response = requests.post(f"{BASE_URL}/reservations", json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 400:
            print_result(False, f"Expected status 400, got {response.status_code}")
            return False
        
        print_result(True, "Correctly returned 400 for missing email")
        return True
        
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_post_reservation_missing_edition():
    """Test 4: POST /api/reservations missing edition - should return 400"""
    print_test_header("POST /api/reservations - Missing Edition (Validation)")
    
    try:
        payload = {
            "email": "test@example.com"
        }
        
        response = requests.post(f"{BASE_URL}/reservations", json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 400:
            print_result(False, f"Expected status 400, got {response.status_code}")
            return False
        
        print_result(True, "Correctly returned 400 for missing edition")
        return True
        
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_put_config():
    """Test 5: PUT /api/config - should update config and recompute percent"""
    print_test_header("PUT /api/config - Update Reservation Tracker")
    
    try:
        payload = {
            "batchLabel": "BATCH 02",
            "batchGoal": 1000,
            "reservedCount": 250
        }
        
        response = requests.put(f"{BASE_URL}/config", json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 200:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
        
        data = response.json()
        
        # Check updated values
        if data['batchLabel'] != "BATCH 02":
            print_result(False, f"batchLabel not updated: {data['batchLabel']}")
            return False
        
        if data['batchGoal'] != 1000:
            print_result(False, f"batchGoal not updated: {data['batchGoal']}")
            return False
        
        if data['reservedCount'] != 250:
            print_result(False, f"reservedCount not updated: {data['reservedCount']}")
            return False
        
        # Check percent recomputed (250/1000 = 25%)
        expected_percent = 25
        if data['percent'] != expected_percent:
            print_result(False, f"Percent should be {expected_percent}%, got {data['percent']}%")
            return False
        
        print_result(True, f"Config updated successfully, percent recomputed to {data['percent']}%")
        return True
        
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_get_reservations():
    """Test 6: GET /api/reservations - should return array of reservations, newest first, no _id"""
    print_test_header("GET /api/reservations - List Reservations")
    
    try:
        response = requests.get(f"{BASE_URL}/reservations", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
        
        data = response.json()
        
        # Check it's an array
        if not isinstance(data, list):
            print_result(False, f"Expected array, got {type(data)}")
            return False
        
        print(f"Returned {len(data)} reservations")
        
        # Check no _id fields in any reservation
        for i, reservation in enumerate(data):
            if '_id' in reservation:
                print_result(False, f"Reservation {i} contains MongoDB _id field")
                return False
        
        # Check sorting (newest first) if we have multiple reservations
        if len(data) > 1:
            for i in range(len(data) - 1):
                if 'createdAt' in data[i] and 'createdAt' in data[i+1]:
                    if data[i]['createdAt'] < data[i+1]['createdAt']:
                        print_result(False, "Reservations not sorted by createdAt descending (newest first)")
                        return False
        
        # Print sample of first reservation if exists
        if len(data) > 0:
            print(f"Sample reservation: {json.dumps(data[0], indent=2)}")
        
        print_result(True, f"Retrieved {len(data)} reservations, no _id fields, sorted correctly")
        return True
        
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def main():
    print("\n" + "="*80)
    print("EXIT 52 BACKEND API TEST SUITE")
    print("="*80)
    
    results = []
    
    # Run all tests in order
    results.append(("GET /api/config", test_get_config() is not None))
    results.append(("POST /api/reservations (valid)", test_post_reservation_valid()))
    results.append(("POST /api/reservations (missing email)", test_post_reservation_missing_email()))
    results.append(("POST /api/reservations (missing edition)", test_post_reservation_missing_edition()))
    results.append(("PUT /api/config", test_put_config()))
    results.append(("GET /api/reservations", test_get_reservations()))
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
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
