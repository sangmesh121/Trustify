import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Container } from '../../components/Container';
import { Button } from '../../components/common/Button';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/colors';

// Result Components
import { ProductSummaryCard } from '../../components/results/ProductSummaryCard';
import { VerificationResult } from '../../components/results/VerificationResult';
import { PricingResult } from '../../components/results/PricingResult';
import { DetailsResult } from '../../components/results/DetailsResult';

export const ScanResultScreen = ({ route, navigation }: any) => {
    const { colors } = useTheme();
    const { method, intent, data } = route.params || {};

    // MOCK DATA (In real app, fetch from API based on image/url)
    const productInfo = {
        name: 'Air Jordan 1 Retro High OG',
        brand: 'Nike',
        sku: '555088-105',
        confidence: 98,
        image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3'
    };

    const verificationData = {
        status: 'genuine' as const,
        checks: [
            { name: 'Swoosh Logo Geometry', status: 'pass' as const, score: 99 },
            { name: 'Stitching Consistency', status: 'pass' as const, score: 97 },
            { name: 'Label Font Analysis', status: 'warn' as const, score: 85 },
            { name: 'Barcode Validity', status: 'pass' as const, score: 100 },
        ]
    };

    const pricingData = {
        bestPrice: '$170.00',
        averagePrice: '$185.00',
        options: [
            { seller: 'StockX', price: '$170.00', shipping: '+$15 Shipping', rating: 4.8, link: 'https://stockx.com', best: true },
            { seller: 'GOAT', price: '$175.00', shipping: '+$12 Shipping', rating: 4.7, link: 'https://goat.com' },
            { seller: 'eBay', price: '$182.00', shipping: 'Free Shipping', rating: 4.5, link: 'https://ebay.com' },
        ]
    };

    const detailsData = {
        description: "The Air Jordan 1 Retro High OG 'Dark Mocha' features a distinctive palette that calls to mind Travis Scott’s highly coveted Air Jordan 1 collaboration from 2019. The upper features a Sail leather base with black leather overlays surrounding the toe box and Swoosh.",
        specs: [
            { label: 'Silhouette', value: 'Air Jordan 1' },
            { label: 'Colorway', value: 'Sail/Dark Mocha-Black' },
            { label: 'Release Date', value: '2020-10-31' },
            { label: 'Upper Material', value: 'Leather' },
        ]
    };

    const getIntentLabel = () => {
        switch (intent) {
            case 'verify': return 'Authenticity Check';
            case 'price': return 'Price Comparison';
            case 'details': return 'Product Details';
            default: return 'Scan Result';
        }
    };

    return (
        <Container>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Intent Badge */}
                <View style={[styles.badgeContainer, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.badgeText, { color: colors.primary }]}>{getIntentLabel()}</Text>
                </View>

                {/* Product Summary */}
                <ProductSummaryCard
                    image={productInfo.image}
                    name={productInfo.name}
                    brand={productInfo.brand}
                    sku={productInfo.sku}
                    confidence={productInfo.confidence}
                />

                {/* Dynamic Content Actions */}
                <View style={styles.content}>
                    {intent === 'verify' && (
                        <VerificationResult status={verificationData.status} checks={verificationData.checks} />
                    )}

                    {intent === 'price' && (
                        <PricingResult
                            bestPrice={pricingData.bestPrice}
                            averagePrice={pricingData.averagePrice}
                            options={pricingData.options}
                        />
                    )}

                    {intent === 'details' && (
                        <DetailsResult
                            description={detailsData.description}
                            specs={detailsData.specs}
                        />
                    )}
                </View>

                {/* Footer Actions */}
                <View style={styles.footer}>
                    <Button title="Save to History" variant="secondary" style={{ marginBottom: 10 }} />
                    <Button title="Scan Another" variant="outline" onPress={() => navigation.navigate('ScanScreen')} />
                </View>

            </ScrollView>
        </Container>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: spacing.xl,
        paddingTop: spacing.m,
    },
    badgeContainer: {
        alignSelf: 'center',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginBottom: spacing.m,
        borderWidth: 1,
        borderColor: '#eee',
    },
    badgeText: {
        fontWeight: 'bold',
        fontSize: 12,
        textTransform: 'uppercase',
    },
    content: {
        marginBottom: spacing.l,
    },
    footer: {
        marginTop: spacing.m,
    },
});
