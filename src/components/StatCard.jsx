export default function StatCard({ stats }) {
  return (
    <div className="flex gap-4 rounded-2xl p-6 bg-[#243325]">
      <div>{stats.icon}</div>
      <div>
        <div className="text-lg">{stats.heading}</div>
        <div className="text-4xl mt-3">{stats.value}</div>
      </div>
    </div>
  );
}
