import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

// ==== PROVIDER ====
import 'package:provider/provider.dart';
import 'package:app/providers/auth.dart';
import 'package:app/providers/blog.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen();

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String selectedTab = "Home";

  @override
  void initState() {
    super.initState();
    Future.delayed(Duration.zero, () {
      Provider.of<Blog>(context, listen: false).getBlogs();
    });
  }

  // useState
  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<Auth>(context, listen: true);
    final name = auth.name;
    final blogs = Provider.of<Blog>(context, listen: true).blogs;
    final isLoading = Provider.of<Blog>(context, listen: true).isLoading;
    return Scaffold(
      appBar: AppBar(
        title: Text("Home Screen", style: TextStyle(color: Colors.white)),
        backgroundColor: Theme.of(context).primaryColor,
      ),
      body: Container(
        padding: const EdgeInsets.all(20),
        width: double.infinity,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Hi $name",
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 20),
            Text("Blogs", style: Theme.of(context).textTheme.bodyLarge),
            if (isLoading)
              const CircularProgressIndicator()
            else
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: ListView.builder(
                  shrinkWrap: true,
                  itemCount: blogs.length,
                  itemBuilder: (context, index) => Card(
                    elevation: 2,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          blogs[index].title,
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        Text(
                          blogs[index].content ?? "",
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                        const SizedBox(height: 10),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              blogs[index].movie,
                              style: Theme.of(context).textTheme.bodyMedium,
                            ),
                            Text(
                              DateFormat('dd MMMM yyyy')
                                  .format(blogs[index].createdAt),
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
