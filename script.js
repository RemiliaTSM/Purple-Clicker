let purples = 0;
let clickValue = 1;
let autoClickers = 0;
let isMuted = false;
let totalPurplesEarned = 0;
let totalClicks = 0;
let totalAutoClicks = 0;
let biggestSingleGain = 0;
let runStartTime = Date.now();
let hideMaxedUpgrades = false;
let synergyClicks = 0;
let synergyBonus = 0;
let prestigePoints = 0;
let totalPrestigePointsEarned = 0;
let prestigeMilestone = 100000 * Math.pow(3, totalPrestigePointsEarned);
let offlineTimeBank = 0; // in seconds
let lastActive = Date.now();
let lastSavedPPS = 0; // Track PPS at the time of saving

// Function to format numbers with space separators
function formatNumber(num) {
  // Only round when using separators format
  if (window.numberFormat === 'separators' || !window.numberFormat) {
    num = Math.round(num);
  }
  
  if (num < 1000) return num.toString();
  
  switch (window.numberFormat) {
    case 'scientific':
      return num.toExponential(2);
    case 'abbreviated':
      if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
      if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
      if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
      if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
      return num.toString();
    case 'separators':
    default:
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
}

// Variables to track falling purple creation
let lastFallingPurpleTime = 0;
let lastPPSUpdate = 0;
let currentPPS = 0;
let manualClicksLastSecond = 0;
let manualClickTimestamps = [];

// Missing critical variables for game functionality will be declared later in file
let sidebarNeedsUpdate = false; // Flag to track when sidebar needs updating

// Performance tracking variables
let performanceMetricsEnabled = false;
let frameCount = 0;
let lastFPSTime = Date.now();
let currentFPS = 0;
let memoryUsage = 0;
let gameLoopTime = 0;
let renderTime = 0;
let averageFrameTime = 0;
let particleCount = 0;
let frameTimes = [];
const maxFrameTimesSamples = 60; // Track last 60 frames

// Slot machine symbols and payouts
const slotSymbols = [
  { symbol: '💜', payout: 100 },
  { symbol: '👑', payout: 50 },
  { symbol: '💎', payout: 25 },
  { symbol: '🔔', payout: 10 },
  { symbol: '🍋', payout: 5 },
  { symbol: '🍒', payout: 3 },
  { symbol: '🍇', payout: 2 }
];

const scoreEl = document.getElementById('score');
const clickerImgBtn = document.getElementById('clicker-img-btn');
const upgradesSidebar = document.getElementById('upgrade-sidebar');
const mainSidebar = document.getElementById('main-sidebar');
const upgradeGrid = document.getElementById('upgrade-grid');
const buildingList = document.getElementById('building-list');
const fallingContainer = document.getElementById('falling-container');
const statsBtn = document.getElementById('stats-btn');
const statsModal = document.getElementById('stats-modal');
const closeStats = document.getElementById('close-stats');
const statsContent = document.getElementById('stats-content');
const showMainBtn = document.getElementById('show-main');
const clickerImg = document.getElementById('clicker-img');
const showCasinoBtn = document.getElementById('show-casino');
const casinoModal = document.getElementById('casino-modal');
const closeCasino = document.getElementById('close-casino');

// Settings menu elements
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettings = document.getElementById('close-settings');
const muteToggle = document.getElementById('mute-toggle');
const volumeSlider = document.getElementById('volume-slider');
const volumeValue = document.getElementById('volume-value');
const particleEffectsToggle = document.getElementById('particle-effects');
const resetGameBtn = document.getElementById('reset-game-btn');
const screamAudioToggle = document.getElementById('scream-audio-toggle');

const screamAudios = [
  new Audio('sounds/purple_scream.mp3'),
  new Audio('sounds/purple_scream2.mp3')
];
const kissAudio = new Audio('sounds/purple_kiss.mp3');
const meowAudio = new Audio('sounds/purple_meow.mp3');
screamAudios.forEach(audio => {
  audio.preload = 'auto';
  audio.volume = parseFloat(volumeSlider.value);
});

// New upgrade system - building-specific upgrades
const buildingUpgrades = [
  // Auto Clicker Upgrades
  { id: 'auto_clicker_faster_clicks', buildingType: 'auto_clicker', tier: 1, name: 'Faster Clicks', description: 'Doubles Auto Clicker PpS', icon: '⚡', cost: 500, owned: false },
  { id: 'auto_clicker_click_precision', buildingType: 'auto_clicker', tier: 2, name: 'Click Precision', description: 'Doubles Auto Clicker PpS', icon: '🎯', cost: 2500, owned: false },
  { id: 'auto_clicker_quantum_clicking', buildingType: 'auto_clicker', tier: 3, name: 'Quantum Clicking', description: 'Doubles Auto Clicker PpS', icon: '⚛️', cost: 12000, owned: false },
  { id: 'auto_clicker_farm_synergy', buildingType: 'auto_clicker', tier: 4, name: 'Farm Synergy', description: 'Auto Clickers gain +1% PpS per Purple Farm owned', icon: '🌾', cost: 8000, owned: false },
  { id: 'auto_clicker_casino_connection', buildingType: 'auto_clicker', tier: 5, name: 'Casino Connection', description: 'Auto Clickers gain +0.5% PpS per Purple Casino owned', icon: '🎲', cost: 25000, owned: false },
  { id: 'auto_clicker_factory_network', buildingType: 'auto_clicker', tier: 6, name: 'Factory Network', description: 'Auto Clickers gain +0.2% PpS per Purple Factory owned', icon: '🔗', cost: 100000, owned: false },
  { id: 'auto_clicker_multi_click_array', buildingType: 'auto_clicker', tier: 7, name: 'Multi-Click Array', description: 'Doubles Auto Clicker PpS + gains 1% of total manual click value per Auto Clicker', icon: '📡', cost: 500000, owned: false },
  { id: 'auto_clicker_global_automation', buildingType: 'auto_clicker', tier: 8, name: 'Global Automation', description: 'Auto Clickers gain +0.1% PpS per building of any type owned', icon: '🌐', cost: 2000000, owned: false },
  { id: 'auto_clicker_exponential_clicking', buildingType: 'auto_clicker', tier: 9, name: 'Exponential Clicking', description: 'Auto Clicker PpS increased by 50% for each Auto Clicker upgrade owned', icon: '📈', cost: 10000000, owned: false },
  { id: 'auto_clicker_ultimate_clicker', buildingType: 'auto_clicker', tier: 10, name: 'Ultimate Clicker', description: 'Quadruples Auto Clicker PpS + Auto Clickers produce 1% of total PpS as bonus', icon: '👑', cost: 50000000, owned: false },
  
  // Purple Farm Upgrades
  { id: 'purple_farm_fertile_soil', buildingType: 'purple_farm', tier: 1, name: 'Fertile Soil', description: 'Doubles Purple Farm PpS', icon: '🌱', cost: 10000, owned: false },
  { id: 'purple_farm_advanced_irrigation', buildingType: 'purple_farm', tier: 2, name: 'Advanced Irrigation', description: 'Doubles Purple Farm PpS', icon: '💧', cost: 50000, owned: false },
  { id: 'purple_farm_genetic_engineering', buildingType: 'purple_farm', tier: 3, name: 'Genetic Engineering', description: 'Doubles Purple Farm PpS', icon: '🧬', cost: 250000, owned: false },
  { id: 'purple_farm_clicker_cooperation', buildingType: 'purple_farm', tier: 4, name: 'Clicker Cooperation', description: 'Farms gain +2% PpS per Auto Clicker owned', icon: '🤝', cost: 75000, owned: false },
  { id: 'purple_farm_industrial_farming', buildingType: 'purple_farm', tier: 5, name: 'Industrial Farming', description: 'Farms gain +1% PpS per Purple Factory owned', icon: '🏭', cost: 400000, owned: false },
  { id: 'purple_farm_mining_resources', buildingType: 'purple_farm', tier: 6, name: 'Mining Resources', description: 'Farms gain +0.5% PpS per Purple Mine owned', icon: '⛏️', cost: 1500000, owned: false },
  { id: 'purple_farm_bio_enhancement', buildingType: 'purple_farm', tier: 7, name: 'Bio-Enhancement', description: 'Doubles Farm PpS + Farms gain +0.2% PpS per Purple Lab owned', icon: '🧪', cost: 5000000, owned: false },
  { id: 'purple_farm_dimensional_agriculture', buildingType: 'purple_farm', tier: 8, name: 'Dimensional Agriculture', description: 'Farms gain +0.1% PpS per Purple Portal owned + produce 2% of total building PpS as bonus', icon: '🌌', cost: 25000000, owned: false },
  { id: 'purple_farm_cosmic_farming', buildingType: 'purple_farm', tier: 9, name: 'Cosmic Farming', description: 'Farm PpS increased by 100% for each Farm upgrade owned', icon: '🌟', cost: 100000000, owned: false },
  { id: 'purple_farm_infinite_harvest', buildingType: 'purple_farm', tier: 10, name: 'Infinite Harvest', description: 'Quadruples Farm PpS + all other buildings gain +0.5% PpS per Farm owned', icon: '♾️', cost: 500000000, owned: false },
  
  // Purple Casino Upgrades
  { id: 'purple_casino_lucky_machines', buildingType: 'purple_casino', tier: 1, name: 'Lucky Machines', description: 'Doubles Purple Casino PpS', icon: '🍀', cost: 80000, owned: false },
  { id: 'purple_casino_vip_tables', buildingType: 'purple_casino', tier: 2, name: 'VIP Tables', description: 'Doubles Purple Casino PpS', icon: '💎', cost: 400000, owned: false },
  { id: 'purple_casino_rigged_games', buildingType: 'purple_casino', tier: 3, name: 'Rigged Games', description: 'Doubles Purple Casino PpS', icon: '🎭', cost: 2000000, owned: false },
  { id: 'purple_casino_auto_clicker_jackpots', buildingType: 'purple_casino', tier: 4, name: 'Auto Clicker Jackpots', description: 'Casinos gain +3% PpS per Auto Clicker owned', icon: '🎰', cost: 500000, owned: false },
  { id: 'purple_casino_farm_partnerships', buildingType: 'purple_casino', tier: 5, name: 'Farm Partnerships', description: 'Casinos gain +2% PpS per Purple Farm owned', icon: '🌾', cost: 1200000, owned: false },
  { id: 'purple_casino_factory_deals', buildingType: 'purple_casino', tier: 6, name: 'Factory Deals', description: 'Casinos gain +1% PpS per Purple Factory owned', icon: '🏭', cost: 5000000, owned: false },
  { id: 'purple_casino_purple_lottery', buildingType: 'purple_casino', tier: 7, name: 'Purple Lottery', description: 'Doubles Casino PpS + 1% chance per second to gain 10x current Casino PpS', icon: '🎫', cost: 20000000, owned: false },
  { id: 'purple_casino_interdimensional_gambling', buildingType: 'purple_casino', tier: 8, name: 'Interdimensional Gambling', description: 'Casinos gain +0.2% PpS per Portal owned + produce 3% of manual click value per Casino', icon: '🌀', cost: 100000000, owned: false },
  { id: 'purple_casino_probability_manipulation', buildingType: 'purple_casino', tier: 9, name: 'Probability Manipulation', description: 'Casino PpS increased by 75% for each Casino upgrade owned', icon: '🔮', cost: 500000000, owned: false },
  { id: 'purple_casino_cosmic_jackpot', buildingType: 'purple_casino', tier: 10, name: 'Cosmic Jackpot', description: 'Triples Casino PpS + all manual clicks have 5% chance to trigger Casino bonus equal to current Casino PpS', icon: '🌠', cost: 2500000000, owned: false },
  
  // Purple Factory Upgrades
  { id: 'purple_factory_assembly_lines', buildingType: 'purple_factory', tier: 1, name: 'Assembly Lines', description: 'Doubles Purple Factory PpS', icon: '⚙️', cost: 200000, owned: false },
  { id: 'purple_factory_automation', buildingType: 'purple_factory', tier: 2, name: 'Automation', description: 'Doubles Purple Factory PpS', icon: '🤖', cost: 1000000, owned: false },
  { id: 'purple_factory_mass_production', buildingType: 'purple_factory', tier: 3, name: 'Mass Production', description: 'Doubles Purple Factory PpS', icon: '📦', cost: 5000000, owned: false },
  { id: 'purple_factory_supplier_network', buildingType: 'purple_factory', tier: 4, name: 'Supplier Network', description: 'Factories gain +1.5% PpS per Purple Farm owned', icon: '🚛', cost: 2000000, owned: false },
  { id: 'purple_factory_casino_contracts', buildingType: 'purple_factory', tier: 5, name: 'Casino Contracts', description: 'Factories gain +1% PpS per Purple Casino owned', icon: '📜', cost: 8000000, owned: false },
  { id: 'purple_factory_mining_operations', buildingType: 'purple_factory', tier: 6, name: 'Mining Operations', description: 'Factories gain +0.8% PpS per Purple Mine owned', icon: '⛏️', cost: 30000000, owned: false },
  { id: 'purple_factory_research_division', buildingType: 'purple_factory', tier: 7, name: 'Research Division', description: 'Doubles Factory PpS + Factories gain +0.5% PpS per Purple Lab owned', icon: '🔬', cost: 100000000, owned: false },
  { id: 'purple_factory_portal_manufacturing', buildingType: 'purple_factory', tier: 8, name: 'Portal Manufacturing', description: 'Factories gain +0.3% PpS per Portal owned + produce 1.5% of total building PpS as bonus', icon: '🌌', cost: 500000000, owned: false },
  { id: 'purple_factory_industrial_empire', buildingType: 'purple_factory', tier: 9, name: 'Industrial Empire', description: 'Factory PpS increased by 60% for each Factory upgrade owned', icon: '🏗️', cost: 2000000000, owned: false },
  { id: 'purple_factory_universal_production', buildingType: 'purple_factory', tier: 10, name: 'Universal Production', description: 'Triples Factory PpS + all other buildings gain +0.3% PpS per Factory owned', icon: '🌍', cost: 10000000000, owned: false },
  
  // Purple Mine Upgrades
  { id: 'purple_mine_deeper_shafts', buildingType: 'purple_mine', tier: 1, name: 'Deeper Shafts', description: 'Doubles Purple Mine PpS', icon: '🕳️', cost: 3000000, owned: false },
  { id: 'purple_mine_industrial_equipment', buildingType: 'purple_mine', tier: 2, name: 'Industrial Equipment', description: 'Doubles Purple Mine PpS', icon: '🚜', cost: 15000000, owned: false },
  { id: 'purple_mine_quantum_drilling', buildingType: 'purple_mine', tier: 3, name: 'Quantum Drilling', description: 'Doubles Purple Mine PpS', icon: '⚛️', cost: 75000000, owned: false },
  { id: 'purple_mine_farm_resources', buildingType: 'purple_mine', tier: 4, name: 'Farm Resources', description: 'Mines gain +1% PpS per Purple Farm owned', icon: '🌾', cost: 20000000, owned: false },
  { id: 'purple_mine_factory_partnership', buildingType: 'purple_mine', tier: 5, name: 'Factory Partnership', description: 'Mines gain +0.8% PpS per Purple Factory owned', icon: '🏭', cost: 100000000, owned: false },
  { id: 'purple_mine_casino_investment', buildingType: 'purple_mine', tier: 6, name: 'Casino Investment', description: 'Mines gain +0.6% PpS per Purple Casino owned', icon: '💰', cost: 250000000, owned: false },
  { id: 'purple_mine_research_collaboration', buildingType: 'purple_mine', tier: 7, name: 'Research Collaboration', description: 'Doubles Mine PpS + Mines gain +0.4% PpS per Purple Lab owned', icon: '🧪', cost: 1000000000, owned: false },
  { id: 'purple_mine_portal_mining', buildingType: 'purple_mine', tier: 8, name: 'Portal Mining', description: 'Mines gain +0.2% PpS per Portal owned + produce 1% of total building PpS as bonus', icon: '🌌', cost: 5000000000, owned: false },
  { id: 'purple_mine_geological_mastery', buildingType: 'purple_mine', tier: 9, name: 'Geological Mastery', description: 'Mine PpS increased by 50% for each Mine upgrade owned', icon: '🗻', cost: 20000000000, owned: false },
  { id: 'purple_mine_core_extraction', buildingType: 'purple_mine', tier: 10, name: 'Core Extraction', description: 'Triples Mine PpS + all buildings gain +0.1% click value per Mine owned', icon: '🌋', cost: 100000000000, owned: false },
  
  // Purple Lab Upgrades
  { id: 'purple_lab_advanced_research', buildingType: 'purple_lab', tier: 1, name: 'Advanced Research', description: 'Doubles Purple Lab PpS', icon: '🔬', cost: 100000000, owned: false },
  { id: 'purple_lab_prototype_development', buildingType: 'purple_lab', tier: 2, name: 'Prototype Development', description: 'Doubles Purple Lab PpS', icon: '⚗️', cost: 500000000, owned: false },
  { id: 'purple_lab_scientific_breakthrough', buildingType: 'purple_lab', tier: 3, name: 'Scientific Breakthrough', description: 'Doubles Purple Lab PpS', icon: '💡', cost: 2500000000, owned: false },
  { id: 'purple_lab_agricultural_studies', buildingType: 'purple_lab', tier: 4, name: 'Agricultural Studies', description: 'Labs gain +0.8% PpS per Purple Farm owned', icon: '🌱', cost: 750000000, owned: false },
  { id: 'purple_lab_industrial_analysis', buildingType: 'purple_lab', tier: 5, name: 'Industrial Analysis', description: 'Labs gain +0.6% PpS per Purple Factory owned', icon: '🔧', cost: 3000000000, owned: false },
  { id: 'purple_lab_mining_research', buildingType: 'purple_lab', tier: 6, name: 'Mining Research', description: 'Labs gain +0.5% PpS per Purple Mine owned', icon: '⛏️', cost: 12000000000, owned: false },
  { id: 'purple_lab_quantum_experiments', buildingType: 'purple_lab', tier: 7, name: 'Quantum Experiments', description: 'Doubles Lab PpS + Labs boost all other buildings\' PpS by 0.5% per Lab owned', icon: '⚛️', cost: 50000000000, owned: false },
  { id: 'purple_lab_portal_studies', buildingType: 'purple_lab', tier: 8, name: 'Portal Studies', description: 'Labs gain +0.3% PpS per Portal owned + produce 0.8% of total building PpS as bonus', icon: '🌌', cost: 200000000000, owned: false },
  { id: 'purple_lab_scientific_revolution', buildingType: 'purple_lab', tier: 9, name: 'Scientific Revolution', description: 'Lab PpS increased by 40% for each Lab upgrade owned', icon: '🧬', cost: 1000000000000, owned: false },
  { id: 'purple_lab_universal_knowledge', buildingType: 'purple_lab', tier: 10, name: 'Universal Knowledge', description: 'Triples Lab PpS + all upgrades cost 5% less for each Lab owned (max 50% reduction)', icon: '📚', cost: 5000000000000, owned: false },
  
  // Purple Portal Upgrades
  { id: 'purple_portal_dimensional_stability', buildingType: 'purple_portal', tier: 1, name: 'Dimensional Stability', description: 'Doubles Purple Portal PpS', icon: '🔮', cost: 2500000000, owned: false },
  { id: 'purple_portal_portal_expansion', buildingType: 'purple_portal', tier: 2, name: 'Portal Expansion', description: 'Doubles Purple Portal PpS', icon: '🌀', cost: 12500000000, owned: false },
  { id: 'purple_portal_multiverse_access', buildingType: 'purple_portal', tier: 3, name: 'Multiverse Access', description: 'Doubles Purple Portal PpS', icon: '♾️', cost: 62500000000, owned: false },
  { id: 'purple_portal_cross_dimensional_mining', buildingType: 'purple_portal', tier: 4, name: 'Cross-Dimensional Mining', description: 'Portals gain +0.5% PpS per Purple Mine owned', icon: '⛏️', cost: 25000000000, owned: false },
  { id: 'purple_portal_interdimensional_labs', buildingType: 'purple_portal', tier: 5, name: 'Interdimensional Labs', description: 'Portals gain +0.4% PpS per Purple Lab owned', icon: '🧪', cost: 100000000000, owned: false },
  { id: 'purple_portal_portal_network', buildingType: 'purple_portal', tier: 6, name: 'Portal Network', description: 'Portals gain +0.3% PpS per other Portal owned', icon: '🔗', cost: 400000000000, owned: false },
  { id: 'purple_portal_reality_manipulation', buildingType: 'purple_portal', tier: 7, name: 'Reality Manipulation', description: 'Doubles Portal PpS + Portals boost all buildings\' PpS by 0.2% per Portal owned', icon: '🌟', cost: 1500000000000, owned: false },
  { id: 'purple_portal_galactic_connection', buildingType: 'purple_portal', tier: 8, name: 'Galactic Connection', description: 'Portals gain +0.1% PpS per Galactic Purpler owned + produce 0.5% of total building PpS as bonus', icon: '🚀', cost: 6000000000000, owned: false },
  { id: 'purple_portal_dimensional_mastery', buildingType: 'purple_portal', tier: 9, name: 'Dimensional Mastery', description: 'Portal PpS increased by 30% for each Portal upgrade owned', icon: '🎭', cost: 25000000000000, owned: false },
  { id: 'purple_portal_infinity_gate', buildingType: 'purple_portal', tier: 10, name: 'Infinity Gate', description: 'Triples Portal PpS + manual clicks gain +1% of total Portal PpS as bonus', icon: '🌠', cost: 100000000000000, owned: false },
  
  // Galactic Purpler Upgrades
  { id: 'galactic_purpler_rocket_boost', buildingType: 'galactic_purpler', tier: 1, name: 'Rocket Boost', description: 'Doubles Galactic Purpler PpS', icon: '🔥', cost: 50000000000, owned: false },
  { id: 'galactic_purpler_stellar_navigation', buildingType: 'galactic_purpler', tier: 2, name: 'Stellar Navigation', description: 'Doubles Galactic Purpler PpS', icon: '⭐', cost: 250000000000, owned: false },
  { id: 'galactic_purpler_cosmic_enhancement', buildingType: 'galactic_purpler', tier: 3, name: 'Cosmic Enhancement', description: 'Doubles Galactic Purpler PpS', icon: '🌌', cost: 1250000000000, owned: false },
  { id: 'galactic_purpler_planetary_mining', buildingType: 'galactic_purpler', tier: 4, name: 'Planetary Mining', description: 'Purpler gain +0.3% PpS per Purple Mine owned', icon: '🪐', cost: 500000000000, owned: false },
  { id: 'galactic_purpler_space_labs', buildingType: 'galactic_purpler', tier: 5, name: 'Space Labs', description: 'Purpler gain +0.2% PpS per Purple Lab owned', icon: '🛰️', cost: 2000000000000, owned: false },
  { id: 'galactic_purpler_portal_integration', buildingType: 'galactic_purpler', tier: 6, name: 'Portal Integration', description: 'Purpler gain +0.15% PpS per Purple Portal owned', icon: '🌀', cost: 8000000000000, owned: false },
  { id: 'galactic_purpler_galactic_empire', buildingType: 'galactic_purpler', tier: 7, name: 'Galactic Empire', description: 'Doubles Purpler PpS + Purpler boost all buildings\' PpS by 0.1% per Purpler owned', icon: '👑', cost: 30000000000000, owned: false },
  { id: 'galactic_purpler_universal_conquest', buildingType: 'galactic_purpler', tier: 8, name: 'Universal Conquest', description: 'Purpler gain +0.05% PpS per building of any type owned + produce 0.3% of total building PpS as bonus', icon: '🌍', cost: 120000000000000, owned: false },
  { id: 'galactic_purpler_cosmic_transcendence', buildingType: 'galactic_purpler', tier: 9, name: 'Cosmic Transcendence', description: 'Purpler PpS increased by 25% for each Purpler upgrade owned', icon: '✨', cost: 500000000000000, owned: false },
  { id: 'galactic_purpler_omnipotence', buildingType: 'galactic_purpler', tier: 10, name: 'Omnipotence', description: 'Quadruples Purpler PpS + all effects in the game are increased by 1% per Galactic Purpler owned', icon: '🌠', cost: 2000000000000000, owned: false },
];

// Manual click upgrades
const clickUpgrades = [
  { id: 'steady_hands', tier: 1, name: 'Steady Hands', description: 'Manual clicks gain +10% of total Auto Clicker PpS', icon: '✋', cost: 1000, owned: false },
  { id: 'click_focus', tier: 2, name: 'Click Focus', description: 'Manual clicks gain +5% of total Purple Farm PpS', icon: '🎯', cost: 15000, owned: false },
  { id: 'lucky_strikes', tier: 3, name: 'Lucky Strikes', description: 'Manual clicks gain +2% of total Purple Casino PpS', icon: '🍀', cost: 120000, owned: false },
  { id: 'industrial_strength', tier: 4, name: 'Industrial Strength', description: 'Manual clicks gain +1% of total Purple Factory PpS', icon: '💪', cost: 800000, owned: false },
  { id: 'precision_striking', tier: 5, name: 'Precision Striking', description: 'Manual clicks gain +0.5% of total Purple Mine PpS', icon: '⚡', cost: 8000000, owned: false },
  { id: 'scientific_clicking', tier: 6, name: 'Scientific Clicking', description: 'Manual clicks gain +0.2% of total Purple Lab PpS', icon: '🧪', cost: 150000000, owned: false },
  { id: 'dimensional_touch', tier: 7, name: 'Dimensional Touch', description: 'Manual clicks gain +0.1% of total Purple Portal PpS', icon: '🌌', cost: 3000000000, owned: false },
  { id: 'cosmic_power', tier: 8, name: 'Cosmic Power', description: 'Manual clicks gain +0.05% of total Galactic Purpler PpS', icon: '🚀', cost: 75000000000, owned: false },
  { id: 'click_mastery', tier: 9, name: 'Click Mastery', description: 'Manual clicks gain +1% of total PpS from all sources', icon: '👑', cost: 1500000000000, owned: false },
  { id: 'ultimate_clicker', tier: 10, name: 'Ultimate Clicker', description: 'Manual clicks gain +0.1% of total PpS per manual click upgrade owned', icon: '🌟', cost: 50000000000000, owned: false },
];

const buildings = [
  {
    id: 'auto_clicker',
    name: 'Auto Clicker',
    description: '+1 Purple per second per tier',
    icon: '🖱️',
    baseCost: 50,
    cost: 50,
    tier: 0,
    pps: 1,
    costGrowth: 1.5,
    totalProduced: 0,
  },
  {
    id: 'purple_farm',
    name: 'Purple Farm',
    description: '+10 Purples per second per tier',
    icon: '🚜',
    baseCost: 1000,
    cost: 1000,
    tier: 0,
    pps: 10,
    costGrowth: 1.6,
    totalProduced: 0,
  },
  {
    id: 'purple_casino',
    name: 'Purple Casino',
    description: '+40 Purples per second per tier. Unlocks casino minigames.',
    icon: '🎰',
    baseCost: 8000,
    cost: 8000,
    tier: 0,
    pps: 40,
    costGrowth: 1.65,
    totalProduced: 0,
  },
  {
    id: 'purple_factory',
    name: 'Purple Factory',
    description: '+100 Purples per second per tier',
    icon: '🏭',
    baseCost: 20000,
    cost: 20000,
    tier: 0,
    pps: 100,
    costGrowth: 1.7,
    totalProduced: 0,
  },
  {
    id: 'purple_mine',
    name: 'Purple Mine',
    description: '+1,000 Purples per second per tier',
    icon: '⛏️',
    baseCost: 300000,
    cost: 300000,
    tier: 0,
    pps: 1000,
    costGrowth: 1.8,
    totalProduced: 0,
  },
  {
    id: 'purple_lab',
    name: 'Purple Lab',
    description: '+10,000 Purples per second per tier',
    icon: '🧪',
    baseCost: 10000000,
    cost: 10000000,
    tier: 0,
    pps: 10000,
    costGrowth: 2.0,
    totalProduced: 0,
  },
  {
    id: 'purple_portal',
    name: 'Purple Portal',
    description: '+100,000 Purples per second per tier',
    icon: '🌌',
    baseCost: 250000000,
    cost: 250000000,
    tier: 0,
    pps: 100000,
    costGrowth: 2.2,
    totalProduced: 0,
  },
  {
    id: 'galactic_purpler',
    name: 'Galactic Purpler',
    description: '+1,000,000 Purples per second per tier',
    icon: '🚀',
    baseCost: 5000000000,
    cost: 5000000000,
    tier: 0,
    pps: 1000000,
    costGrowth: 2.5,
    totalProduced: 0,
  },
];

const achievements = [
  { id: 'first_click', name: 'First Click', desc: 'Earn your first Purple.', unlocked: false },
  { id: 'first_1000', name: 'First 1000', desc: 'Hit 1,000 Purples for the first time in a run.', unlocked: false },
  { id: 'first_million', name: 'First Million', desc: 'Hit 1,000,000 Purples for the first time.', unlocked: false },
  { id: 'world_domination', name: 'World Domination', desc: 'Hit 8,000,000,000 Purples.', unlocked: false },
  { id: 'click_frenzy', name: 'Click Frenzy', desc: 'Click 100 times in 10 seconds.', unlocked: false },
  { id: 'auto_empire', name: 'Auto Empire', desc: 'Own 100 total buildings.', unlocked: false },
  { id: 'upgrade_collector', name: 'Upgrade Collector', desc: 'Reach Tier 10 in any upgrade.', unlocked: false },
  { id: 'farm_tycoon', name: 'Farm Tycoon', desc: 'Own 10 Purple Farms.', unlocked: false },
  { id: 'factory_owner', name: 'Factory Owner', desc: 'Own 5 Purple Factories.', unlocked: false },
  { id: 'mining_magnate', name: 'Mining Magnate', desc: 'Own 3 Purple Mines.', unlocked: false },
  { id: 'lab_rat', name: 'Lab Rat', desc: 'Own 2 Purple Labs.', unlocked: false },
  { id: 'portal_master', name: 'Portal Master', desc: 'Own a Purple Portal.', unlocked: false },
  { id: 'galactic_overlord', name: 'Galactic Overlord', desc: 'Own a Galactic Purpler.', unlocked: false },
  { id: 'purple_rain', name: 'Purple Rain', desc: 'Earn 10,000 Purples in a single second.', unlocked: false },
  { id: 'manual_master', name: 'Manual Master', desc: 'Earn 10,000 Purples by clicking (not automation).', unlocked: false },
  { id: 'prestige', name: 'Prestige!', desc: 'Prestige for the first time.', unlocked: false },
  { id: 'idle_idol', name: 'Idle Idol', desc: 'Earn 1,000,000 Purples while idle (no clicks for 10 minutes).', unlocked: false },
  { id: 'upgrade_maxed', name: 'Upgrade Maxed', desc: 'Max out all upgrades.', unlocked: false },
  { id: 'building_boom', name: 'Building Boom', desc: 'Buy 10 buildings in one second.', unlocked: false },
  { id: 'sound_of_silence', name: 'Sound of Silence', desc: 'Play fully muted for 10 minutes straight.', unlocked: false },
  { id: 'speedrunner', name: 'Speedrunner', desc: 'Reach 1,000,000 Purples in under 5 minutes.', unlocked: false },
  { id: 'loyal_clicker', name: 'Loyal Clicker', desc: 'Play for 7 days total.', unlocked: false },
];

// Add new arrays for offline upgrades and buildings
const offlineUpgrades = [
  {
    id: 'offline_booster',
    name: 'Offline Booster',
    description: 'Increases offline time accumulation rate by +2s/sec per tier',
    baseCost: 1000,
    cost: 1000,
    tier: 0,
    costGrowth: 2,
    maxTier: 10,
    effect: () => {},
  },
  {
    id: 'time_capsule',
    name: 'Time Capsule',
    description: 'Increases offline time bank cap by +1 hour per tier',
    baseCost: 5000,
    cost: 5000,
    tier: 0,
    costGrowth: 2.5,
    maxTier: 12,
    effect: () => {},
  },
  {
    id: 'efficient_automation',
    name: 'Efficient Automation',
    description: 'Increases effectiveness of offline PPS by 25% (single-buy)',
    baseCost: 20000,
    cost: 20000,
    tier: 0,
    costGrowth: 1,
    maxTier: 1,
    effect: () => {},
  },
  {
    id: 'offline_synergy',
    name: 'Offline Synergy',
    description: 'Each tier increases synergy bonus included in offline gains',
    baseCost: 10000,
    cost: 10000,
    tier: 0,
    costGrowth: 2,
    maxTier: 10,
    effect: () => {},
  },
  {
    id: 'offline_magnet',
    name: 'Offline Magnet',
    description: 'Increases percentage of PPS counted for offline gains by 10% per tier',
    baseCost: 15000,
    cost: 15000,
    tier: 0,
    costGrowth: 2,
    maxTier: 10,
    effect: () => {},
  },
];

const offlineBuildings = [
  {
    id: 'sleep_lab',
    name: 'Sleep Lab',
    description: 'Increases effectiveness of all offline gains by 10% per tier',
    baseCost: 25000,
    cost: 25000,
    tier: 0,
    costGrowth: 2.5,
    maxTier: 20,
  },
  {
    id: 'chrono_vault',
    name: 'Chrono Vault',
    description: 'Each tier increases offline time cap by 1 hour and gives a one-time offline gain boost',
    baseCost: 100000,
    cost: 100000,
    tier: 0,
    costGrowth: 3,
    maxTier: 12,
  },
];

let sidebarPage = 'main';
const showOfflineBtn = document.getElementById('show-offline');
const offlineUpgradeSidebar = document.getElementById('offline-upgrade-sidebar');

// Tooltip system
let currentTooltip = null;
let currentTooltipTarget = null; // Track which element the tooltip belongs to
let currentTooltipType = null; // Track the type of tooltip (upgrade, building, etc.)

function createTooltip(content, x, y, target, type) {
  // If tooltip already exists for this target, just update content and position
  if (currentTooltip && currentTooltipTarget === target && currentTooltipType === type) {
    updateTooltipContent(content, x, y);
    return currentTooltip;
  }
  
  removeTooltip();
  
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.innerHTML = content;
  document.body.appendChild(tooltip);
  
  // Position tooltip
  positionTooltip(tooltip, x, y);
  
  // Show tooltip with animation
  setTimeout(() => tooltip.classList.add('visible'), 10);
  
  currentTooltip = tooltip;
  currentTooltipTarget = target;
  currentTooltipType = type;
  return tooltip;
}

function updateTooltipContent(content, x, y) {
  if (currentTooltip) {
    currentTooltip.innerHTML = content;
    positionTooltip(currentTooltip, x, y);
  }
}

function positionTooltip(tooltip, x, y) {
  const rect = tooltip.getBoundingClientRect();
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  // Adjust position to keep tooltip on screen
  let left = x + 15;
  let top = y - 10;
  
  if (left + rect.width > windowWidth) {
    left = x - rect.width - 15;
  }
  
  if (top + rect.height > windowHeight) {
    top = y - rect.height + 10;
  }
  
  if (left < 0) left = 10;
  if (top < 0) top = 10;
  
  tooltip.style.left = left + 'px';
  tooltip.style.top = top + 'px';
}

function removeTooltip() {
  if (currentTooltip) {
    currentTooltip.remove();
    currentTooltip = null;
    currentTooltipTarget = null;
    currentTooltipType = null;
  }
}

// Function to update tooltip content every frame if one exists
function updateActiveTooltips() {
  if (currentTooltip && currentTooltipTarget && currentTooltipType) {
    // Get current mouse position
    const mouseEvent = window.lastMouseEvent;
    if (!mouseEvent) return;
    
    let newContent = '';
    
    // Generate updated content based on tooltip type
    if (currentTooltipType === 'upgrade') {
      const upgradeId = currentTooltipTarget.getAttribute('data-upgrade');
      const upgrade = [...buildingUpgrades, ...clickUpgrades].find(u => u.id === upgradeId);
      if (upgrade) {
        newContent = generateNewUpgradeTooltip(upgrade);
      }
    } else if (currentTooltipType === 'building') {
      const buildingId = currentTooltipTarget.getAttribute('data-building');
      const building = buildings.find(b => b.id === buildingId);
      if (building) {
        const obscured = currentTooltipTarget.classList.contains('building-obscured');
        newContent = generateBuildingTooltip(building, obscured);
      }
    }
    
    if (newContent) {
      updateTooltipContent(newContent, mouseEvent.clientX, mouseEvent.clientY);
    }
  }
}

// Track mouse position globally for tooltip updates
window.lastMouseEvent = null;
document.addEventListener('mousemove', (e) => {
  window.lastMouseEvent = e;
});

// Helper functions for new sidebar
function sortUpgradesByPrice() {
  return [...buildingUpgrades, ...clickUpgrades]
    .filter(upgrade => upgrade.owned === false)
    .sort((a, b) => a.cost - b.cost);
}

function getBuildingVisibility() {
  const visibleBuildings = [];
  let unaffordableCount = 0;
  
  for (const building of buildings) {
    if (building.tier > 0 || purples >= building.cost) {
      // Owned or affordable - always show
      visibleBuildings.push({ building, obscured: false });
    } else if (unaffordableCount < 2) {
      // Next 2 tiers of unaffordable buildings - show obscured
      visibleBuildings.push({ building, obscured: true });
      unaffordableCount++;
    }
  }
  
  return visibleBuildings;
}

function obscureBuildingName(name) {
  return name.replace(/[a-zA-Z]/g, '?');
}

function calculateBuildingPercentage(building) {
  const totalPPS = getPPS();
  if (totalPPS === 0) return 0;
  const buildingPPS = building.tier * building.pps;
  return (buildingPPS / totalPPS) * 100;
}

function generateUpgradeTooltip(upgrade) {
  return `
    <div class="tooltip-title">${upgrade.name}</div>
    <div class="tooltip-cost">Cost: ${formatNumber(upgrade.cost)} Purples</div>
    <div class="tooltip-description">${upgrade.description}</div>
  `;
}

function generateBuildingTooltip(building, obscured = false) {
  if (obscured) {
    return `
      <div class="tooltip-title">${obscureBuildingName(building.name)}</div>
      <div class="tooltip-cost">Cost: ${formatNumber(building.cost)} Purples</div>
      <div class="tooltip-description">???</div>
    `;
  }
  
  const ppsPerBuilding = building.pps;
  const owned = building.tier;
  const totalPPS = owned * ppsPerBuilding;
  const percentage = calculateBuildingPercentage(building);
  const totalProduced = building.totalProduced || 0;
  
  return `
    <div class="tooltip-title">${building.name}</div>
    <div class="tooltip-description">${building.description}</div>
    <div class="tooltip-stats">
      <div class="tooltip-stat-line tooltip-production">Each ${building.name} produces ${formatNumber(ppsPerBuilding)} purples per second.</div>
      <div class="tooltip-stat-line tooltip-production">${owned} ${building.name} producing ${formatNumber(totalPPS)} purples per second (${(window.numberFormat === 'separators' || !window.numberFormat) ? Math.round(percentage) : percentage.toFixed(1)}% of total PpS)</div>
      <div class="tooltip-stat-line">${formatNumber(totalProduced)} purples produced so far</div>
    </div>
  `;
}

// Sidebar event listeners
showMainBtn.addEventListener('click', () => {
  sidebarPage = 'main';
  showMainBtn.classList.add('active');
  showOfflineBtn.classList.remove('active');
  showCasinoBtn.classList.remove('active');
  renderSidebar();
});

showOfflineBtn.addEventListener('click', () => {
  console.log("DEBUG: Offline button clicked");
  sidebarPage = 'offline';
  showOfflineBtn.classList.add('active');
  showMainBtn.classList.remove('active');
  showCasinoBtn.classList.remove('active');
  renderSidebar();
});

showCasinoBtn.addEventListener('click', () => {
  if (ownsPurpleCasino()) {
    casinoModal.style.display = 'block';
    renderSlotMachineUI();
  }
});

// Prestige Tech Tree (branching, dependencies, multi-level nodes)
const techTree = [
  // Manual Click Branch
  {
    id: 'click_power',
    name: 'Click Power',
    desc: '+10% manual click value per level',
    cost: 1,
    unlocked: false,
    maxLevel: 5,
    level: 0,
    deps: [],
    effect: () => {},
  },
  {
    id: 'critical_mastery',
    name: 'Critical Mastery',
    desc: '+2% crit chance per level',
    cost: 2,
    unlocked: false,
    maxLevel: 3,
    level: 0,
    deps: ['click_power-2'], // Requires Click Power level 2
    effect: () => {},
  },
  {
    id: 'combo_chain',
    name: 'Combo Chain',
    desc: 'Click combos last 0.2s longer',
    cost: 2,
    unlocked: false,
    maxLevel: 1,
    level: 0,
    deps: ['critical_mastery'],
    effect: () => {},
  },
  {
    id: 'golden_touch',
    name: 'Golden Touch',
    desc: 'Every 50th click is a guaranteed crit',
    cost: 3,
    unlocked: false,
    maxLevel: 1,
    level: 0,
    deps: ['combo_chain'],
    effect: () => {},
  },
  // Automation Branch
  {
    id: 'auto_efficiency',
    name: 'Auto Efficiency',
    desc: '+10% PPS per level',
    cost: 1,
    unlocked: false,
    maxLevel: 5,
    level: 0,
    deps: [],
    effect: () => {},
  },
  {
    id: 'synergy_engine',
    name: 'Synergy Engine',
    desc: 'Manual clicks boost PPS for 5s',
    cost: 2,
    unlocked: false,
    maxLevel: 1,
    level: 0,
    deps: ['auto_efficiency-2'], // Requires Auto Efficiency level 2
    effect: () => {},
  },
  {
    id: 'factory_overdrive',
    name: 'Factory Overdrive',
    desc: 'Factories produce 2x for 30s every 10 min',
    cost: 3,
    unlocked: false,
    maxLevel: 1,
    level: 0,
    deps: ['synergy_engine'],
    effect: () => {},
  },
  // Offline Branch
  {
    id: 'offline_booster',
    name: 'Offline Booster',
    desc: '+20% offline gains per level',
    cost: 1,
    unlocked: false,
    maxLevel: 5,
    level: 0,
    deps: [],
    effect: () => {},
  },
  {
    id: 'time_capsule',
    name: 'Time Capsule',
    desc: '+1h offline cap per level',
    cost: 2,
    unlocked: false,
    maxLevel: 3,
    level: 0,
    deps: ['offline_booster-2'], // Requires Offline Booster level 2
    effect: () => {},
  },
  {
    id: 'dream_clicks',
    name: 'Dream Clicks',
    desc: '10% of manual click upgrades count for offline',
    cost: 3,
    unlocked: false,
    maxLevel: 1,
    level: 0,
    deps: ['time_capsule'],
    effect: () => {},
  },
  // Meta/Global Branch
  {
    id: 'prestige_multiplier',
    name: 'Prestige Multiplier',
    desc: '+5% all gains per level',
    cost: 3,
    unlocked: false,
    maxLevel: 10,
    level: 0,
    deps: [],
    effect: () => {},
  },
  {
    id: 'cheaper_upgrades',
    name: 'Cheaper Upgrades',
    desc: '-2% upgrade costs per level',
    cost: 2,
    unlocked: false,
    maxLevel: 5,
    level: 0,
    deps: ['prestige_multiplier-2'], // Requires Prestige Multiplier level 2
    effect: () => {},
  },
  {
    id: 'faster_progress',
    name: 'Faster Progress',
    desc: 'Buildings and upgrades unlock 10% sooner',
    cost: 2,
    unlocked: false,
    maxLevel: 1,
    level: 0,
    deps: ['cheaper_upgrades'],
    effect: () => {},
  },
  // Special/Unique Techs
  {
    id: 'quantum_leap',
    name: 'Quantum Leap',
    desc: 'Instantly gain 1h offline gains',
    cost: 5,
    unlocked: false,
    maxLevel: 1,
    level: 0,
    deps: ['offline_booster', 'time_capsule'], // Deep in offline branch
    effect: () => {},
  },
  {
    id: 'purple_storm',
    name: 'Purple Storm',
    desc: '1% chance per click for a 10x burst',
    cost: 4,
    unlocked: false,
    maxLevel: 1,
    level: 0,
    deps: ['combo_chain', 'factory_overdrive'], // Requires both click and automation branches
    effect: () => {},
  },
  {
    id: 'cosmetic_unlocks',
    name: 'Cosmetic Unlocks',
    desc: 'New themes, backgrounds, or effects',
    cost: 2,
    unlocked: false,
    maxLevel: 3,
    level: 0,
    deps: ['prestige_multiplier'],
    effect: () => {},
  },
];

// Global settings defaults
window.animationSpeed = 1;
window.fallingPurpleLimit = 200;
window.floatingTextEnabled = true;
window.screenShakeEnabled = true;
window.screamAudioEnabled = true;
window.numberFormat = 'separators'; // 'separators', 'scientific', 'abbreviated'

// --- Farm Decor Setup (must be before loadGame) ---
var farmDecorContainer;
var savedFarmPositions = []; // Store farm positions persistently

function ensureFarmDecorContainer() {
  if (!farmDecorContainer) {
    farmDecorContainer = document.getElementById('farm-decor');
    if (!farmDecorContainer) {
      farmDecorContainer = document.createElement('div');
      farmDecorContainer.id = 'farm-decor';
      document.body.appendChild(farmDecorContainer);
    }
  }
}
function rebuildFarmDecorFromSave() {
  ensureFarmDecorContainer();
  // Clear existing farm images
  while (farmDecorContainer.firstChild) farmDecorContainer.removeChild(farmDecorContainer.firstChild);
  
  // Recreate farm images from saved positions
  savedFarmPositions.forEach(pos => {
    const img = document.createElement('img');
    img.src = 'images/farm.png';
    img.style.left = pos.x + 'px';
    img.style.top = pos.y + 'px';
    farmDecorContainer.appendChild(img);
  });
}

function updateFarmDecor() {
  ensureFarmDecorContainer();
  const farmBuilding = buildings.find(b => b.id === 'purple_farm');
  if (!farmBuilding || farmBuilding.tier === 0) {
    // Clear all farms if no farms owned
    while (farmDecorContainer.firstChild) farmDecorContainer.removeChild(farmDecorContainer.firstChild);
    savedFarmPositions = [];
    return;
  }
  
  const currentCount = Math.min(farmBuilding.tier, 25); // Cap at 25 farms
  const containerWidth = window.innerWidth;
  const containerHeight = window.innerHeight * 0.4; // 40vh from CSS
  const imgSize = 120;
  
  // If we have fewer farms than before, remove excess ones
  if (currentCount < savedFarmPositions.length) {
    while (savedFarmPositions.length > currentCount) {
      savedFarmPositions.pop();
      if (farmDecorContainer.lastChild) {
        farmDecorContainer.removeChild(farmDecorContainer.lastChild);
      }
    }
  }
  
  // Add new farms if we have more than before
  while (savedFarmPositions.length < currentCount) {
    let attempts = 0;
    let x = 0, y = 0;
    do {
      x = Math.random() * (containerWidth - imgSize);
      y = Math.random() * (containerHeight - imgSize);
      attempts++;
    } while (attempts < 30 && savedFarmPositions.some(p => Math.abs(p.x - x) < imgSize && Math.abs(p.y - y) < imgSize));
    
    // Save the position
    savedFarmPositions.push({ x, y });
    
    // Create and position the farm image
    const img = document.createElement('img');
    img.src = 'images/farm.png';
    img.style.left = x + 'px';
    img.style.top = y + 'px';
    farmDecorContainer.appendChild(img);
  }
}

function saveGame() {
  // Capture current PPS before saving
  lastSavedPPS = getPPS();
  // Update lastActive to the exact save time
  lastActive = Date.now();
  
  const save = {
    purples,
    clickValue,
    totalPurplesEarned,
    totalClicks,
    totalAutoClicks,
    biggestSingleGain,
    runStartTime,
    // New upgrade system
    buildingUpgrades: buildingUpgrades.map(u => ({ id: u.id, owned: u.owned })),
    clickUpgrades: clickUpgrades.map(u => ({ id: u.id, owned: u.owned })),
    buildings: buildings.map(b => ({ tier: b.tier, cost: b.cost, totalProduced: b.totalProduced })),
    isMuted,
    hideMaxedUpgrades,
    synergyClicks,
    synergyBonus,
    prestigePoints,
    totalPrestigePointsEarned,
    offlineTimeBank,
    lastActive,
    lastSavedPPS,
    offlineUpgrades: offlineUpgrades.map(u => ({ tier: u.tier, cost: u.cost })),
    offlineBuildings: offlineBuildings.map(b => ({ tier: b.tier, cost: b.cost })),
    techTree: techTree.map(t => ({ level: t.level, unlocked: t.unlocked })),
    achievements,
    particleEffectsEnabled: window.particleEffectsEnabled,
    volume: parseFloat(volumeSlider.value),
    animationSpeed: window.animationSpeed,
    fallingPurpleLimit: window.fallingPurpleLimit,
    floatingTextEnabled: window.floatingTextEnabled,
    screenShakeEnabled: window.screenShakeEnabled,
    screamAudioEnabled: window.screamAudioEnabled,
    numberFormat: window.numberFormat,
    savedFarmPositions: savedFarmPositions,
    performanceMetricsEnabled: performanceMetricsEnabled
  };
  localStorage.setItem('purpleClickerSave', JSON.stringify(save));
}

function loadGame() {
  const save = JSON.parse(localStorage.getItem('purpleClickerSave'));
  if (save) {
    purples = save.purples ?? 0;
    clickValue = save.clickValue ?? 1;
    totalPurplesEarned = save.totalPurplesEarned ?? 0;
    totalClicks = save.totalClicks ?? 0;
    totalAutoClicks = save.totalAutoClicks ?? 0;
    biggestSingleGain = save.biggestSingleGain ?? 0;
    runStartTime = save.runStartTime ?? Date.now();
    
    // Load new upgrade system
    if (save.buildingUpgrades) {
      save.buildingUpgrades.forEach(savedUpgrade => {
        const upgrade = buildingUpgrades.find(u => u.id === savedUpgrade.id);
        if (upgrade) {
          upgrade.owned = savedUpgrade.owned;
        }
      });
    }
    if (save.clickUpgrades) {
      save.clickUpgrades.forEach(savedUpgrade => {
        const upgrade = clickUpgrades.find(u => u.id === savedUpgrade.id);
        if (upgrade) {
          upgrade.owned = savedUpgrade.owned;
        }
      });
    }
    
    if (save.buildings) {
      save.buildings.forEach((saved, i) => {
        buildings[i].tier = saved.tier;
        buildings[i].cost = saved.cost;
        buildings[i].totalProduced = saved.totalProduced || 0;
      });
    }
    isMuted = save.isMuted ?? false;
    hideMaxedUpgrades = save.hideMaxedUpgrades ?? false;
    synergyClicks = save.synergyClicks ?? 0;
    synergyBonus = save.synergyBonus ?? 0;
    prestigePoints = save.prestigePoints ?? 0;
    totalPrestigePointsEarned = save.totalPrestigePointsEarned ?? 0;
    // Update prestige milestone after loading
    prestigeMilestone = 100000 * Math.pow(3, totalPrestigePointsEarned);
    if (save.techTree && Array.isArray(save.techTree)) {
      save.techTree.forEach((saved, i) => {
        techTree[i].level = saved.level;
        techTree[i].unlocked = saved.unlocked;
      });
    }
    if (save.achievements) {
      save.achievements.forEach((saved, i) => {
        achievements[i].unlocked = saved.unlocked;
      });
    }
    offlineTimeBank = save.offlineTimeBank ?? 0;
    lastActive = save.lastActive ?? Date.now();
    lastSavedPPS = save.lastSavedPPS ?? 0;
    
    // Load offline upgrades and buildings
    if (save.offlineUpgrades) {
      save.offlineUpgrades.forEach((saved, i) => {
        if (offlineUpgrades[i]) {
          offlineUpgrades[i].tier = saved.tier;
          offlineUpgrades[i].cost = saved.cost;
        }
      });
    }
    if (save.offlineBuildings) {
      save.offlineBuildings.forEach((saved, i) => {
        if (offlineBuildings[i]) {
          offlineBuildings[i].tier = saved.tier;
          offlineBuildings[i].cost = saved.cost;
        }
      });
    }
    
    // Load settings
    window.particleEffectsEnabled = save.particleEffectsEnabled ?? true;
    const savedVolume = save.volume ?? 1;
    
    // Initialize settings UI
    muteToggle.checked = isMuted;
    volumeSlider.value = savedVolume;
    volumeValue.textContent = Math.round(savedVolume * 100) + '%';
    particleEffectsToggle.checked = window.particleEffectsEnabled;
    
    // Apply volume to audio
    screamAudios.forEach(audio => {
      audio.volume = savedVolume;
    });
    
    // Apply offline gains
    const now = Date.now();
    // Update lastActive to current time BEFORE calculating offline gains
    // This ensures we only consider the actual time since the last save
    const timeSinceLastSave = Math.max(0, Math.floor((now - lastActive) / 1000));
    lastActive = now; // Update immediately
    
    // Only use the amount of offline time that corresponds to the actual time away
    const timeToUse = Math.min(timeSinceLastSave, offlineTimeBank);
    if (timeToUse > 0) {
      // Use the PPS that was active when the game was last saved, not the current PPS
      let pps = lastSavedPPS;
      
      // Apply offline upgrade effects
      pps = applyOfflineUpgradeEffects(pps);
      
      const offlineGains = Math.floor(pps * timeToUse);
      purples += offlineGains;
      totalPurplesEarned += offlineGains;
      offlineTimeBank -= timeToUse;
      
      // Show offline gains popup
      showOfflineGainsPopup(timeToUse, offlineTimeBank, offlineGains, pps);
    }
    window.animationSpeed = save.animationSpeed ?? 1;
    window.fallingPurpleLimit = save.fallingPurpleLimit ?? 200;
    window.floatingTextEnabled = save.floatingTextEnabled ?? true;
    window.screenShakeEnabled = save.screenShakeEnabled ?? true;
    window.screamAudioEnabled = save.screamAudioEnabled ?? true;
    window.numberFormat = save.numberFormat ?? 'separators';
    savedFarmPositions = save.savedFarmPositions ?? [];
    performanceMetricsEnabled = save.performanceMetricsEnabled ?? false;
    // inside loadGame before saveGame();
    // Need to rebuild farm images from saved positions
    rebuildFarmDecorFromSave();
    updateFarmDecor();
    saveGame();
    if (statsModal && statsModal.style.display === 'block') renderStats();
  }
}

function updateScore() {
  const ppc = getManualClickValue();
  const pps = getPPS();
  scoreEl.innerHTML = `Purples: ${formatNumber(purples)}<br><span style='font-size:0.8em;font-weight:normal;'>Per Click: <b>${formatNumber(ppc)}</b><br>Per Second: <b>${formatNumber(pps)}</b><br>Clicks/sec: <b>${manualClicksLastSecond}</b></span><br><span style='font-size:0.8em;color:#ffe066;'>Prestige Points: <b>${prestigePoints}</b></span>`;
  checkPrestigeAvailability();
  checkTechTreeAvailability();
}

function updateSidebarTabPurchasable() {
  // Main tab (upgrades and buildings combined)
  const availableUpgrades = getAvailableUpgrades();
  const canBuyUpgrade = availableUpgrades.some(u => {
    const labBuilding = buildings.find(b => b.id === 'purple_lab');
    const labCount = labBuilding ? labBuilding.tier : 0;
    const costReduction = Math.min(0.5, labCount * 0.05);
    const actualCost = Math.floor(u.cost * (1 - costReduction));
    return purples >= actualCost;
  });
  const canBuyBuilding = buildings.some(b => purples >= b.cost);
  
  if (canBuyUpgrade || canBuyBuilding) {
    showMainBtn.classList.add('purchasable');
  } else {
    showMainBtn.classList.remove('purchasable');
  }
  
  // Offline upgrades and buildings
  const canBuyOfflineUpgrade = offlineUpgrades.some(u => purples >= u.cost && (!u.maxTier || u.tier < u.maxTier));
  const canBuyOfflineBuilding = offlineBuildings.some(b => purples >= b.cost && (!b.maxTier || b.tier < b.maxTier));
  if (canBuyOfflineUpgrade || canBuyOfflineBuilding) {
    showOfflineBtn.classList.add('purchasable');
  } else {
    showOfflineBtn.classList.remove('purchasable');
  }
}

function renderSidebar() {
  console.log("DEBUG: renderSidebar called, sidebarPage:", sidebarPage);
  // Show/hide sidebars based on current page
  mainSidebar.style.display = (sidebarPage === 'main') ? 'flex' : 'none';
  upgradesSidebar.style.display = 'none';
  offlineUpgradeSidebar.style.display = (sidebarPage === 'offline') ? 'flex' : 'none';
  console.log("DEBUG: offlineUpgradeSidebar display set to:", offlineUpgradeSidebar.style.display);
  
  if (sidebarPage === 'main') {
    renderMainSidebar();
  } else if (sidebarPage === 'offline') {
    renderOfflineSidebar();
  }
  
  updateSidebarTabPurchasable();
  checkCasinoUnlock();
}

function renderMainSidebar() {
  // Clear existing content
  upgradeGrid.innerHTML = '';
  buildingList.innerHTML = '';
  
  // Add "Upgrades" title above the grid (check if it doesn't already exist)
  const parent = upgradeGrid.parentNode;
  let upgradesTitle = parent.querySelector('h3');
  if (!upgradesTitle) {
    upgradesTitle = document.createElement('h3');
    upgradesTitle.textContent = 'Upgrades';
    upgradesTitle.style.color = '#c77dff';
    upgradesTitle.style.textAlign = 'center';
    upgradesTitle.style.marginBottom = '12px';
    upgradesTitle.style.fontSize = '1.1em';
    parent.insertBefore(upgradesTitle, upgradeGrid);
  }
  
  // Render new upgrades grid
  const availableUpgrades = getAvailableUpgrades();
  
  if (availableUpgrades.length === 0) {
    const noUpgrades = document.createElement('div');
    noUpgrades.textContent = 'No upgrades available. Purchase buildings to unlock upgrades!';
    noUpgrades.style.color = '#888';
    noUpgrades.style.textAlign = 'center';
    noUpgrades.style.padding = '20px';
    noUpgrades.style.fontSize = '0.9em';
    upgradeGrid.appendChild(noUpgrades);
  } else {
    // Limit visible upgrades to first row (up to 4 for proper display)
    const visibleUpgrades = availableUpgrades.slice(0, 4);
    
    // Add event listeners to the upgrade grid for hover effects
    let additionalRowsVisible = false;
    
    const showAdditionalRows = () => {
      if (availableUpgrades.length > 4 && !additionalRowsVisible) {
        showAdditionalUpgradeRows(availableUpgrades.slice(4));
        additionalRowsVisible = true;
      }
    };
    
    const hideAdditionalRows = () => {
      if (additionalRowsVisible) {
        hideAdditionalUpgradeRows();
        additionalRowsVisible = false;
      }
    };
    
    // Add hover events to the upgrade grid itself
    upgradeGrid.addEventListener('mouseenter', showAdditionalRows);
    
    // Add mouseleave to the upgrade grid's parent to handle hovering over additional rows
    upgradeGrid.parentNode.addEventListener('mouseleave', hideAdditionalRows);
    
    visibleUpgrades.forEach((upgrade, index) => {
      const square = document.createElement('button');
      square.className = 'upgrade-square';
      
      // Apply lab cost reduction
      const labBuilding = buildings.find(b => b.id === 'purple_lab');
      const labCount = labBuilding ? labBuilding.tier : 0;
      const costReduction = Math.min(0.5, labCount * 0.05);
      const actualCost = Math.floor(upgrade.cost * (1 - costReduction));
      
      square.disabled = purples < actualCost;
      square.innerHTML = upgrade.icon || '⭐';
      square.setAttribute('data-upgrade', upgrade.id);
      
      // Add tooltip events
      square.addEventListener('mouseenter', (e) => {
        const tooltip = generateNewUpgradeTooltip(upgrade);
        createTooltip(tooltip, e.clientX, e.clientY, square, 'upgrade');
      });
      
      square.addEventListener('mouseleave', () => {
        removeTooltip();
      });
      
      square.addEventListener('mousemove', (e) => {
        if (currentTooltip) {
          currentTooltip.style.left = (e.clientX + 15) + 'px';
          currentTooltip.style.top = (e.clientY - 10) + 'px';
        }
      });
      
      square.onclick = () => {
        if (purchaseUpgrade(upgrade.id)) {
          if (!isMuted && meowAudio) {
            meowAudio.currentTime = 0;
            meowAudio.play();
          }
          sidebarNeedsUpdate = true; // Mark for update after purchase
          saveGame();
        }
      };
      
      upgradeGrid.appendChild(square);
    });
  }
  
  // Render buildings list (unchanged)
  const visibleBuildings = getBuildingVisibility();
  visibleBuildings.forEach(({ building, obscured }) => {
    const item = document.createElement('button');
    item.className = 'building-item' + (obscured ? ' building-obscured' : '');
    item.disabled = obscured || (building.maxTier && building.tier >= building.maxTier) || purples < building.cost;
    item.setAttribute('data-building', building.id);
    
    const displayName = obscured ? obscureBuildingName(building.name) : building.name;
    const countDisplay = building.tier > 0 ? `(${building.tier})` : '';
    
    item.innerHTML = `
      <div class="building-item-left">
        <div class="building-item-icon">${building.icon || '🏢'}</div>
        <div class="building-item-info">
          <div class="building-item-name">${displayName}</div>
          <div class="building-item-cost">${formatNumber(building.cost)} Purples</div>
        </div>
      </div>
      ${countDisplay ? `<div class="building-item-count">${countDisplay}</div>` : ''}
    `;
    
    // Add tooltip events
    item.addEventListener('mouseenter', (e) => {
      const tooltip = generateBuildingTooltip(building, obscured);
      createTooltip(tooltip, e.clientX, e.clientY, item, 'building');
    });
    
    item.addEventListener('mouseleave', () => {
      removeTooltip();
    });
    
    item.addEventListener('mousemove', (e) => {
      if (currentTooltip) {
        currentTooltip.style.left = (e.clientX + 15) + 'px';
        currentTooltip.style.top = (e.clientY - 10) + 'px';
      }
    });
    
    if (!obscured) {
      item.onclick = () => {
        if (purples >= building.cost && (!building.maxTier || building.tier < building.maxTier)) {
          purples -= building.cost;
          building.tier++;
          building.cost = Math.round(building.baseCost * Math.pow(building.costGrowth, building.tier));
          
          createUpgradeParticles(item);
          if (!isMuted && meowAudio) {
            meowAudio.currentTime = 0;
            meowAudio.play();
          }
          
          // Track building purchases for Building Boom achievement
          if (!window._buildingBuyTimestamps) window._buildingBuyTimestamps = [];
          window._buildingBuyTimestamps.push(Date.now());
          
          if (building.id === 'purple_farm') updateFarmDecor();
          
          updateScore();
          sidebarNeedsUpdate = true; // Mark for update after purchase
          saveGame();
        }
      };
    }
    
    buildingList.appendChild(item);
  });
}

function showAdditionalUpgradeRows(additionalUpgrades) {
  // Remove existing additional rows
  hideAdditionalUpgradeRows();
  
  if (additionalUpgrades.length === 0) return;
  
  // Create additional rows container
  const additionalContainer = document.createElement('div');
  additionalContainer.className = 'additional-upgrade-rows';
  additionalContainer.style.marginTop = '8px';
  
  // Group upgrades into rows of 4
  for (let i = 0; i < additionalUpgrades.length; i += 4) {
    const rowUpgrades = additionalUpgrades.slice(i, i + 4);
    const row = document.createElement('div');
    row.className = 'upgrade-grid';
    row.style.display = 'grid';
    row.style.gridTemplateColumns = 'repeat(auto-fit, minmax(50px, 1fr))';
    row.style.gap = '8px';
    row.style.padding = '0';
    
    rowUpgrades.forEach(upgrade => {
      const square = document.createElement('button');
      square.className = 'upgrade-square';
      
      // Apply lab cost reduction
      const labBuilding = buildings.find(b => b.id === 'purple_lab');
      const labCount = labBuilding ? labBuilding.tier : 0;
      const costReduction = Math.min(0.5, labCount * 0.05);
      const actualCost = Math.floor(upgrade.cost * (1 - costReduction));
      
      square.disabled = purples < actualCost;
      square.innerHTML = upgrade.icon || '⭐';
      square.setAttribute('data-upgrade', upgrade.id);
      
      // Add tooltip events
      square.addEventListener('mouseenter', (e) => {
        const tooltip = generateNewUpgradeTooltip(upgrade);
        createTooltip(tooltip, e.clientX, e.clientY, square, 'upgrade');
      });
      
      square.addEventListener('mouseleave', () => {
        removeTooltip();
      });
      
      square.addEventListener('mousemove', (e) => {
        if (currentTooltip) {
          currentTooltip.style.left = (e.clientX + 15) + 'px';
          currentTooltip.style.top = (e.clientY - 10) + 'px';
        }
      });
      
      square.onclick = () => {
        if (purchaseUpgrade(upgrade.id)) {
          if (!isMuted && meowAudio) {
            meowAudio.currentTime = 0;
            meowAudio.play();
          }
          sidebarNeedsUpdate = true; // Mark for update after purchase
          saveGame();
        }
      };
      
      row.appendChild(square);
    });
    
    additionalContainer.appendChild(row);
  }
  
  upgradeGrid.parentNode.insertBefore(additionalContainer, upgradeGrid.nextSibling);
}

function hideAdditionalUpgradeRows() {
  const existing = document.querySelector('.additional-upgrade-rows');
  if (existing) {
    existing.remove();
  }
}

function renderOfflineSidebar() {
  offlineUpgradeSidebar.innerHTML = '';
  console.log("DEBUG: Rendering offline sidebar, upgrades count:", offlineUpgrades.length);
  
  offlineUpgradeSidebar.innerHTML += '<h3 style="color:#ffe066;text-align:center;margin-bottom:18px;">Offline Upgrades</h3>';
  offlineUpgrades.forEach((upgrade) => {
    const btn = document.createElement('button');
    btn.className = 'upgrade-btn';
    btn.disabled = (upgrade.maxTier && upgrade.tier >= upgrade.maxTier) || purples < upgrade.cost;
    btn.innerHTML = `
      <div style="font-weight:bold;">${upgrade.name} (Tier ${upgrade.tier}${upgrade.maxTier !== Infinity ? '/' + upgrade.maxTier : ''})</div>
      <div style="font-size:0.95em;">${upgrade.description}</div>
      <div style="margin-top:4px;">Cost: ${formatNumber(upgrade.cost)} Purples</div>
    `;
    btn.onclick = () => {
      console.log("DEBUG: Offline upgrade clicked:", upgrade.name, "Cost:", upgrade.cost, "Purples:", purples);
      if (purples >= upgrade.cost && (!upgrade.maxTier || upgrade.tier < upgrade.maxTier)) {
        console.log("DEBUG: Purchase allowed, purchasing...");
        purples -= upgrade.cost;
        upgrade.tier++;
        if (typeof upgrade.effect === 'function') upgrade.effect();
        upgrade.cost = Math.round(upgrade.baseCost * Math.pow(upgrade.costGrowth, upgrade.tier));
        
        createUpgradeParticles(btn);
        if (!isMuted && meowAudio) {
          meowAudio.currentTime = 0;
          meowAudio.play();
        }
        
        updateScore();
        sidebarNeedsUpdate = true; // Mark for update after purchase
        saveGame();
      }
    };
    offlineUpgradeSidebar.appendChild(btn);
  });
  
  offlineUpgradeSidebar.innerHTML += '<h3 style="color:#ffe066;text-align:center;margin:24px 0 12px 0;">Offline Buildings</h3>';
  offlineBuildings.forEach((building) => {
    const btn = document.createElement('button');
    btn.className = 'upgrade-btn';
    btn.disabled = (building.maxTier && building.tier >= building.maxTier) || purples < building.cost;
    btn.innerHTML = `
      <div style="font-weight:bold;">${building.name} (Tier ${building.tier}${building.maxTier ? '/' + building.maxTier : ''})</div>
      <div style="font-size:0.95em;">${building.description}</div>
      <div style="margin-top:4px;">Cost: ${formatNumber(building.cost)} Purples</div>
    `;
    btn.onclick = () => {
      if (purples >= building.cost && (!building.maxTier || building.tier < building.maxTier)) {
        purples -= building.cost;
        building.tier++;
        building.cost = Math.round(building.baseCost * Math.pow(building.costGrowth, building.tier));
        
        createUpgradeParticles(btn);
        if (!isMuted && meowAudio) {
          meowAudio.currentTime = 0;
          meowAudio.play();
        }
        
        // Track building purchases for Building Boom achievement
        if (!window._buildingBuyTimestamps) window._buildingBuyTimestamps = [];
        window._buildingBuyTimestamps.push(Date.now());
        
        updateScore();
        renderSidebar();
        saveGame();
      }
    };
    offlineUpgradeSidebar.appendChild(btn);
  });
}

function createFallingPurple() {
  const img = document.createElement('img');
  // 1 in 10000 chance for goblin_arne.png, 30% chance for purrrpet.png, 70% chance for purple.png
  const rand = Math.random();
  if (rand < 0.0001) {
    img.src = 'images/goblin_arne.png';
  } else if (rand < 0.3001) { // 30% of remaining 99.99%
    img.src = 'images/purrrpet.png';
  } else {
    img.src = 'images/purple.png';
  }
  img.className = 'falling-purple';

  // Initial position and velocity
  const PURPLE_SIZE = 72;
  const containerWidth = window.innerWidth;
  let x = Math.random() * (containerWidth - PURPLE_SIZE); // ensures image is fully inside
  let y = -PURPLE_SIZE;
  let vx = (Math.random() - 0.5) * 6; // random horizontal velocity
  let vy = Math.random() * 2 + 2; // initial downward velocity
  const gravity = 0.35;
  const bounce = 0.6;
  const friction = 0.98;
  
  // Rotation variables
  let rotation = Math.random() * 360; // random initial rotation
  let rotationSpeed = (Math.random() - 0.5) * 720; // random rotation speed (-360 to +360 degrees per second)
  let wobble = Math.random() * 20; // random wobble amount
  let wobbleSpeed = Math.random() * 4 + 2; // random wobble speed

  img.style.left = `${x}px`;
  img.style.top = `${y}px`;
  fallingContainer.appendChild(img);

  let startTime = null;
  let lastTimestamp = null;
  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    if (!lastTimestamp) lastTimestamp = timestamp;
    const elapsed = (timestamp - startTime) / 1000; // seconds
    const deltaTime = (timestamp - lastTimestamp) / 1000; // time since last frame
    lastTimestamp = timestamp;

    vy += gravity;
    x += vx;
    y += vy;
    
    // Update rotation and wobble
    rotation += rotationSpeed * deltaTime;
    const wobbleOffset = Math.sin(elapsed * wobbleSpeed) * wobble;

    // Bounce off floor
    if (y + PURPLE_SIZE > window.innerHeight) {
      y = window.innerHeight - PURPLE_SIZE;
      vy *= -bounce;
      vx *= friction;
      if (Math.abs(vy) < 1) vy = 0;
      // Add some rotation change on bounce
      rotationSpeed *= 0.8;
      wobble *= 0.7;
    }
    // Bounce off walls
    if (x < 0) {
      x = 0;
      vx *= -bounce;
      rotationSpeed *= 0.9;
    } else if (x + PURPLE_SIZE > window.innerWidth) {
      x = window.innerWidth - PURPLE_SIZE;
      vx *= -bounce;
      rotationSpeed *= 0.9;
    }

    // Apply transform with rotation and wobble
    img.style.transform = `translate(${x}px, ${y + wobbleOffset}px) rotate(${rotation}deg)`;

    // Remove if out of bounds for a while or after 5 seconds
    if (elapsed > 5 || y > window.innerHeight + 100) {
      img.remove();
    } else {
      requestAnimationFrame(animate);
    }
  }
  requestAnimationFrame(animate);
}

// Achievement boosts system
const achievementBoosts = {
  first_click:      { type: 'manual', value: 0.01, desc: '+1% manual click gains' },
  first_1000:       { type: 'all', value: 0.01, desc: '+1% all Purples earned' },
  first_million:    { type: 'pps', value: 0.02, desc: '+2% PPS' },
  world_domination: { type: 'all', value: 0.05, desc: '+5% all production' },
  click_frenzy:     { type: 'manual', value: 0.10, desc: '+10% manual click value' },
  auto_empire:      { type: 'building', value: 0.02, desc: '+2% building production' },
  upgrade_collector:{ type: 'upgrade', value: 0.02, desc: '+2% upgrade effects' },
  farm_tycoon:      { type: 'farm', value: 0.02, desc: '+2% Purple Farm production' },
  factory_owner:    { type: 'factory', value: 0.02, desc: '+2% Purple Factory production' },
  mining_magnate:   { type: 'mine', value: 0.02, desc: '+2% Purple Mine production' },
  lab_rat:          { type: 'lab', value: 0.02, desc: '+2% Purple Lab production' },
  portal_master:    { type: 'portal', value: 0.02, desc: '+2% Purple Portal production' },
  galactic_overlord:{ type: 'galactic', value: 0.02, desc: '+2% Galactic Purpler production' },
  purple_rain:      { type: 'all', value: 0.02, desc: '+2% all Purples earned in a second' },
  manual_master:    { type: 'manual', value: 0.05, desc: '+5% manual click value' },
  prestige:         { type: 'prestige', value: 0.05, desc: '+5% prestige bonuses' },
  idle_idol:        { type: 'idle', value: 0.05, desc: '+5% PPS while idle' },
  upgrade_maxed:    { type: 'upgrade', value: 0.05, desc: '+5% upgrade effects' },
  building_boom:    { type: 'building_speed', value: 0.02, desc: '+2% building purchase speed' },
  sound_of_silence: { type: 'all', value: 0.01, desc: '+1% all production while muted' },
  speedrunner:      { type: 'all', value: 0.05, desc: '+5% all production for first 10 min' },
  loyal_clicker:    { type: 'all', value: 0.10, desc: '+10% all production permanently' },
};

function getAchievementBoosts() {
  let boosts = {
    manual: 1,
    pps: 1,
    all: 1,
    building: 1,
    upgrade: 1,
    farm: 1,
    factory: 1,
    mine: 1,
    lab: 1,
    portal: 1,
    galactic: 1,
    prestige: 1,
    idle: 1,
    building_speed: 1,
  };
  achievements.forEach(a => {
    if (a.unlocked && achievementBoosts[a.id]) {
      const boost = achievementBoosts[a.id];
      if (boost.type in boosts) boosts[boost.type] *= (1 + boost.value);
    }
  });
  return boosts;
}

// Offline upgrade effects helper functions
function getOfflineTimeAccumulationRate() {
  // Base rate: 1 second per second
  let rate = 1;
  
  // Offline Booster: +2s/sec per tier
  const offlineBooster = offlineUpgrades.find(u => u.id === 'offline_booster');
  if (offlineBooster) {
    rate += offlineBooster.tier * 2;
  }
  
  return rate;
}

function getMaxOfflineTimeBank() {
  // Base cap: 12 hours (43200 seconds)
  let maxBank = 43200;
  
  // Time Capsule: +1 hour per tier
  const timeCapsule = offlineUpgrades.find(u => u.id === 'time_capsule');
  if (timeCapsule) {
    maxBank += timeCapsule.tier * 3600; // 3600 seconds = 1 hour
  }
  
  // Chrono Vault: +1 hour per tier
  const chronoVault = offlineBuildings.find(b => b.id === 'chrono_vault');
  if (chronoVault) {
    maxBank += chronoVault.tier * 3600;
  }
  
  return maxBank;
}

function applyOfflineUpgradeEffects(basePPS) {
  let pps = basePPS;
  
  // Efficient Automation: +25% effectiveness
  const efficientAutomation = offlineUpgrades.find(u => u.id === 'efficient_automation');
  if (efficientAutomation && efficientAutomation.tier > 0) {
    pps *= 1.25;
  }
  
  // Offline Magnet: +10% per tier of PPS counted for offline gains
  const offlineMagnet = offlineUpgrades.find(u => u.id === 'offline_magnet');
  if (offlineMagnet) {
    pps *= (1 + 0.10 * offlineMagnet.tier);
  }
  
  // Offline Synergy: Include synergy bonus in offline gains
  const offlineSynergy = offlineUpgrades.find(u => u.id === 'offline_synergy');
  if (offlineSynergy && offlineSynergy.tier > 0 && synergyBonus > 0) {
    // Add a portion of the synergy bonus based on upgrade tier
    const synergyContribution = synergyBonus * 0.1 * offlineSynergy.tier; // 10% per tier
    pps += synergyContribution;
  }
  
  // Sleep Lab: +10% per tier to all offline gains
  const sleepLab = offlineBuildings.find(b => b.id === 'sleep_lab');
  if (sleepLab) {
    pps *= (1 + 0.10 * sleepLab.tier);
  }
  
  return pps;
}

// Tech tree renderer
function renderTechTree() {
  const content = document.getElementById('tech-tree-content');
  content.innerHTML = `<div style='margin-bottom:12px;font-size:1.1em; width:100%; text-align:center;'>Prestige Points: <b>${prestigePoints}</b> (Total Earned: ${totalPrestigePointsEarned})</div>`;
  
  // Tree layout: assign each node a (row, col) based on branch and depth
  const treeLevels = [
    ['click_power', 'auto_efficiency', 'offline_booster', 'prestige_multiplier'],
    ['critical_mastery', 'synergy_engine', 'time_capsule', 'cheaper_upgrades'],
    ['combo_chain', 'factory_overdrive', 'dream_clicks', 'faster_progress'],
    ['golden_touch', 'purple_storm', 'quantum_leap', 'cosmetic_unlocks'],
  ];
  const nodePos = {};
  for (let row = 0; row < treeLevels.length; row++) {
    for (let col = 0; col < treeLevels[row].length; col++) {
      nodePos[treeLevels[row][col]] = { row, col };
    }
  }
  const nodeW = 110, nodeH = 70, hGap = 60, vGap = 50;
  const leftPad = 40, topPad = 60;
  
  techTree.forEach((tech) => {
    const pos = nodePos[tech.id];
    if (!pos) return;
    const canBuy = prestigePoints >= tech.cost && tech.deps.every(depId => {
      if (depId.includes('-')) {
        const [baseId, lvl] = depId.split('-');
        const dep = techTree.find(t => t.id === baseId);
        return dep && dep.level >= parseInt(lvl);
      } else {
        const dep = techTree.find(t => t.id === depId);
        return dep && (dep.unlocked || dep.level > 0);
      }
    }) && tech.level < tech.maxLevel;
    const unlocked = tech.level > 0;
    const node = document.createElement('div');
    node.className = 'tech-node' + (unlocked ? ' unlocked' : (!canBuy ? ' locked' : ''));
    node.style.width = nodeW + 'px';
    node.style.height = nodeH + 'px';
    node.style.position = 'absolute';
    node.style.padding = '8px';
    node.style.border = unlocked ? '2px solid #ffe066' : (canBuy ? '2px solid #c77dff' : '2px solid #555');
    node.style.background = unlocked ? '#2a0845' : (canBuy ? '#1a0330' : '#1a1a1a');
    node.style.borderRadius = '8px';
    node.style.cursor = canBuy ? 'pointer' : 'default';
    node.style.fontSize = '0.85em';
    node.style.color = unlocked ? '#ffe066' : (canBuy ? '#c77dff' : '#888');
    node.innerHTML = `<div style='font-weight:bold;font-size:1.1em;'>${tech.name}</div>
      <div style='font-size:0.9em;margin:2px 0;'>${tech.desc}</div>
      <div style='font-size:0.8em;'>Cost: ${tech.cost} PP</div>
      <div style='font-size:0.8em;'>Level: ${tech.level}/${tech.maxLevel}</div>`;
    if (canBuy) {
      node.onclick = () => {
        if (prestigePoints >= tech.cost && tech.level < tech.maxLevel) {
          prestigePoints -= tech.cost;
          tech.level++;
          tech.unlocked = true;
          saveGame();
          renderTechTree();
          updateScore();
        }
      };
    }
    node.style.left = (leftPad + pos.col * (nodeW + hGap)) + 'px';
    node.style.top = (topPad + pos.row * (nodeH + vGap)) + 'px';
    content.appendChild(node);
  });
}

// Tech tree modal close
const closeTechTree = document.getElementById('close-tech-tree');
const techTreeModal = document.getElementById('tech-tree-modal');
if (closeTechTree && techTreeModal) {
  closeTechTree.addEventListener('click', () => {
    techTreeModal.style.display = 'none';
  });
  window.addEventListener('click', (e) => {
    if (e.target === techTreeModal) techTreeModal.style.display = 'none';
  });
}

// Settings menu event listeners
settingsBtn.addEventListener('click', () => {
  settingsModal.style.display = 'block';
  document.getElementById('animation-speed').value = window.animationSpeed;
  document.getElementById('animation-speed-value').textContent = window.animationSpeed + 'x';
  document.getElementById('falling-limit').value = window.fallingPurpleLimit;
  document.getElementById('falling-limit-value').textContent = window.fallingPurpleLimit;
  document.getElementById('floating-text-toggle').checked = window.floatingTextEnabled;
  document.getElementById('screen-shake-toggle').checked = window.screenShakeEnabled;
  document.getElementById('scream-audio-toggle').checked = window.screamAudioEnabled;
  document.getElementById('number-format-select').value = window.numberFormat;
  document.getElementById('hide-maxed-upgrades-setting').checked = hideMaxedUpgrades;
  document.getElementById('performance-metrics-toggle').checked = performanceMetricsEnabled;
});

closeSettings.addEventListener('click', () => {
  settingsModal.style.display = 'none';
});

// Audio controls
muteToggle.addEventListener('change', () => {
  isMuted = muteToggle.checked;
  saveGame();
});

volumeSlider.addEventListener('input', () => {
  const volume = parseFloat(volumeSlider.value);
  volumeValue.textContent = Math.round(volume * 100) + '%';
  screamAudios.forEach(audio => {
    audio.volume = volume;
  });
  saveGame();
});

// Particle effects toggle
particleEffectsToggle.addEventListener('change', () => {
  window.particleEffectsEnabled = particleEffectsToggle.checked;
  saveGame();
});

// Reset game button
resetGameBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to reset your game? This cannot be undone.')) {
    localStorage.removeItem('purpleClickerSave');
    purples = 0;
    clickValue = 1;
    totalPurplesEarned = 0;
    totalClicks = 0;
    totalAutoClicks = 0;
    biggestSingleGain = 0;
    runStartTime = Date.now();
    prestigePoints = 0;
    totalPrestigePointsEarned = 0;
    prestigeMilestone = 100000;
    // Reset new upgrade system
    buildingUpgrades.forEach(u => { u.owned = false; });
    clickUpgrades.forEach(u => { u.owned = false; });
    buildings.forEach(b => {
      b.tier = 0;
      b.cost = b.baseCost;
      b.totalProduced = 0;
    });
    techTree.forEach(t => {
      t.level = 0;
      t.unlocked = false;
    });
    achievements.forEach(a => {
      a.unlocked = false;
    });
    saveGame();
    location.reload();
  }
});

// Settings controls
document.getElementById('animation-speed').addEventListener('input', (e) => {
  window.animationSpeed = parseFloat(e.target.value);
  document.getElementById('animation-speed-value').textContent = window.animationSpeed + 'x';
  saveGame();
});
document.getElementById('falling-limit').addEventListener('input', (e) => {
  window.fallingPurpleLimit = parseInt(e.target.value);
  document.getElementById('falling-limit-value').textContent = window.fallingPurpleLimit;
  saveGame();
});
document.getElementById('floating-text-toggle').addEventListener('change', (e) => {
  window.floatingTextEnabled = e.target.checked;
  saveGame();
});
document.getElementById('screen-shake-toggle').addEventListener('change', (e) => {
  window.screenShakeEnabled = e.target.checked;
  saveGame();
});
document.getElementById('scream-audio-toggle').addEventListener('change', (e) => {
  window.screamAudioEnabled = e.target.checked;
  saveGame();
}); 
document.getElementById('number-format-select').addEventListener('change', (e) => {
  window.numberFormat = e.target.value;
  updateScore();
  renderSidebar();
  if (statsModal && statsModal.style.display === 'block') renderStats();
  saveGame();
});
document.getElementById('hide-maxed-upgrades-setting').addEventListener('change', (e) => {
  hideMaxedUpgrades = e.target.checked;
  renderSidebar();
  saveGame();
});
document.getElementById('performance-metrics-toggle').addEventListener('change', (e) => {
  performanceMetricsEnabled = e.target.checked;
  saveGame();
});

function formatTime(ms) {
  const sec = Math.floor(ms / 1000) % 60;
  const min = Math.floor(ms / 60000) % 60;
  const hr = Math.floor(ms / 3600000);
  return `${hr}h ${min}m ${sec}s`;
}

function getPPS() {
  let pps = 0;
  buildings.forEach(b => {
    pps += getBuildingEffectivePpS(b);
  });
  
  // Add global bonuses
  buildings.forEach(building => {
    const bonus = applyGlobalBuildingBonuses(building, building.pps * building.tier, 1);
    pps += bonus;
  });
  
  // Add special upgrade bonuses that generate independent PpS
  const autoClickerBuilding = buildings.find(b => b.id === 'auto_clicker');
  const hasUltimateClicker = buildingUpgrades.find(u => u.id === 'auto_clicker_ultimate_clicker' && u.owned);
  if (hasUltimateClicker && autoClickerBuilding && autoClickerBuilding.tier > 0) {
    // Auto Clickers produce 1% of total PpS as bonus
    const baseTotalPpS = buildings.reduce((sum, b) => sum + b.pps * b.tier, 0);
    pps += baseTotalPpS * autoClickerBuilding.tier * 0.01;
  }
  
  // Add farm dimensional agriculture bonus: produce 2% of total building PpS as bonus
  const farmBuilding = buildings.find(b => b.id === 'purple_farm');
  const hasDimensionalAgriculture = buildingUpgrades.find(u => u.id === 'purple_farm_dimensional_agriculture' && u.owned);
  if (hasDimensionalAgriculture && farmBuilding && farmBuilding.tier > 0) {
    const baseTotalPpS = buildings.reduce((sum, b) => sum + b.pps * b.tier, 0);
    pps += baseTotalPpS * farmBuilding.tier * 0.02;
  }
  
  // Add similar bonuses for other special upgrades...
  const factoryBuilding = buildings.find(b => b.id === 'purple_factory');
  const hasPortalManufacturing = buildingUpgrades.find(u => u.id === 'purple_factory_portal_manufacturing' && u.owned);
  if (hasPortalManufacturing && factoryBuilding && factoryBuilding.tier > 0) {
    const baseTotalPpS = buildings.reduce((sum, b) => sum + b.pps * b.tier, 0);
    pps += baseTotalPpS * factoryBuilding.tier * 0.015;
  }
  
  pps += synergyBonus;
  return pps;
}

function renderStats() {
  const now = Date.now();
  const runDuration = now - runStartTime;
  const pps = getPPS();
  const ppc = clickValue;
  const upgradesOwned = buildingUpgrades.filter(u => u.owned).map(u => u.name).concat(
    clickUpgrades.filter(u => u.owned).map(u => u.name)
  ).join('<br>') || 'None';
  const buildingsOwned = buildings.map(b => `${b.name}: Tier ${b.tier}`).join('<br>');
  const manualVsAuto = totalPurplesEarned === 0 ? 'N/A' : `${Math.round((totalClicks * ppc) / totalPurplesEarned * 100)}% manual / ${Math.round((totalAutoClicks) / totalPurplesEarned * 100)}% auto`;
  const offlineHours = Math.floor(offlineTimeBank / 3600);
  const offlineMinutes = Math.floor((offlineTimeBank % 3600) / 60);
  const offlineSeconds = offlineTimeBank % 60;
  statsContent.innerHTML = `
    <b>Current Purples:</b> ${formatNumber(purples)}<br>
    <b>Total Purples Earned:</b> ${formatNumber(totalPurplesEarned)}<br>
    <b>Purples Per Second (PPS):</b> ${formatNumber(pps)}<br>
    <b>Purples Per Click (PPC):</b> ${formatNumber(ppc)}<br>
    <b>Total Clicks:</b> ${formatNumber(totalClicks)}<br>
    <b>Total Auto Clicks:</b> ${formatNumber(totalAutoClicks)}<br>
    <b>Run Duration:</b> ${formatTime(runDuration)}<br>
    <b>Current Prestige Points:</b> ${prestigePoints}<br>
    <b>Total Prestige Points Earned:</b> ${totalPrestigePointsEarned}<br>
    <b>Upgrades Owned:</b><br>${upgradesOwned}<br>
    <b>Buildings Owned:</b><br>${buildingsOwned}<br>
    <b>Biggest Single Gain:</b> ${formatNumber(biggestSingleGain)}<br>
    <b>Manual vs. Auto Ratio:</b> ${manualVsAuto}<br>
    <b>Session Start Time:</b> ${new Date(runStartTime).toLocaleString()}<br>
    <b>Offline Time Bank:</b> ${offlineHours}h ${offlineMinutes}m ${offlineSeconds}s (max 12h)
  `;
  statsContent.innerHTML += `<br><h3 style='margin-top:24px;color:#ffe066;'>Achievements</h3>`;
  statsContent.innerHTML += `<ul style='list-style:none;padding:0;'>` +
    achievements.map(a => `<li style='margin-bottom:8px;${a.unlocked ? "color:#ffe066;" : "color:#888;"}'>
      ${a.unlocked ? '✔️' : '⬜'} <b>${a.name}</b>: ${a.desc}
    </li>`).join('') + '</ul>';
  // Add this block:
  const boosts = getAchievementBoosts();
  let boostList = Object.entries(achievementBoosts)
    .filter(([id, b]) => achievements.find(a => a.id === id && a.unlocked))
    .map(([id, b]) => `<li style='margin-bottom:4px;color:#ffe066;'>${achievements.find(a => a.id === id)?.name}: ${b.desc}</li>`)
    .join('');
  if (boostList) {
    statsContent.innerHTML += `<br><h3 style='margin-top:18px;color:#ffe066;'>Achievement Boosts</h3><ul style='list-style:none;padding:0;'>${boostList}</ul>`;
  }
  
  // Add performance metrics if enabled
  if (performanceMetricsEnabled) {
    statsContent.innerHTML += `
      <br><h3 style='margin-top:18px;color:#ffe066;'>Performance Metrics</h3>
      <b>FPS:</b> ${currentFPS}<br>
      <b>Average Frame Time:</b> ${(window.numberFormat === 'separators' || !window.numberFormat) ? Math.round(averageFrameTime) : averageFrameTime.toFixed(2)}ms<br>
      <b>Game Loop Time:</b> ${(window.numberFormat === 'separators' || !window.numberFormat) ? Math.round(gameLoopTime) : gameLoopTime.toFixed(2)}ms<br>
      <b>Active Particles:</b> ${particleCount}<br>
      ${memoryUsage > 0 ? `<b>Memory Usage:</b> ${memoryUsage}MB<br>` : ''}
      <div style='margin-top:8px;font-size:0.9em;color:#ccc;font-style:italic;'>
        Performance metrics can be toggled in Settings → User Interface
      </div>
    `;
  }
}

statsBtn.addEventListener('click', () => {
  renderStats();
  statsModal.style.display = 'block';
});
closeStats.addEventListener('click', () => {
  statsModal.style.display = 'none';
});
window.addEventListener('click', (e) => {
  if (e.target === statsModal) statsModal.style.display = 'none';
});

function showAchievementPopup(achievement) {
  // Create confetti particles for achievement
  createAchievementParticles();
  
  // Create popup element
  const popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.bottom = '50px';
  popup.style.left = '50%';
  popup.style.transform = 'translateX(-50%)';
  popup.style.background = 'linear-gradient(135deg, #3e0060, #5a189a)';
  popup.style.color = '#ffe066';
  popup.style.padding = '16px 24px';
  popup.style.borderRadius = '12px';
  popup.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
  popup.style.zIndex = '1000';
  popup.style.fontSize = '1.1em';
  popup.style.fontWeight = 'bold';
  popup.style.textAlign = 'center';
  popup.style.minWidth = '300px';
  popup.style.opacity = '0';
  popup.style.transition = 'opacity 0.5s ease-in-out';
  
  popup.innerHTML = `
    <div style="margin-bottom: 8px;">🏆 Achievement Unlocked!</div>
    <div style="font-size: 1.2em; margin-bottom: 8px;">${achievement.name}</div>
    <div style="font-size: 0.9em; font-weight: normal; opacity: 0.9;">${achievement.desc}</div>
  `;
  
  document.body.appendChild(popup);
  
  // Fade in
  setTimeout(() => {
    popup.style.opacity = '1';
  }, 100);
  
  // Fade out and remove after 5 seconds
  setTimeout(() => {
    popup.style.opacity = '0';
    setTimeout(() => {
      if (popup.parentNode) {
        popup.parentNode.removeChild(popup);
      }
    }, 500);
  }, 5000);

  if (!isMuted && kissAudio) {
    kissAudio.currentTime = 0;
    kissAudio.play();
  }
}

function checkAchievements() {
  // First Click
  if (!achievements[0].unlocked && totalClicks > 0) {
    achievements[0].unlocked = true;
    showAchievementPopup(achievements[0]);
  }
  // First 1000
  if (!achievements[1].unlocked && purples >= 1000) {
    achievements[1].unlocked = true;
    showAchievementPopup(achievements[1]);
  }
  // First Million
  if (!achievements[2].unlocked && purples >= 1000000) {
    achievements[2].unlocked = true;
    showAchievementPopup(achievements[2]);
  }
  // World Domination
  if (!achievements[3].unlocked && purples >= 8000000000) {
    achievements[3].unlocked = true;
    showAchievementPopup(achievements[3]);
  }
  // Click Frenzy (100 clicks in 10 seconds)
  if (!achievements[4].unlocked) {
    if (!window._clickTimestamps) window._clickTimestamps = [];
    window._clickTimestamps.push(Date.now());
    window._clickTimestamps = window._clickTimestamps.filter(ts => Date.now() - ts <= 10000);
    if (window._clickTimestamps.length >= 100) {
      achievements[4].unlocked = true;
      showAchievementPopup(achievements[4]);
    }
  }
  // Auto Empire (100 total buildings)
  if (!achievements[5].unlocked && buildings.reduce((a, b) => a + b.tier, 0) >= 100) {
    achievements[5].unlocked = true;
    showAchievementPopup(achievements[5]);
  }
  // Upgrade Collector (10 upgrades owned)
  if (!achievements[6].unlocked && (buildingUpgrades.filter(u => u.owned).length + clickUpgrades.filter(u => u.owned).length) >= 10) {
    achievements[6].unlocked = true;
    showAchievementPopup(achievements[6]);
  }
  // Farm Tycoon (10 Purple Farms)
  if (!achievements[7].unlocked && buildings.find(b => b.id === 'purple_farm')?.tier >= 10) {
    achievements[7].unlocked = true;
    showAchievementPopup(achievements[7]);
  }
  // Factory Owner (5 Purple Factories)
  if (!achievements[8].unlocked && buildings.find(b => b.id === 'purple_factory')?.tier >= 5) {
    achievements[8].unlocked = true;
    showAchievementPopup(achievements[8]);
  }
  // Mining Magnate (3 Purple Mines)
  if (!achievements[9].unlocked && buildings.find(b => b.id === 'purple_mine')?.tier >= 3) {
    achievements[9].unlocked = true;
    showAchievementPopup(achievements[9]);
  }
  // Lab Rat (2 Purple Labs)
  if (!achievements[10].unlocked && buildings.find(b => b.id === 'purple_lab')?.tier >= 2) {
    achievements[10].unlocked = true;
    showAchievementPopup(achievements[10]);
  }
  // Portal Master (1 Purple Portal)
  if (!achievements[11].unlocked && buildings.find(b => b.id === 'purple_portal')?.tier >= 1) {
    achievements[11].unlocked = true;
    showAchievementPopup(achievements[11]);
  }
  // Galactic Overlord (1 Galactic Purpler)
  if (!achievements[12].unlocked && buildings.find(b => b.id === 'galactic_purpler')?.tier >= 1) {
    achievements[12].unlocked = true;
    showAchievementPopup(achievements[12]);
  }
  // Purple Rain (10,000 in a second)
  if (!achievements[13].unlocked) {
    if (!window._lastSecondPurples) window._lastSecondPurples = [];
    window._lastSecondPurples.push({ t: Date.now(), v: purples });
    window._lastSecondPurples = window._lastSecondPurples.filter(e => Date.now() - e.t <= 1000);
    if (window._lastSecondPurples.length > 1) {
      const gain = window._lastSecondPurples[window._lastSecondPurples.length-1].v - window._lastSecondPurples[0].v;
      if (gain >= 10000) {
        achievements[13].unlocked = true;
        showAchievementPopup(achievements[13]);
      }
    }
  }
  // Prestige! (first prestige) - This is handled in prestige button now
  // if (!achievements[15].unlocked && totalPrestigePointsEarned > 0) {
  //   achievements[15].unlocked = true;
  //   showAchievementPopup(achievements[15]);
  // }
  // Idle Idol (1,000,000 Purples while idle for 10 min)
  if (!achievements[16].unlocked) {
    if (!window._lastManualClickTime) window._lastManualClickTime = Date.now();
    if (!window._idlePurples) window._idlePurples = 0;
    if (Date.now() - window._lastManualClickTime > 10 * 60 * 1000) {
      window._idlePurples += getPPS();
      console.log("DEBUG: Idle Idol - Idle purples:", window._idlePurples, "Target: 1000000");
      if (window._idlePurples >= 1000000) {
        achievements[16].unlocked = true;
        console.log("DEBUG: Idle Idol achievement unlocked!");
        showAchievementPopup(achievements[16]);
      }
    } else {
      window._idlePurples = 0;
    }
  }
  // Upgrade Maxed (all tier 10 upgrades owned for at least one building type)
  const allTier10AutoClicker = buildingUpgrades.filter(u => u.buildingType === 'auto_clicker').every(u => u.owned);
  if (!achievements[16].unlocked && allTier10AutoClicker) {
    achievements[16].unlocked = true;
    showAchievementPopup(achievements[16]);
  }
  // Building Boom (buy 10 buildings in 1 second)
  if (!achievements[17].unlocked) {
    if (!window._buildingBuyTimestamps) window._buildingBuyTimestamps = [];
    window._buildingBuyTimestamps = window._buildingBuyTimestamps.filter(ts => Date.now() - ts <= 1000);
    if (window._buildingBuyTimestamps.length >= 10) {
      achievements[17].unlocked = true;
      showAchievementPopup(achievements[17]);
    }
  }
  // Sound of Silence (play muted for 10 min)
  if (!achievements[18].unlocked) {
    if (!window._muteStart) window._muteStart = isMuted ? Date.now() : null;
    if (isMuted) {
      if (!window._muteStart) window._muteStart = Date.now();
      if (Date.now() - window._muteStart > 10 * 60 * 1000) {
        achievements[18].unlocked = true;
        showAchievementPopup(achievements[18]);
      }
    } else {
      window._muteStart = null;
    }
  }
  // Speedrunner (1,000,000 Purples in under 5 min)
  if (!achievements[19].unlocked && purples >= 1000000 && (Date.now() - runStartTime) < 5 * 60 * 1000) {
    achievements[19].unlocked = true;
    showAchievementPopup(achievements[19]);
  }
  // Loyal Clicker (play for 7 days total)
  if (!achievements[20].unlocked) {
    if (!window._totalPlayTime) window._totalPlayTime = 0;
    if (!window._lastPlayTimeCheck) window._lastPlayTimeCheck = Date.now();
    window._totalPlayTime += Date.now() - window._lastPlayTimeCheck;
    window._lastPlayTimeCheck = Date.now();
    if (window._totalPlayTime >= 7 * 24 * 60 * 60 * 1000) {
      achievements[20].unlocked = true;
      showAchievementPopup(achievements[20]);
    }
  }
}

let clickComboCount = 0;
let lastClickTime = 0;
let purpleAvalancheActive = 0;

function getManualClickValue() {
  let baseValue = clickValue; // Start with base click value
  let totalBonus = 0;
  
  // Apply click upgrades bonuses
  const ownedClickUpgrades = clickUpgrades.filter(u => u.owned);
  
  ownedClickUpgrades.forEach(upgrade => {
    switch (upgrade.id) {
      case 'steady_hands':
        const autoClickerPpS = getBuildingEffectivePpS(buildings.find(b => b.id === 'auto_clicker'));
        totalBonus += autoClickerPpS * 0.10;
        break;
      case 'click_focus':
        const farmPpS = getBuildingEffectivePpS(buildings.find(b => b.id === 'purple_farm'));
        totalBonus += farmPpS * 0.05;
        break;
      case 'lucky_strikes':
        const casinoPpS = getBuildingEffectivePpS(buildings.find(b => b.id === 'purple_casino'));
        totalBonus += casinoPpS * 0.02;
        break;
      case 'industrial_strength':
        const factoryPpS = getBuildingEffectivePpS(buildings.find(b => b.id === 'purple_factory'));
        totalBonus += factoryPpS * 0.01;
        break;
      case 'precision_striking':
        const minePpS = getBuildingEffectivePpS(buildings.find(b => b.id === 'purple_mine'));
        totalBonus += minePpS * 0.005;
        break;
      case 'scientific_clicking':
        const labPpS = getBuildingEffectivePpS(buildings.find(b => b.id === 'purple_lab'));
        totalBonus += labPpS * 0.002;
        break;
      case 'dimensional_touch':
        const portalPpS = getBuildingEffectivePpS(buildings.find(b => b.id === 'purple_portal'));
        totalBonus += portalPpS * 0.001;
        break;
      case 'cosmic_power':
        const purplerPpS = getBuildingEffectivePpS(buildings.find(b => b.id === 'galactic_purpler'));
        totalBonus += purplerPpS * 0.0005;
        break;
      case 'click_mastery':
        const totalPpS = getPPS();
        totalBonus += totalPpS * 0.01;
        break;
      case 'ultimate_clicker':
        const clickUpgradeCount = ownedClickUpgrades.length;
        const ultimateTotalPpS = getPPS();
        totalBonus += ultimateTotalPpS * (clickUpgradeCount * 0.001);
        break;
    }
  });
  
  // Apply special manual click upgrade bonuses from building upgrades
  const autoClickerBuilding = buildings.find(b => b.id === 'auto_clicker');
  const hasMultiClickArray = buildingUpgrades.find(u => u.id === 'auto_clicker_multi_click_array' && u.owned);
  if (hasMultiClickArray && autoClickerBuilding && autoClickerBuilding.tier > 0) {
    totalBonus += baseValue * autoClickerBuilding.tier * 0.01;
  }
  
  const casinoBuilding = buildings.find(b => b.id === 'purple_casino');
  const hasInterdimensionalGambling = buildingUpgrades.find(u => u.id === 'purple_casino_interdimensional_gambling' && u.owned);
  if (hasInterdimensionalGambling && casinoBuilding && casinoBuilding.tier > 0) {
    totalBonus += baseValue * casinoBuilding.tier * 0.03;
  }
  
  const portalBuilding = buildings.find(b => b.id === 'purple_portal');
  const hasInfinityGate = buildingUpgrades.find(u => u.id === 'purple_portal_infinity_gate' && u.owned);
  if (hasInfinityGate && portalBuilding && portalBuilding.tier > 0) {
    const portalPpS = getBuildingEffectivePpS(portalBuilding);
    totalBonus += portalPpS * 0.01;
  }
  
  // Apply casino cosmic jackpot: 5% chance to trigger casino bonus
  const hasCosmicJackpot = buildingUpgrades.find(u => u.id === 'purple_casino_cosmic_jackpot' && u.owned);
  if (hasCosmicJackpot && casinoBuilding && Math.random() < 0.05) {
    const casinoPpS = getBuildingEffectivePpS(casinoBuilding);
    totalBonus += casinoPpS;
  }
  
  // Apply mine core extraction: all buildings gain +0.1% click value per Mine owned
  const mineBuilding = buildings.find(b => b.id === 'purple_mine');
  const hasCoreExtraction = buildingUpgrades.find(u => u.id === 'purple_mine_core_extraction' && u.owned);
  if (hasCoreExtraction && mineBuilding && mineBuilding.tier > 0) {
    totalBonus += baseValue * (mineBuilding.tier * 0.001);
  }
  
  return Math.floor(baseValue + totalBonus);
}

let critActive = false;

function showFloatingPlus(x, y, value) {
  if (!window.floatingTextEnabled) return;
  
  const plus = document.createElement('div');
  plus.className = 'floating-plus';
  plus.textContent = `+${formatNumber(value)}`;
  plus.style.left = `${x}px`;
  plus.style.top = `${y}px`;
  document.body.appendChild(plus);
  setTimeout(() => plus.remove(), 1000);
}

// Click cooldown system
const BASE_CLICK_COOLDOWN = 100; // ms
let lastManualClickTime = 0;
function getClickCooldown() {
  const BASE_CLICK_COOLDOWN = 100; // 100ms default
  // Since we removed the old upgrade system, return the base cooldown
  let cooldown = BASE_CLICK_COOLDOWN;
  return Math.max(20, cooldown); // Minimum 20ms
}

clickerImg.addEventListener('click', (e) => {
  let now = Date.now();
  // Click cooldown logic
  const cooldown = getClickCooldown();
  if (now - lastManualClickTime < cooldown) {
    // Optional: Visual feedback for too-fast click
    clickerImg.classList.add('cooldown');
    setTimeout(() => clickerImg.classList.remove('cooldown'), 80);
    return;
  }
  lastManualClickTime = now;
  window._lastManualClickTime = now;
  
  // Track manual clicks for CPS calculation
  manualClickTimestamps.push(now);
  // Remove clicks older than 1 second
  manualClickTimestamps = manualClickTimestamps.filter(timestamp => now - timestamp <= 1000);
  manualClicksLastSecond = manualClickTimestamps.length;
  
  // Basic click logic (old upgrade effects removed)
  lastClickTime = now;

  let value = getManualClickValue();
  purples += value;
  totalPurplesEarned += value;
  totalClicks++;
  if (value > biggestSingleGain) biggestSingleGain = value;
  updateScore();
  sidebarNeedsUpdate = true; // Update sidebar after manual click
  createFallingPurple();
  // Purple Avalanche removed with old upgrade system
  // Create click particles from button center
  const rect = clickerImg.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  createClickParticles(centerX, centerY, value);
  // Floating +X effect
  const clickX = e.clientX;
  const clickY = e.clientY;
  showFloatingPlus(clickX, clickY, value);
  checkAchievements();
  if (!isMuted && window.screamAudioEnabled) {
    const audio = (Math.random() < 0.01) ? screamAudios[1] : screamAudios[0];
    audio.currentTime = 0;
    audio.play();
  }
  saveGame();
  updateSidebarTabPurchasable();
  // Synergy logic removed with old upgrade system
});

// Frame-based purple generation loop
let lastFrameTime = performance.now();
let accumulatedTime = 0;
let lastSecondUpdate = Date.now();
let fractionalPurples = 0; // Track fractional purples

function gameLoop(currentTime) {
  const gameLoopStart = performance.now();
  const deltaTime = (currentTime - lastFrameTime) / 1000; // Convert to seconds
  lastFrameTime = currentTime;
  
  // Performance tracking
  if (performanceMetricsEnabled) {
    frameCount++;
    
    // Update FPS every second
    if (currentTime - lastFPSTime >= 1000) {
      currentFPS = Math.round((frameCount * 1000) / (currentTime - lastFPSTime));
      frameCount = 0;
      lastFPSTime = currentTime;
      
      // Update memory usage if available
      if (performance.memory) {
        memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1048576); // Convert to MB
      }
      
      // Count particles
      particleCount = document.querySelectorAll('.falling-purple, .click-particle, .upgrade-particle, .achievement-particle, .pps-particle').length;
    }
    
    // Track frame times for average calculation
    frameTimes.push(deltaTime * 1000); // Convert to ms
    if (frameTimes.length > maxFrameTimesSamples) {
      frameTimes.shift();
    }
    averageFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
  }
  
  const pps = getPPS();
  if (pps > 0) {
    // Add purples based on frame rate
    const purplesThisFrame = pps * deltaTime;
    fractionalPurples += purplesThisFrame;
    
    // Only add whole purples when we have at least 1
    if (fractionalPurples >= 1) {
      const wholePurples = Math.floor(fractionalPurples);
      purples += wholePurples;
      totalPurplesEarned += wholePurples;
      totalAutoClicks += wholePurples;
      
      // Track building production for statistics
      if (pps > 0) {
        buildings.forEach(building => {
          if (building.tier > 0) {
            const buildingPPS = building.tier * building.pps;
            const buildingPortion = (buildingPPS / pps) * wholePurples;
            building.totalProduced += buildingPortion;
          }
        });
      }
      
      fractionalPurples -= wholePurples; // Keep the remainder
    }
    
    // Update current PPS for falling purple distribution
    currentPPS = pps;
    lastPPSUpdate = Date.now();
    
    // Update score every frame for smooth counter
    updateScore();
  }
  
  // Update tooltips every frame with current data
  updateActiveTooltips();
  
  // Update sidebar and other logic once per second to avoid performance issues
  accumulatedTime += deltaTime;
  if (accumulatedTime >= 1.0) {
    accumulatedTime -= 1.0;
    
    if (pps > 0) {
      if (pps > biggestSingleGain) biggestSingleGain = pps;
      
      // Only render sidebar when something changed that affects it
      if (sidebarNeedsUpdate) {
        renderSidebar();
        sidebarNeedsUpdate = false;
      } else {
        // Just update the purchasable states without full re-render
        updateSidebarTabPurchasable();
      }
      
      // Create PPS particles occasionally
      if (Math.random() < 0.1) { // 10% chance per second
        createPPSParticles();
      }
      checkAchievements();
    }
    
    // Offline time bank logic - apply offline booster upgrade
    const offlineAccumulationRate = getOfflineTimeAccumulationRate();
    offlineTimeBank = Math.min(offlineTimeBank + offlineAccumulationRate, getMaxOfflineTimeBank()); // Max based on Time Capsule upgrade
    saveGame();
  }
  
  // End performance tracking
  if (performanceMetricsEnabled) {
    gameLoopTime = performance.now() - gameLoopStart;
  }
  
  requestAnimationFrame(gameLoop);
}

// Start the game loop
requestAnimationFrame(gameLoop);

// Create falling purples gradually over time
setInterval(() => {
  const now = Date.now();
  
  // Only create falling purples if we have a valid PPS rate
  if (currentPPS > 0 && now - lastPPSUpdate < 2000) { // Allow 2 second grace period
    const timeSinceLastPurple = now - lastFallingPurpleTime;
    
    // Calculate the target interval between falling purples
    // For example, if PPS is 10, we want one purple every 100ms
    const targetInterval = 1000 / Math.min(currentPPS, 300); // Cap at 300 PPS for performance
    
    // Check if enough time has passed to create a new falling purple
    if (timeSinceLastPurple >= targetInterval) {
      createFallingPurple();
      lastFallingPurpleTime = now;
    }
  }
}, 16); // Run at ~60fps for smooth animation

window.addEventListener('beforeunload', saveGame);

// Enhanced page unload handling for better save reliability
window.addEventListener('beforeunload', (event) => {
  // Force a synchronous save to ensure data is written
  saveGame();
  
  // Optional: Show a confirmation dialog (modern browsers may ignore this)
  // event.preventDefault();
  // event.returnValue = '';
});

// Additional event listeners for different unload scenarios
window.addEventListener('unload', () => {
  // Final save attempt as the page is unloading
  saveGame();
});

// Handle page visibility changes (when user switches tabs or minimizes browser)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Save when user switches away from the tab
    saveGame();
  }
});

// Handle page freeze (when browser freezes the page to save resources)
document.addEventListener('freeze', () => {
  saveGame();
});

// Handle page resume (when browser unfreezes the page)
document.addEventListener('resume', () => {
  // Update lastActive when page resumes
  lastActive = Date.now();
});



loadGame();
updateScore();
sidebarNeedsUpdate = true; // Initial render needed
updateSidebarTabPurchasable();

function renderSlotMachineUI() {
  const casinoContent = document.getElementById('casino-content');
  casinoContent.innerHTML = `
    <h3 style="color:#ffe066;text-align:center;">Slot Machine</h3>
    <div style="text-align:center;margin-bottom:10px;">
      <label for="slot-bet">Bet (Purples): </label>
      <input id="slot-bet" type="number" min="1" value="10" style="width:80px;text-align:center;" />
      <button id="all-in-btn" style="margin-left:5px;background:#ff4444;color:white;border:none;padding:2px 8px;border-radius:4px;cursor:pointer;">All-In</button>
      <button id="slot-spin-btn" style="margin-left:10px;">Spin 🎰</button>
    </div>
    <div id="slot-result" style="font-size:2em;text-align:center;height:2.2em;margin-bottom:10px;"></div>
    <div id="slot-payout-msg" style="text-align:center;color:#ffe066;font-weight:bold;height:1.5em;"></div>
    <div style="margin-top:18px;">
      <h4 style="color:#a259ff;text-align:center;">Payout Table</h4>
      <table style="margin:auto;color:#fff;background:#2d0036;border-radius:8px;overflow:hidden;">
        <tr><th>Symbols</th><th>Payout (x bet)</th></tr>
        <tr><td>💜💜💜</td><td>100x</td></tr>
        <tr><td>👑👑👑</td><td>50x</td></tr>
        <tr><td>💎💎💎</td><td>25x</td></tr>
        <tr><td>🔔🔔🔔</td><td>10x</td></tr>
        <tr><td>🍋🍋🍋</td><td>5x</td></tr>
        <tr><td>🍒🍒🍒</td><td>3x</td></tr>
        <tr><td>🍇🍇🍇</td><td>2x</td></tr>
        <tr><td>Any two 💜</td><td>10x</td></tr>
        <tr><td>Any two 👑</td><td>5x</td></tr>
        <tr><td>Any two 💎</td><td>3x</td></tr>
        <tr><td>Any two of a kind</td><td>2x</td></tr>
      </table>
    </div>
  `;
  document.getElementById('slot-spin-btn').onclick = spinSlotMachine;
  document.getElementById('all-in-btn').onclick = () => {
    const betInput = document.getElementById('slot-bet');
    betInput.value = purples;
  };
}

function spinSlotMachine() {
  const betInput = document.getElementById('slot-bet');
  const bet = Math.max(1, parseInt(betInput.value) || 1);
  const spinBtn = document.getElementById('slot-spin-btn');
  const resultEl = document.getElementById('slot-result');
  const payoutMsgEl = document.getElementById('slot-payout-msg');
  // Clear payout message at the very start of a new spin
  payoutMsgEl.textContent = '';
  if (purples < bet) {
    payoutMsgEl.textContent = 'Not enough Purples!';
    return;
  }
  purples -= bet;
  updateScore();
  spinBtn.disabled = true;
  // Do NOT clear resultEl.textContent here, so the previous result stays until the new animation starts

  // Animation: cycle symbols for 1 second using requestAnimationFrame
  const animationDuration = 1000; // ms
  const symbolChangeInterval = 60; // ms per frame
  let startTime = null;
  let lastSymbolChange = 0;
  let finalSpin;

  function animateSpin(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    if (elapsed - lastSymbolChange >= symbolChangeInterval) {
      const fakeSpin = [0, 0, 0].map(() => slotSymbols[Math.floor(Math.random() * slotSymbols.length)]);
      resultEl.textContent = fakeSpin.map(s => s.symbol).join(' ');
      lastSymbolChange = elapsed;
    }
    if (elapsed < animationDuration) {
      requestAnimationFrame(animateSpin);
    } else {
      // Actual spin result
      finalSpin = [0, 0, 0].map(() => slotSymbols[Math.floor(Math.random() * slotSymbols.length)]);
      resultEl.textContent = finalSpin.map(s => s.symbol).join(' ');
      // Determine payout
      let payout = 0;
      if (finalSpin[0].symbol === finalSpin[1].symbol && finalSpin[1].symbol === finalSpin[2].symbol) {
        payout = bet * finalSpin[0].payout;
      } else if (finalSpin.filter(s => s.symbol === '💜').length === 2) {
        payout = bet * 10;
      } else if (finalSpin.filter(s => s.symbol === '👑').length === 2) {
        payout = bet * 5;
      } else if (finalSpin.filter(s => s.symbol === '💎').length === 2) {
        payout = bet * 3;
      } else if (finalSpin[0].symbol === finalSpin[1].symbol || finalSpin[1].symbol === finalSpin[2].symbol || finalSpin[0].symbol === finalSpin[2].symbol) {
        payout = bet * 2;
      }
      if (payout > 0) {
        purples += payout;
        totalPurplesEarned += payout;
        payoutMsgEl.textContent = `You won ${formatNumber(payout)} Purples!`;
        // Win animation: bounce and highlight
        resultEl.style.transition = 'transform 0.18s cubic-bezier(.5,1.8,.5,1), box-shadow 0.18s';
        resultEl.style.transform = 'scale(1.25)';
        resultEl.style.boxShadow = '0 0 18px 4px #ffe066cc';
        setTimeout(() => {
          resultEl.style.transform = '';
          resultEl.style.boxShadow = '';
        }, 180);
        // Create purple rain effect based on winnings
        createPurpleRain(payout);
      } else {
        payoutMsgEl.textContent = 'No win. Try again!';
      }
      updateScore();
      saveGame();
      // Wait 0.5s before enabling spin again, but do NOT clear the result or payout message
      setTimeout(() => {
        spinBtn.disabled = false;
      }, 500);
    }
  }
  requestAnimationFrame(animateSpin);
}



// --- Purple Rain Effect for Slot Machine Wins ---
function createPurpleRain(payout) {
  // Scale the number of falling purples with the payout
  // Base: 5 purples for small wins, up to 50 for big wins
  const baseCount = Math.min(50, Math.max(5, Math.floor(payout / 10)));
  const count = Math.min(100, baseCount); // Cap at 100 for performance
  
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const img = document.createElement('img');
      img.src = 'images/gold_purple.png';
      img.style.position = 'fixed';
      img.style.width = '96px';
      img.style.height = '96px';
      img.style.zIndex = '999';
      img.style.pointerEvents = 'none';
      img.style.transition = 'none';
      
      // Random starting position across the top of the screen
      const startX = Math.random() * window.innerWidth;
      const startY = -96;
      
      img.style.left = startX + 'px';
      img.style.top = startY + 'px';
      
      document.body.appendChild(img);
      
      // Physics variables
      let x = startX;
      let y = startY;
      let vx = (Math.random() - 0.5) * 8; // Increased horizontal velocity
      let vy = Math.random() * 4 + 3; // Increased initial downward velocity
      const gravity = 0.4; // Slightly increased gravity
      const bounce = 0.7; // Increased bounce force
      const friction = 0.98; // Reduced friction for more bouncy movement
      
      // Rotation variables
      let rotation = Math.random() * 360;
      let rotationSpeed = (Math.random() - 0.5) * 800; // Increased rotation speed
      
      let startTime = null;
      let lastTimestamp = null;
      
      function animatePurple(timestamp) {
        if (!startTime) startTime = timestamp;
        if (!lastTimestamp) lastTimestamp = timestamp;
        const deltaTime = (timestamp - lastTimestamp) / 1000;
        lastTimestamp = timestamp;
        
        vy += gravity;
        x += vx;
        y += vy;
        rotation += rotationSpeed * deltaTime;
        
        // Bounce off floor
        if (y + 96 > window.innerHeight) {
          y = window.innerHeight - 96;
          vy *= -bounce;
          vx *= friction;
          if (Math.abs(vy) < 1) vy = 0;
          rotationSpeed *= 0.8; // Reduced rotation damping
        }
        
        // Bounce off walls
        if (x < 0) {
          x = 0;
          vx *= -bounce;
        } else if (x + 96 > window.innerWidth) {
          x = window.innerWidth - 96;
          vx *= -bounce;
        }
        
        img.style.transform = `translate(${x - startX}px, ${y - startY}px) rotate(${rotation}deg)`;
        
        // Remove after 8 seconds or if off screen
        const elapsed = (timestamp - startTime) / 1000;
        if (elapsed > 8 || y > window.innerHeight + 100) {
          if (img.parentNode) {
            img.parentNode.removeChild(img);
          }
        } else {
          requestAnimationFrame(animatePurple);
        }
      }
      
      requestAnimationFrame(animatePurple);
    }, i * 50); // Stagger the creation by 50ms for a more natural rain effect
  }
}

// Casino close functionality
closeCasino.addEventListener('click', () => {
  casinoModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === casinoModal) casinoModal.style.display = 'none';
});

function showOfflineGainsPopup(timeUsed, timeRemaining, purplesEarned, ppsUsed) {
  // Create popup element
  const popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.background = 'linear-gradient(135deg, #3e0060, #5a189a)';
  popup.style.color = '#ffe066';
  popup.style.padding = '24px 32px';
  popup.style.borderRadius = '16px';
  popup.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
  popup.style.zIndex = '1001';
  popup.style.fontSize = '1.1em';
  popup.style.fontWeight = 'bold';
  popup.style.textAlign = 'center';
  popup.style.minWidth = '400px';
  popup.style.maxWidth = '500px';
  popup.style.opacity = '0';
  popup.style.transition = 'opacity 0.5s ease-in-out';
  popup.style.border = '2px solid #ffe066';
  
  // Format time values
  const formatTimeDisplay = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };
  
  popup.innerHTML = `
    <div style="margin-bottom: 16px; font-size: 1.3em;">⏰ Offline Gains</div>
    <div style="margin-bottom: 12px; font-size: 1.1em; color: #c77dff;">Welcome back!</div>
    <div style="text-align: left; font-weight: normal; line-height: 1.4;">
      <div style="margin-bottom: 8px;"><b>Time Used:</b> ${formatTimeDisplay(timeUsed)}</div>
      <div style="margin-bottom: 8px;"><b>Time Remaining:</b> ${formatTimeDisplay(timeRemaining)}</div>
      <div style="margin-bottom: 8px;"><b>Purples Earned:</b> ${formatNumber(purplesEarned)}</div>
      <div style="margin-bottom: 16px;"><b>PPS Used:</b> ${formatNumber(ppsUsed)}/sec</div>
    </div>
    <button id="offline-popup-close" style="background: #ffe066; color: #3e0060; border: none; padding: 8px 16px; border-radius: 8px; font-weight: bold; cursor: pointer;">OK</button>
  `;
  
  document.body.appendChild(popup);
  
  // Fade in
  setTimeout(() => {
    popup.style.opacity = '1';
  }, 100);
  
  // Add close button functionality
  document.getElementById('offline-popup-close').addEventListener('click', () => {
    popup.style.opacity = '0';
    setTimeout(() => {
      if (popup.parentNode) {
        popup.parentNode.removeChild(popup);
      }
    }, 500);
  });
  
  // Auto-close after 8 seconds
  setTimeout(() => {
    if (popup.parentNode) {
      popup.style.opacity = '0';
      setTimeout(() => {
        if (popup.parentNode) {
          popup.parentNode.removeChild(popup);
        }
      }, 500);
    }
  }, 8000);
}

// --- Prestige & Tech Tree Buttons ---

function showPrestigeButton() {
  let btn = document.getElementById('prestige-btn');

  const placeButton = () => {
    const rect = scoreEl.getBoundingClientRect();
    btn.style.position = 'fixed';
    btn.style.left = rect.left + 'px';
    btn.style.top = (rect.bottom + 8) + 'px'; // 8px gap below score
    btn.style.width = rect.width + 'px';
  };

  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'prestige-btn';
    btn.style.background = '#ffe066';
    btn.style.color = '#3e0060';
    btn.style.fontWeight = 'bold';
    btn.style.fontSize = '1.1em';
    btn.style.padding = '10px 16px';
    btn.style.border = 'none';
    btn.style.borderRadius = '10px';
    btn.style.boxShadow = '0 2px 8px #0005';
    btn.style.zIndex = '150';
    document.body.appendChild(btn);
    window.addEventListener('resize', placeButton);

    btn.onclick = () => {
      if (confirm('Are you sure you want to prestige? This will reset all progress except Prestige Points and unlocked techs!')) {
        // Calculate how many milestones have been passed
        let milestonesPassed = 0;
        let milestone = 100000 * Math.pow(3, totalPrestigePointsEarned);
        let tempPurples = purples;
        while (tempPurples >= milestone) {
          milestonesPassed++;
          milestone = 100000 * Math.pow(3, totalPrestigePointsEarned + milestonesPassed);
        }
        // ALWAYS unlock Prestige! achievement on first prestige, regardless of points earned
        if (!achievements[15].unlocked) {
          achievements[15].unlocked = true;
          console.log("DEBUG: Prestige achievement unlocked!");
          showAchievementPopup(achievements[15]);
          // Save immediately to ensure achievement persists through reload
          saveGame();
        }
        
        if (milestonesPassed > 0) {
          totalPrestigePointsEarned += milestonesPassed;
          prestigePoints += milestonesPassed;
        }

        // Update milestone for next prestige
        prestigeMilestone = 100000 * Math.pow(3, totalPrestigePointsEarned);

        // Reset most game progress
        purples = 0;
        clickValue = 1;
        totalPurplesEarned = 0;
        totalClicks = 0;
        totalAutoClicks = 0;
        biggestSingleGain = 0;
        runStartTime = Date.now();
        synergyClicks = 0;
        synergyBonus = 0;
        manualUpgrades.forEach(u => { u.tier = 0; u.cost = u.baseCost; });
        buildings.forEach(b => { b.tier = 0; b.cost = b.baseCost; b.totalProduced = 0; });
        // Tech tree levels remain but effects are applied elsewhere; save & refresh
        saveGame();
        location.reload();
      }
    };
  }

  placeButton();

  // Update button label with dynamic info
  let pointsEarned = 0;
  let milestone = 100000 * Math.pow(3, totalPrestigePointsEarned);
  let tempPurples = purples;
  while (tempPurples >= milestone) {
    pointsEarned++;
    milestone = 100000 * Math.pow(3, totalPrestigePointsEarned + pointsEarned);
  }
  btn.textContent = `Prestige! (+${pointsEarned} PP, Next at ${formatNumber(milestone)} Purples)`;
  btn.style.display = 'block';
}

function hidePrestigeButton() {
  const btn = document.getElementById('prestige-btn');
  if (btn) btn.style.display = 'none';
}

function checkPrestigeAvailability() {
  if (purples >= prestigeMilestone) {
    showPrestigeButton();
  } else {
    hidePrestigeButton();
  }
}

function showTechTreeButton() {
  let btn = document.getElementById('tech-tree-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'tech-tree-btn';
    btn.title = 'Prestige Tech Tree';
    btn.textContent = '🌳';
    btn.style.fontSize = '1.6em';
    btn.style.position = 'fixed';
    btn.style.top = '20px';
    btn.style.zIndex = '160';
    btn.onclick = () => {
      document.getElementById('tech-tree-modal').style.display = 'block';
      setTimeout(renderTechTree, 0);
    };
    document.body.appendChild(btn);
  }
  
  // Position dynamically with 8px gap from stats button
  const statsBtn = document.getElementById('stats-btn');
  if (statsBtn) {
    const statsRect = statsBtn.getBoundingClientRect();
    const statsRightPosition = window.innerWidth - statsRect.right;
    const statsWidth = statsRect.width;
    const techTreeRight = statsRightPosition + statsWidth + 8; // 8px gap
    btn.style.right = techTreeRight + 'px';
  } else {
    // Fallback if stats button not found
    btn.style.right = '120px';
  }
  
  btn.classList.add('visible');
  
  // Add resize listener to update position
  if (!window._techTreePositionListener) {
    window.addEventListener('resize', () => {
      if (btn && btn.classList.contains('visible')) {
        const statsBtn = document.getElementById('stats-btn');
        if (statsBtn) {
          const statsRect = statsBtn.getBoundingClientRect();
          const statsRightPosition = window.innerWidth - statsRect.right;
          const statsWidth = statsRect.width;
          const techTreeRight = statsRightPosition + statsWidth + 8;
          btn.style.right = techTreeRight + 'px';
        }
      }
    });
    window._techTreePositionListener = true;
  }
}

function hideTechTreeButton() {
  const btn = document.getElementById('tech-tree-btn');
  if (btn) btn.classList.remove('visible');
}

// Always show if player has any prestige points (earned or current)
function checkTechTreeAvailability() {
  if (prestigePoints > 0 || totalPrestigePointsEarned > 0) {
    showTechTreeButton();
  } else {
    hideTechTreeButton();
  }
}

// Helper: does player own a Purple Casino building?
function ownsPurpleCasino() {
  const casino = buildings.find(b => b.id === 'purple_casino');
  return casino && casino.tier > 0;
}

// Enable/disable casino button based on ownership
function checkCasinoUnlock() {
  if (ownsPurpleCasino()) {
    showCasinoBtn.disabled = false;
    showCasinoBtn.classList.remove('disabled');
    if (!window._casinoUnlocked) {
      window._casinoUnlocked = true;
    }
  } else {
    showCasinoBtn.disabled = true;
    showCasinoBtn.classList.add('disabled');
  }
}

// --- Particle Helper Functions (restored) ---

function createClickParticles(x, y, value) {
  if (!window.particleEffectsEnabled) return;

  const particleCount = Math.max(12, Math.min(Math.floor(value / 10), 24));
  const colors = ['#ffe066', '#c77dff', '#9d4edd', '#7b2cbf'];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '8px';
    particle.style.height = '8px';
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '999';
    particle.style.transition = 'none';

    document.body.appendChild(particle);

    // Physics
    const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.2;
    const distance = 120 + Math.random() * 60;
    const endX = x + Math.cos(angle) * distance;
    const endY = y + Math.sin(angle) * distance;

    const startTime = performance.now();
    const duration = 0.6; // seconds

    function animateParticle() {
      const currentTime = performance.now();
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentX = x + (endX - x) * easeOut;
      const currentY = y + (endY - y) * easeOut;
      const currentScale = 1 - 0.5 * progress;
      const currentOpacity = 1 - progress;

      particle.style.transform = `translate(${currentX - x}px, ${currentY - y}px) scale(${currentScale})`;
      particle.style.opacity = currentOpacity;

      if (progress < 1) {
        requestAnimationFrame(animateParticle);
      } else {
        particle.remove();
      }
    }

    requestAnimationFrame(animateParticle);
  }
}

function createUpgradeParticles(element) {
  if (!window.particleEffectsEnabled) return;

  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 12; i++) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.left = centerX + 'px';
    sparkle.style.top = centerY + 'px';
    sparkle.style.width = '3px';
    sparkle.style.height = '3px';
    sparkle.style.background = '#ffe066';
    sparkle.style.borderRadius = '50%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '999';
    sparkle.style.transition = 'none';

    document.body.appendChild(sparkle);

    const angle = (Math.PI * 2 * i) / 12;
    const distance = 40;
    const endX = centerX + Math.cos(angle) * distance;
    const endY = centerY + Math.sin(angle) * distance;

    const startTime = performance.now();
    const duration = 0.6;

    function animateSparkle() {
      const currentTime = performance.now();
      const progress = Math.min((currentTime - startTime) / 1000 / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 2);
      const currentX = centerX + (endX - centerX) * easeOut;
      const currentY = centerY + (endY - centerY) * easeOut;
      const currentOpacity = 1 - progress;

      sparkle.style.transform = `translate(${currentX - centerX}px, ${currentY - centerY}px)`;
      sparkle.style.opacity = currentOpacity;

      if (progress < 1) {
        requestAnimationFrame(animateSparkle);
      } else {
        sparkle.remove();
      }
    }

    requestAnimationFrame(animateSparkle);
  }
}

function createAchievementParticles() {
  if (!window.particleEffectsEnabled) return;

  // Delay so popup visible first
  setTimeout(() => {
    const colors = ['#ffe066', '#c77dff', '#9d4edd', '#7b2cbf', '#5a189a', '#3c096c'];
    const screenCenterX = window.innerWidth / 2;
    const popupBottomY = window.innerHeight - 50;
    const popupWidth = 300;
    const popupHeight = 120;
    const popupLeftX = screenCenterX - popupWidth / 2;
    const popupRightX = screenCenterX + popupWidth / 2;
    const popupTopY = popupBottomY - popupHeight;

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.width = '8px';
      confetti.style.height = '8px';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.pointerEvents = 'none';
      confetti.style.zIndex = '999';
      confetti.style.transition = 'none';

      const side = Math.random() < 0.5 ? 'left' : 'right';
      let startX, startY;
      if (side === 'left') {
        startX = popupLeftX + Math.random() * 20;
        startY = popupTopY + Math.random() * popupHeight;
      } else {
        startX = popupRightX - Math.random() * 20;
        startY = popupTopY + Math.random() * popupHeight;
      }
      confetti.style.left = startX + 'px';
      confetti.style.top = startY + 'px';
      document.body.appendChild(confetti);

      const angle = 30 * (Math.PI / 180);
      const speed = (100 + Math.random() * 100) * 2;
      const direction = side === 'left' ? -1 : 1;
      let vx = Math.cos(angle) * speed * direction;
      let vy = -Math.sin(angle) * speed;
      const gravity = 50;
      let lastTime = performance.now();

      let currentX = 0;
      let currentY = 0;
      
      function animateConfetti() {
        const now = performance.now();
        const dt = (now - lastTime) / 1000;
        lastTime = now;
        vy += gravity * dt;
        currentX += vx * dt;
        currentY += vy * dt;
        confetti.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${now * 0.4}deg)`;
        const absoluteX = startX + currentX;
        const absoluteY = startY + currentY;
        if (absoluteY < window.innerHeight + 50 && absoluteX > -50 && absoluteX < window.innerWidth + 50) {
          requestAnimationFrame(animateConfetti);
        } else {
          confetti.remove();
        }
      }

      requestAnimationFrame(animateConfetti);
    }
  }, 500);
}

function createPPSParticles() {
  if (!window.particleEffectsEnabled) return;

  const particle = document.createElement('div');
  particle.style.position = 'fixed';
  particle.style.left = Math.random() * window.innerWidth + 'px';
  particle.style.top = window.innerHeight + 'px';
  particle.style.width = '2px';
  particle.style.height = '2px';
  particle.style.background = '#c77dff';
  particle.style.borderRadius = '50%';
  particle.style.pointerEvents = 'none';
  particle.style.zIndex = '998';
  particle.style.transition = 'none';

  document.body.appendChild(particle);

  const startTime = performance.now();
  const duration = 2;
  const startY = window.innerHeight;
  const endY = -10;

  function animate() {
    const now = performance.now();
    const progress = Math.min((now - startTime) / 1000 / duration, 1);
    const currentY = startY + (endY - startY) * progress;
    const currentOpacity = 1 - progress;
    particle.style.transform = `translateY(${currentY - startY}px)`;
    particle.style.opacity = currentOpacity;
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      particle.remove();
    }
  }

  requestAnimationFrame(animate);
}

// New upgrade system functions
function getAvailableUpgrades() {
  const availableUpgrades = [];
  
  // Get building upgrades for owned buildings
  buildings.forEach(building => {
    if (building.tier > 0) { // Only if we own this building type
      const buildingUpgradesForType = buildingUpgrades.filter(u => u.buildingType === building.id);
      
      // Find the current tier for this building type
      const ownedUpgrades = buildingUpgradesForType.filter(u => u.owned);
      const currentMaxTier = ownedUpgrades.length > 0 ? Math.max(...ownedUpgrades.map(u => u.tier)) : 0;
      const nextTier = currentMaxTier + 1;
      
      // Add the next tier upgrade if it exists and isn't owned
      const nextUpgrade = buildingUpgradesForType.find(u => u.tier === nextTier && !u.owned);
      if (nextUpgrade) {
        availableUpgrades.push(nextUpgrade);
      }
    }
  });
  
  // Get click upgrades
  const ownedClickUpgrades = clickUpgrades.filter(u => u.owned);
  const currentMaxClickTier = ownedClickUpgrades.length > 0 ? Math.max(...ownedClickUpgrades.map(u => u.tier)) : 0;
  const nextClickTier = currentMaxClickTier + 1;
  const nextClickUpgrade = clickUpgrades.find(u => u.tier === nextClickTier && !u.owned);
  if (nextClickUpgrade) {
    availableUpgrades.push(nextClickUpgrade);
  }
  
  // Sort by cost (cheapest first)
  return availableUpgrades.sort((a, b) => a.cost - b.cost);
}

function purchaseUpgrade(upgradeId) {
  let upgrade = buildingUpgrades.find(u => u.id === upgradeId);
  if (!upgrade) {
    upgrade = clickUpgrades.find(u => u.id === upgradeId);
  }
  
  if (!upgrade || upgrade.owned) return false;
  
  // Apply lab cost reduction
  const labBuilding = buildings.find(b => b.id === 'purple_lab');
  const labCount = labBuilding ? labBuilding.tier : 0;
  const costReduction = Math.min(0.5, labCount * 0.05); // Max 50% reduction, 5% per lab
  const actualCost = Math.floor(upgrade.cost * (1 - costReduction));
  
  if (purples >= actualCost) {
    purples -= actualCost;
    upgrade.owned = true;
    
    // Apply upgrade effects immediately for some upgrades
    applyUpgradeEffects();
    
    // Update display
    updateScore();
    renderMainSidebar();
    
    // Create particles effect
    const upgradeBtn = document.querySelector(`[data-upgrade="${upgradeId}"]`);
    if (upgradeBtn) {
      createUpgradeParticles(upgradeBtn);
    }
    
    return true;
  }
  
  return false;
}

function applyUpgradeEffects() {
  // This function is called to apply upgrade effects that need recalculation
  // Most effects are applied in getBuildingEffectivePpS and getManualClickValue
}

function getBuildingEffectivePpS(building) {
  if (building.tier === 0) return 0;
  
  let basePpS = building.pps * building.tier;
  let multiplier = 1;
  let additionalPpS = 0;
  
  // Apply building-specific upgrades
  const buildingUpgradesForType = buildingUpgrades.filter(u => u.buildingType === building.id && u.owned);
  
  buildingUpgradesForType.forEach(upgrade => {
    switch (upgrade.id) {
      // Auto Clicker upgrades
      case 'auto_clicker_faster_clicks':
      case 'auto_clicker_click_precision':
      case 'auto_clicker_quantum_clicking':
      case 'auto_clicker_multi_click_array':
        multiplier *= 2;
        break;
      case 'auto_clicker_ultimate_clicker':
        multiplier *= 4;
        break;
      case 'auto_clicker_exponential_clicking':
        const autoClickerUpgradeCount = buildingUpgradesForType.length;
        multiplier *= (1 + autoClickerUpgradeCount * 0.5);
        break;
      
      // Purple Farm upgrades
      case 'purple_farm_fertile_soil':
      case 'purple_farm_advanced_irrigation':
      case 'purple_farm_genetic_engineering':
      case 'purple_farm_bio_enhancement':
        multiplier *= 2;
        break;
      case 'purple_farm_infinite_harvest':
        multiplier *= 4;
        break;
      case 'purple_farm_cosmic_farming':
        const farmUpgradeCount = buildingUpgradesForType.length;
        multiplier *= (1 + farmUpgradeCount * 1.0);
        break;
      
      // Purple Casino upgrades
      case 'purple_casino_lucky_machines':
      case 'purple_casino_vip_tables':
      case 'purple_casino_rigged_games':
      case 'purple_casino_purple_lottery':
        multiplier *= 2;
        break;
      case 'purple_casino_cosmic_jackpot':
        multiplier *= 3;
        break;
      case 'purple_casino_probability_manipulation':
        const casinoUpgradeCount = buildingUpgradesForType.length;
        multiplier *= (1 + casinoUpgradeCount * 0.75);
        break;
      
      // Purple Factory upgrades
      case 'purple_factory_assembly_lines':
      case 'purple_factory_automation':
      case 'purple_factory_mass_production':
      case 'purple_factory_research_division':
        multiplier *= 2;
        break;
      case 'purple_factory_universal_production':
        multiplier *= 3;
        break;
      case 'purple_factory_industrial_empire':
        const factoryUpgradeCount = buildingUpgradesForType.length;
        multiplier *= (1 + factoryUpgradeCount * 0.6);
        break;
      
      // Purple Mine upgrades
      case 'purple_mine_deeper_shafts':
      case 'purple_mine_industrial_equipment':
      case 'purple_mine_quantum_drilling':
      case 'purple_mine_research_collaboration':
        multiplier *= 2;
        break;
      case 'purple_mine_core_extraction':
        multiplier *= 3;
        break;
      case 'purple_mine_geological_mastery':
        const mineUpgradeCount = buildingUpgradesForType.length;
        multiplier *= (1 + mineUpgradeCount * 0.5);
        break;
      
      // Purple Lab upgrades
      case 'purple_lab_advanced_research':
      case 'purple_lab_prototype_development':
      case 'purple_lab_scientific_breakthrough':
      case 'purple_lab_quantum_experiments':
        multiplier *= 2;
        break;
      case 'purple_lab_universal_knowledge':
        multiplier *= 3;
        break;
      case 'purple_lab_scientific_revolution':
        const labUpgradeCount = buildingUpgradesForType.length;
        multiplier *= (1 + labUpgradeCount * 0.4);
        break;
      
      // Purple Portal upgrades
      case 'purple_portal_dimensional_stability':
      case 'purple_portal_portal_expansion':
      case 'purple_portal_multiverse_access':
      case 'purple_portal_reality_manipulation':
        multiplier *= 2;
        break;
      case 'purple_portal_infinity_gate':
        multiplier *= 3;
        break;
      case 'purple_portal_dimensional_mastery':
        const portalUpgradeCount = buildingUpgradesForType.length;
        multiplier *= (1 + portalUpgradeCount * 0.3);
        break;
      
      // Galactic Purpler upgrades
      case 'galactic_purpler_rocket_boost':
      case 'galactic_purpler_stellar_navigation':
      case 'galactic_purpler_cosmic_enhancement':
      case 'galactic_purpler_galactic_empire':
        multiplier *= 2;
        break;
      case 'galactic_purpler_omnipotence':
        multiplier *= 4;
        break;
      case 'galactic_purpler_cosmic_transcendence':
        const purplerUpgradeCount = buildingUpgradesForType.length;
        multiplier *= (1 + purplerUpgradeCount * 0.25);
        break;
    }
  });
  
  // Apply synergy bonuses
  buildingUpgradesForType.forEach(upgrade => {
    switch (upgrade.id) {
      case 'auto_clicker_farm_synergy':
        const farmCount = buildings.find(b => b.id === 'purple_farm')?.tier || 0;
        additionalPpS += basePpS * multiplier * (farmCount * 0.01);
        break;
      case 'auto_clicker_casino_connection':
        const casinoCount = buildings.find(b => b.id === 'purple_casino')?.tier || 0;
        additionalPpS += basePpS * multiplier * (casinoCount * 0.005);
        break;
      case 'auto_clicker_factory_network':
        const factoryCount = buildings.find(b => b.id === 'purple_factory')?.tier || 0;
        additionalPpS += basePpS * multiplier * (factoryCount * 0.002);
        break;
      case 'auto_clicker_global_automation':
        const totalBuildingCount = buildings.reduce((sum, b) => sum + b.tier, 0);
        additionalPpS += basePpS * multiplier * (totalBuildingCount * 0.001);
        break;
      
      // Add similar synergy calculations for other building types...
      // (Following the same pattern for farms, casinos, factories, etc.)
    }
  });
  
  // Apply cross-building bonuses
  applyGlobalBuildingBonuses(building, basePpS, multiplier);
  
  return (basePpS * multiplier) + additionalPpS;
}

function applyGlobalBuildingBonuses(building, basePpS, multiplier) {
  // Apply bonuses from other building types
  let bonus = 0;
  
  // Lab quantum experiments: Labs boost all other buildings' PpS by 0.5% per Lab owned
  const labBuilding = buildings.find(b => b.id === 'purple_lab');
  const hasQuantumExperiments = buildingUpgrades.find(u => u.id === 'purple_lab_quantum_experiments' && u.owned);
  if (hasQuantumExperiments && labBuilding && building.id !== 'purple_lab') {
    bonus += basePpS * multiplier * (labBuilding.tier * 0.005);
  }
  
  // Portal reality manipulation: Portals boost all buildings' PpS by 0.2% per Portal owned
  const portalBuilding = buildings.find(b => b.id === 'purple_portal');
  const hasRealityManipulation = buildingUpgrades.find(u => u.id === 'purple_portal_reality_manipulation' && u.owned);
  if (hasRealityManipulation && portalBuilding) {
    bonus += basePpS * multiplier * (portalBuilding.tier * 0.002);
  }
  
  // Galactic Purpler galactic empire: Purpler boost all buildings' PpS by 0.1% per Purpler owned
  const purplerBuilding = buildings.find(b => b.id === 'galactic_purpler');
  const hasGalacticEmpire = buildingUpgrades.find(u => u.id === 'galactic_purpler_galactic_empire' && u.owned);
  if (hasGalacticEmpire && purplerBuilding) {
    bonus += basePpS * multiplier * (purplerBuilding.tier * 0.001);
  }
  
  return bonus;
}

function generateNewUpgradeTooltip(upgrade) {
  const isClickUpgrade = clickUpgrades.includes(upgrade);
  const buildingName = isClickUpgrade ? 'Manual Clicks' : 
    buildings.find(b => b.id === upgrade.buildingType)?.name || 'Unknown';
  
  // Apply lab cost reduction
  const labBuilding = buildings.find(b => b.id === 'purple_lab');
  const labCount = labBuilding ? labBuilding.tier : 0;
  const costReduction = Math.min(0.5, labCount * 0.05);
  const actualCost = Math.floor(upgrade.cost * (1 - costReduction));
  const discountText = costReduction > 0 ? ` (${Math.round(costReduction * 100)}% off!)` : '';
  
  return `
    <div class="tooltip-title">${upgrade.icon} ${upgrade.name}</div>
    <div class="tooltip-description">${upgrade.description}</div>
    <div class="tooltip-cost">Cost: ${formatNumber(actualCost)} Purples${discountText}</div>
    <div class="tooltip-stats">Building: ${buildingName} | Tier ${upgrade.tier}</div>
  `;
}

