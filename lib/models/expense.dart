import 'package:flutter/material.dart';

class ExpenseCategories {
  ExpenseCategories._();

  static const Map<String, IconData> icons = {
    'Food': Icons.restaurant,
    'Transport': Icons.directions_bus,
    'Shopping': Icons.shopping_bag,
    'Bills': Icons.receipt_long,
    'Health': Icons.favorite,
    'Education': Icons.school,
    'Entertainment': Icons.movie,
    'Other': Icons.category,
  };

  static List<String> get names => icons.keys.toList();

  static IconData iconFor(String category) =>
      icons[category] ?? Icons.category;
}

class Expense {
  const Expense({
    required this.id,
    required this.title,
    required this.amount,
    required this.category,
    required this.date,
    required this.note,
    required this.createdAt,
  });

  final String id;
  final String title;
  final double amount;
  final String category;
  final DateTime date;
  final String note;
  final DateTime createdAt;

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'amount': amount,
        'category': category,
        'date': date.toIso8601String(),
        'note': note,
        'createdAt': createdAt.toIso8601String(),
      };

  factory Expense.fromJson(Map<String, dynamic> json) => Expense(
        id: json['id'] as String,
        title: json['title'] as String,
        amount: (json['amount'] as num).toDouble(),
        category: json['category'] as String,
        date: DateTime.parse(json['date'] as String),
        note: (json['note'] as String?) ?? '',
        createdAt: DateTime.parse(json['createdAt'] as String),
      );
}
