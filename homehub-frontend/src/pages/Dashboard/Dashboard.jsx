import { MonitorSmartphone, CheckSquare, Wallet } from "lucide-react";
import StatCard from "../../components/common/StatCard";

import "./Dashboard.css";

export default function Dashboard() {
    return (
        <section className="dashboard-page">
            <div className="page-heading">
                <div>
                    <h1>Tổng quan</h1>
                    <p>Quản lý ngôi nhà và công việc của bạn.</p>
                </div>
            </div>

            <div className="stats-grid">
                <StatCard
                    title="Thiết bị đang bật"
                    value="2"
                    description="Trong 3 thiết bị"
                    icon={MonitorSmartphone}
                />

                <StatCard
                    title="Công việc cần làm"
                    value="2"
                    description="Đang chờ hoàn thành"
                    icon={CheckSquare}
                />

                <StatCard
                    title="Chi tiêu tháng này"
                    value="1.255.000đ"
                    description="Tổng chi tiêu mẫu"
                    icon={Wallet}
                />
            </div>

            {/* Thêm WelcomeBanner, DeviceOverview,
          TaskOverview và ExpenseOverview tại đây */}
        </section>
    );
}