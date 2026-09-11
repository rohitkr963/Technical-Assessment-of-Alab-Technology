import { Archive, ArrowUpRight, Check, Package, Tag } from 'lucide-react';

const cards = [
  { key: 'total', label: 'Total products', icon: Package, accent: 'ink' },
  { key: 'active', label: 'Active products', icon: Check, accent: 'mint' },
  { key: 'lowStock', label: 'Low stock', icon: Archive, accent: 'amber' },
  { key: 'categories', label: 'Categories', icon: Tag, accent: 'coral' }
];

export function CatalogStats({ stats }) {
  return (
    <section className="stats-grid">
      {cards.map(({ key, label, icon: Icon, accent }) => (
        <div className={`stat-card ${accent}`} key={key}>
          <div className="stat-icon"><Icon /></div>
          <div><span>{label}</span><strong>{stats[key]}</strong></div>
          <ArrowUpRight size={17} className="stat-arrow" />
        </div>
      ))}
    </section>
  );
}
