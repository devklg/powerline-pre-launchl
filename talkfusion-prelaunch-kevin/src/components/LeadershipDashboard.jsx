import React from 'react';
import { useState, useEffect } from 'react';
import BinaryTreeVisualization from './BinaryTreeVisualization';

export default function LeadershipDashboard({ teamStructure }) {
    const [leadershipStats, setLeadershipStats] = useState({
        totalTeamMembers: 0,
        totalTeamVolume: 0,
        leftLegVolume: 0,
        rightLegVolume: 0,
        cyclesAvailable: 0,
        topPerformers: []
    });

    useEffect(() => {
        if (teamStructure) {
            const leftVolume = teamStructure.leftLegVolume || 0;
            const rightVolume = teamStructure.rightLegVolume || 0;

            setLeadershipStats({
                totalTeamMembers: (teamStructure.placements || []).length,
                totalTeamVolume: leftVolume + rightVolume,
                leftLegVolume: leftVolume,
                rightLegVolume: rightVolume,
                cyclesAvailable: Math.floor(Math.min(leftVolume, rightVolume) / 200),
                topPerformers: (teamStructure.placements || [])
                    .sort((a, b) => b.initialSV - a.initialSV)
                    .slice(0, 5)
            });
        }
    }, [teamStructure]);

    return (
        <div className="space-y-8">
            {/* Leadership Vision Banner */}
            <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 rounded-3xl p-8 shadow-2xl">
                <h2 className="text-3xl font-bold text-white mb-4">Leadership Vision</h2>
                <p className="text-xl text-purple-200">
                    Empowering success through leadership, innovation, and teamwork in the Talk Fusion community.
                </p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-purple-800/50 rounded-2xl p-6 border border-purple-500/30">
                    <h3 className="text-lg font-semibold text-purple-200">Team Members</h3>
                    <p className="text-3xl font-bold text-white">{leadershipStats.totalTeamMembers}</p>
                </div>
                <div className="bg-purple-800/50 rounded-2xl p-6 border border-purple-500/30">
                    <h3 className="text-lg font-semibold text-purple-200">Total Team Volume</h3>
                    <p className="text-3xl font-bold text-white">{leadershipStats.totalTeamVolume} SV</p>
                </div>
                <div className="bg-purple-800/50 rounded-2xl p-6 border border-purple-500/30">
                    <h3 className="text-lg font-semibold text-purple-200">Cycles Available</h3>
                    <p className="text-3xl font-bold text-white">{leadershipStats.cyclesAvailable}</p>
                </div>
                <div className="bg-green-800/50 rounded-2xl p-6 border border-green-500/30">
                    <h3 className="text-lg font-semibold text-green-200">Team Balance</h3>
                    <p className="text-3xl font-bold text-white">
                        {Math.round((Math.min(leadershipStats.leftLegVolume, leadershipStats.rightLegVolume) /
                            Math.max(leadershipStats.leftLegVolume, leadershipStats.rightLegVolume) * 100) || 0)}%
                    </p>
                </div>
            </div>

            {/* Top Performers */}
            <div className="bg-purple-800/30 rounded-2xl p-6 border border-purple-500/30">
                <h3 className="text-2xl font-bold text-white mb-4">Top Performers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {leadershipStats.topPerformers.map((performer, index) => (
                        <div key={performer.enrollerId}
                            className="bg-purple-700/30 rounded-xl p-4 border border-purple-400/30">
                            <div className="flex items-center space-x-3">
                                <div className="bg-purple-500/30 rounded-full p-2">
                                    <span className="text-xl font-bold text-white">#{index + 1}</span>
                                </div>
                                <div>
                                    <p className="text-white font-semibold">{performer.name}</p>
                                    <p className="text-purple-200">{performer.initialSV} SV</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team Structure Visualization */}
            <div className="bg-purple-800/30 rounded-2xl p-6 border border-purple-500/30">
                <h3 className="text-2xl font-bold text-white mb-4">Team Structure</h3>
                <BinaryTreeVisualization
                    leftLegVolume={leadershipStats.leftLegVolume}
                    rightLegVolume={leadershipStats.rightLegVolume}
                    placements={teamStructure.placements || []}
                />
            </div>
        </div>
    );
} 