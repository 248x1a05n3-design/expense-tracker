import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../services/expense_store.dart';
import '../widgets/expense_tile.dart';
import '../widgets/formatters.dart';
import '../widgets/state_views.dart';
import 'expense_detail_screen.dart';
import 'expense_form_screen.dart';
import 'summary_screen.dart';

class ExpenseListScreen extends StatelessWidget {
  const ExpenseListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<ExpenseStore>();
    return Scaffold(
      appBar: AppBar(
        title: const Text('Expense Tracker'),
        actions: [
          IconButton(
            tooltip: 'Summary',
            icon: const Icon(Icons.pie_chart_outline),
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const SummaryScreen()),
            ),
          ),
        ],
      ),
      body: SafeArea(child: _body(context, store)),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const ExpenseFormScreen()),
        ),
        icon: const Icon(Icons.add),
        label: const Text('Add expense'),
      ),
    );
  }

  Widget _body(BuildContext context, ExpenseStore store) {
    switch (store.status) {
      case LoadStatus.loading:
        return const LoadingView();
      case LoadStatus.error:
        return ErrorView(
          message: store.errorMessage ?? 'Something went wrong.',
          onRetry: store.load,
        );
      case LoadStatus.ready:
        if (store.isEmpty) {
          return const EmptyView(
            title: 'No expenses yet',
            hint: 'Tap "Add expense" to record your first one.',
          );
        }
        final items = store.items;
        return Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
              child: Row(
                children: [
                  const Text('Total spent'),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      formatAmount(store.total),
                      textAlign: TextAlign.end,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 88),
                itemCount: items.length,
                separatorBuilder: (_, __) => const SizedBox(height: 8),
                itemBuilder: (context, i) => ExpenseTile(
                  expense: items[i],
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) =>
                          ExpenseDetailScreen(expenseId: items[i].id),
                    ),
                  ),
                ),
              ),
            ),
          ],
        );
    }
  }
}
