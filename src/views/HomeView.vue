<template>
  <div class="home">
    <h1>Orbit</h1>
    <p>Хранение и анализ файлов GPX и FIT: маршруты на Яндекс.Картах и разбор тренировок.</p>
    <div class="cta">
      <button class="btn btn-primary" @click="handleLogin">Войти</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function handleLogin() {
  router.push('/login')
}
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2.5rem 1rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

p {
  font-size: 1.05rem;
  color: var(--color-muted);
  margin-bottom: 1.5rem;
}

.cta {
  margin-top: 1.5rem;
}

@media (min-width: 768px) {
  .home {
    padding: 3.5rem 2rem;
  }

  h1 {
    font-size: 2.4rem;
  }
}
</style>