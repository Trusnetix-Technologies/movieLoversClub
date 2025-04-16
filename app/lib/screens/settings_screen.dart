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
        title: Text("Settings", style: Theme.of(context).textTheme.titleMedium),
        backgroundColor: Theme.of(context).cardColor,
      ),
      body: SingleChildScrollView(
        child: Container(
          padding: const EdgeInsets.all(20),
          width: double.infinity,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 20,
                    backgroundColor: Theme.of(context).cardColor,
                    child: Text(
                      auth.name?.substring(0, 1) ?? "",
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        auth.name ?? "",
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      Text(
                        auth.phone ?? "",
                        style: Theme.of(context).textTheme.labelSmall,
                      ),
                    ],
                  ),
                  const Spacer(),
                  IconButton(
                    onPressed: () {},
                    icon: Icon(Icons.edit),
                  ),
                ],
              ),
              const Divider(
                color: Colors.grey,
                thickness: 1,
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  const Icon(Icons.favorite_border),
                  const SizedBox(width: 10),
                  Text("Liked", style: Theme.of(context).textTheme.bodyMedium),
                  const Spacer(),
                  Icon(Icons.arrow_forward_ios),
                ],
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  const Icon(Icons.privacy_tip_outlined),
                  const SizedBox(width: 10),
                  Text("Privacy",
                      style: Theme.of(context).textTheme.bodyMedium),
                  const Spacer(),
                  Icon(Icons.arrow_forward_ios),
                ],
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  const Icon(Icons.help_outline),
                  const SizedBox(width: 10),
                  Text("Help", style: Theme.of(context).textTheme.bodyMedium),
                  const Spacer(),
                  Icon(Icons.arrow_forward_ios),
                ],
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  const Icon(Icons.info_outline),
                  const SizedBox(width: 10),
                  Text("About", style: Theme.of(context).textTheme.bodyMedium),
                  const Spacer(),
                  Icon(Icons.arrow_forward_ios),
                ],
              ),
              const SizedBox(height: 10),
              const Divider(
                color: Colors.grey,
                thickness: 1,
              ),
              const SizedBox(height: 10),
              InkWell(
                onTap: () {
                  auth.logout();
                },
                child: SizedBox(
                  height: 50,
                  width: double.infinity,
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(
                        "Logout",
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: Theme.of(context).colorScheme.error,
                            ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
