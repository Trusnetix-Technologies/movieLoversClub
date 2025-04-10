import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';

// ==== IMPORT CONSTANTS ====
import 'package:app/constants/address_constants.dart';

class BlogModel {
  final String id;
  final String title;
  final String content;
  String? description;
  final String movie;
  final String director;
  final String status;
  final DateTime createdAt;
  final DateTime updatedAt;

  BlogModel({
    required this.id,
    required this.title,
    required this.content,
    this.description,
    required this.movie,
    required this.director,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });
}

class Blog extends ChangeNotifier {
  String? _token;
  set token(String? token) => _token = token;

  void update(String? token) {
    if (token == null) return;
    _token = token;
  }

  bool _isLoading = false;
  bool get isLoading => _isLoading;
  List<BlogModel> _blogs = [];
  List<BlogModel> get blogs => _blogs;

  Future<void> getBlogs() async {
    try {
      _isLoading = true;
      final url = '$host/api/v1/user/get/blog';
      final response = await http.post(Uri.parse(url),
          body: jsonEncode({
            'pageSize': 100,
            'page': 0,
          }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': _token ?? '',
          });

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);
        debugPrint("data: $data");
        _blogs = data['data']
            .map<BlogModel>((blog) => BlogModel(
                  id: blog['_id'],
                  title: blog['title'],
                  content: blog['content'],
                  description: blog['description'],
                  movie: blog['movie'],
                  director: blog['director'],
                  status: blog['status'],
                  createdAt: blog['createdAt'] != null
                      ? DateTime.parse(blog['createdAt'])
                      : DateTime.now(),
                  updatedAt: blog['updatedAt'] != null
                      ? DateTime.parse(blog['updatedAt'])
                      : DateTime.now(),
                ))
            .toList();
        _isLoading = false;
        notifyListeners();
      } else {
        _isLoading = false;
        throw Exception('Failed to load posts');
      }
    } catch (e) {
      _isLoading = false;
      throw Exception("Failed to fetch blog posts: $e");
    }
  }
}
