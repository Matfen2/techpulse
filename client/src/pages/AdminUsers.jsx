import { useState, useEffect } from 'react';
import { getAllUsers, deleteUser } from '../services/productService';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Supprimer l'utilisateur ${name} ?`)) return;
    try {
      await deleteUser(id);
      await fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-5 sm:py-8">
      <div className="mb-5 sm:mb-8">
        <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-[var(--text-primary)] mb-1 sm:mb-2 font-request">Utilisateurs</h1>
        <p className="text-[var(--text-muted)] text-xs sm:text-sm font-qaranta">{users.length} utilisateur{users.length > 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-[var(--text-muted)] text-xs sm:text-sm font-qaranta">Chargement...</div>
      ) : (
        <>
          {/* ── Desktop Table ── */}
          <div className="hidden sm:block bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--bg-deep)]/50">
                    <th className="text-left py-3 px-4 text-[var(--text-muted)] font-medium text-[10px] sm:text-xs uppercase tracking-wider font-qaranta">Nom</th>
                    <th className="text-left py-3 px-4 text-[var(--text-muted)] font-medium text-[10px] sm:text-xs uppercase tracking-wider font-qaranta">Email</th>
                    <th className="text-left py-3 px-4 text-[var(--text-muted)] font-medium text-[10px] sm:text-xs uppercase tracking-wider font-qaranta">Rôle</th>
                    <th className="text-left py-3 px-4 text-[var(--text-muted)] font-medium text-[10px] sm:text-xs uppercase tracking-wider font-qaranta">Inscrit le</th>
                    <th className="text-right py-3 px-4 text-[var(--text-muted)] font-medium text-[10px] sm:text-xs uppercase tracking-wider font-qaranta">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-[var(--border)]/50 last:border-0 hover:bg-[var(--bg-deep)]/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] text-[10px] sm:text-xs font-bold font-qaranta shrink-0">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </div>
                          <span className="text-xs sm:text-sm text-[var(--text-primary)] font-medium font-request truncate">
                            {user.firstName} {user.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs sm:text-sm text-[var(--text-muted)] truncate max-w-[200px] font-qaranta">{user.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] sm:text-xs font-qaranta ${
                            user.role === 'admin'
                              ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                              : 'bg-[var(--bg-base)] text-[var(--text-muted)]'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[10px] sm:text-xs text-[var(--text-muted)] font-qaranta">
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {user.role !== 'admin' ? (
                          <button
                            onClick={() => handleDelete(user._id, `${user.firstName} ${user.lastName}`)}
                            className="text-[10px] sm:text-xs text-[var(--error)] hover:underline cursor-pointer font-qaranta"
                          >
                            Supprimer
                          </button>
                        ) : (
                          <span className="text-[10px] sm:text-xs text-[var(--text-muted)] font-qaranta">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Mobile Cards ── */}
          <div className="sm:hidden space-y-3">
            {users.map((user) => (
              <div key={user._id} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] text-xs font-bold font-qaranta shrink-0">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[var(--text-primary)] font-medium font-request truncate">
                        {user.firstName} {user.lastName}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-qaranta shrink-0 ${
                          user.role === 'admin'
                            ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                            : 'bg-[var(--bg-base)] text-[var(--text-muted)]'
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] truncate font-qaranta mt-0.5">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-[var(--border)]/50">
                  <span className="text-[10px] text-[var(--text-muted)] font-qaranta">
                    Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                  {user.role !== 'admin' ? (
                    <button
                      onClick={() => handleDelete(user._id, `${user.firstName} ${user.lastName}`)}
                      className="text-[10px] text-[var(--error)] hover:underline cursor-pointer font-qaranta"
                    >
                      Supprimer
                    </button>
                  ) : (
                    <span className="text-[10px] text-[var(--text-muted)] font-qaranta">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminUsers;