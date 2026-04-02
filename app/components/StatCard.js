export default function StatCard({ label, value }) {
    return (
        <div className="bg-gray-950 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-sm">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    )
}
