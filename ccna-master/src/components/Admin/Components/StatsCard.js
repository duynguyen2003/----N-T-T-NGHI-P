import React from 'react';
import '../../../css/Admin/AdminViews.css';

const StatsCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <div className="admin-stats-card">
      <div className="admin-stats-icon">
        {Icon && <Icon size={24} />}
      </div>
      <div className="admin-stats-info">
        <h3>{title}</h3>
        <p>{value}</p>
        {trend && <span className="admin-trend">{trend}</span>}
      </div>
    </div>
  );
};

export default StatsCard;
