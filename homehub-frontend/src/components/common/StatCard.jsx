export default function StatCard({
    title,
    value,
    description,
    icon: Icon,
}) {
    return (
        <article className="stat-card">
            <div className="stat-card-top">
                <span>{title}</span>

                <span className="stat-card-icon">
                    <Icon size={20} />
                </span>
            </div>

            <h2>{value}</h2>
            <p>{description}</p>
        </article>
    );
}