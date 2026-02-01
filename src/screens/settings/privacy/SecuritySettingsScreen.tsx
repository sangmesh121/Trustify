import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container } from '../../../components/Container';
import { SettingsItem } from '../../../components/settings/SettingsItem';
import { SettingsSection } from '../../../components/settings/SettingsSection';
import { useAuth } from '../../../helpers/AuthContext';
import { spacing } from '../../../theme/colors';

export const SecuritySettingsScreen = ({ navigation }: any) => {
    const { signOut } = useAuth();
    const [biometricsEnabled, setBiometricsEnabled] = useState(false);
    const [pinEnabled, setPinEnabled] = useState(true);

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            const bio = await AsyncStorage.getItem('biometric_enabled');
            const pin = await AsyncStorage.getItem('pin_enabled');
            if (bio !== null) setBiometricsEnabled(bio === 'true');
            if (pin !== null) setPinEnabled(pin === 'true');
        } catch (e) {
            console.error("Failed to load security settings");
        }
    };

    const toggleBiometrics = async (value: boolean) => {
        setBiometricsEnabled(value);
        await AsyncStorage.setItem('biometric_enabled', String(value));
    };

    const togglePin = async (value: boolean) => {
        setPinEnabled(value);
        await AsyncStorage.setItem('pin_enabled', String(value));
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure? This action is irreversible and all your data will be lost.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        // Mock Delete API call
                        await AsyncStorage.clear(); // Clear local storage (example)
                        Alert.alert("Account Deleted", "Your account has been deleted.");
                        await signOut();
                    }
                }
            ]
        );
    };

    const handleChangePassword = () => {
        Alert.alert("Change Password", "Use this mock function to change password.", [
            { text: "Cancel", style: "cancel" },
            { text: "Send Reset Link", onPress: () => Alert.alert("Success", "Reset link sent to your email.") }
        ]);
    };

    return (
        <Container>
            <ScrollView contentContainerStyle={styles.content}>

                <SettingsSection title="Login Security">
                    <SettingsItem
                        icon="key"
                        title="Change Password"
                        onPress={handleChangePassword}
                    />
                    <SettingsItem
                        icon="fingerprint"
                        title="Biometric Login"
                        type="toggle"
                        value={biometricsEnabled}
                        onToggle={toggleBiometrics}
                    />
                    <SettingsItem
                        icon="lock"
                        title="App PIN"
                        type="toggle"
                        value={pinEnabled}
                        onToggle={togglePin}
                        showBorder={false}
                    />
                </SettingsSection>

                <SettingsSection title="Account Data">
                    <SettingsItem
                        icon="download"
                        title="Export My Data"
                        onPress={() => Alert.alert("Request Received", "Your data export will be emailed to you.")}
                        showBorder={false}
                    />
                </SettingsSection>

                <SettingsSection title="Danger Zone">
                    <SettingsItem
                        icon="trash-alt"
                        title="Delete Account"
                        type="danger"
                        onPress={handleDeleteAccount}
                        showBorder={false}
                    />
                </SettingsSection>

            </ScrollView>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        paddingTop: spacing.m,
        paddingBottom: spacing.xl,
    },
});
