import { AppLayout } from "../components/AppLayout";
import PricingPlans from "../components/PricingPlans";

export default function PricingPage() {
  return (
    <AppLayout section="Workspace" current="Pricing">
      <PricingPlans compact />
    </AppLayout>
  );
}
