<template>
  <Column class="textStyles double">
    <section>
      <h1>Stylebook</h1>
      <p>
        This page acts as a kind of a Diary for the UX and UI design for the app. Additionally, it is a
        very convinient way to test and document usage of UX/UI practices, tooling, components, and
        styles in the codebase.
      </p>
      <h2>Router Views</h2>

      <div class="frame right-of-text">
        <img
          src="@/assets/MobileWeb.svg"
          alt="An Example of the App Wireframe"
        >
        <p class="TypeCaption">
          Base layout of the App
        </p>
      </div>

      <p>
        The Single Page App routing is created using <a href="https://router.vuejs.org/">Vue Router</a>, and all the
        views can be found from the default location <span class="code">@/view</span>
      </p>

      <p>The class declarations for view styles can be found in <span class="code">@/styles/views.sass</span></p>

      <p>
        Use the <span class="code">&lt;@/components/form/Select.vue&gt;</span> below,
        to switch between the different layout models we have for the router-views.
      </p>
      <div>
        <Select
          v-model="selectedLayout"
          name="LayoutSelector"
          :opts="layouts"
          label="Select a layoyt"
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Class</th>
            <th>Usage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span class="code">singleColumnLayout</span>
            </td>
            <td>A simple layout with a single, centered column of text.</td>
          </tr>
          <tr>
            <td>
              <span class="code">dashBoardLayout</span>
            </td>
            <td>A layout for dashboards. Arranges sections into rows of 3 items for desktop and tablet. (on mobile, acts like the <span class="code">singleColumnLayout</span>)</td>
          </tr>
          <tr>
            <td
              style="text-decoration:line-through"
              class="lowEmphasis"
            >
              <span class="code">withSideBarLayout</span>
            </td>
            <td
              style="text-decoration:line-through"
              class="lowEmphasis"
            >
              A layout for wiki and game pages, with a site specific sidebar.
            </td>
          </tr>
          <tr>
            <td>
              <span class="code">emptyLayout</span>
            </td>
            <td>A layout filling 100% of the space with some padding.</td>
          </tr>
          <tr>
            <td>
              <span class="code">bookLayout</span>
            </td>
            <td>A layout with 2 sized columns. use class <span class="code">double</span> to get 2 columnns wide <span class="code">Column</span></td>
          </tr>
        </tbody>
      </table>
    </section>
  </Column>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import Select from '@/components/form/Select.vue'
import Column from '@/components/layout/Column.vue'

export default defineComponent({
  name: 'StyleBookIntro',
  components: { Column, Select },
  props: {
    modelValue: { type: String, required: true }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const selectedLayout = ref(props.modelValue)
    watch(selectedLayout, (v) => {
      context.emit('update:modelValue', v)
    })
    const layouts = new Map<string, string>()
    layouts.set('singleColumnLayout', 'singleColumnLayout')
    layouts.set('dashBoardLayout', 'dashBoardLayout')
    layouts.set('emptyLayout', 'emptyLayout')
    layouts.set('bookLayout', 'bookLayout')
    return { selectedLayout, layouts }
  }
})
</script>
