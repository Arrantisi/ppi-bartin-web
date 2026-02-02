import { SectionCards } from "@/components/dashboard/card";
import { DataTable } from "@/components/dashboard/table/data-table";
import { Card } from "@/components/ui/card";

const DashboardPage = async () => {
  return (
    <div className="space-y-6 pb-14">
      <SectionCards />
      <Card className="mx-4 lg:mx-6">
        <DataTable />
      </Card>
    </div>
  );
};

export default DashboardPage;
