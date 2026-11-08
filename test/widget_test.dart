import 'package:expense_tracker/main.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  testWidgets('shows empty state, then validation errors on empty form',
      (tester) async {
    await tester.pumpWidget(const ExpenseApp());
    await tester.pumpAndSettle();

    expect(find.text('No expenses yet'), findsOneWidget);

    await tester.tap(find.text('Add expense'));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Save'));
    await tester.pumpAndSettle();

    expect(find.text('Enter a title'), findsOneWidget);
    expect(find.text('Enter an amount'), findsOneWidget);
    expect(find.text('Choose a category'), findsOneWidget);
  });
}
