/**
 * Creator Contracts - User Memory System
 * 
 * Remembers user preferences across sessions:
 * - Industry/niche (fitness, tech, lifestyle, etc.)
 * - Typical deal sizes
 * - Contract concerns (exclusivity, usage rights, payment terms)
 * - Past interactions
 * 
 * Storage: Vercel KV or file-based for MVP
 */

// In-memory store for MVP (replace with Vercel KV in production)
const userMemory = new Map();

/**
 * User preference schema
 */
const createUserProfile = (userId) => ({
  userId,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  
  // Layer 2: Atomic facts
  facts: [],
  
  // Layer 3: Evolved summary
  profile: {
    industry: null,         // fitness, tech, lifestyle, beauty, gaming, etc.
    contentType: null,      // UGC, sponsorships, affiliate, ambassadorships
    followerRange: null,    // micro, mid, macro, mega
    typicalDealSize: null,  // <$500, $500-2k, $2k-10k, $10k+
    topConcerns: [],        // exclusivity, usage_rights, payment_terms, deliverables
    preferredTerms: {},     // e.g., { maxExclusivity: "30 days", requiresAdvancePayment: true }
  },
  
  // Interaction history
  interactions: [],
  
  // Conflict resolution history
  history: []
});

/**
 * Get or create user profile
 */
function getUser(userId) {
  if (!userMemory.has(userId)) {
    userMemory.set(userId, createUserProfile(userId));
  }
  return userMemory.get(userId);
}

/**
 * Add a fact about the user with conflict resolution
 */
function addFact(userId, category, fact, source = null) {
  const user = getUser(userId);
  
  // Check for conflicting facts in same category
  const conflictIdx = user.facts.findIndex(f => 
    f.category === category && !f.superseded
  );
  
  if (conflictIdx !== -1) {
    const oldFact = user.facts[conflictIdx];
    // Archive conflict
    user.history.push({
      type: 'fact_conflict',
      category,
      old: oldFact.value,
      new: fact,
      timestamp: new Date().toISOString(),
      resolution: 'superseded'
    });
    // Mark old as superseded
    user.facts[conflictIdx].superseded = true;
    user.facts[conflictIdx].supersededAt = new Date().toISOString();
  }
  
  // Add new fact
  user.facts.push({
    id: `${category}_${Date.now()}`,
    category,
    value: fact,
    source,
    createdAt: new Date().toISOString(),
    superseded: false
  });
  
  user.updatedAt = new Date().toISOString();
  return user;
}

/**
 * Update user profile summary (Layer 3 evolution)
 */
function evolveProfile(userId, updates) {
  const user = getUser(userId);
  
  // Track what changed
  const changes = {};
  Object.keys(updates).forEach(key => {
    if (user.profile[key] !== updates[key]) {
      changes[key] = { old: user.profile[key], new: updates[key] };
    }
  });
  
  if (Object.keys(changes).length > 0) {
    user.history.push({
      type: 'profile_evolution',
      changes,
      timestamp: new Date().toISOString()
    });
    
    user.profile = { ...user.profile, ...updates };
    user.updatedAt = new Date().toISOString();
  }
  
  return user;
}

/**
 * Record an interaction
 */
function recordInteraction(userId, type, data) {
  const user = getUser(userId);
  user.interactions.push({
    type,
    data,
    timestamp: new Date().toISOString()
  });
  user.updatedAt = new Date().toISOString();
  return user;
}

/**
 * Get personalized recommendations based on user profile
 */
function getRecommendations(userId) {
  const user = getUser(userId);
  const recommendations = [];
  
  // Based on concerns
  if (user.profile.topConcerns.includes('exclusivity')) {
    recommendations.push({
      type: 'tip',
      message: 'You\'ve flagged exclusivity as a concern before. Always negotiate time limits and category scope.',
      priority: 'high'
    });
  }
  
  if (user.profile.topConcerns.includes('usage_rights')) {
    recommendations.push({
      type: 'tip', 
      message: 'Usage rights matter to you. Look for clauses about perpetual vs. limited use, and geographic restrictions.',
      priority: 'high'
    });
  }
  
  // Based on deal size
  if (user.profile.typicalDealSize === '<$500') {
    recommendations.push({
      type: 'warning',
      message: 'For smaller deals, watch out for contracts that ask for more rights than the payment justifies.',
      priority: 'medium'
    });
  }
  
  return recommendations;
}

/**
 * Export for Vercel serverless function
 */
module.exports = {
  getUser,
  addFact,
  evolveProfile,
  recordInteraction,
  getRecommendations,
  // For testing
  _store: userMemory
};

// Vercel API handler
module.exports.handler = async (req, res) => {
  const { method, body, query } = req;
  
  try {
    switch (method) {
      case 'GET':
        // GET /api/user-memory?userId=xxx
        const user = getUser(query.userId || 'anonymous');
        return res.status(200).json({ user, recommendations: getRecommendations(user.userId) });
        
      case 'POST':
        // POST /api/user-memory { action: 'addFact', userId, category, fact }
        const { action, userId } = body;
        
        if (action === 'addFact') {
          const result = addFact(userId, body.category, body.fact, body.source);
          return res.status(200).json({ success: true, user: result });
        }
        
        if (action === 'evolveProfile') {
          const result = evolveProfile(userId, body.updates);
          return res.status(200).json({ success: true, user: result });
        }
        
        if (action === 'recordInteraction') {
          const result = recordInteraction(userId, body.type, body.data);
          return res.status(200).json({ success: true, user: result });
        }
        
        return res.status(400).json({ error: 'Unknown action' });
        
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
