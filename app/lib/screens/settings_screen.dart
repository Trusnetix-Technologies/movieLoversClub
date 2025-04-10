import 'package:flutter/material.dart';

// ==== PROVIDER ====
import 'package:provider/provider.dart';
import 'package:app/providers/auth.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen();

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<Auth>(context, listen: true);
    return Scaffold(
      appBar: AppBar(
        title: Text("Settings Screen", style: TextStyle(color: Colors.white)),
        backgroundColor: Theme.of(context).primaryColor,
      ),
      body: Container(
        child: Center(
          child: ElevatedButton(
            onPressed: () {
              auth.logout();
            },
            child: Text("Logout"),
          ),
        ),
      ),
    );
  }
}
