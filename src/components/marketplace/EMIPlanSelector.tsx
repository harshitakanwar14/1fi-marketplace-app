import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { EMIPlan } from '../../types/marketplace';
import { Colors } from '../../theme/colors';
import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react-native';

interface EMIPlanSelectorProps {
  plans: EMIPlan[];
  selectedPlanId?: string;
  onSelectPlan: (plan: EMIPlan) => void;
}

export const EMIPlanSelector: React.FC<EMIPlanSelectorProps> = ({
  plans,
  selectedPlanId,
  onSelectPlan,
}) => {
  return (
    <View style={styles.container}>
      {/* Title & Trust Note */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Choose EMI Plan</Text>
        <View style={styles.mfTag}>
          <ShieldCheck size={12} color={Colors.primary} style={{ marginRight: 4 }} />
          <Text style={styles.mfTagText}>Backed by Mutual Funds</Text>
        </View>
      </View>
      <Text style={styles.subTitle}>Select a tenure that fits your monthly budget</Text>

      {/* Grid of EMI Card Options */}
      <View style={styles.plansGrid}>
        {plans.map((plan) => {
          const isSelected = selectedPlanId === plan.id;

          return (
            <Pressable
              key={plan.id}
              style={[
                styles.planCard,
                isSelected && styles.selectedPlanCard,
              ]}
              onPress={() => onSelectPlan(plan)}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`${plan.tenureMonths} Months EMI, ₹${plan.monthlyAmount} per month`}
            >
              {/* Radio Circle & No-Cost Badge */}
              <View style={styles.cardHeader}>
                <View style={styles.tenureContainer}>
                  <Text style={[styles.tenureNumber, isSelected && styles.selectedText]}>
                    {plan.tenureMonths}
                  </Text>
                  <Text style={[styles.tenureLabel, isSelected && styles.selectedText]}>
                    Months
                  </Text>
                </View>

                {plan.isNoCost ? (
                  <View style={styles.noCostBadge}>
                    <Zap size={10} color="#FFFFFF" style={{ marginRight: 2 }} />
                    <Text style={styles.noCostText}>0% Interest</Text>
                  </View>
                ) : (
                  <Text style={styles.stdRateText}>{plan.interestRatePct}% p.a.</Text>
                )}
              </View>

              {/* Monthly Amount */}
              <View style={styles.amountRow}>
                <Text style={styles.monthlyAmount}>
                  ₹{plan.monthlyAmount.toLocaleString('en-IN')}
                </Text>
                <Text style={styles.perMonthText}>/month</Text>
              </View>

              {/* Total Cost & Savings */}
              <View style={styles.cardFooter}>
                <Text style={styles.totalPayable}>
                  Total: ₹{plan.totalPayable.toLocaleString('en-IN')}
                </Text>
                {plan.savingsAmount && plan.savingsAmount > 0 ? (
                  <Text style={styles.savingsText}>Save ₹{plan.savingsAmount.toLocaleString('en-IN')}</Text>
                ) : null}
              </View>

              {/* Selected Checkmark */}
              {isSelected && (
                <View style={styles.selectedCheckPosition}>
                  <CheckCircle2 size={16} color={Colors.primary} fill="#FFFFFF" />
                </View>
              )}
            </Pressable>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  mfTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primarySurface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  mfTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  subTitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 12,
  },
  plansGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  planCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 12,
    position: 'relative',
  },
  selectedPlanCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySurface,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tenureContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  tenureNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginRight: 3,
  },
  tenureLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  selectedText: {
    color: Colors.primaryDark,
  },
  noCostBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  noCostText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  stdRateText: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  monthlyAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  perMonthText: {
    fontSize: 10,
    color: Colors.textMuted,
    marginLeft: 2,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.6)',
    paddingTop: 6,
  },
  totalPayable: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  savingsText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.success,
    marginTop: 2,
  },
  selectedCheckPosition: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
});
