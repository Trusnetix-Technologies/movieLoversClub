import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:timeago/timeago.dart' as timeago;

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
        title: Text("MovieLoversClub",
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: Theme.of(context).primaryColor,
                )),
        centerTitle: true,
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
                      name?.substring(0, 1) ?? "",
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        name ?? "",
                        style: Theme.of(context).textTheme.titleSmall,
                      ),
                      Text(
                        "What's on your mind?",
                        style: Theme.of(context).textTheme.labelSmall,
                      ),
                    ],
                  ),
                  const Spacer(),
                  IconButton(
                    onPressed: () {},
                    icon: Icon(Icons.add),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Divider(
                color: Theme.of(context).dividerColor,
                thickness: 1,
              ),
              const SizedBox(height: 6),
              Text("Threads", style: Theme.of(context).textTheme.labelSmall),
              const SizedBox(height: 6),
              if (isLoading)
                const CircularProgressIndicator()
              else if (blogs.isEmpty)
                const Center(
                  child: Text("No threads yet"),
                )
              else
                ListView.builder(
                  shrinkWrap: true,
                  itemCount: blogs.length,
                  physics: const NeverScrollableScrollPhysics(),
                  itemBuilder: (context, index) => Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Theme.of(context).cardColor,
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            CircleAvatar(
                              radius: 12,
                              backgroundColor: Theme.of(context).primaryColor,
                              child: Text(
                                blogs[index].movie.substring(0, 1),
                                style: Theme.of(context).textTheme.titleSmall,
                              ),
                            ),
                            const SizedBox(width: 10),
                            Text(
                              blogs[index].movie,
                              style: Theme.of(context).textTheme.titleSmall,
                            ),
                            Spacer(),
                            Text(
                              '•',
                              style: Theme.of(context)
                                  .textTheme
                                  .bodySmall
                                  ?.copyWith(
                                    color: Colors.grey,
                                  ),
                            ),
                            const SizedBox(width: 4),
                            Text(
                              timeago.format(blogs[index].createdAt),
                              style: Theme.of(context)
                                  .textTheme
                                  .bodySmall
                                  ?.copyWith(
                                    color: Colors.grey,
                                  ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Text(
                          blogs[index].title,
                          style: Theme.of(context).textTheme.titleSmall,
                        ),
                        Text(
                          blogs[index].content ?? "",
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            Icon(Icons.favorite),
                            const SizedBox(width: 4),
                            Text(blogs[index].likesCount.toString() ?? "0"),
                          ],
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
