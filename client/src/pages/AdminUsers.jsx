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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Utilisateurs</h1>
        <p className="text-[var(--text-muted)]">{users.length} utilisateur{users.length > 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-[var(--text-muted)]">Chargement...</div>
      ) : (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-[var(--border)] text-xs text-[var(--text-muted)] uppercase tracking-wide">
            <span>Nom</span>
            <span>Email</span>
            <span>Rôle</span>
            <span>Inscrit le</span>
            <span>Actions</span>
          </div>
          {users.map((user) => (
            <div
              key={user._id}
              className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-5 py-4 border-b border-[var(--border)] last:border-0 items-center"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] text-xs font-bold">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <span className="text-sm text-[var(--text-primary)] font-medium">
                  {user.firstName} {user.lastName}
                </span>
              </div>
              <span className="text-sm text-[var(--text-muted)] truncate">{user.email}</span>
              <span
                className={`px-2 py-0.5 rounded text-xs ${
                  user.role === 'admin'
                    ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                    : 'bg-[var(--bg-base)] text-[var(--text-muted)]'
                }`}
              >
                {user.role}
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                {new Date(user.createdAt).toLocaleDateString('fr-FR')}
              </span>
              <div>
                {user.role !== 'admin' ? (
                  <button
                    onClick={() => handleDelete(user._id, `${user.firstName} ${user.lastName}`)}
                    className="text-xs text-[var(--error)] hover:underline cursor-pointer"
                  >
                    Supprimer
                  </button>
                ) : (
                  <span className="text-xs text-[var(--text-muted)]">—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;