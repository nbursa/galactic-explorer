import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', {
  state: () => ({
    score: 0,
    health: 100,
  }),
  actions: {
    increaseScore(points: number) {
      this.score += points;
    },
    decreaseHealth(amount: number) {
      this.health -= amount;
    },
  },
});
