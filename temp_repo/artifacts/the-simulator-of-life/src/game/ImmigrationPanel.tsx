import React, { useState, useMemo } from 'react';
import { Globe, Plane, Search, ChevronRight, ChevronDown, Shield, Star, Clock, AlertTriangle } from 'lucide-react';
import { COUNTRIES } from './constants';
import {
  getPassportData,
  getImmigrationProfile,
  getVisaOptions,
  calculateImmigrationChance,
  getPassportTierColor,
  getDifficultyColor,
  getDifficultyLabel,
} from './immigration';
import type { VisaRequirement } from './immigration';
import type { Player, PlayerVisa } from './types';

interface ImmigrationPanelProps {
  player: Player;
  onApplyVisa: (country: string, visaType: VisaRequirement) => void;
  onCancelVisa: (visaId: string) => void;
  logs?: { message: string; type: string }[];
}

export default function ImmigrationPanel({ player, onApplyVisa, onCancelVisa }: ImmigrationPanelProps) {
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [showPassport, setShowPassport] = useState(true);

  const passport = player.passport || getPassportData(player.country);
  const pendingVisas = (player.visas || []).filter(v => v.status === 'pending');
  const approvedVisas = (player.visas || []).filter(v => v.status === 'approved');

  const filteredCountries = useMemo(() => {
    const q = search.toLowerCase();
    return COUNTRIES
      .filter(c => c !== player.country)
      .filter(c => !q || c.toLowerCase().includes(q))
      .sort((a, b) => a.localeCompare(b));
  }, [search, player.country]);

  const selectedProfile = selectedCountry ? getImmigrationProfile(selectedCountry) : null;
  const selectedVisas = selectedCountry ? getVisaOptions(selectedCountry) : [];

  return (
    <div className="space-y-6">
      {/* Passport Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
        <button
          onClick={() => setShowPassport(!showPassport)}
          className="w-full flex items-center justify-between p-5"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
              style={{ backgroundColor: getPassportTierColor(passport.tier) + '22', color: getPassportTierColor(passport.tier) }}
            >
              {passport.tier}
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-zinc-300">Your Passport</div>
              <div className="text-xs text-zinc-500">{player.country}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-bold" style={{ color: getPassportTierColor(passport.tier) }}>
                Power: {passport.strength}/100
              </div>
              <div className="text-xs text-zinc-500">{passport.visaFreeCountries} visa-free countries</div>
            </div>
            {showPassport ? <ChevronDown className="w-4 h-4 text-zinc-500" /> : <ChevronRight className="w-4 h-4 text-zinc-500" />}
          </div>
        </button>

        {showPassport && (
          <div className="border-t border-zinc-800 p-5">
            {/* Passport strength bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400">Passport Strength</span>
                <span style={{ color: getPassportTierColor(passport.tier) }}>Tier {passport.tier}</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${passport.strength}%`,
                    background: `linear-gradient(90deg, ${getPassportTierColor(passport.tier)}88, ${getPassportTierColor(passport.tier)})`,
                  }}
                />
              </div>
            </div>

            {/* Previous countries */}
            {player.previousCountries && player.previousCountries.length > 0 && (
              <div className="mb-3">
                <div className="text-xs text-zinc-500 mb-1">Previously lived in:</div>
                <div className="flex flex-wrap gap-1">
                  {player.previousCountries.map(c => (
                    <span key={c} className="px-2 py-0.5 bg-zinc-800 rounded text-xs text-zinc-400">{c}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Active visas */}
            {approvedVisas.length > 0 && (
              <div>
                <div className="text-xs text-zinc-500 mb-2 uppercase tracking-wider font-semibold">Active Visas</div>
                <div className="space-y-2">
                  {approvedVisas.map(v => (
                    <div key={v.id} className="flex items-center justify-between p-2 bg-emerald-950/30 border border-emerald-900/40 rounded-lg">
                      <div>
                        <span className="text-sm text-emerald-300 font-medium">{v.country}</span>
                        <span className="text-xs text-emerald-500 ml-2">{v.type.replace('_', ' ')}</span>
                      </div>
                      {v.expiresAge && <span className="text-xs text-zinc-500">Expires age {v.expiresAge}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending applications */}
            {pendingVisas.length > 0 && (
              <div className="mt-3">
                <div className="text-xs text-zinc-500 mb-2 uppercase tracking-wider font-semibold">Pending Applications</div>
                <div className="space-y-2">
                  {pendingVisas.map(v => (
                    <div key={v.id} className="flex items-center justify-between p-2 bg-amber-950/30 border border-amber-900/40 rounded-lg">
                      <div>
                        <span className="text-sm text-amber-300 font-medium">{v.country}</span>
                        <span className="text-xs text-amber-500 ml-2">{v.type.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span className="text-xs text-zinc-500">{v.processYearsLeft}yr left</span>
                        <button
                          onClick={() => onCancelVisa(v.id)}
                          className="text-xs text-rose-400 hover:text-rose-300 ml-2"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Country Browser */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4" /> Immigration — Apply for a Visa
        </h3>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search countries..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        {/* Country selection or detail view */}
        {selectedCountry && selectedProfile ? (
          <div>
            {/* Back button */}
            <button
              onClick={() => setSelectedCountry(null)}
              className="text-xs text-indigo-400 hover:text-indigo-300 mb-3 flex items-center gap-1"
            >
              ← Back to countries
            </button>

            {/* Country header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold text-zinc-200">{selectedCountry}</h4>
                <div className="text-xs text-zinc-500">{selectedProfile.region} • {selectedProfile.officialLanguage}</div>
              </div>
              <div className="text-right">
                <div
                  className="text-sm font-bold"
                  style={{ color: getDifficultyColor(selectedProfile.difficulty) }}
                >
                  {getDifficultyLabel(selectedProfile.difficulty)}
                </div>
                <div className="text-xs text-zinc-500">Immigration difficulty</div>
              </div>
            </div>

            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">{selectedProfile.description}</p>

            {/* Passport of destination */}
            {(() => {
              const destPassport = getPassportData(selectedCountry);
              return (
                <div className="flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-xl mb-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: getPassportTierColor(destPassport.tier) + '22', color: getPassportTierColor(destPassport.tier) }}
                  >
                    {destPassport.tier}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-zinc-400">Passport you'd gain</div>
                    <div className="text-sm text-zinc-200">
                      Tier {destPassport.tier} • Strength {destPassport.strength} • {destPassport.visaFreeCountries} visa-free
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Visa options */}
            {!selectedProfile.acceptsImmigrants ? (
              <div className="p-4 bg-rose-950/30 border border-rose-900/40 rounded-xl text-center">
                <AlertTriangle className="w-5 h-5 text-rose-400 mx-auto mb-2" />
                <p className="text-sm text-rose-300">This country does not accept immigrants.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2">Available Visa Types</div>
                {selectedVisas.map(visa => {
                  const { chance, factors } = calculateImmigrationChance(visa, selectedCountry, player);
                  const canAfford = player.money >= visa.cost;
                  const alreadyPending = pendingVisas.some(v => v.country === selectedCountry && v.type === visa.type);
                  const chancePercent = Math.round(chance * 100);

                  return (
                    <div key={visa.type} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                            {visa.type === 'investment' ? <Star className="w-3.5 h-3.5 text-amber-400" /> :
                             visa.type === 'citizenship' ? <Shield className="w-3.5 h-3.5 text-emerald-400" /> :
                             visa.type === 'work' ? <Plane className="w-3.5 h-3.5 text-blue-400" /> : null}
                            {visa.label}
                          </div>
                          <p className="text-xs text-zinc-500 mt-0.5">{visa.description}</p>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <div className={`text-sm font-bold ${chancePercent > 60 ? 'text-emerald-400' : chancePercent > 30 ? 'text-amber-400' : 'text-rose-400'}`}>
                            {chancePercent}%
                          </div>
                          <div className="text-xs text-zinc-600">chance</div>
                        </div>
                      </div>

                      {/* Factors */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {factors.map((f, i) => (
                          <span
                            key={i}
                            className={`text-[10px] px-1.5 py-0.5 rounded ${
                              f.effect === 'positive' ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/40' :
                              f.effect === 'negative' ? 'bg-rose-950/50 text-rose-400 border border-rose-900/40' :
                              'bg-zinc-800 text-zinc-400 border border-zinc-700'
                            }`}
                          >
                            {f.effect === 'positive' ? '✓' : f.effect === 'negative' ? '✗' : '•'} {f.label}
                          </span>
                        ))}
                      </div>

                      {/* Cost and apply */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-zinc-500">
                          <span>Cost: <span className={canAfford ? 'text-emerald-400' : 'text-rose-400'}>${visa.cost.toLocaleString()}</span></span>
                          {visa.processingTimeYears > 0 && <span>Processing: {visa.processingTimeYears}yr</span>}
                          {visa.grantsDuration && <span>Duration: {visa.grantsDuration}yr</span>}
                        </div>
                        <button
                          onClick={() => onApplyVisa(selectedCountry, visa)}
                          disabled={!canAfford || !player.isAlive || player.age < 18 || alreadyPending || !!player.inPrison}
                          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          {alreadyPending ? 'Pending...' : player.age < 18 ? 'Must be 18+' : 'Apply'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Country list */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
            {filteredCountries.slice(0, 50).map(countryName => {
              const profile = getImmigrationProfile(countryName);
              const destPassport = getPassportData(countryName);
              return (
                <button
                  key={countryName}
                  onClick={() => setSelectedCountry(countryName)}
                  className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors text-left flex items-center justify-between group"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-zinc-200 truncate">{countryName}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="text-[10px] font-bold px-1 rounded"
                        style={{ backgroundColor: getPassportTierColor(destPassport.tier) + '22', color: getPassportTierColor(destPassport.tier) }}
                      >
                        {destPassport.tier}
                      </span>
                      <span className="text-[10px]" style={{ color: getDifficultyColor(profile.difficulty) }}>
                        {getDifficultyLabel(profile.difficulty)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0" />
                </button>
              );
            })}
            {filteredCountries.length > 50 && (
              <div className="col-span-2 text-center text-xs text-zinc-500 py-2">
                Showing 50 of {filteredCountries.length} — refine your search
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
