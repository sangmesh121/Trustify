import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { Container } from '../../../components/Container';
import { Button } from '../../../components/common/Button';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../helpers/AuthContext';
import { spacing } from '../../../theme/colors';

export const EditProfileScreen = ({ navigation }: any) => {
    const { colors } = useTheme();
    const { user } = useAuth();

    // Initialize with current user data or defaults
    const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
    const [phone, setPhone] = useState(user?.user_metadata?.phone || '');
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            Alert.alert("Success", "Profile updated successfully.", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        }, 1500);
    };

    return (
        <Container>
            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
                    <TextInput
                        style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="John Doe"
                        placeholderTextColor={colors.textSecondary}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Phone Number</Text>
                    <TextInput
                        style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="+1 234 567 890"
                        placeholderTextColor={colors.textSecondary}
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Email (Read-only)</Text>
                    <TextInput
                        style={[styles.input, { color: colors.textSecondary, borderColor: colors.border, backgroundColor: colors.background }]}
                        value={user?.email || ''}
                        editable={false}
                    />
                </View>

                <Button
                    title={isLoading ? "Saving..." : "Save Changes"}
                    onPress={handleSave}
                    disabled={isLoading}
                    style={{ marginTop: spacing.xl }}
                />

            </ScrollView>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: spacing.l,
    },
    formGroup: {
        marginBottom: spacing.l,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
    },
});
