import "./StatCard.css";

export default function StatCard({
    title,
    value,
    icon: Icon,
    color = "purple",
    description,
}) {
    return (
        <div className="admin-stat-card">
            <div className={`admin-stat-card-icon ${color}`}>
                {Icon && <Icon size={21} />}
            </div>

            <div className="admin-stat-card-content">
                <p>{title}</p>
                <h3>{value}</h3>
                {description && <span>{description}</span>}
            </div>
        </div>
    );
}