<template>
  <div>
    获取参数： {{ $route.params.id }} -- {{ id }}
  </div>
</template>

<script>
export default {
  props: ['id']
}
</script>
