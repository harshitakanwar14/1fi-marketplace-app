import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

interface ProductSpecTableProps {
  specs: Record<string, string>;
}

export const ProductSpecTable: React.FC<ProductSpecTableProps> = ({ specs }) => {
  const entries = Object.entries(specs);

  if (entries.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Specifications</Text>
      <View style={styles.table}>
        {entries.map(([key, value], index) => {
          const isEven = index % 2 === 0;
          return (
            <View
              key={key}
              style={[styles.row, isEven && styles.evenRow]}
            >
              <Text style={styles.keyText}>{key}</Text>
              <Text style={styles.valueText}>{value}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  table: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  evenRow: {
    backgroundColor: '#F8FAFC',
  },
  keyText: {
    width: '38%',
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  valueText: {
    width: '62%',
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
});
