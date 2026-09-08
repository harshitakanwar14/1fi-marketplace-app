import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { EMIPlan } from '../../types/marketplace';
import { Colors } from '../../theme/colors';
import { ChevronUp, ChevronDown, Check, ShieldCheck } from 'lucide-react-native';

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
  const [isExpanded, setIsExpanded] = useState(true);

  if (!plans || plans.length === 0) return null;

  // Find lowest monthly amount to show in "Starts at ₹X/mo"
  const lowestMonthly = plans.reduce(
    (min, p) => (p.monthlyAmount < min ? p.monthlyAmount : min),
    plans[0].monthlyAmount
  );

  return (
    <View style={styles.container}>
      {/* Title & Trust Note */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>Choose EMI Plan</Text>
        <View style={styles.mfTag}>
          <ShieldCheck size={12} color={Colors.primary} style={{ marginRight: 4 }} />
          <Text style={styles.mfTagText}>Backed by Mutual Funds</Text>
        </View>
      </View>

      {/* Main EMI Card Container */}
      <View style={styles.cardContainer}>
        {/* Card Header (Starts at ₹X/mo  |  Hide plans ^) */}
        <Pressable
          style={styles.cardHeader}
          onPress={() => setIsExpanded(!isExpanded)}
          accessibilityRole="button"
          accessibilityLabel="Toggle EMI plans visibility"
        >
          <View style={styles.startsAtRow}>
            <Text style={styles.startsAtLabel}>Starts at </Text>
            <Text style={styles.startsAtPrice}>₹{lowestMonthly.toLocaleString('en-IN')}/mo</Text>
          </View>

          <View style={styles.toggleBtn}>
            <Text style={styles.toggleBtnText}>
              {isExpanded ? 'Hide plans' : 'Show plans'}
            </Text>
            {isExpanded ? (
              <ChevronUp size={16} color={Colors.primary} style={{ marginLeft: 2 }} />
            ) : (
              <ChevronDown size={16} color={Colors.primary} style={{ marginLeft: 2 }} />
            )}
          </View>
        </Pressable>

        {/* Collapsible Vertical EMI List */}
        {isExpanded && (
          <View style={styles.plansList}>
            {plans.map((plan, index) => {
              const isSelected = selectedPlanId === plan.id;
              const isLast = index === plans.length - 1;

              return (
                <Pressable
                  key={plan.id}
                  style={[
                    styles.planRow,
                    isSelected && styles.selectedPlanRow,
                    !isLast && styles.rowBorder,
                  ]}
                  onPress={() => onSelectPlan(plan)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                  accessibilityLabel={`${plan.tenureMonths} months, ₹${plan.monthlyAmount} per month`}
                >
                  {/* Left Column: Tenure & Interest Rate */}
                  <View style={styles.planRowLeft}>
                    <Text style={[styles.tenureText, isSelected && styles.selectedTenureText]}>
                      {plan.tenureMonths} months
                    </Text>
                    <Text style={styles.dotSeparator}> · </Text>
                    <Text style={[styles.rateText, plan.isNoCost && styles.noCostRateText]}>
                      {plan.isNoCost ? '0% p.a.' : `${plan.interestRatePct}% p.a.`}
                    </Text>
                  </View>

                  {/* Right Column: Monthly Price */}
                  <View style={styles.planRowRight}>
                    <Text style={[styles.monthlyPriceText, isSelected && styles.selectedPriceText]}>
                      ₹{plan.monthlyAmount.toLocaleString('en-IN')}
                    </Text>
                    <Text style={styles.moUnitText}> /mo</Text>

                    {isSelected && (
                      <View style={styles.selectedCheckCircle}>
                        <Check size={11} color="#FFFFFF" strokeWidth={3} />
                      </View>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  startsAtRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  startsAtLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  startsAtPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  plansList: {
    backgroundColor: '#FFFFFF',
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  selectedPlanRow: {
    backgroundColor: '#F5F3FF',
  },
  planRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tenureText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  selectedTenureText: {
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  dotSeparator: {
    fontSize: 13,
    color: '#94A3B8',
  },
  rateText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  noCostRateText: {
    color: '#64748B',
    fontWeight: '600',
  },
  planRowRight: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  monthlyPriceText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  selectedPriceText: {
    color: Colors.primary,
    fontWeight: '900',
  },
  moUnitText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginRight: 6,
  },
  selectedCheckCircle: {
    backgroundColor: Colors.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
});
