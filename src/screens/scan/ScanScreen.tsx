import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Image, Alert, TextInput, TouchableOpacity } from 'react-native';
import { Container } from '../../components/Container';
import { Button } from '../../components/common/Button';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/colors';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5 } from '@expo/vector-icons';

// Components
import { MethodSelector, ScanMethod } from '../../components/scan/MethodSelector';
import { IntentSelector, ScanIntent } from '../../components/scan/IntentSelector';
import { useAuth } from '../../helpers/AuthContext';
import { SupabaseService } from '../../services/SupabaseService';

export const ScanScreen = ({ navigation, route }: any) => {
    const { colors, isDark } = useTheme();
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);

    // Params from Dashboard (e.g. mode='upload')
    const initialMode = route.params?.mode || 'camera';

    const [method, setMethod] = useState<ScanMethod>(initialMode);
    const [intent, setIntent] = useState<ScanIntent>('verify');

    // Inputs
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [url, setUrl] = useState('');

    // Camera
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        if (route.params?.mode) {
            setMethod(route.params.mode);
        }
    }, [route.params?.mode]);

    useEffect(() => {
        if (method === 'camera' && !permission?.granted) {
            requestPermission();
        }
    }, [method]);

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleCameraCapture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync();
                if (photo) {
                    setImageUri(photo.uri);
                    setScanned(true); // Stop preview
                }
            } catch (e) {
                console.error(e);
                Alert.alert('Error', 'Failed to take photo');
            }
        }
    };

    const handleClear = () => {
        setImageUri(null);
        setScanned(false);
        setUrl('');
    };

    const handleSubmit = async () => {
        if (method === 'camera' || method === 'upload') {
            if (!imageUri) {
                Alert.alert('Input Required', 'Please provide an image.');
                return;
            }
        } else if (method === 'url') {
            if (!url) {
                Alert.alert('Input Required', 'Please enter a URL.');
                return;
            }
        }

        if (!user) {
            Alert.alert('Auth Error', 'You must be logged in to scan.');
            return;
        }

        setIsProcessing(true);
        try {
            // 1. Upload Image (if applicable)
            let finalImageUrl = imageUri;
            if (method !== 'url' && imageUri) {
                // In a real app with 'fs', we would read the file. 
                // For this demo, we assume SupabaseService handles the URI upload or we skip actual upload if file system access is tricky in Expo Go without config.
                // We'll attempt the upload.
                try {
                    finalImageUrl = await SupabaseService.uploadImage(imageUri, 'scans');
                } catch (err) {
                    console.warn("Image upload failed, falling back to local URI for demo persistence", err);
                }
            }

            // 2. Save Scan Record
            const scanData = await SupabaseService.saveScan({
                user_id: user.id,
                input_type: method,
                intent: intent,
                image_url: finalImageUrl || undefined,
                website_url: method === 'url' ? url : undefined
            });

            // 3. Generate & Save Results (Mock Logic for "AI")
            // In a real backend, this would happen via Edge Function. We simulate it here.
            const mockResult = {
                scan_id: scanData.id,
                authenticity_status: Math.random() > 0.1 ? 'Genuine' : 'Fake',
                confidence_score: 0.95,
                product_name: 'Simulated Product Detection',
                brand: 'Detected Brand',
                metadata: { demo: true }
            };
            await SupabaseService.saveScanResults(mockResult);

            if (intent === 'price') {
                await SupabaseService.savePriceResults({
                    scan_id: scanData.id,
                    seller: 'BestBuy',
                    price: 199.99,
                    currency: 'USD',
                    availability: 'In Stock'
                });
            }

            // 4. Navigate
            navigation.navigate('ScanResult', {
                method,
                intent,
                data: finalImageUrl || url,
                scanId: scanData.id, // Pass ID for tracking
                mockResult // Pass directly for instant render
            });

        } catch (error: any) {
            Alert.alert('Scan Failed', error.message || 'Could not save scan.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Render Camera Input
    const renderCameraInput = () => {
        if (Platform.OS === 'web') {
            return (
                <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={{ color: colors.text }}>Camera not fully supported on Web. Please use Upload.</Text>
                    <Button title="Switch to Upload" onPress={() => setMethod('upload')} style={{ marginTop: 10 }} />
                </View>
            );
        }

        if (!permission?.granted) {
            return (
                <View style={styles.inputContainer}>
                    <Text style={{ textAlign: 'center', marginBottom: 10, color: colors.text }}>We need your permission to show the camera</Text>
                    <Button onPress={requestPermission} title="Grant Permission" />
                </View>
            );
        }

        if (imageUri && scanned) {
            return (
                <View style={[styles.inputContainer, { padding: 0, overflow: 'hidden' }]}>
                    <Image source={{ uri: imageUri }} style={{ width: '100%', height: 300 }} />
                    <TouchableOpacity style={styles.retakeBtn} onPress={handleClear}>
                        <FontAwesome5 name="times" size={16} color="#fff" />
                        <Text style={{ color: '#fff', marginLeft: 8 }}>Retake</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={[styles.inputContainer, { padding: 0, overflow: 'hidden', height: 300, backgroundColor: '#000' }]}>
                <CameraView style={{ flex: 1 }} ref={cameraRef}>
                    <View style={styles.cameraOverlay}>
                        {/* Scan Frame */}
                        <View style={styles.scanFrame} />
                        {/* Capture Button */}
                        <TouchableOpacity style={styles.captureBtn} onPress={handleCameraCapture}>
                            <View style={styles.captureInner} />
                        </TouchableOpacity>
                    </View>
                </CameraView>
            </View>
        );
    };

    // Render Upload Input
    const renderUploadInput = () => (
        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {imageUri ? (
                <View>
                    <Image source={{ uri: imageUri }} style={{ width: '100%', height: 200, borderRadius: 8 }} resizeMode="cover" />
                    <Button title="Remove Image" variant="outline" onPress={handleClear} style={{ marginTop: 10 }} />
                </View>
            ) : (
                <View style={{ alignItems: 'center', padding: 20 }}>
                    <FontAwesome5 name="cloud-upload-alt" size={40} color={colors.primary} style={{ marginBottom: 10 }} />
                    <Text style={{ color: colors.textSecondary, marginBottom: 10 }}>Select an image from gallery</Text>
                    <Button title="Select Image" onPress={handlePickImage} />
                </View>
            )}
        </View>
    );

    // Render URL Input
    const renderUrlInput = () => (
        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.text }]}>Submit Product Link</Text>
            <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: isDark ? '#333' : '#fff' }]}
                placeholder="https://example.com/product/..."
                placeholderTextColor={colors.textSecondary}
                value={url}
                onChangeText={setUrl}
                autoCapitalize="none"
                keyboardType="url"
            />
            <Button title="Paste" variant="outline" onPress={() => Alert.alert('Paste', 'Paste logic here')} style={{ alignSelf: 'flex-start' }} />
        </View>
    );

    const getButtonTitle = () => {
        switch (intent) {
            case 'verify': return 'Verify Authenticity';
            case 'price': return 'Check Pricing';
            case 'details': return 'Get Product Details';
            default: return 'Submit';
        }
    };

    return (
        <Container>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <MethodSelector selectedMethod={method} onSelect={(m) => { handleClear(); setMethod(m); }} />

                {/* Dynamic Input Area */}
                <View style={styles.section}>
                    {method === 'camera' && renderCameraInput()}
                    {method === 'upload' && renderUploadInput()}
                    {method === 'url' && renderUrlInput()}
                </View>

                {/* Intent Selection */}
                <IntentSelector selectedIntent={intent} onSelect={setIntent} />

                {/* Submit */}
                <Button
                    title={isProcessing ? "Processing..." : getButtonTitle()}
                    onPress={handleSubmit}
                    style={{ marginTop: spacing.m }}
                    disabled={isProcessing || (!imageUri && method !== 'url') || (method === 'url' && !url)}
                    loading={isProcessing}
                />
            </ScrollView>
        </Container>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: spacing.xl,
        paddingTop: spacing.m,
    },
    section: {
        marginBottom: spacing.l,
    },
    inputContainer: {
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        minHeight: 150,
        justifyContent: 'center',
        padding: spacing.m,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: spacing.m,
        marginBottom: 10,
    },
    // Camera Styles
    cameraOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 40,
    },
    scanFrame: {
        position: 'absolute',
        top: '20%',
        left: '10%',
        right: '10%',
        height: 250,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 12,
    },
    captureBtn: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
    },
    retakeBtn: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
});
