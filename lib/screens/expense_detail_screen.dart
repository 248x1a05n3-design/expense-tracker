import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/expense.dart';
import '../services/expense_store.dart';
import '../widgets/formatters.dart';

class ExpenseDetailScreen extends StatelessWidget {
  const ExpenseDetailScreen({super.key, required this.expenseId});

  final String expenseId;

  @override
  Widget build(BuildContext context) {
    final expense = context.watch<ExpenseStore>().byId(expenseId);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Expense details'),
        actions: [
          if (expense != null)
            IconButton(
              tooltip: 'Delete',
              icon: const Icon(Icons.delete_outline),
              onPressed: () => _confirmDelete(context, expense),
            ),
        ],
      ),
      body: SafeArea(
        child: expense == null
            ? const Center(child: Text('This expense no longer exists.'))
            : _Details(expense: expense),
      ),
    );
  }

  Future<void> _confirmDelete(BuildContext context, Expense expense) async {
    final store = context.read<ExpenseStore>();
    final navigator = Navigator.of(context);
    final messenger = ScaffoldMessenger.of(context);
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete expense?'),
        content: const Text('This cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
    if (confirmed != true) return;
    try {
      await store.remove(expense.id);
      navigator.pop();
    } catch (_) {
      messenger.showSnackBar(
        const SnackBar(content: Text('Could not delete. Please try again.')),
      );
    }
  }
}

class _Details extends StatelessWidget {
  const _Details({required this.expense});

  final Expense expense;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Center(
          child: CircleAvatar(
            radius: 32,
            backgroundColor: theme.colorScheme.secondaryContainer,
            foregroundColor: theme.colorScheme.onSecondaryContainer,
            child: Icon(ExpenseCategories.iconFor(expense.category), size: 32),
          ),
        ),
        const SizedBox(height: 16),
        Text(
          formatAmount(expense.amount),
          textAlign: TextAlign.center,
          style: theme.textTheme.headlineMedium,
        ),
        const SizedBox(height: 8),
        Text(
          expense.title,
          textAlign: TextAlign.center,
          style: theme.textTheme.titleMedium,
        ),
        const SizedBox(height: 24),
        _Row(label: 'Category', value: expense.category),
        _Row(label: 'Date', value: formatDate(expense.date)),
        _Row(
          label: 'Note',
          value: expense.note.isEmpty ? 'No note added' : expense.note,
        ),
        _Row(label: 'Recorded on', value: formatDate(expense.createdAt)),
      ],
    );
  }
}

class _Row extends StatelessWidget {
  const _Row({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: theme.textTheme.labelMedium),
          const SizedBox(height: 2),
          Text(value, style: theme.textTheme.bodyLarge),
          const Divider(),
        ],
      ),
    );
  }
}
