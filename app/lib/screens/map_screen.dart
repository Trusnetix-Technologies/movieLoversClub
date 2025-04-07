import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:url_launcher/url_launcher.dart';

import 'package:latlong2/latlong.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Map Screen", style: TextStyle(color: Colors.white)),
        backgroundColor: Theme.of(context).primaryColor,
      ),
      body: Container(
        child: FlutterMap(
          options: MapOptions(
            initialCenter:
                LatLng(26.1426489, 91.8059525), // Center the map over London
            initialZoom: 15.2,
          ),
          children: [
            TileLayer(
              // Bring your own tiles
              urlTemplate:
                  'https://tile.openstreetmap.org/{z}/{x}/{y}.png', // For demonstration only
              userAgentPackageName:
                  'com.example.app', // Add your app identifier
              // And many more recommended properties!
            ),
            RichAttributionWidget(
              // Include a stylish prebuilt attribution widget that meets all requirments
              attributions: [
                TextSourceAttribution(
                  'OpenStreetMap contributors',
                  onTap: () => launchUrl(Uri.parse(
                      'https://openstreetmap.org/copyright')), // (external)
                ),
                // Also add images...
              ],
            ),
          ],
        ),
      ),
    );
  }
}
