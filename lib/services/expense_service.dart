import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import '../models/expense.dart';

/// Reads and writes expenses on the device so they survive a restart.
class ExpenseService {
  static const String _key = 'expenses_v1';

  Future<List<Expense>> readAll() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_key);
    if (raw == null || raw.isEmpty) return [];
    final decoded = jsonDecode(raw) as List<dynamic>;
    return decoded
        .map((e) => Expense.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<void> writeAll(List<Expense> expenses) async {
    final prefs = await SharedPreferences.getInstance();
    final ok = await prefs.setString(
      _key,
      jsonEncode(expenses.map((e) => e.toJson()).toList()),
    );
    if (!ok) {
      throw Exception('Could not save to device storage');
    }
  }
}
