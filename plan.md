# Purple Clicker: Project Plan

## Core Features
- [x] **Clickable Main Button:** Player clicks to earn "Purples".
- [x] **Score Display:** Shows current number of Purples.
- [x] **Upgrades:** Spend Purples to buy upgrades that increase click value or automate production.
- [x] **Automation:** Items that generate Purples per second (auto-clickers, factories, etc).
- [x] **Save/Load:** Game state persists between sessions (localStorage).
- [x] **Responsive UI:** Works on desktop and mobile.

## Upgrade Ideas (with scaling)
- [x] **Auto Clicker**: +1 Purple/sec, base cost: 50, cost ×1.5 per tier
- [x] **Purple Farm**: +10 Purples/sec, base cost: 1,000, cost ×1.6 per tier
- [x] **Purple Factory**: +100 Purples/sec, base cost: 20,000, cost ×1.7 per tier
- [x] **Purple Mine**: +1,000 Purples/sec, base cost: 500,000, cost ×1.8 per tier
- [x] **Purple Lab**: +10,000 Purples/sec, base cost: 10,000,000, cost ×2.0 per tier
- [x] **Purple Portal**: +100,000 Purples/sec, base cost: 250,000,000, cost ×2.2 per tier
- [x] **Galactic Purpler**: +1,000,000 Purples/sec, base cost: 5,000,000,000, cost ×2.5 per tier

## Manual Click Upgrade Suggestions
- [x] **Stronger Clicks** (multi-tier): +1 Purple per click per tier (existing)
- [x] **Double Tap** (single-buy): Doubles your current click value.
- [x] **Purple Surge** (multi-tier): +5% click value per tier, up to 10 tiers.
- [x] **Critical Clicks** (single-buy): 5% chance for clicks to be worth 10x.
- [ ] **Clickstorm** (multi-tier): +2 clicks per second for 10 seconds after every 50 clicks (up to 5 tiers, increases duration).
- [ ] **Golden Touch** (single-buy): Every 100th click gives 100x Purples.
- [ ] **Efficient Clicking** (multi-tier): Reduces click cooldown by 10% per tier (up to 5 tiers).
- [x] **Purple Multiplier** (multi-tier): +10% to all manual click gains per tier (up to 10 tiers).
- [x] **Auto-Click Synergy** (multi-tier, reworked): For every 10 manual clicks, gain +1 auto-click per second (per tier, up to a cap). This bonus is permanent and stacks with other auto-clickers.
- [x] **Click Combo** (multi-tier): Each consecutive click within 1 second increases click value by 1% (up to 20% per tier).
- [ ] **Finger of Fate** (single-buy): Next click is guaranteed to be a critical click.
- [ ] **Click Magnet** (multi-tier): +1% chance per tier for double Purples per click (up to 10 tiers).
- [ ] **Purple Avalanche** (single-buy): For 30 seconds, every click drops 5 extra falling purples.

These upgrades can be mixed between single-purchase and multi-tier, and can be unlocked at different stages of the game for variety and progression.

## Achievements (examples)
- [x] **First Click:** Earn your first Purple.  
  *Boost:* +1% to all future manual click gains.
- [x] **First 1000:** Hit 1,000 Purples for the first time in a run.  
  *Boost:* +1% to all Purples earned.
- [x] **First Million:** Hit 1,000,000 Purples for the first time.  
  *Boost:* +2% to all Purples per second (PPS).
- [x] **World Domination:** Hit 8,000,000,000 Purples.  
  *Boost:* +5% to all production (PPS and manual clicks).
- [x] **Click Frenzy:** Click 100 times in 10 seconds.  
  *Boost:* +10% click speed (or +10% to manual click value).
- [x] **Auto Empire:** Own 100 total buildings.  
  *Boost:* +2% to all building production.
- [x] **Upgrade Collector:** Reach Tier 10 in any upgrade.  
  *Boost:* +2% to all upgrade effects.
- [x] **Farm Tycoon:** Own 10 Purple Farms.  
  *Boost:* +2% to Purple Farm production.
- [x] **Factory Owner:** Own 5 Purple Factories.  
  *Boost:* +2% to Purple Factory production.
- [x] **Mining Magnate:** Own 3 Purple Mines.  
  *Boost:* +2% to Purple Mine production.
- [x] **Lab Rat:** Own 2 Purple Labs.  
  *Boost:* +2% to Purple Lab production.
- [x] **Portal Master:** Own a Purple Portal.  
  *Boost:* +2% to Purple Portal production.
- [x] **Galactic Overlord:** Own a Galactic Purpler.  
  *Boost:* +2% to Galactic Purpler production.
- [ ] **Prestige!** (if implemented): Prestige for the first time.  
  *Boost:* +5% to all future prestige bonuses.
- [x] **Purple Rain:** Earn 10,000 Purples in a single second.  
  *Boost:* +2% to all Purples earned in a single second.
- [x] **Manual Master:** Earn 10,000 Purples by clicking (not automation).  
  *Boost:* +5% to manual click value.
- [ ] **Idle Idol:** Earn 1,000,000 Purples while idle (no clicks for 10 minutes).  
  *Boost:* +5% to PPS while idle (no clicks for 1+ minute).
- [ ] **Upgrade Maxed:** Max out all upgrades.  
  *Boost:* +5% to all upgrade effects.
- [ ] **Building Boom:** Buy 10 buildings in one second.  
  *Boost:* +2% to building purchase speed (or -2% cost for next building).
- [ ] **Sound of Silence:** Play muted for 10 minutes straight.  
  *Boost:* +1% to all production while muted.
- [ ] **Speedrunner:** Reach 1,000,000 Purples in under 5 minutes.  
  *Boost:* +5% to all production for the first 10 minutes of each run.
- [ ] **Loyal Clicker:** Play for 7 days total.  
  *Boost:* +10% to all production permanently.

## Statistics Page Plan
- [x] **Current Purples**: The current number of Purples owned.
- [x] **Total Purples Earned**: All Purples earned over the run (including spent ones).
- [x] **Purples Per Second (PPS)**: Current rate of automatic Purple generation.
- [x] **Purples Per Click (PPC)**: Current value per manual click.
- [x] **Total Clicks**: Number of times the main button has been clicked.
- [x] **Total Auto Clicks**: Number of Purples generated automatically.
- [x] **Run Duration**: How long the current run has lasted (time since first click or reset).
- [x] **Upgrades Owned**: List of all upgrades and their tiers.
- [x] **Biggest Single Gain**: Largest number of Purples gained in a single click or auto tick.
- [ ] **Average PPS Over Time**: Graph or data showing how PPS has changed during the run.
- [x] **Session Start Time**: When the current session began.
- [x] **Manual vs. Auto Ratio**: Ratio of Purples earned by clicking vs. automation.
- [x] **Achievements Progress**: (If implemented) Progress toward various achievements.
- [ ] **Prestige Stats**: (If implemented) Number of prestiges, bonuses, etc.

**Features:**
- [x] Accessible from a dedicated button or menu.
- [x] Option to reset stats (with confirmation).
- [ ] Optionally, export/import stats as JSON.
- [x] Clean, readable layout with possible charts/graphs for trends.

## Stretch Goals
- [x] **Achievements:** Unlockable badges for milestones.
- [x] **Prestige System:** Reset progress for permanent bonuses.
- [ ] **Leaderboards:** Compare scores with others (local or online).
- [x] **Sound & Animation:** Feedback for clicks and upgrades.
- [ ] **Theming:** Customizable color schemes.

## Development Roadmap
1. **Setup**: Create basic file structure and initial HTML/CSS/JS files. [x]
2. **Core Loop**: Implement clicking, score, and display. [x]
3. **Upgrades**: Add upgrade system and UI. [x]
4. **Automation**: Implement auto-generators. [x]
5. **Persistence**: Add save/load functionality. [x]
6. **Polish**: Improve UI/UX, add animations. [x]
7. **Stretch Features**: Add achievements, prestige, leaderboards, etc. [~]

## Milestones
- [x] Basic clicker loop
- [x] Upgrades functional
- [x] Automation working
- [x] Save/load implemented
- [x] UI polish
- [~] Stretch goals 

## Prestige System Plan

**Overview:**
- Prestige allows players to reset their progress in exchange for powerful permanent bonuses, encouraging replayability and long-term progression.

**How it works:**
- Prestige becomes available after reaching a certain milestone (e.g., 10 million or 1 billion Purples).
- When you prestige, your Purples, upgrades, and buildings are reset, but you gain Prestige Points (or a special currency).
- Prestige Points can be spent on powerful bonuses that persist through all future runs.
- Each subsequent prestige requires a higher milestone.

**Possible Prestige Bonuses:**
- **Permanent Production Multiplier:** Each Prestige Point increases all Purples per second and per click by a percentage (e.g., +5% per point).
- **Manual Click Multiplier:** Each Prestige Point increases manual click value by a percentage.
- **Building Efficiency:** Each Prestige Point increases building output by a percentage.
- **Upgrade Efficiency:** Each Prestige Point increases the effect of all upgrades.
- **Prestige Currency:** Earn a special currency (e.g., "Purple Essence") to spend on unique prestige upgrades.
- **Unlock New Upgrades/Buildings:** Certain prestige milestones unlock new, powerful upgrades or buildings.
- **Achievement Boosts:** Some achievements give extra prestige bonuses when prestiged.
- **Faster Early Game:** Reduce the cost of early upgrades/buildings after each prestige.
- **Cosmetic Rewards:** Unlock new themes, backgrounds, or visual effects for prestiging.
- **Auto-Click Speed:** Increase the speed of auto-clickers or reduce their interval.
- **Offline Progress:** Increase the amount of progress made while offline.

**Prestige UI:**
- Show current Prestige Points, next milestone, and available bonuses.
- Confirm before prestiging to avoid accidental resets.
- Show a summary of what will be lost and what will be gained.

**Implementation Steps:**
1. Add prestige milestone and currency tracking.
2. Implement reset logic and bonus application.
3. Add UI for prestige and bonuses.
4. Balance prestige requirements and rewards for long-term play.

## Prestige Tech Tree Plan

The new Prestige system will use a tech-tree structure, where each node (tech) requires Prestige Points to unlock and may have dependencies on other nodes. This allows for branching, specialization, and long-term strategic planning.

### Structure
- **Nodes:** Each node represents a unique upgrade, bonus, or ability. Nodes cost Prestige Points to unlock.
- **Branches:** The tree branches into different playstyles: manual clicking, automation, offline gains, meta bonuses, and special abilities.
- **Dependencies:** Some nodes require unlocking previous nodes (or a set of nodes) before they become available, creating meaningful choices and paths.
- **Progression:** Players earn Prestige Points by prestiging and spend them to unlock nodes. Some nodes may be multi-level, increasing in cost and effect.

### Example Branches & Techs

#### 1. Manual Click Branch
- **Click Power**: +10% manual click value per level (multi-level)
- **Critical Mastery**: +2% crit chance per level (requires Click Power 2)
- **Combo Chain**: Click combos last 0.2s longer (requires Critical Mastery)
- **Golden Touch**: Every 50th click is a guaranteed crit (requires Combo Chain)

#### 2. Automation Branch
- **Auto Efficiency**: +10% PPS per level (multi-level)
- **Synergy Engine**: Manual clicks boost PPS for 5s (requires Auto Efficiency 2)
- **Factory Overdrive**: Factories produce 2x for 30s every 10 minutes (requires Synergy Engine)

#### 3. Offline Branch
- **Offline Booster**: +20% offline gains per level (multi-level)
- **Time Capsule**: +1h offline cap per level (requires Offline Booster 2)
- **Dream Clicks**: 10% of manual click upgrades count for offline (requires Time Capsule)

#### 4. Meta/Global Branch
- **Prestige Multiplier**: +5% all gains per level (multi-level, expensive)
- **Cheaper Upgrades**: -2% upgrade costs per level (requires Prestige Multiplier 2)
- **Faster Progress**: Buildings and upgrades unlock 10% sooner (requires Cheaper Upgrades)

#### 5. Special/Unique Techs
- **Quantum Leap**: Instantly gain 1 hour of offline gains (one-time, deep in tree)
- **Purple Storm**: 1% chance per click for a 10x burst (requires both click and automation branches)
- **Cosmetic Unlocks**: New themes, backgrounds, or effects (side branches)

### Example Node Format
- **Name**: Short, descriptive
- **Cost**: Prestige Points required
- **Dependencies**: List of required nodes
- **Effect**: What the node does
- **Max Level**: (if multi-level)

### Example Node Table
| Name              | Cost | Dependencies         | Effect                                 | Max Level |
|-------------------|------|---------------------|----------------------------------------|-----------|
| Click Power       | 1    | -                   | +10% manual click value                | 5         |
| Critical Mastery  | 2    | Click Power 2       | +2% crit chance                        | 3         |
| Auto Efficiency   | 1    | -                   | +10% PPS                               | 5         |
| Synergy Engine    | 2    | Auto Efficiency 2   | Manual clicks boost PPS for 5s         | 1         |
| Offline Booster   | 1    | -                   | +20% offline gains                     | 5         |
| Time Capsule      | 2    | Offline Booster 2   | +1h offline cap                        | 3         |
| Prestige Multiplier| 3   | -                   | +5% all gains                          | 10        |
| Cheaper Upgrades  | 2    | Prestige Multiplier 2| -2% upgrade costs                      | 5         |
| Quantum Leap      | 5    | Deep branch         | Instantly gain 1h offline gains        | 1         |

### UI & Unlocking
- The tree is visualized as a grid or branching diagram, with lines showing dependencies.
- Locked nodes are grayed out; available nodes are highlighted.
- Hovering/clicking a node shows its effect, cost, and requirements.
- Unlocking a node spends Prestige Points and immediately grants the bonus.
- Multi-level nodes show current/maximum level.

### Benefits
- **Replayability:** Players can pursue different strategies in each run.
- **Player Choice:** Specialize in clicking, automation, offline, or meta bonuses.
- **Long-Term Goals:** Deep, expensive nodes provide long-term objectives.
- **Branching Paths:** Not all nodes can be unlocked at once, encouraging planning and experimentation.

This system makes the prestige layer a true meta-progression, rewarding both short-term and long-term play, and giving players meaningful choices for every prestige point spent.

## Offline Progression System (Planned)

**Goal:**
Allow players to earn Purples automatically while the game is closed, based on their current automation (PPS) and synergy bonuses.

**How it works:**
- While playing, "offline time" accumulates at a rate of 10 seconds per 1 second of active gameplay, up to a cap of 12 hours (43,200 seconds).
- The current offline time bank is displayed in the statistics menu.
- On save, record the current timestamp (lastActive) and the current offline time bank.
- On load, compare the current time to lastActive. The lesser of (offline time bank, time away) is used to calculate offline gains.
- Calculate offline gains: `offlinePurples = PPS * offlineSecondsUsed`.
- Subtract the used offline time from the bank (reset to 0 if all is used).
- Add offlinePurples to the player's total Purples and update statistics (totalAutoClicks, totalPurplesEarned, etc).
- Show a modal or notification on load summarizing the offline gains ("While you were away, you earned X Purples!").
- Optionally, achievements or tech tree upgrades can boost offline gains or increase the cap.

**Implementation Steps:**
1. Add `lastActive` timestamp and `offlineTimeBank` to saveGame and loadGame.
2. On each game tick, increment offlineTimeBank by 10 seconds (capped at 12 hours).
3. Display offlineTimeBank in the statistics menu.
4. On load, calculate time away and award offline Purples using the banked time.
5. Update stats and show a summary modal.
6. Add a cap and/or tech upgrades for offline time.
7. (Optional) Add achievement(s) for large offline gains.

**Limitations:**
- Only automation (PPS, synergy) is counted for offline gains, not manual clicks or click-based upgrades.
- No falling purples or sound effects are triggered for offline gains.
- If the player is away for a very long time, gains may be capped to prevent excessive rewards.

**Additional Feature:**
- While playing, offline time accumulates at a rate of 10 seconds per 1 second of active gameplay, up to a cap of 12 hours (43,200 seconds).
- The current offline time bank is displayed in the statistics menu.
- Offline time is spent when the player is away, and resets after use.

## Offline-Related Upgrades & Buildings (In Progress)

- [~] **Offline Upgrades Sidebar:** New sidebar tab (⏰) for offline upgrades and buildings.
- [~] **Offline Upgrades:**
  - Offline Booster (multi-tier): Increases offline time accumulation rate.
  - Time Capsule (multi-tier): Increases offline time bank cap.
  - Efficient Automation (single-buy): Increases effectiveness of offline PPS.
  - Offline Synergy (multi-tier): Increases synergy bonus included in offline gains.
  - Offline Magnet (multi-tier): Increases percentage of PPS counted for offline gains.
- [~] **Offline Buildings:**
  - Sleep Lab: Increases effectiveness of all offline gains per tier.
  - Chrono Vault: Increases offline time cap and gives a one-time offline gain boost per tier.
- [ ] **Tech Tree:** To be expanded with offline-related techs (e.g., Offline Mastery, Quantum Alarm).

## Suggestions for Offline-Related Upgrades & Buildings

**Upgrade Ideas:**
- **Offline Booster** (multi-tier): Increases the rate at which offline time accumulates while playing (e.g., +2s per tier).
- **Time Capsule** (multi-tier): Increases the maximum offline time bank cap (e.g., +1 hour per tier).
- **Efficient Automation** (single-buy): Increases the effectiveness of offline PPS by 25%.
- **Offline Synergy** (multi-tier): Each tier increases the portion of synergy bonus included in offline gains.
- **Dream Clicks** (single-buy): While offline, a small portion of manual click upgrades are included in offline gains.
- **Offline Magnet** (multi-tier): Increases the percentage of PPS counted for offline gains (e.g., 110%, 120%, etc).

**Building Ideas:**
- **Sleep Lab**: Increases the effectiveness of all offline gains by a percentage per tier.
- **Chrono Vault**: Each tier increases the offline time cap and provides a one-time offline gain boost when purchased.

**Tech Tree Ideas:**
- **Offline Mastery**: Unlocks the ability to accumulate offline time while idle (not just while actively playing).
- **Quantum Alarm**: Doubles the first hour of offline gains after a long absence.

These upgrades and buildings can be unlocked at different stages and provide meaningful progression for players who return after being away, or who want to optimize their idle gains.

## Settings Menu Plan

**Location:** Bottom right corner of the screen, accessible via a gear icon (⚙️) or settings button.

**Current Features to Integrate:**
- [x] **Audio Mute/Unmute:** Toggle sound effects on/off
- [x] **Volume Slider:** Control volume level (0-100%)

**Suggested Additional Settings:**

### Audio & Visual Settings
- [x] **Master Volume:** Overall game volume control
- [ ] **Animation Speed:** Control how fast falling purples and other animations play
- [ ] **Falling Purple Limit:** Slider to control max animated purples on screen (50-1000 range)
- [ ] **Floating Text Effects:** Toggle the "+X" floating numbers on clicks
- [ ] **Screen Shake:** Toggle screen shake effects on large gains
- [x] **Particle Effects:** Toggle additional visual effects

### Gameplay Settings
- [ ] **Auto-Save Frequency:** How often the game saves (every 10s, 30s, 1min, 5min)
- [ ] **Confirmation Dialogs:** Toggle confirmation prompts for expensive purchases
- [x] **Hide Maxed Upgrades:** Toggle to hide/show fully upgraded items (already implemented)
- [ ] **Number Format:** Choose between scientific notation, abbreviations (1K, 1M), or full numbers
- [ ] **Decimal Places:** Control how many decimal places to show in numbers
- [ ] **Click Cooldown:** Adjust minimum time between clicks (for accessibility)
- [ ] **Auto-Click Prevention:** Toggle to prevent rapid-fire clicking

### UI & Display Settings
- [ ] **Theme Selection:** Choose between light, dark, or custom themes
- [ ] **Font Size:** Adjust text size for better readability
- [ ] **Sidebar Position:** Choose left or right side for the upgrades/buildings sidebar
- [ ] **Compact Mode:** Condensed UI for smaller screens
- [ ] **Show/Hide Elements:** Toggle visibility of various UI elements
- [ ] **Tooltip Style:** Choose between hover tooltips, click tooltips, or none
- [ ] **Language Selection:** (if multiple languages are supported)

### Performance Settings
- [ ] **Animation Quality:** High/Medium/Low settings for animations
- [ ] **Falling Purple Quality:** Control animation smoothness vs performance
- [ ] **Background Effects:** Toggle background animations/effects
- [ ] **Memory Usage:** Show current memory usage and optimization options
- [ ] **Performance Mode:** Ultra-low settings for older devices

### Accessibility Settings
- [ ] **High Contrast Mode:** Enhanced contrast for better visibility
- [ ] **Large Click Target:** Increase the size of clickable elements
- [ ] **Keyboard Navigation:** Enable keyboard shortcuts for all actions
- [ ] **Screen Reader Support:** Enhanced text descriptions
- [ ] **Reduced Motion:** Disable animations for motion-sensitive users
- [ ] **Colorblind Support:** Multiple colorblind-friendly themes

### Data & Privacy Settings
- [ ] **Export Save Data:** Download your save file as JSON
- [ ] **Import Save Data:** Load a save file from JSON
- [ ] **Reset All Data:** Complete game reset with confirmation

### Advanced Settings
- [ ] **Debug Mode:** Show additional technical information
- [ ] **Developer Console:** Access to developer tools and commands
- [ ] **Custom Mods:** Enable/disable mod support (if implemented)
- [ ] **Experimental Features:** Toggle beta/experimental game features
- [ ] **Performance Metrics:** Show FPS, memory usage, etc.

### Animation Control Specifics
- [ ] **Falling Purple Animation:**
  - **Max On Screen:** Slider (50-1000) to control maximum animated purples
  - **Animation Speed:** Slider to control fall speed and physics
  - **Physics Quality:** Simple/Complex physics for falling purples
  - **Bounce Effects:** Toggle bouncing off screen edges
  - **Fade Duration:** Control how long purples stay visible (currently 5 seconds)
  - **Spawn Rate:** Control how frequently new purples spawn
  - **Visual Style:** Choose between different purple image styles

**Implementation Priority:**
1. **High Priority:** Audio controls (already implemented), falling purple limit, number format
2. **Medium Priority:** Theme selection, accessibility options, performance settings
3. **Low Priority:** Advanced features, mod support, experimental features

**UI Design:**
- Modal popup with categorized sections
- Sliders for numerical settings
- Toggle switches for boolean settings
- Dropdown menus for selection options
- Reset to defaults button
- Save/cancel buttons
- Responsive design for mobile devices 

## Stage System Plan

**Overview:**
- The game is divided into Stages, each marked by unlocking a key building ("Stage Building").
- Unlocking a Stage Building introduces a brand new gameplay system or minigame, in addition to increasing production.
- Each Stage Building requires a milestone (e.g., total Purples, previous building owned, or a specific upgrade).
- New systems are accessible via new tabs, sidebars, or modals in the UI.

### Stage Buildings & Their Systems

| Stage Building        | Unlocks System/Minigame          | Description (Summary)                                 |
|-----------------------|----------------------------------|-------------------------------------------------------|
| Purple Bank           | Purplenomics (Stock Market)      | Invest Purples in a simulated market for profit.      |
| Purple Research Lab   | Research & Tech Tree             | Spend Purples to research permanent upgrades.         |
| Purple Casino         | Gambling Minigames               | Play slots, roulette, and more for big rewards.       |
| Purple Portal         | Multiverse Expeditions           | Send expeditions for unique resources and buffs.      |
| Purple Mine           | Mining Minigame                  | Mine for rare gems and special upgrades.              |
| Purple Factory        | Production Chains                | Manage and optimize production lines.                 |
| Purple Observatory    | Celestial Events                 | Track/predict cosmic events for temporary boosts.     |
| Purple University     | Prestige Specializations         | Choose a specialization for unique bonuses.           |
| Purple Shrine         | Rituals & Sacrifices             | Sacrifice for powerful buffs (temp or permanent).     |
| Purple Arcade         | Skill Minigames                  | Play skill games for bonus Purples/rewards.           |
| Purple Spaceport      | Space Missions                   | Launch missions for unique resources/meta-currency.   |

### Example Progression Path
1. Purple Bank → Stock Market
2. Purple Research Lab → Tech Tree
3. Purple Casino → Gambling Minigames
4. Purple Portal → Multiverse Expeditions
5. Purple Observatory → Celestial Events
6. Purple University → Prestige Specializations
7. Purple Market → Trading System
8. Purple Shrine → Rituals & Sacrifices
9. Purple Arcade → Skill Minigames
10. Purple Spaceport → Space Missions

**Synergy:** Some systems interact (e.g., research can improve stock market returns, casino can grant research boosts).

**Replayability:** Systems like Prestige Specializations encourage different playstyles in future runs.

---

*See next section for detailed descriptions of each Stage Building and its system.* 

## Casino System Overview

### Purple Casino Building
- **Unlock Requirement**: Purchase Purple Casino building (costs 8,000 Purples, +40 PPS per tier)
- **Function**: Unlocks casino minigames and gambling mechanics
- **Location**: Accessible via the 🎰 button in the sidebar

### Slot Machine Minigame

#### Game Mechanics
- **Betting**: Players can bet any amount of Purples (minimum 1, no maximum)
- **All-In Button**: Instantly sets bet to current purple balance
- **Spin Animation**: 1-second spinning animation with cycling symbols
- **Cooldown**: 0.5 seconds between spins for fast-paced gameplay

#### Symbols and Payouts
| Symbol | Name | Payout (x bet) |
|--------|------|----------------|
| 🍇 | Grapes | 2x |
| 🍒 | Cherries | 3x |
| 🍋 | Lemon | 5x |
| 🔔 | Bell | 10x |
| 💎 | Gem | 25x |
| 👑 | Crown | 50x |
| 💜 | Purple | 100x |

#### Win Conditions and Odds
1. **Three of a Kind (Highest Priority)**:
   - Three identical symbols in a row
   - Payout: Symbol's base value × bet amount
   - Example: 💜💜💜 = 100x bet

2. **Special Two-of-a-Kind Bonuses**:
   - Two 💜 symbols: 10x bet (instead of 2x)
   - Two 👑 symbols: 5x bet (instead of 2x)
   - Two 💎 symbols: 3x bet (instead of 2x)

3. **Regular Two-of-a-Kind**:
   - Any two identical symbols (except special cases above)
   - Payout: 2x bet amount

4. **No Win**:
   - All three symbols are different
   - No payout, bet is lost

#### Win Probability Analysis
- **House Edge**: Approximately 15-20% (varies based on symbol distribution)
- **Best Odds**: Two-of-a-kind combinations (~30-40% chance)
- **Jackpot**: Three Purple symbols (💜💜💜) - extremely rare, 100x payout
- **Expected Value**: ~0.8-0.85x bet (meaning players lose ~15-20% on average)

#### Visual Effects
- **Win Animation**: Result bounces and glows with golden highlight
- **Purple Rain**: Golden purple images fall from screen when winning
  - Number of falling purples scales with payout amount
  - 96px golden purple images with enhanced physics
  - Bouncy, rotating animation with realistic gravity
- **Particle Effects**: Sparkle effects on winning combinations

#### Strategy Considerations
- **High Risk/High Reward**: Large bets can result in massive wins or losses
- **All-In Strategy**: Risky but potentially game-changing for large purple balances
- **Small Bet Strategy**: Lower risk, consistent small losses over time
- **Timing**: No skill element - purely luck-based gambling

#### Integration with Main Game
- **Purple Generation**: Winnings add to total purple count and statistics
- **Achievement Potential**: Large wins could trigger special achievements
- **Economic Impact**: Can significantly accelerate or slow down progression
- **Risk Management**: Players must balance gambling with steady progression

### Future Casino Features (Potential)
- **Multiple Minigames**: Roulette, dice games, card games
- **Casino Upgrades**: Better odds, special bonuses, VIP features
- **Tournaments**: Competitive gambling events
- **Casino Currency**: Separate gambling chips or tokens
- **Progressive Jackpots**: Accumulating prizes across multiple players
- **Skill-Based Games**: Games requiring timing or strategy instead of pure luck

---

*See next section for detailed descriptions of each Stage Building and its system.* 