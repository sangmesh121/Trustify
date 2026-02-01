import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Container } from '../components/Container';
import { colors } from '../theme/colors';

export const HomeScreen = () => {
    return (
        <Container centered>
            <Text style={styles.title}>Welcome to React Native!</Text>
            <Text style={styles.subtitle}>This is your new folder structure.</Text>
        </Container>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.text,
    },
});
