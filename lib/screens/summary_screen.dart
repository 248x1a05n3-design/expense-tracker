import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/expense.dart';
import '../services/expense_store.dart';
import '../widgets/formatters.dart';
import '../widgets/state_views.dart';

class SummaryScreen extends StatelessWidget {
  const SummaryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final store = context.watch<ExpenseStore>();
    final totals = store.totalsByCategory.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));
    final grandTotal = store.total;

    return Scaffold(
      appBar: AppBar(title: const Text('Summary')),
      body: SafeArea(
        child: totals.isEmpty
            ? const EmptyView(
                title: 'Nothing to summarise',
                hint: 'Add some expenses to see totals per category.',
              )
            : ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        children: [
                          const Text('Total spent'),
                          const SizedBox(height: 4),
                          Text(
                            formatAmount(grandTotal),
                            style:
                                Theme.of(context).textTheme.headlineMedium,
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  for (final entry in totals)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: _CategoryRow(
                        category: entry.key,
                        amount: entry.value,
                        share: grandTotal == 0 ? 0 : entry.value / grandTotal,
                      ),
                    ),
                ],
              ),
      ),
    );
  }
}

class _CategoryRow extends StatelessWidget {
  const _CategoryRow({
    required this.category,
    required this.amount,
    required this.share,
  });

  final String category;
  final double amount;
  final double share;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(ExpenseCategories.iconFor(category), size: 20),
            const SizedBox(width: 8),
            Expanded(child: Text(category)),
            Flexible(
              child: Text(
                formatAmount(amount),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
        const SizedBox(height: 6),
        LinearProgressIndicator(value: share, minHeight: 8),
        const SizedBox(height: 2),
        Text('${(share * 100).toStringAsFixed(1)}%',
            style: Theme.of(context).textTheme.labelSmall),
      ],
    );
  }
}
