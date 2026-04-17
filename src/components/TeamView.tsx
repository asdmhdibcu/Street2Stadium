import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, UserPlus, Shield, Star, MapPin, Search, Plus, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, setDoc, updateDoc } from 'firebase/firestore';

export default function TeamView({ showToast }: { showToast: (msg: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [teamStore, setTeamStore] = useState<any>(null);
  
  const [squad, setSquad] = useState<any[]>([]);
  
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerPos, setNewPlayerPos] = useState('CM');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function loadTeam() {
      if (!auth.currentUser) return;
      try {
        const tQuery = query(collection(db, 'teams'), where('ownerId', '==', auth.currentUser.uid));
        const tSnap = await getDocs(tQuery);
        if (!tSnap.empty) {
           const docSnap = tSnap.docs[0];
           const teamData = { id: docSnap.id, ...docSnap.data() };
           setTeamStore(teamData);
           if (teamData.members && teamData.members.length > 0) {
              setSquad(teamData.members);
           } else {
             // Let's seed initial members if empty
             const initialSquad = [
               { id: '1', name: 'K. Diallo', pos: 'ST', rating: 78, status: 'Active' },
               { id: '2', name: 'M. Mensah', pos: 'LW', rating: 82, status: 'Active' },
               { id: '3', name: 'O. Ibrahim', pos: 'CB', rating: 75, status: 'Active' },
               { id: '4', name: 'A. Okoro', pos: 'GK', rating: 80, status: 'Active' },
               { id: '5', name: 'J. Mbeki', pos: 'CM', rating: 74, status: 'Active' }
             ];
             await updateDoc(docSnap.ref, { members: initialSquad });
             setSquad(initialSquad);
             setTeamStore({ ...teamData, members: initialSquad });
           }
        } else {
           // Provide a default team to satisfy schema
           const newTeamRef = doc(collection(db, 'teams'));
           const initialSquad = [
              { id: '1', name: 'K. Diallo', pos: 'ST', rating: 78, status: 'Active' },
              { id: '2', name: 'M. Mensah', pos: 'LW', rating: 82, status: 'Active' },
              { id: '3', name: 'O. Ibrahim', pos: 'CB', rating: 75, status: 'Suspended' },
              { id: '4', name: 'A. Okoro', pos: 'GK', rating: 80, status: 'Active' },
              { id: '5', name: 'J. Mbeki', pos: 'CM', rating: 74, status: 'Injured' }
           ];
           const newTeam = {
              ownerId: auth.currentUser.uid,
              name: 'Lagos United Demo',
              location: 'Lagos, NG',
              members: initialSquad,
              createdAt: new Date().toISOString()
           };
           await setDoc(newTeamRef, newTeam);
           setTeamStore({ id: newTeamRef.id, ...newTeam });
           setSquad(initialSquad);
        }
      } catch (err) {
        try {
          handleFirestoreError(err, OperationType.GET, 'teams');
        } catch {
          // Handled
        }
      }
    }
    loadTeam();
  }, []);

  const handleAddPlayer = async () => {
    if (!newPlayerName.trim() || !teamStore?.id) return;
    setIsAdding(true);

    try {
      const newMember = {
        id: `p_${Date.now()}`,
        name: newPlayerName,
        pos: newPlayerPos,
        rating: Math.floor(Math.random() * (85 - 65 + 1)) + 65,
        status: 'Active'
      };

      const teamRef = doc(db, 'teams', teamStore.id);
      const updatedMembers = [...squad, newMember];
      
      await updateDoc(teamRef, {
        members: updatedMembers
      });

      setSquad(updatedMembers);
      setTeamStore({ ...teamStore, members: updatedMembers });
      showToast(`${newPlayerName} added to squad!`);
      setNewPlayerName('');
      setShowAddPlayer(false);
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.UPDATE, `teams/${teamStore.id}`);
      } catch {
         showToast("Failed to add player.");
      }
    } finally {
      setIsAdding(false);
    }
  };

  const filteredSquad = squad.filter(player => 
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    player.pos.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">{teamStore ? teamStore.name : 'First Team Squad'}</h2>
          <p className="text-text-muted flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] mt-1">
            <MapPin size={12} className="text-accent" /> {teamStore?.location || 'Lagos Youth Academy'} • Premier Div
          </p>
        </div>
        <button onClick={() => setShowAddPlayer(true)} className="bg-accent text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all">
          <UserPlus size={18} /> Add Player
        </button>
      </div>

      <AnimatePresence>
        {showAddPlayer && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }} 
            animate={{ opacity: 1, y: 0, height: 'auto' }} 
            exit={{ opacity: 0, y: -20, height: 0 }} 
            className="overflow-hidden"
          >
            <div className="glass-card p-6 flex flex-col md:flex-row gap-4 items-end mb-6">
              <div className="w-full">
               <label className="text-[10px] uppercase font-bold text-text-muted px-2 block mb-1">Player Name</label>
               <input 
                 value={newPlayerName}
                 onChange={e => setNewPlayerName(e.target.value)}
                 placeholder="e.g. Victor Osimhen" 
                 className="w-full bg-[#121212] border border-border rounded-xl py-3 px-4 text-sm font-bold focus:border-accent outline-none" 
               />
              </div>
              <div className="w-full md:w-48">
               <label className="text-[10px] uppercase font-bold text-text-muted px-2 block mb-1">Pos</label>
               <select 
                 value={newPlayerPos}
                 onChange={e => setNewPlayerPos(e.target.value)}
                 className="w-full bg-[#121212] border border-border rounded-xl py-3 px-4 text-sm font-bold focus:border-accent outline-none appearance-none"
               >
                 {['GK', 'LB', 'CB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'].map(p => (
                   <option key={p} value={p}>{p}</option>
                 ))}
               </select>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
               <button 
                 disabled={isAdding}
                 onClick={handleAddPlayer} 
                 className="w-full md:w-auto bg-accent text-black px-6 py-3 rounded-xl font-black text-xs uppercase hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2 whitespace-nowrap h-[46px]"
               >
                 {isAdding ? "Saving..." : <><Plus size={16} /> Add to Squad</>}
               </button>
               <button onClick={() => setShowAddPlayer(false)} className="px-4 py-3 bg-white/5 rounded-xl hover:bg-white/10 h-[46px] flex items-center justify-center">
                 <X size={16} />
               </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lineup Builder Visualization */}
        <section className="lg:col-span-2 bg-surface border border-border rounded-[24px] overflow-hidden relative min-h-[500px] flex flex-col shadow-inner">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            {/* Simple Pitch Layout lines */}
            <div className="absolute inset-4 border border-white/30" />
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-1/2 h-1/4 border-b border-white/30" />
            <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-1/2 h-1/4 border-t border-white/30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white/30" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
          </div>
          
          <div className="relative z-10 p-4 md:p-8 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8 md:mb-12">
              <div className="flex items-center gap-2">
                <Shield className="text-accent" size={20} />
                <h3 className="font-bold tracking-[1px] uppercase text-[12px] text-text-muted">Tactical Board</h3>
              </div>
              <button className="text-[10px] font-black uppercase border border-border px-3 py-1 rounded-lg hover:border-accent hover:text-accent transition-colors" onClick={() => showToast("Formation editor requires Coach Role permission.")}>4-3-3 Symmetric</button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center space-y-16 md:space-y-20 overflow-x-auto pb-4">
              <div className="flex gap-12 md:gap-20">
                <PlayerDot name="Mensah" pos="LW" onClick={() => showToast("Player details: M. Mensah (LW)")} />
                <PlayerDot name="Diallo" pos="ST" onClick={() => showToast("Player details: K. Diallo (ST)")} />
                <PlayerDot name="Sane" pos="RW" onClick={() => showToast("Player details: L. Sane (RW)")} />
              </div>
              <div className="flex gap-16 md:gap-24">
                <PlayerDot name="Toure" pos="CM" onClick={() => showToast("Player details: Y. Toure (CM)")} />
                <PlayerDot name="Mbeki" pos="CM" onClick={() => showToast("Player details: J. Mbeki (CM)")} />
                <PlayerDot name="Kante" pos="CM" onClick={() => showToast("Player details: N. Kante (CM)")} />
              </div>
              <div className="flex gap-6 md:gap-12">
                <PlayerDot name="Koulibaly" pos="LB" onClick={() => showToast("Player details: K. Koulibaly (LB)")} />
                <PlayerDot name="Okoro" pos="CB" onClick={() => showToast("Player details: A. Okoro (CB)")} />
                <PlayerDot name="Ibrahim" pos="CB" onClick={() => showToast("Player details: O. Ibrahim (CB)")} />
                <PlayerDot name="Bissaka" pos="RB" onClick={() => showToast("Player details: A. Bissaka (RB)")} />
              </div>
              <div>
                <PlayerDot name="Enyeama" pos="GK" onClick={() => showToast("Player details: V. Enyeama (GK)")} />
              </div>
            </div>
          </div>
        </section>

        {/* Players List */}
        <section className="glass-card p-6 h-fit bg-surface border-border flex flex-col">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search squad..." 
              className="w-full bg-white/5 border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] scrollbar-hide">
            {filteredSquad.map((player, i) => (
              <div key={i} onClick={() => showToast(`View full profile for ${player.name}`)} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-border transition-all group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-border flex items-center justify-center font-bold text-[10px] uppercase">
                    {player.pos}
                  </div>
                  <div>
                    <p className="font-bold text-sm tracking-tight">{player.name}</p>
                    <p className={cn(
                      "text-[9px] uppercase font-black tracking-widest",
                      player.status === 'Active' ? 'text-accent' : 
                      player.status === 'Injured' ? 'text-red-400' : 'text-text-muted'
                    )}>{player.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-accent tracking-tighter">{player.rating}</p>
                  <div className="flex gap-0.5">
                    {[1,2,3].map(s => <Star key={s} size={8} className="fill-accent text-accent" />)}
                  </div>
                </div>
              </div>
            ))}
            {filteredSquad.length === 0 && (
               <p className="text-center text-text-muted text-xs font-bold py-8 uppercase tracking-widest">No players found</p>
            )}
          </div>

          <button onClick={() => showToast("Staff Management unlocked in Pro Version.")} className="w-full mt-6 py-4 border border-border rounded-xl text-[10px] uppercase tracking-[2px] font-black text-text-muted hover:text-accent hover:border-accent transition-all">
            Manage Staff
          </button>
        </section>
      </div>
    </motion.div>
  );
}

function PlayerDot({ name, pos, onClick }: { name: string, pos: string, onClick?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={onClick}>
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/20 bg-pitch group-hover:bg-accent group-hover:border-accent transition-all flex items-center justify-center text-[10px] font-black group-hover:text-accent group-hover:border-accent group-hover:bg-accent/10 text-white">
        {pos}
      </div>
      <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100">{name}</span>
    </div>
  );
}
