import 'dart:convert';
import 'package:flutter/material.dart';
// ==== IMPORT PROVIDER ====
import 'package:provider/provider.dart';
import 'package:app/providers/auth.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool _isLoading = false;
  bool _showOTP = false;

  // === FORM CONTROLLERS ===
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _otpController = TextEditingController();

  // === FORM KEY ===
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  void _sendOTP() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();

      if (_phoneController.text.length != 10) {
        // show snackbar
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Please enter a valid mobile number'),
          ),
        );
        return;
      }
      setState(() {
        _isLoading = true;
      });

      try {
        final response = await Provider.of<Auth>(context, listen: false)
            .sendOtp(_phoneController.text);
        if (response.statusCode == 200) {
          setState(() {
            _showOTP = true;
            _isLoading = false;
          });
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('OTP sent successfully. Please check your phone.'),
            ),
          );
        } else {
          setState(() {
            _isLoading = false;
          });
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Unable to send OTP. Please try again later.'),
            ),
          );
        }
      } catch (e) {
        setState(() {
          _isLoading = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Unable to send OTP. Please try again later.'),
          ),
        );
      }
    }
  }

  void _verifyOTP() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      setState(() {
        _isLoading = true;
      });
      try {
        final response = await Provider.of<Auth>(context, listen: false)
            .verifyOtp(_phoneController.text, _otpController.text);
        if (response.statusCode == 200) {
          setState(() {
            _isLoading = false;
          });
        } else {
          setState(() {
            _isLoading = false;
          });
          final jsonResponse = jsonDecode(response.body);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(jsonResponse['message']),
            ),
          );
        }
      } catch (e) {
        setState(() {
          _isLoading = false;
        });

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Unable to verify OTP. Please try again later.'),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                const Spacer(),
                SizedBox(
                  width: double.infinity,
                  child: Text(
                    'Sign In',
                    style: Theme.of(context).textTheme.displaySmall,
                    textAlign: TextAlign.center,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Enter your phone number to continue',
                  style: Theme.of(context).textTheme.bodyLarge,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 32),
                !_showOTP
                    ? Padding(
                        padding: const EdgeInsets.all(12.0),
                        child: TextFormField(
                          autofocus: true,
                          controller: _phoneController,
                          keyboardType: TextInputType.phone,
                          decoration: const InputDecoration(
                            hintText: 'Enter Your Phone Number',
                            prefixIcon: Icon(Icons.phone_outlined),
                          ),
                          validator: (value) {
                            if (value!.isEmpty) {
                              return 'Please enter your mobile number';
                            } else if (value.length != 10) {
                              return 'Please enter a valid mobile number';
                            }
                            return null;
                          },
                          onSaved: (value) {
                            _phoneController.text = value!;
                          },
                          onFieldSubmitted: (value) {
                            if (_formKey.currentState!.validate()) {
                              _formKey.currentState!.save();
                              _sendOTP();
                            }
                          },
                        ))
                    : Padding(
                        padding: const EdgeInsets.all(12.0),
                        child: TextFormField(
                          autofocus: true,
                          controller: _otpController,
                          keyboardType: TextInputType.phone,
                          decoration: const InputDecoration(
                            hintText: 'Enter Your OTP',
                          ),
                        ),
                      ),
                const Spacer(),
                Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        if (_isLoading) {
                          return;
                        }
                        if (_showOTP) {
                          _verifyOTP();
                        } else {
                          _sendOTP();
                        }
                      },
                      child: _isLoading
                          ? const CircularProgressIndicator()
                          : const Text('Continue'),
                    ),
                  ),
                ),
                SizedBox(
                  height: 12,
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
