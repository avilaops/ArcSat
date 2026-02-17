<template>
  <SettingsPage
    doctype="ERPNext CRM Settings"
    :title="__('ArcSat settings')"
    :successMessage="__('ArcSat settings updated')"
    class="p-8"
  />
</template>
<script setup>
import SettingsPage from '@/components/Settings/SettingsPage.vue'
</script>
