import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { Colors } from '../../theme/colors';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  starSize?: number;
  showText?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  reviewCount,
  starSize = 14,
  showText = true,
}) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>
      <View style={styles.starsRow}>
        {stars.map((index) => {
          const isFilled = index <= Math.floor(rating);
          const isHalf = index === Math.ceil(rating) && rating % 1 !== 0;

          return (
            <Star
              key={index}
              size={starSize}
              color={isFilled || isHalf ? Colors.starActive : Colors.starInactive}
              fill={isFilled ? Colors.starActive : isHalf ? Colors.warningLight : 'none'}
              style={styles.star}
            />
          );
        })}
      </View>

      {showText && (
        <Text style={styles.ratingText}>
          <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
          {reviewCount !== undefined && (
            <Text style={styles.reviewCount}> ({reviewCount})</Text>
          )}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  star: {
    marginRight: 2,
  },
  ratingText: {
    fontSize: 11,
  },
  ratingValue: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  reviewCount: {
    color: Colors.textMuted,
  },
});
