import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Image } from 'react-native';
import { Container } from '../../components/Container';
import { Button } from '../../components/common/Button';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/colors';
import { FontAwesome5 } from '@expo/vector-icons';

import { HistoryItem } from '../../components/history/HistoryItem';
import { HistoryFilters } from '../../components/history/HistoryFilters';

const MOCK_HISTORY = [
    {
        id: '1',
        name: 'Nike Air Jordan 1',
        brand: 'Nike',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        date: 'Today, 10:23 AM',
        intent: 'verify' as const,
        status: 'Genuine',
        statusColor: '#4CAF50'
    },
    {
        id: '2',
        name: 'Rolex Submariner',
        brand: 'Rolex',
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314',
        date: 'Yesterday, 4:15 PM',
        intent: 'verify' as const,
        status: 'Cannot Verify',
        statusColor: '#FFC107'
    },
    {
        id: '3',
        name: 'Sony WH-1000XM4',
        brand: 'Sony',
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb',
        date: 'Jan 28, 2025',
        intent: 'price' as const,
        status: 'Best: $248',
        statusColor: '#4CAF50'
    },
    {
        id: '4',
        name: 'Gucci Marmont Bag',
        brand: 'Gucci',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',
        date: 'Jan 25, 2025',
        intent: 'verify' as const,
        status: 'Fake',
        statusColor: '#F44336'
    },
    {
        id: '5',
        name: 'iPhone 15 Pro',
        brand: 'Apple',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569',
        date: 'Jan 20, 2025',
        intent: 'details' as const,
        status: 'Viewed',
        statusColor: '#666'
    },
];

export const HistoryScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    // Filter Logic
    const filteredData = MOCK_HISTORY.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.brand.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = activeFilter === 'all' || item.intent === activeFilter;
        // Note: For 'camera'/'upload' filters we'd check item.sourceType if available.
        // For now we just map intents. 
        // If filter is 'camera' we show all for mock simplicity or add mock property.

        return matchesSearch && matchesFilter;
    });

    const handlePress = (item: any) => {
        navigation.navigate('ScanTab', {
            screen: 'ScanResult',
            params: {
                method: 'history',
                intent: item.intent,
                data: item.image
            }
        });
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <View style={[styles.iconCircle, { backgroundColor: colors.surface }]}>
                <FontAwesome5 name="history" size={40} color={colors.textSecondary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No History Yet</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Scan your first product to see it here.
            </Text>
            <Button
                title="Scan Product"
                onPress={() => navigation.navigate('ScanTab')}
                style={{ marginTop: spacing.l, width: 200 }}
            />
        </View>
    );

    return (
        <Container>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>History</Text>

                {/* Search Bar */}
                <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <FontAwesome5 name="search" size={16} color={colors.textSecondary} style={{ marginRight: 10 }} />
                    <TextInput
                        placeholder="Search products..."
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={[styles.input, { color: colors.text }]}
                    />
                    {searchQuery.length > 0 && (
                        <FontAwesome5 name="times" size={16} color={colors.textSecondary} onPress={() => setSearchQuery('')} />
                    )}
                </View>
            </View>

            <HistoryFilters activeFilter={activeFilter} onSelect={setActiveFilter} />

            <FlatList
                data={filteredData}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <HistoryItem item={item} onPress={() => handlePress(item)} />}
                contentContainerStyle={styles.list}
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
            />
        </Container>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: spacing.m,
        marginBottom: spacing.m,
        marginTop: spacing.s,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: spacing.m,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.m,
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
    },
    input: {
        flex: 1,
        height: '100%',
    },
    list: {
        paddingHorizontal: spacing.m,
        paddingBottom: spacing.xl,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: spacing.s,
    },
    emptyText: {
        textAlign: 'center',
        paddingHorizontal: 40,
    },
});
