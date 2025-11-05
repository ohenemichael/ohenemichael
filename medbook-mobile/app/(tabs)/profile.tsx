import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/services/auth-context';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.firstName[0]}{user?.lastName[0]}
          </Text>
        </View>
        <Text style={styles.name}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Card style={styles.menuItem}>
          <Text style={styles.menuIcon}>👤</Text>
          <View style={styles.menuText}>
            <Text style={styles.menuTitle}>Edit Profile</Text>
            <Text style={styles.menuSubtitle}>Update your information</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </Card>

        <Card style={styles.menuItem}>
          <Text style={styles.menuIcon}>📄</Text>
          <View style={styles.menuText}>
            <Text style={styles.menuTitle}>Medical Records</Text>
            <Text style={styles.menuSubtitle}>View your records</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </Card>

        <Card style={styles.menuItem}>
          <Text style={styles.menuIcon}>💳</Text>
          <View style={styles.menuText}>
            <Text style={styles.menuTitle}>Payment Methods</Text>
            <Text style={styles.menuSubtitle}>Manage payment options</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </Card>

        <Card style={styles.menuItem}>
          <Text style={styles.menuIcon}>⚙️</Text>
          <View style={styles.menuText}>
            <Text style={styles.menuTitle}>Settings</Text>
            <Text style={styles.menuSubtitle}>App preferences</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </Card>

        <Card style={styles.menuItem}>
          <Text style={styles.menuIcon}>❓</Text>
          <View style={styles.menuText}>
            <Text style={styles.menuTitle}>Help & Support</Text>
            <Text style={styles.menuSubtitle}>Get assistance</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </Card>
      </View>

      <Button
        title="Logout"
        onPress={handleLogout}
        variant="outline"
        style={styles.logoutButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGray,
  },
  content: {
    padding: SPACING.lg,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  name: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  email: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  menuArrow: {
    fontSize: 24,
    color: COLORS.textLight,
  },
  logoutButton: {
    marginBottom: 40,
  },
});
