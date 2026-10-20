import { apiClient } from "./client";

export const intelligenceApi = {
  getOverview: async () => (await apiClient.get("/intelligence/overview")).data,
  breakEven: async (fixedCosts, pricePerUnit, variableCostPerUnit) =>
    (
      await apiClient.get("/intelligence/break-even", {
        params: { fixed_costs: fixedCosts, price_per_unit: pricePerUnit, variable_cost_per_unit: variableCostPerUnit },
      })
    ).data,
  grossMargin: async (revenue, cogs) =>
    (
      await apiClient.get("/intelligence/gross-margin", {
        params: { revenue, cogs },
      })
    ).data,
};