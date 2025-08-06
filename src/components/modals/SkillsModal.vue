<template>
  <Teleport to="body">
    <div class="skills-modal-overlay" @click.self="$emit('close')">
      <div class="skills-modal">
         <button class="close-btn modal-close-btn" @click="$emit('close')" aria-label="Close">×</button>
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
              <span class="skill-level">Level {{ skill.level }}</span>
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
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skills-modal {
  background: #21381B;
  position:relative;
  padding: 24px 28px;
  border-radius: 12px;
  min-width: 420px;
  max-width: 95vw;
  color: #fff;
  border: 2.5px solid #43633e;
  box-shadow: 0 4px 40px #000b,0 1px 0 #3c3e2c;
  font-family: 'Press Start 2P', 'VT323', monospace, Arial, sans-serif;
}
.modal-close-btn {
  position: absolute;
  top: 13px;
  right: 15px;
  background: #284a31;
  border: none;
  color: #ffe792;
  border-radius: 50%;
  font-size: 21px;
  width: 29px;
  height: 29px;
  cursor: pointer;
  font-weight: bold;
  z-index: 10;
  box-shadow: 0 2px 8px #0004;
  transition: background 0.14s;
}
.modal-close-btn:hover { background: #3cb162; }

.skills-title {
  font-size: 19px;
  margin-bottom: 18px;
  font-weight: bold;
  color: #ffe792;
   letter-spacing: .02em;

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
  background: #223822;
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
  color: #ffe792;
}

.skill-level{
  color: #aaff98;
  font-size: 13px;
  margin-left: 3px;
} 


.skill-xp {
  color: #FFFAC0;
  font-size: 13px;
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
 background: linear-gradient(90deg,
  #ffe792 0%,
  #fce398 25%,
  #b7f183 75%,
  #70e088 100%
);

  height: 100%;
  border-radius: 5px 0 0 5px;
  box-shadow: 0 1px 3px #fff8;
  transition: width 0.3s;
}


</style>
