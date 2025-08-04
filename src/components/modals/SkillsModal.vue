<template>
  <Teleport to="body">
    <div class="skills-modal-overlay" @click.self="$emit('close')">
      <div class="skills-modal">
        <h2 class="skills-title">SKILLS</h2>
        <div class="skills-list">
          <div
            v-for="skill in skills"
            :key="skill.code"
            class="skill-row"
          >
            <img :src="skill.icon" :alt="skill.name" class="skill-icon" />
            <div class="skill-info">
              <span class="skill-name">{{ skill.name }} </span> 
              <span class="skill-level">(Level {{ skill.level }})</span>
              <span class="skill-xp">
                : {{ skill.xp }}/{{ skill.maxXp }} XP
              </span>
              <div class="skill-bar-bg">
                <div
                  class="skill-bar"
                  :style="{ width: ((skill.xp / skill.maxXp) * 100) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <button class="skills-close-btn" @click="$emit('close')">Close</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayer } from '../../stores/usePlayer'

const { player } = usePlayer()

defineEmits<{ (e: 'close'): void }>()

const skillIcons = {
  mining:        'https://www.artifactsmmo.com/images/items/iron_pickaxe.png',
  woodcutting:   'https://www.artifactsmmo.com/images/items/iron_axe.png',
  fishing:       'https://www.artifactsmmo.com/images/items/spruce_fishing_rod.png',
  weaponcrafting:'https://www.artifactsmmo.com/images/items/iron_sword.png',
  gearcrafting:  'https://www.artifactsmmo.com/images/items/iron_armor.png',
  jewelrycrafting:'https://www.artifactsmmo.com/images/items/fire_ring.png',
  cooking:       'https://www.artifactsmmo.com/images/items/raw_beef.png',
  alchemy:       'https://www.artifactsmmo.com/images/items/health_potion.png',
}

const skills = computed(() => {
  const p = player??null
  if (!p) return []
  return [
    {
      code: 'mining',
      name: 'Mining',
      icon: skillIcons.mining,
      level: p.mining_level,
      xp: p.mining_xp,
      maxXp: p.mining_max_xp,
    },
    {
      code: 'woodcutting',
      name: 'Woodcutting',
      icon: skillIcons.woodcutting,
      level: p.woodcutting_level,
      xp: p.woodcutting_xp,
      maxXp: p.woodcutting_max_xp,
    },
    {
      code: 'fishing',
      name: 'Fishing',
      icon: skillIcons.fishing,
      level: p.fishing_level,
      xp: p.fishing_xp,
      maxXp: p.fishing_max_xp,
    },
    {
      code: 'weaponcrafting',
      name: 'Weaponcrafting',
      icon: skillIcons.weaponcrafting,
      level: p.weaponcrafting_level,
      xp: p.weaponcrafting_xp,
      maxXp: p.weaponcrafting_max_xp,
    },
    {
      code: 'gearcrafting',
      name: 'Gearcrafting',
      icon: skillIcons.gearcrafting,
      level: p.gearcrafting_level,
      xp: p.gearcrafting_xp,
      maxXp: p.gearcrafting_max_xp,
    },
    {
      code: 'jewelrycrafting',
      name: 'Jewelrycrafting',
      icon: skillIcons.jewelrycrafting,
      level: p.jewelrycrafting_level,
      xp: p.jewelrycrafting_xp,
      maxXp: p.jewelrycrafting_max_xp,
    },
    {
      code: 'cooking',
      name: 'Cooking',
      icon: skillIcons.cooking,
      level: p.cooking_level,
      xp: p.cooking_xp,
      maxXp: p.cooking_max_xp,
    },
    {
      code: 'alchemy',
      name: 'Alchemy',
      icon: skillIcons.alchemy,
      level: p.alchemy_level,
      xp: p.alchemy_xp,
      maxXp: p.alchemy_max_xp,
    },
  ]
})

</script>

<style scoped>
.skills-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skills-modal {
  background: #111d17;
  padding: 24px 28px;
  border-radius: 12px;
  min-width: 420px;
  max-width: 95vw;
  color: #fff;
  border: 3px solid #344634;
  box-shadow: 0 4px 40px #000a;
  font-family: 'Press Start 2P', 'VT323', monospace, Arial, sans-serif;
}

.skills-title {
  font-size: 20px;
  letter-spacing: 1px;
  margin-bottom: 18px;
  font-weight: bold;
  color: #fff;
  text-shadow: 1px 1px 0 #344634, 2px 2px 0 #0008;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skill-row {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #16221c;
  border-radius: 8px;
  padding: 10px 12px;
  box-shadow: 0 2px 6px #0005;
}

.skill-icon {
  width: 36px;
  height: 36px;
  image-rendering: pixelated;
  flex-shrink: 0;
}

.skill-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.skill-name {
  font-size: 15px;
  font-family: inherit;
  font-weight: bold;
  color: #f8f8f8;
}

.skill-level, .skill-xp {
  font-size: 13px;
  color: #e7e7e7;
  margin-left: 3px;
}

.skill-bar-bg {
  margin-top: 5px;
  background: #232c28;
  border-radius: 5px;
  width: 100%;
  height: 11px;
  overflow: hidden;
  box-shadow: 0 1px 4px #0008 inset;
}

.skill-bar {
  background: linear-gradient(90deg,#f6e2c0,#b9eee0 70%,#99e6a6 100%);
  height: 100%;
  border-radius: 5px 0 0 5px;
  box-shadow: 0 1px 3px #fff8;
  transition: width 0.3s;
}

.skills-close-btn {
  display: block;
  margin: 25px auto 0;
  background: #262f23;
  color: #fff;
  font-weight: bold;
  border: 2px solid #82bc80;
  border-radius: 6px;
  font-size: 15px;
  padding: 7px 18px;
  box-shadow: 0 2px 8px #000a;
  cursor: pointer;
  transition: background .2s;
}
.skills-close-btn:hover {
  background: #364d39;
}
</style>
