import 'package:flutter/foundation.dart';

import '../models/expense.dart';
import 'expense_service.dart';

enum LoadStatus { loading, error, ready }

/// Provider store shared by the list, detail, form and summary screens.
class ExpenseStore extends ChangeNotifier {
  ExpenseStore(this._service);

  final ExpenseService _service;

  List<Expense> _items = [];
  LoadStatus _status = LoadStatus.loading;
  String? _errorMessage;

  List<Expense> get items => List.unmodifiable(_items);
  LoadStatus get status => _status;
  String? get errorMessage => _errorMessage;
  bool get isEmpty => _items.isEmpty;

  double get total => _items.fold(0.0, (sum, e) => sum + e.amount);

  Map<String, double> get totalsByCategory {
    final totals = <String, double>{};
    for (final e in _items) {
      totals[e.category] = (totals[e.category] ?? 0) + e.amount;
    }
    return totals;
  }

  Expense? byId(String id) {
    for (final e in _items) {
      if (e.id == id) return e;
    }
    return null;
  }

  Future<void> load() async {
    _status = LoadStatus.loading;
    _errorMessage = null;
    notifyListeners();
    try {
      _items = await _service.readAll();
      _sort();
      _status = LoadStatus.ready;
    } catch (e) {
      _status = LoadStatus.error;
      _errorMessage = 'Could not load your expenses.';
    }
    notifyListeners();
  }

  Future<void> add({
    required String title,
    required double amount,
    required String category,
    required DateTime date,
    required String note,
  }) async {
    final now = DateTime.now();
    final expense = Expense(
      id: now.microsecondsSinceEpoch.toString(),
      title: title,
      amount: amount,
      category: category,
      date: date,
      note: note,
      createdAt: now,
    );
    final updated = [..._items, expense];
    await _service.writeAll(updated);
    _items = updated;
    _sort();
    notifyListeners();
  }

  Future<void> remove(String id) async {
    final updated = _items.where((e) => e.id != id).toList();
    await _service.writeAll(updated);
    _items = updated;
    notifyListeners();
  }

  void _sort() {
    _items.sort((a, b) {
      final byDate = b.date.compareTo(a.date);
      return byDate != 0 ? byDate : b.createdAt.compareTo(a.createdAt);
    });
  }
}
