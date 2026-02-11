function Leaderboard({ data }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold mb-3">Leaderboard</h3>
      <ol className="space-y-2">
        {data.map((u, i) => (
          <li key={u.email || u.name} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">{i+1}</div>
              <div>
                <div className="font-medium">{u.name}</div>
                <div className="text-xs text-gray-500">{u.email}</div>
              </div>
            </div>
            <div className="font-semibold">{u.points} pts</div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Leaderboard;
