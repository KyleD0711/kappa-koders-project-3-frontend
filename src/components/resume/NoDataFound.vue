<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "No Data Found",
  },
  subText: {
    type: String,
    default: "Try adjusting your search or filters",
  },
});
</script>
<template>
  <div class="no-data-container">
    <div class="icon-container">
      <svg class="no-data-icon" viewBox="0 0 24 24">
        <path
          d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10zm-2-6H6v-2h12v2zm-4 4H6v-2h8v2z"
        />
      </svg>
    </div>
    <div class="no-data-text">No Data Found</div>
  </div>
</template>

<style scoped>
.no-data-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  font-family: Arial, sans-serif;
  color: #666;
  text-align: center;
  padding: 20px;
}

.icon-container {
  margin-bottom: 20px;
}

.no-data-icon {
  width: 64px;
  height: 64px;
  fill: #ccc;
}

.no-data-text {
  font-size: 1.2em;
  margin-bottom: 10px;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.icon-container {
  animation: float 3s ease-in-out infinite;
}

@media (max-width: 768px) {
  .no-data-container {
    min-height: 200px;
  }

  .no-data-text {
    font-size: 1em;
  }

  .no-data-subtext {
    font-size: 0.8em;
  }
}
</style>
