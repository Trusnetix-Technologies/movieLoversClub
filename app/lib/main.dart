import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

// ==== IMPORT PROVIDERS ====
import 'package:app/providers/auth.dart';
import 'package:app/providers/blog.dart';

// ==== IMPORT WIDGETS ====
import 'package:app/widgets/navbar.dart';

// ==== IMPORT SCREENS ====
import 'screens/home_screen.dart';
import 'screens/onboarding/login_screen.dart';
import 'screens/onboarding/onboarding_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp();

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => Auth(),
        ),
        ChangeNotifierProxyProvider<Auth, Blog>(
          create: (_) => Blog(),
          update: (ctx, auth, previousBlogs) => previousBlogs!
            ..update(
              auth.token,
            ),
        ),
      ],
      child: Consumer<Auth>(builder: (context, auth, _) {
        debugPrint("auth: ${auth.token}");
        return MaterialApp(
          title: 'MovieLoversClub',
          theme: ThemeData(
            primaryColor: Colors.blue,
            highlightColor: Color.fromRGBO(235, 236, 236, 1),
            cardColor: Color.fromRGBO(248, 248, 248, 1),
            scaffoldBackgroundColor:
                Color.fromRGBO(255, 255, 255, 1), // light mode white background
            hintColor: Color.fromRGBO(238, 111, 113, 1),
            dividerColor: Colors.grey[300],
            fontFamily: 'Inter',
            colorScheme: const ColorScheme.light(
              primary: Colors.blue,
              secondary: Color.fromRGBO(12, 71, 12, 1),
              tertiary: Color.fromRGBO(135, 175, 135, 1),
              primaryContainer: Color.fromRGBO(193, 191, 191, 1),
            ),
            textTheme: const TextTheme(
              displayLarge: TextStyle(
                  fontFamily: 'EB Garamond',
                  fontSize: 14.0,
                  fontWeight: FontWeight.bold,
                  color: Color(0xff6868AC)),
              displayMedium: TextStyle(
                fontFamily: 'EB Garamond',
                fontSize: 45.0,
                fontWeight: FontWeight.w400,
              ),
              displaySmall: TextStyle(
                fontFamily: 'EB Garamond',
                fontSize: 36,
                fontWeight: FontWeight.w400,
              ),
              headlineLarge: TextStyle(
                fontFamily: 'EB Garamond',
                fontSize: 24.0,
                fontWeight: FontWeight.bold,
              ), // headline 1
              headlineMedium: TextStyle(
                  fontFamily: 'EB Garamond',
                  fontSize: 18.0,
                  fontWeight: FontWeight.bold,
                  color: Color(0xff6868AC)), // headline 2
              headlineSmall: TextStyle(
                fontFamily: 'EB Garamond',
                fontSize: 18.0,
                fontWeight: FontWeight.bold,
              ), // headline 3
              titleLarge: TextStyle(
                fontFamily: 'Inter',
                fontSize: 22.0,
                fontWeight: FontWeight.w600,
              ), // headline 4
              titleMedium: TextStyle(
                fontFamily: 'Inter',
                fontSize: 16.0,
                fontWeight: FontWeight.w600,
              ), // headline 5
              titleSmall: TextStyle(
                fontFamily: 'Inter',
                fontSize: 14.0,
                fontWeight: FontWeight.w600,
              ), // headline 6
              labelLarge: TextStyle(
                fontFamily: 'Inter',
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ), // subtitle 1
              labelMedium: TextStyle(
                fontFamily: 'Inter',
                fontSize: 12.0,
                fontWeight: FontWeight.bold,
              ), // subtitle 2
              labelSmall: TextStyle(
                fontFamily: 'Inter',
                fontSize: 11.0,
                fontWeight: FontWeight.w500,
              ), // button
              bodyLarge: TextStyle(
                fontFamily: 'Inter',
                fontSize: 16.0,
                fontWeight: FontWeight.w400,
              ), // bodyText 1
              bodyMedium: TextStyle(
                fontFamily: 'Inter',
                fontSize: 14.0,
                fontWeight: FontWeight.w400,
                color: Color.fromRGBO(0, 0, 0, 1),
              ), // bodyText 2
              bodySmall: TextStyle(
                fontFamily: 'Inter',
                fontSize: 10.0,
                fontWeight: FontWeight.w400,
              ),
            ),
            iconTheme: const IconThemeData(
              color: Color(0xff000000),
            ),
            switchTheme: SwitchThemeData(
              trackOutlineColor: MaterialStateProperty.all(
                Colors.black12,
              ),
            ),
            cardTheme: CardTheme(
              color: Color.fromRGBO(248, 248, 248, 1),
              elevation: 1,
              shadowColor: Colors.black26,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16.0),
              ),
            ),
            buttonTheme: ButtonThemeData(
              buttonColor: Theme.of(context).colorScheme.primary,
              textTheme: ButtonTextTheme.primary,
            ),
            outlinedButtonTheme: OutlinedButtonThemeData(
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: Color.fromRGBO(236, 181, 25, 1)),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(25),
                ),
              ),
            ),
            elevatedButtonTheme: ElevatedButtonThemeData(
              style: ElevatedButton.styleFrom(
                foregroundColor: Colors.white,
                padding: EdgeInsets.symmetric(horizontal: 40, vertical: 15),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(25),
                ),
                textStyle: Theme.of(context).textTheme.labelLarge,
              ).copyWith(
                backgroundColor: MaterialStateProperty.all(
                  const Color.fromRGBO(236, 181, 25, 1),
                ),
                overlayColor: MaterialStateProperty.all(
                  const Color.fromRGBO(217, 149, 12, 1),
                ),
              ),
            ),
            // text field theme
            inputDecorationTheme: InputDecorationTheme(
              hintStyle: TextStyle(
                fontFamily: 'Inter',
                fontSize: 14,
                color: Colors.black,
                fontWeight: FontWeight.w400,
              ),
              prefixIconColor: Colors.black,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: BorderSide(
                  color: Color.fromRGBO(7, 51, 7, 1),
                  width: 2,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: BorderSide(
                  color: Color.fromRGBO(7, 51, 7, 1),
                  width: 2,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: BorderSide(
                  color: Color.fromRGBO(7, 51, 7, 1),
                  width: 2,
                ),
              ),
            ),
            useMaterial3: true,
          ),
          darkTheme: ThemeData(
            brightness: Brightness.dark,
            useMaterial3: true,
            primaryColor: Colors.blue,
            scaffoldBackgroundColor:
                const Color(0xFF1C1B1F), // M3 dark background
            cardColor:
                const Color(0xFF2C2C2C), // Slightly lighter than background
            dialogBackgroundColor: const Color(0xFF2C2C2C),
            colorScheme: ColorScheme.dark(
              primary: Colors.blue,
              secondary: Colors.blueAccent,
              tertiary: Colors.lightBlue,
              surface: const Color(0xFF2C2C2C),
              background: const Color(0xFF1C1B1F),
            ),
            dividerColor: const Color(0xFF49454F), // M3 dark outline
            fontFamily: 'Inter',
            textTheme: const TextTheme(
              displayLarge: TextStyle(
                fontFamily: 'EB Garamond',
                fontSize: 14.0,
                fontWeight: FontWeight.bold,
                color: Color(0xFFD0BCFF), // M3 dark primary
              ),
              displayMedium: TextStyle(
                fontFamily: 'EB Garamond',
                fontSize: 45.0,
                fontWeight: FontWeight.w400,
              ),
              displaySmall: TextStyle(
                fontFamily: 'EB Garamond',
                fontSize: 36,
                fontWeight: FontWeight.w400,
              ),
              headlineLarge: TextStyle(
                  fontFamily: 'EB Garamond',
                  fontSize: 24.0,
                  fontWeight: FontWeight.bold,
                  color: Color(0xff6868AC)), // headline 1
              headlineMedium: TextStyle(
                  fontFamily: 'EB Garamond',
                  fontSize: 18.0,
                  fontWeight: FontWeight.bold,
                  color: Color(0xff6868AC)), // headline 2
              headlineSmall: TextStyle(
                fontFamily: 'EB Garamond',
                fontSize: 18.0,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ), // headline 3
              titleLarge: TextStyle(
                fontFamily: 'Inter',
                fontSize: 22.0,
                fontWeight: FontWeight.w600,
              ), // headline 4
              titleMedium: TextStyle(
                fontFamily: 'Inter',
                fontSize: 16.0,
                fontWeight: FontWeight.w600,
              ), // headline 5
              titleSmall: TextStyle(
                fontFamily: 'Inter',
                fontSize: 14.0,
                fontWeight: FontWeight.w600,
              ), // headline 6
              labelLarge: TextStyle(
                fontFamily: 'Inter',
                fontSize: 14,
                color: Colors.white,
              ), // subtitle 1
              labelMedium: TextStyle(
                fontFamily: 'Inter',
                fontSize: 12.0,
                fontWeight: FontWeight.w500,
              ), // subtitle 2
              labelSmall: TextStyle(
                fontFamily: 'Inter',
                fontSize: 11.0,
                fontWeight: FontWeight.w500,
                color: Color.fromARGB(165, 250, 250, 255),
              ), // button
              bodyLarge: TextStyle(
                fontFamily: 'Inter',
                fontSize: 16.0,
                fontWeight: FontWeight.w400,
              ), // bodyText 1
              bodyMedium: TextStyle(
                fontFamily: 'Inter',
                fontSize: 14.0,
                fontWeight: FontWeight.w400,
                color: Color(0xFFE6E1E5), // M3 dark on-surface
              ), // bodyText 2
              bodySmall: TextStyle(
                fontFamily: 'Inter',
                fontSize: 10.0,
              ),
            ),
            iconTheme: const IconThemeData(
              color: Color(0xFFE6E1E5), // M3 dark on-surface
            ),
            cardTheme: CardTheme(
              color: const Color(0xFF2C2C2C),
              elevation: 2,
              shadowColor: Colors.black26,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16.0),
              ),
            ),
            buttonTheme: ButtonThemeData(
              buttonColor: Theme.of(context).colorScheme.primary,
              textTheme: ButtonTextTheme.primary,
            ),
            outlinedButtonTheme: OutlinedButtonThemeData(
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: Color.fromRGBO(236, 181, 25, 1)),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(25),
                ),
              ),
            ),
            elevatedButtonTheme: ElevatedButtonThemeData(
              style: ElevatedButton.styleFrom(
                foregroundColor: Colors.white,
                padding: EdgeInsets.symmetric(horizontal: 12, vertical: 15),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(25),
                ),
                textStyle: Theme.of(context).textTheme.labelLarge,
              ).copyWith(
                backgroundColor: MaterialStateProperty.all(
                  const Color.fromRGBO(236, 181, 25, 1),
                ),
                overlayColor: MaterialStateProperty.all(
                  const Color.fromRGBO(217, 149, 12, 1),
                ),
              ),
            ),
            // text field theme
            inputDecorationTheme: InputDecorationTheme(
              hintStyle: TextStyle(
                fontFamily: 'Inter',
                fontSize: 14,
                color: const Color(0xFF938F99), // M3 dark on-surface-variant
                fontWeight: FontWeight.w400,
              ),
              prefixIconColor: const Color(0xFF938F99),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: const BorderSide(
                  color: Color(0xFF49454F), // M3 dark outline
                  width: 1,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: const BorderSide(
                  color: Color(0xFF49454F), // M3 dark outline
                  width: 1,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: const BorderSide(
                  color: Colors.blue,
                  width: 2,
                ),
              ),
            ),
          ),
          themeMode: ThemeMode.system,
          home: auth.isLoggedIn
              ? auth.onboarded == true
                  ? const Navbar()
                  : const OnboardingScreen()
              : FutureBuilder(
                  future: auth.tryAutoLogin(),
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return const Center(child: CircularProgressIndicator());
                    }
                    return LoginScreen();
                  },
                ),
        );
      }),
    );
  }
}
