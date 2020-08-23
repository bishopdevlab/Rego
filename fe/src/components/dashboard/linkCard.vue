<template>
  <v-card height="100%">
    <v-toolbar color="cyan" dark tabs>
      <v-toolbar-title>{{board.title}}</v-toolbar-title>
      <v-tabs
        slot="extension"
        v-model="tab"
        color="cyan" grow
      >
        <v-tabs-slider color="yellow"></v-tabs-slider>

        <v-tab v-for="article in articles" :key="article._id">
          {{ article.title }}
        </v-tab>
      </v-tabs>
    </v-toolbar>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="article in articles" :key="article._id">
        <v-card flat>
          <v-card-text v-html="article.content"></v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
export default {
  data () {
    return {
      board: {
        name: 'Link',
        title: 'Link',
        rmk: 'N/A'
      },
      tab: null,
      loading: false,
      params: {
        draw: 0,
        search: '',
        skip: 0,
        sort: '_id',
        order: 1,
        limit: 10
      },
      articles: []
    }
  },
  mounted () {
  },
  watch: {
    tab (t) {
      if (this.articles.length) this.read(t)
    }
  },
  methods: {
  }
}
</script>
