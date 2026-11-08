import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'screens/expense_list_screen.dart';
import 'services/expense_service.dart';
import 'services/expense_store.dart';
import 'theme/app_theme.dart';

void main() {
  runApp(const ExpenseApp());
}

class ExpenseApp extends StatelessWidget {
  const ExpenseApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => ExpenseStore(ExpenseService())..load(),
      child: MaterialApp(
        title: 'Expense Tracker',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.light(),
        darkTheme: AppTheme.dark(),
        home: const ExpenseListScreen(),
      ),
    );
  }
}
