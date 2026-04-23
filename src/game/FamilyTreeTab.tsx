import React, { useState } from 'react';
import { Users, X, Crown, Briefcase, DollarSign, Heart, User, ChevronDown, ChevronRight, TreePine } from 'lucide-react';
import { Player, LineageEntry } from './types';

interface FamilyTreeTabProps {
  player: Player;
  calculateNetWorth: (p: Player) => number;
}

interface FamilyPerson {
  id: string;
  name: string;
  age: number;
  role: string;
  gender?: 'Male' | 'Female' | string;
  relationship?: number;
  isDead?: boolean;
  netWorth?: number;
  bestJob?: string;
  isCurrentPlayer?: boolean;
  children?: FamilyPerson[];
}

function PersonCard({ person, isSelected, onClick }: { person: FamilyPerson; isSelected: boolean; onClick: () => void }) {
  const borderColor = person.isCurrentPlayer
    ? 'border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
    : person.isDead
    ? 'border-zinc-700/50 opacity-70'
    : 'border-zinc-700 hover:border-zinc-600';

  const dotColor = person.isCurrentPlayer
    ? 'bg-emerald-500'
    : person.isDead
    ? 'bg-zinc-600'
    : 'bg-indigo-500';

  return (
    <button
      onClick={onClick}
      className={`relative w-full text-left p-3 bg-zinc-950 border rounded-xl transition-all ${borderColor} ${isSelected ? 'ring-1 ring-indigo-500/50' : ''}`}
    >
      <div className="flex items-center gap-2.5">
        <div className={`w-2.5 h-2.5 rounded-full ${dotColor} flex-shrink-0`} />
        <div className="min-w-0 flex-1">
          <div className="font-medium text-zinc-200 text-sm truncate">
            {person.name}
            {person.isCurrentPlayer && <span className="text-emerald-400 text-xs ml-1.5">(You)</span>}
          </div>
          <div className="text-xs text-zinc-500">
            {person.role} • {person.isDead ? `Died at ${person.age}` : `Age ${person.age}`}
          </div>
        </div>
      </div>
    </button>
  );
}

function PersonDetail({ person }: { person: FamilyPerson }) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${person.isCurrentPlayer ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
          <User className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-zinc-100">{person.name}</h3>
          <p className="text-sm text-zinc-500">{person.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <InfoTile icon={<Heart className="w-4 h-4" />} label="Age" value={person.isDead ? `Died at ${person.age}` : `${person.age} years`} />
        {person.gender && <InfoTile icon={<User className="w-4 h-4" />} label="Gender" value={person.gender} />}
        {person.bestJob && <InfoTile icon={<Briefcase className="w-4 h-4" />} label="Best Job" value={person.bestJob} />}
        {person.netWorth !== undefined && (
          <InfoTile icon={<DollarSign className="w-4 h-4" />} label="Net Worth" value={`$${person.netWorth.toLocaleString()}`} color="text-emerald-400" />
        )}
        {person.relationship !== undefined && (
          <div className="col-span-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-zinc-500">Relationship</span>
              <span className="text-zinc-300">{person.relationship}%</span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${person.relationship}%`,
                  background: person.relationship > 60 ? '#10b981' : person.relationship > 30 ? '#f59e0b' : '#ef4444',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {person.children && person.children.length > 0 && (
        <div className="pt-2 border-t border-zinc-800">
          <p className="text-xs text-zinc-500 mb-1">Children: {person.children.map(c => c.name).join(', ')}</p>
        </div>
      )}
    </div>
  );
}

function InfoTile({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color?: string }) {
  return (
    <div className="bg-zinc-900/50 rounded-lg p-2.5">
      <div className="flex items-center gap-1.5 text-zinc-500 mb-0.5">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className={`text-sm font-medium truncate ${color || 'text-zinc-200'}`}>{value}</p>
    </div>
  );
}

function TreeConnector({ hasChildren }: { hasChildren: boolean }) {
  if (!hasChildren) return null;
  return (
    <div className="flex justify-center">
      <div className="w-px h-4 bg-zinc-700" />
    </div>
  );
}

export default function FamilyTreeTab({ player, calculateNetWorth }: FamilyTreeTabProps) {
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [showLineage, setShowLineage] = useState(true);

  // Derive best job for current player
  const getBestJob = (): string => {
    if (!player.job && (!player.jobHistory || player.jobHistory.length === 0)) return 'None';
    let best = player.job?.title || 'Unemployed';
    // Just use current or last job title as "best" 
    if (player.jobHistory && player.jobHistory.length > 0) {
      best = player.jobHistory[player.jobHistory.length - 1].title;
    }
    if (player.job) best = player.job.title;
    return best;
  };

  // Build person nodes
  const currentPlayer: FamilyPerson = {
    id: 'current',
    name: `${player.firstName} ${player.lastName}`,
    age: player.age,
    role: `Gen ${(player.lineage?.length || 0) + 1}`,
    netWorth: calculateNetWorth(player),
    bestJob: getBestJob(),
    isCurrentPlayer: true,
    children: player.kids.map(k => ({
      id: k.id,
      name: `${k.name} ${player.lastName}`,
      age: k.age,
      role: 'Child',
      gender: k.gender,
      relationship: k.relationship,
    })),
  };

  const parents: FamilyPerson[] = player.parents.map(p => ({
    id: p.id,
    name: p.name,
    age: p.age,
    role: 'Parent',
    gender: p.gender,
    relationship: p.relationship,
    isDead: p.isDead,
  }));

  const siblings: FamilyPerson[] = player.siblings.map(s => ({
    id: s.id,
    name: s.name,
    age: s.age,
    role: 'Sibling',
    gender: s.gender,
    relationship: s.relationship,
    isDead: s.isDead,
  }));

  const partner: FamilyPerson | null = player.partner
    ? {
        id: 'partner',
        name: player.partner.name,
        age: player.partner.age,
        role: player.partner.type === 'married' ? 'Spouse' : player.partner.type === 'engaged' ? 'Fiancé(e)' : 'Partner',
        relationship: player.partner.relationship,
        gender: player.partner.gender,
      }
    : null;

  const lineagePersons: FamilyPerson[] = (player.lineage || []).map((l, idx) => ({
    id: l.id,
    name: l.name,
    age: l.ageAtDeath,
    role: `Gen ${idx + 1}`,
    isDead: true,
    netWorth: l.netWorth,
    bestJob: l.finalJob,
  }));

  const allPersons = [...lineagePersons, currentPlayer, ...parents, ...siblings, ...(partner ? [partner] : []), ...(currentPlayer.children || [])];
  const selectedPerson = allPersons.find(p => p.id === selectedPersonId) || null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-200 flex items-center gap-2">
          <TreePine className="w-5 h-5 text-indigo-400" />
          Family Tree
        </h2>
        <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2.5 py-1 rounded-full">
          Gen {(player.lineage?.length || 0) + 1}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tree View */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lineage (Past Generations) */}
          {lineagePersons.length > 0 && (
            <div>
              <button
                onClick={() => setShowLineage(!showLineage)}
                className="flex items-center gap-2 text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3 hover:text-zinc-300 transition-colors"
              >
                {showLineage ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                Past Generations ({lineagePersons.length})
              </button>
              {showLineage && (
                <div className="relative pl-5 border-l-2 border-zinc-800 space-y-3 mb-4">
                  {lineagePersons.map(person => (
                    <div key={person.id} className="relative">
                      <div className="absolute -left-[29px] top-4 w-3 h-3 rounded-full bg-zinc-600 border-2 border-zinc-900" />
                      <PersonCard
                        person={person}
                        isSelected={selectedPersonId === person.id}
                        onClick={() => setSelectedPersonId(selectedPersonId === person.id ? null : person.id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Current Generation */}
          <div>
            <div className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Current Generation</div>

            {/* Parents row */}
            {parents.length > 0 && (
              <>
                <div className="flex gap-3 mb-1 flex-wrap">
                  {parents.map(p => (
                    <div key={p.id} className="flex-1 min-w-[140px] max-w-[220px]">
                      <PersonCard
                        person={p}
                        isSelected={selectedPersonId === p.id}
                        onClick={() => setSelectedPersonId(selectedPersonId === p.id ? null : p.id)}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-center">
                  <div className="w-px h-5 bg-zinc-700" />
                </div>
              </>
            )}

            {/* Current player + partner row */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex-1 min-w-[160px] max-w-[260px]">
                <PersonCard
                  person={currentPlayer}
                  isSelected={selectedPersonId === 'current'}
                  onClick={() => setSelectedPersonId(selectedPersonId === 'current' ? null : 'current')}
                />
              </div>
              {partner && (
                <>
                  <div className="flex items-center">
                    <div className="w-4 h-px bg-pink-500/50" />
                    <Heart className="w-3.5 h-3.5 text-pink-500/50 mx-0.5" />
                    <div className="w-4 h-px bg-pink-500/50" />
                  </div>
                  <div className="flex-1 min-w-[140px] max-w-[220px]">
                    <PersonCard
                      person={partner}
                      isSelected={selectedPersonId === 'partner'}
                      onClick={() => setSelectedPersonId(selectedPersonId === 'partner' ? null : 'partner')}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Children */}
            {currentPlayer.children && currentPlayer.children.length > 0 && (
              <>
                <div className="flex justify-center">
                  <div className="w-px h-5 bg-zinc-700" />
                </div>
                <div className="flex gap-3 flex-wrap">
                  {currentPlayer.children.map(child => (
                    <div key={child.id} className="flex-1 min-w-[140px] max-w-[200px]">
                      <PersonCard
                        person={child}
                        isSelected={selectedPersonId === child.id}
                        onClick={() => setSelectedPersonId(selectedPersonId === child.id ? null : child.id)}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Siblings */}
            {siblings.length > 0 && (
              <div className="mt-5">
                <div className="text-xs text-zinc-600 uppercase tracking-wider mb-2">Siblings</div>
                <div className="flex gap-3 flex-wrap">
                  {siblings.map(s => (
                    <div key={s.id} className="flex-1 min-w-[140px] max-w-[200px]">
                      <PersonCard
                        person={s}
                        isSelected={selectedPersonId === s.id}
                        onClick={() => setSelectedPersonId(selectedPersonId === s.id ? null : s.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          {selectedPerson ? (
            <div className="sticky top-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Details</span>
                <button onClick={() => setSelectedPersonId(null)} className="text-zinc-600 hover:text-zinc-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <PersonDetail person={selectedPerson} />
            </div>
          ) : (
            <div className="bg-zinc-950/50 border border-dashed border-zinc-800 rounded-xl p-8 text-center">
              <User className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
              <p className="text-sm text-zinc-600">Click a person to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
