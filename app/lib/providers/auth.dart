/**
 * 1. Install http package - flutter pub add http
 * 2. Install shared_preferences package - flutter pub add shared_preferences
 * 3. Install provider package - flutter pub add provider
 */

import 'dart:io';
import 'dart:async'; // helps to handle async operations
import 'dart:convert'; // helps to convert json to dart object
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http; // like axios in react
import 'package:shared_preferences/shared_preferences.dart'; // helps to store data in the device

// ==== IMPORT CONSTANTS ====
import 'package:app/constants/address_constants.dart';

class Auth with ChangeNotifier {
  String? _token;
  String? _userId;
  String? _phone;
  String? _name;
  String? _status;
  bool? _onboarded;

  String? get name => _name;
  String? get phone => _phone;
  String? get token => _token;
  String? get status => _status;
  String? get userId => _userId;
  bool? get onboarded => _onboarded;

  bool get isLoggedIn => _token != null;

  Future<void> setSharedPreference() async {
    final prefs = await SharedPreferences.getInstance();
    final userData = json.encode(
      {
        'token': _token,
        'userId': _userId,
        'phone': _phone,
        'name': _name,
        'status': _status,
        'onboarded': _onboarded,
      },
    );
    prefs.setString('userData', userData);
  }

  // ==================
  // ==== SEND OTP ====
  // ==================
  Future<http.Response> sendOtp(String phone) async {
    try {
      debugPrint("Sending OTP to $phone");
      final url = "$host/api/v1/send/otp/number/$phone";
      final response = await http.get(
        Uri.parse(url),
      );
      debugPrint("Response: ${response.body}");
      return response;
    } catch (e) {
      debugPrint(e.toString());
      throw Exception("Failed to send OTP: $e");
    }
  }

  // ====================
  // ==== VERIFY OTP ====
  // ====================
  Future<http.Response> verifyOtp(String phone, String otp) async {
    try {
      debugPrint("Verifying OTP for $phone");
      final url = "$host/api/v1/verify/otp";
      final response = await http.post(
        Uri.parse(url),
        body: jsonEncode({"phone": phone, "otp": otp}),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
      );
      if (response.statusCode == 200) {
        final responseBody = jsonDecode(response.body);
        _token = responseBody['token'];
        _userId = responseBody['user']['_id'];
        _phone = responseBody['user']['phone'];
        _name = responseBody['user']['name'];
        _status = responseBody['user']['status'];
        _onboarded = responseBody['user']['onboarded'];
        await setSharedPreference();
        notifyListeners();
      }
      return response;
    } catch (e) {
      debugPrint(e.toString());
      throw Exception("Failed to verify OTP: $e");
    }
  }

  // =================
  // ==== ONBOARD ====
  // =================
  Future<http.Response> onboard(String name) async {
    try {
      debugPrint("Onboarding user with name $name");
      final url = "$host/api/v1/onboard";
      final response = await http.post(
        Uri.parse(url),
        body: jsonEncode({"name": name}),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': _token ?? '',
        },
      );
      if (response.statusCode == 200) {
        _onboarded = true;
        _name = name;
        await setSharedPreference();
        notifyListeners();
      }
      return response;
    } catch (e) {
      debugPrint(e.toString());
      throw Exception("Failed to onboard: $e");
    }
  }

  // ========================
  // ==== TRY AUTO LOGIN ====
  // ========================
  Future<bool> tryAutoLogin() async {
    debugPrint("Trying to auto login");
    final prefs = await SharedPreferences.getInstance();
    final userData = prefs.getString('userData');
    if (userData == null) {
      return false;
    }
    final userDataJson = jsonDecode(userData);
    _token = userDataJson['token'];
    _userId = userDataJson['userId'];
    _phone = userDataJson['phone'];
    _name = userDataJson['name'];
    _status = userDataJson['status'];
    _onboarded = userDataJson['onboarded'];

    try {
      const url = "$host/api/v1/current-user";
      final response = await http.get(
        Uri.parse(url),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': _token ?? '',
        },
      );
      if (response.statusCode == 200) {
        final responseBody = jsonDecode(response.body);
        _userId = responseBody['_id'];
        _phone = responseBody['phone'];
        _name = responseBody['name'];
        _status = responseBody['status'];
        _onboarded = responseBody['onboarded'];
        await setSharedPreference();
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      debugPrint(e.toString());
      return false;
    }
  }

  // =================
  // ==== LOGOUT ====
  // =================
  Future<void> logout() async {
    _token = null;
    _userId = null;
    _phone = null;
    _name = null;
    _status = null;
    _onboarded = null;
    await setSharedPreference();
    notifyListeners();
  }
}
