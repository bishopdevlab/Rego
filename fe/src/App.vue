<template>
  <v-app :dark="siteDark">
    <v-navigation-drawer
      persistent
      v-model="drawer"
      :mini-variant.sync="mini"
      enable-resize-watcher
      fixed
      app
    >
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img :src="$store.state.user.img">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{$store.state.user.name}}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon @click.native.stop="mini = !mini">
                <v-icon>chevron_left</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list>
        <v-list-group
          v-for="(item, i) in items"
          v-model="item.act"
          :prepend-icon="item.icon"
          :key="i"
          no-action
        >
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile
            v-for="subItem in item.subItems"
            :key="subItem.title"
            :to="subItem.to"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>{{siteTitle}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-menu bottom left>
          <v-btn icon slot="activator">
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-list>
            <template v-if="!$store.state.token">
              <v-list-tile  @click="$router.push('/sign')">
                <v-list-tile-title>로그인</v-list-tile-title>
              </v-list-tile>
              <v-list-tile  @click="$router.push('/register')">
                <v-list-tile-title>회원가입</v-list-tile-title>
              </v-list-tile>
            </template>
            <template v-else>
              <v-list-tile  @click="$router.push('/user')">
                <v-list-tile-title>사용자 정보</v-list-tile-title>
              </v-list-tile>
              <v-list-tile  @click="signOut">
                <v-list-tile-title>로그아웃</v-list-tile-title>
              </v-list-tile>
            </template>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <v-footer app>
      <v-spacer></v-spacer>
      <span>{{siteCopyright}} &nbsp;</span>
    </v-footer>
    <v-snackbar
      v-model="$store.state.sb.act"
      :color="$store.state.sb.color"
    >
      {{ $store.state.sb.msg }}
      <v-btn
        flat
        @click="$store.commit('pop', { act: false })"
      >
        닫기
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      drawer: null,
      mini: false,
      siteTitle: 'wait loading...',
      siteCopyright: 'wait loading...',
      siteDark: false,
      items: [
        {
          icon: 'donut_large',
          title: this.$t('dashboard'), // '현황',
          act: true,
          subItems: [
            {
              title: this.$t('today'), // '오늘',
              to: {
                path: '/'
              }
            }
          ]
        },
        {
          icon: 'settings',
          title: '관리메뉴',
          subItems: [
            {
              title: '사용자관리',
              to: {
                path: '/manage/users'
              }
            }
          ]
        }
      ],
      title: this.$apiRootPath
    }
  },
  mounted () {
    this.getSite()
  },
  methods: {
    signOut () {
      // localStorage.removeItem('token')
      this.$store.commit('delToken')
      this.$router.push('/')
    },
    getSite () {
      this.$axios.get('/site')
        .then(r => {
          this.siteTitle = r.data.d.title
          this.siteCopyright = r.data.d.copyright
          this.siteDark = r.data.d.dark
        })
        .catch(e => {
          if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
        })
    }
  }
}
</script>
<style>
/* .v-datatable__actions__range-controls {
  display: none;
} */
</style>
