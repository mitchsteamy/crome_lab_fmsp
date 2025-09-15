import React from 'react';
import {
  StyleSheet
} from 'react-native';
import { ThemedView } from '../common/ThemedView';
import { ThemedText } from '../common/ThemedText';

interface SafetyPlanSectionProps {
  title: string;
  content: React.ReactNode | string;
  isEmpty?: boolean;
}

export default function SafetyPlanSection({ 
  title, 
  content, 
  isEmpty = false
}: SafetyPlanSectionProps) {
  
  return (
    <ThemedView style={styles.section} lightColor="#fff" darkColor="#2a2a2a">
      <ThemedView style={styles.sectionHeader} lightColor="transparent" darkColor="transparent">
        <ThemedText 
          type="subtitle" 
          style={styles.sectionTitle}
          lightColor="#333"
          darkColor="#fff"
        >
          {title}
        </ThemedText>
        <ThemedView 
          style={styles.headerDivider} 
          lightColor="#f0f0f0" 
          darkColor="#404040" 
        />
      </ThemedView>
      
      <ThemedView style={[styles.sectionContent, isEmpty && styles.emptyContent]} lightColor="transparent" darkColor="transparent">
        {typeof content === 'string' ? (
          <ThemedText 
            style={styles.contentText}
            lightColor={isEmpty ? "#999" : "#333"} 
            darkColor={isEmpty ? "#666" : "#e0e0e0"}
          >
            {content}
          </ThemedText>
        ) : (
          content
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  headerDivider: {
    height: 1,
    marginHorizontal: -20,
  },
  sectionContent: {
    padding: 20,
    minHeight: 20,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 22,
  },
  emptyContent: {
    opacity: 0.7,
  },
});