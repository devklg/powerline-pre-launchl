import React from 'react';

export default function BinaryTreeVisualization({ leftLegVolume, rightLegVolume, placements }) {
    return (
        <div className="mt-8 p-8 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 rounded-2xl shadow-2xl">
            <h3 className="text-2xl font-bold text-center text-white mb-8 tracking-wide">
                Your Pre-Launch Team Structure
            </h3>

            <div className="flex justify-center mb-6">
                <div className="relative">
                    {/* Connecting Lines */}
                    <div className="absolute top-24 left-1/2 w-px h-16 bg-gradient-to-b from-purple-300 to-transparent"></div>
                    <div className="absolute top-40 left-1/4 w-1/2 h-px bg-gradient-to-r from-blue-400 to-green-400"></div>

                    {/* Kevin's Position (Top) */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                            <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white p-2 border-2 border-purple-300/50 shadow-lg transform hover:scale-105 transition-all duration-300">
                                <div className="text-center">
                                    <div className="font-bold text-lg">Kevin</div>
                                    <div className="text-purple-200 text-sm">Position #5</div>
                                    <div className="text-xs text-purple-200 mt-1">Pre-Launch Leader</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Binary Tree Structure */}
                    <div className="mt-40 flex justify-between w-[800px]">
                        {/* Left Leg */}
                        <div className="text-center transform hover:scale-105 transition-transform duration-300">
                            <div className="mb-6">
                                <div className="w-40 h-24 rounded-xl bg-gradient-to-br from-blue-900 to-blue-700 p-3 border border-blue-500/30 shadow-lg">
                                    <div className="font-bold text-blue-100">Left Team</div>
                                    <div className="text-2xl font-bold text-blue-200 mt-1">{leftLegVolume} SV</div>
                                    <div className="text-xs text-blue-300 mt-1">Team Volume</div>
                                </div>
                            </div>
                            <div className="flex flex-wrap justify-center gap-3 max-w-[300px]">
                                {placements
                                    .filter(p => p.leg === 'LEFT')
                                    .map((placement, index) => (
                                        <div
                                            key={placement.enrollerId}
                                            className="group relative"
                                        >
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                                            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-xs border border-blue-400/30 shadow-lg transform hover:scale-105 transition-all duration-300">
                                                <div className="text-center">
                                                    <div className="font-bold text-sm">{placement.position}</div>
                                                    <div className="text-blue-200">{placement.initialSV} SV</div>
                                                    <div className="text-[10px] text-blue-300 mt-0.5">{placement.name}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Right Leg */}
                        <div className="text-center transform hover:scale-105 transition-transform duration-300">
                            <div className="mb-6">
                                <div className="w-40 h-24 rounded-xl bg-gradient-to-br from-green-900 to-green-700 p-3 border border-green-500/30 shadow-lg">
                                    <div className="font-bold text-green-100">Right Team</div>
                                    <div className="text-2xl font-bold text-green-200 mt-1">{rightLegVolume} SV</div>
                                    <div className="text-xs text-green-300 mt-1">Team Volume</div>
                                </div>
                            </div>
                            <div className="flex flex-wrap justify-center gap-3 max-w-[300px]">
                                {placements
                                    .filter(p => p.leg === 'RIGHT')
                                    .map((placement, index) => (
                                        <div
                                            key={placement.enrollerId}
                                            className="group relative"
                                        >
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-green-300 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                                            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-white text-xs border border-green-400/30 shadow-lg transform hover:scale-105 transition-all duration-300">
                                                <div className="text-center">
                                                    <div className="font-bold text-sm">{placement.position}</div>
                                                    <div className="text-green-200">{placement.initialSV} SV</div>
                                                    <div className="text-[10px] text-green-300 mt-0.5">{placement.name}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>

                    {/* Volume Summary */}
                    <div className="mt-12 text-center">
                        <div className="inline-block px-8 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
                            <h4 className="font-semibold text-white mb-3 text-lg">Volume Summary</h4>
                            <div className="grid grid-cols-3 gap-6 text-sm">
                                <div className="bg-blue-900/50 px-4 py-2 rounded-lg">
                                    <span className="text-blue-200 font-medium block mb-1">Left Team</span>
                                    <span className="text-xl font-bold text-blue-100">{leftLegVolume} SV</span>
                                </div>
                                <div className="bg-green-900/50 px-4 py-2 rounded-lg">
                                    <span className="text-green-200 font-medium block mb-1">Right Team</span>
                                    <span className="text-xl font-bold text-green-100">{rightLegVolume} SV</span>
                                </div>
                                <div className="bg-purple-900/50 px-4 py-2 rounded-lg">
                                    <span className="text-purple-200 font-medium block mb-1">Cycles</span>
                                    <span className="text-xl font-bold text-purple-100">
                                        {Math.floor(Math.min(leftLegVolume, rightLegVolume) / 200)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 