import "./Loading.css";

function LoadingItem({ className = "" }) {
    return <div className={`skeleton ${className}`} />;
}

export function LoadingScreen() {
    return (
        <div className="skeleton-screen">
            <main className="skeleton-content">
                <div className="skeleton-heading">
                    <div className="skeleton-heading-info">
                        <LoadingItem className="skeleton-title" />
                        <LoadingItem className="skeleton-description" />
                    </div>

                    <LoadingItem className="skeleton-button" />
                </div>

                <div className="skeleton-stats">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div className="skeleton-card" key={index}>
                            <LoadingItem className="skeleton-card-icon" />
                            <LoadingItem className="skeleton-card-label" />
                            <LoadingItem className="skeleton-card-value" />
                            <LoadingItem className="skeleton-card-footer" />
                        </div>
                    ))}
                </div>

                <div className="skeleton-content-grid">
                    <div className="skeleton-panel">
                        <LoadingItem className="skeleton-panel-title" />
                        <LoadingItem className="skeleton-chart" />
                    </div>

                    <div className="skeleton-panel">
                        <LoadingItem className="skeleton-panel-title" />

                        {Array.from({ length: 4 }).map((_, index) => (
                            <div className="skeleton-list-item" key={index}>
                                <LoadingItem className="skeleton-list-icon" />

                                <div className="skeleton-list-info">
                                    <LoadingItem className="skeleton-list-title" />
                                    <LoadingItem className="skeleton-list-description" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default LoadingScreen;