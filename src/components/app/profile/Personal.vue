<template>
  
</template>

<script>
export default {
  mounted () {
    return this.$emit('meta', {
      title: 'Personal Information',
      crumbs: {
        text: 'Personal info', disabled: true,
      }
    })
  }
}
</script>