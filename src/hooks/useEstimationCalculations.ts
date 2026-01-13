// hooks/useEstimationCalculations.ts
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

export const useEstimationCalculations = () => {
  const { employees, costTypes, taxConfigs } = useSelector(
    (state: RootState) => state.estimate
  );

  // Helper: Get cost type by ID
  const getCostType = (costTypeId: number | string) => {
    return costTypes.find(
      (ct: any) => ct.costTypeId === parseInt(costTypeId.toString())
    );
  };

  // Helper: Get employee by ID
  const getEmployee = (employeeId: number | string) => {
    return employees.find(
      (emp: any) => emp.employeeId === parseInt(employeeId.toString())
    );
  };

  // Calculate total for a single direct cost item
  const calculateDirectTotal = (cost: any): number => {
    const ct = getCostType(cost.costTypeId);
    if (!ct) return 0;

    const qty = parseFloat(cost.quantityOrHours) || 0;
    const rate = parseFloat(cost.rateOrCost) || 0;
    const months = parseFloat(cost.monthsUsed) || 1;

    return ct.requiresMonths ? qty * rate * months : qty * rate;
  };

  // Main totals calculation used across steps and summary
  const calculateTotals = (
    laborCosts: any[],
    directCosts: any[],
    indirectCosts: any[],
    additionalCosts: any[],
    profitPercentage: number | string,
    taxId: number | string
  ) => {
    const totalLaborCost = laborCosts.reduce((sum, l) => {
      const hours = parseFloat(l.estimatedHours) || 0;
      const rate = parseFloat(l.hourlyRate) || 0;
      return sum + hours * rate;
    }, 0);

    const totalDirectCost = directCosts.reduce(
      (sum, d) => sum + calculateDirectTotal(d),
      0
    );

    const totalIndirectCost = indirectCosts.reduce((sum, i) => {
      return sum + (parseFloat(i.costAmount) || 0);
    }, 0);

    const totalAdditionalCost = additionalCosts.reduce((sum, a) => {
      return sum + (parseFloat(a.costAmount) || 0);
    }, 0);

    const subTotal =
      totalLaborCost +
      totalDirectCost +
      totalIndirectCost +
      totalAdditionalCost;

    const profitAmount = subTotal * (parseFloat(profitPercentage.toString()) / 100);

    const selectedTax = taxConfigs.find(
      (t: any) => t.taxConfigId === parseInt(taxId.toString())
    );
    const taxPercentage = selectedTax?.taxRate || 0;
    const taxAmount = (subTotal + profitAmount) * (taxPercentage / 100);

    const finalAmount = subTotal + profitAmount + taxAmount;

    return {
      totalLaborCost: Math.round(totalLaborCost * 100) / 100,
      totalDirectCost: Math.round(totalDirectCost * 100) / 100,
      totalIndirectCost: Math.round(totalIndirectCost * 100) / 100,
      totalAdditionalCost: Math.round(totalAdditionalCost * 100) / 100,
      subTotal: Math.round(subTotal * 100) / 100,
      profitAmount: Math.round(profitAmount * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      taxPercentage,
      finalAmount: Math.round(finalAmount * 100) / 100,
    };
  };

  return {
    getCostType,
    getEmployee,
    calculateDirectTotal,
    calculateTotals,
  };
};