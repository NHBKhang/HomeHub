import { useState } from "react";
import { Plus, Search } from "lucide-react";
// import DeviceCard from "./components/DeviceCard";

const initialDevices = [
    {
        id: 1,
        name: "Smart TV phòng khách",
        room: "Phòng khách",
        type: "TV",
        on: true,
    },
    {
        id: 2,
        name: "Đèn trần thông minh",
        room: "Phòng khách",
        type: "Light",
        on: true,
    },
    {
        id: 3,
        name: "Điều hòa phòng ngủ",
        room: "Phòng ngủ",
        type: "AC",
        on: false,
    },
];

export default function Devices() {
    const [devices, setDevices] = useState(initialDevices);
    const [search, setSearch] = useState("");

    function toggleDevice(id) {
        setDevices((current) =>
            current.map((device) =>
                device.id === id
                    ? { ...device, on: !device.on }
                    : device
            )
        );
    }

    const filteredDevices = devices.filter((device) =>
        `${device.name} ${device.room}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <section className="devices-page">
            <div className="page-heading">
                <div>
                    <h1>Thiết bị</h1>
                    <p>Quản lý các thiết bị trong nhà.</p>
                </div>

                <button type="button" className="primary-button">
                    <Plus size={18} />
                    Thêm thiết bị
                </button>
            </div>

            <div className="page-toolbar">
                <Search size={18} />

                <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Tìm thiết bị hoặc phòng..."
                />
            </div>

            {/* <div className="devices-grid">
                {filteredDevices.map((device) => (
                    <DeviceCard
                        key={device.id}
                        device={device}
                        onToggle={() => toggleDevice(device.id)}
                    />
                ))}

                {filteredDevices.length === 0 && (
                    <p>Không tìm thấy thiết bị phù hợp.</p>
                )}
            </div> */}
        </section>
    );
}