import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Container } from '../../components/Container';
import { useAuth } from '../../helpers/AuthContext';
import { spacing } from '../../theme/colors';
import { Button } from '../../components/common/Button';

// Components
import { ProfileSummaryCard } from '../../components/settings/ProfileSummaryCard';
import { AccountOverview } from '../../components/profile/AccountOverview';
import { UsageInsights } from '../../components/profile/UsageInsights';
import { SubscriptionCard } from '../../components/profile/SubscriptionCard';

export const ProfileScreen = ({ navigation }: any) => {
    const { user } = useAuth();

    return (
        <Container>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Identity Header */}
                <ProfileSummaryCard
                    name={user?.user_metadata?.full_name || 'User Name'}
                    email={user?.email || 'user@example.com'}
                    isPremium={true}
                    onEditPress={() => Alert.alert('Edit Profile', 'Edit flow not implemented')}
                />

                {/* Main Dashboard Content */}
                <AccountOverview />
                <UsageInsights />
                <SubscriptionCard />

                {/* Settings Shortcut */}
                <Button
                    title="App Settings"
                    variant="secondary"
                    onPress={() => navigation.navigate('Settings')}
                    style={{ marginTop: spacing.m, marginBottom: spacing.xl }}
                />
            </ScrollView>
        </Container>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        paddingTop: spacing.m,
        paddingBottom: spacing.xl,
    },
});
