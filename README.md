# Expense Tracker

**Topic:** Expense tracker (Flutter Application Development Programme, group project)

## Description
Students often lose track of small daily spending. Expense Tracker lets you record
expenses through a validated form, browse them in a list, open any expense for full
details, and see totals per category on a summary screen. All data is saved on the
device, so it survives an app restart and works without internet.

## Screenshots
Add at least three screenshots here after running the app:

1. `screenshots/list.png` - expense list
2. `screenshots/form.png` - add expense form with a validation error
3. `screenshots/summary.png` - summary by category

## Data source
User-created data saved on the device with `shared_preferences` (JSON). No API and no key.

## Team and ownership
| Member | Parts built |
|---|---|
| 248x1a05n3-design |  Form screen and validation |
| 248x1a05n4-design. |  Data service, Provider store |
| 248x1a05l1-design. |  List, detail and summary screens, theme |

## Project structure
```
lib/
  models/     expense.dart
  services/   expense_service.dart (device storage), expense_store.dart (Provider)
  screens/    list, detail, form, summary
  widgets/    expense_tile, state_views, formatters
  theme/      app_theme.dart (single seed colour)
```

## Run the project
Requires Flutter 3.35+ (stable), JDK 17, Android Studio.

```bash
git clone <your-repo-url>
cd expense_tracker
flutter create . --platforms=android --project-name expense_tracker   # generates the android/ folder
flutter pub get
flutter run
flutter test
```

## App name and icon
1. Edit `android/app/src/main/AndroidManifest.xml` and set `android:label="Expense Tracker"`.
2. Put a 1024x1024 PNG at `assets/icon.png`, then run `dart run flutter_launcher_icons`.

## Build the release APK
```bash
flutter build apk --release
```
Output: `build/app/outputs/flutter-apk/app-release.apk`. Copy it to a phone and install.
