import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export const PerformanceScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Progress</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>7</Text>
          <Text style={styles.statLabel}>Days Tracked</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>85%</Text>
          <Text style={styles.statLabel}>Completion Rate</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mood Trends</Text>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Mood chart will appear here</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Insights</Text>
        <View style={styles.insightCard}>
          <Text style={styles.insightText}>
            You tend to feel more positive in the morning
          </Text>
        </View>
        <View style={styles.insightCard}>
          <Text style={styles.insightText}>
            Regular breaks improve your mood
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7C4DFF',
  },
  statLabel: {
    marginTop: 5,
    color: '#666',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  placeholder: {
    backgroundColor: '#f5f5f5',
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
  },
  insightCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  insightText: {
    color: '#333',
    fontSize: 16,
  },
}); 