// Core AI Orchestration Layer
export * from './AIManager';

// Optional clients: Add only if you have actual implementation
// export * from './client/OpenAIClient'; // ✅ Uncomment when client exists

// Modular services
export * from './core/AICore';
export * from './metrics/AIMetricsManager';
export * from './history/AIHistoryManager';
export * from './cache/AICacheManager';