# Help & Security Implementation

## Goal
Make Help, Support, Security, and Privacy settings fully functional using mocked backend calls and local persistence.

## Proposed Changes

### Screens
- **`src/screens/settings/support/HelpCenterScreen.tsx`**:
    - **Features**: Search bar, Category list, Article detail modal/view.
    - **Logic**: Fetch items -> Filter by search -> Show details.
- **`src/screens/settings/support/ContactSupportScreen.tsx`**:
    - **Features**: Subject, Message, System Info (auto-filled).
    - **Logic**: Validate -> "Post" to backend -> Show Success/Failure.
- **`src/screens/settings/privacy/SecuritySettingsScreen.tsx` (Update)**:
    - **Biometrics**: Use `AsyncStorage` to persist "biometric_enabled" state. Simulate auth challenge.
    - **Clear History**: Clear global history state (Context or Storage).
    - **Delete Account**: Two-step confirmation -> Reset Auth State.

### Navigation
- Add `HelpCenter` and `ContactSupport` to `ProfileNavigator`.

## Logic / Mock Data
- **Help Data**: JSON array of articles (FAQ).
- **Support API**: Mock `Promise` with random success/failure.
- **Security**: Mock `LocalAuthentication` behavior for web compatibility.

## Verification
- **Help**: Search for "scan" -> See results.
- **Support**: Submit ticket -> See success toast/alert.
- **Security**: Toggle Biometrics -> See state persist.
- **Privacy**: Clear History -> Check if history is empty (Visual verification).
