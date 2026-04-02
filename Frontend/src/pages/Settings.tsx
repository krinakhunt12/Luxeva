import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { User, Mail, Save } from 'lucide-react';

const Settings: React.FC = () => {
  const { user, updateUserProfile } = useShop();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email] = useState(user?.email || '');

  const handleSave = async () => {
    if (!updateUserProfile) return;
    await updateUserProfile({ displayName });
    // You may want to show a toast or confirmation here
  };

  return (
    <div className="pt-40 pb-20 bg-bg min-h-screen">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto bg-white border border-accent p-8">
          <h1 className="text-2xl mb-4">Account Settings</h1>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] uppercase tracking-widest">Full name</label>
              <div className="mt-2 flex items-center gap-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                  <User size={20} className="text-muted" />
                </div>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="flex-1 border border-accent p-3 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest">Email</label>
              <div className="mt-2 flex items-center gap-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                  <Mail size={18} className="text-muted" />
                </div>
                <input value={email} disabled className="flex-1 border border-accent p-3 text-sm bg-gray-50" />
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={handleSave} className="flex items-center gap-2 bg-primary text-white px-6 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-gold transition-colors">
                <Save size={14} /> Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
