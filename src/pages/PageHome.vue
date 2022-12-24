<template>
    <q-page class="relative-position">
      <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-lg q-px-md row items-end
      q-col-gutter-md">
        <div class="col">
          <q-input
        bottom-slots
        class="new-qweet"
        v-model="newQweetContent"
        placeholder="What's happening?"
        counter
        autogrow
        maxlength="280">
          <template v-slot:before>
            <q-avatar size="xl">
              <img src="..\assets\face_tealbg_2png.png">
            </q-avatar>
          </template>
        </q-input>

        </div>
        <div class="col col-shrink">
            <q-btn
            @click = "addNewQweet"
            :disable="!newQweetContent"
            unelevated
            class = 'q-mb-lg'
            no-caps
            rounded
            color="primary"
            label="Qweet" />
        </div>

      </div>


    <q-separator
    class="divider"
    size="10px"
    color="grey-2" />

    <q-list separator>

      <transition-group
  appear
  enter-active-class="animated fadeIn slow"
  leave-active-class="animated fadeOut slow"
>
      <q-item
      v-for="qweet in qweets"
      :key="qweet.id"
      class="q-py-md">
        <q-item-section avatar top>
          <q-avatar>
            <img src="..\assets\face_tealbg_2png.png">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-subtitle1">
            <strong>Alex Yaroshuk</strong>
            <span class="text-grey-7">
              @dev
              <br class='lt-sm'>&bull; {{ relativeDate(qweet.date) + ' ago' }}
            </span>
          </q-item-label>

          <q-item-label class="qweet-content text-body1">
            {{ qweet.content }}
          </q-item-label>
          <div class="qweet-icons row justify-between q-mt-sm">
            <q-btn
              flat
              size="sm"
              round
              color="grey"
              icon="far fa-comment" />
            <q-btn
              flat
              size="sm"
              round
              color="grey"
              icon="fas fa-retweet" />
              <div class="row">
                <q-btn
                  flat
                  size="sm"
                  round
                  @click="toggleLiked(qweet)"
                  :color="qweet.liked ? 'pink' : 'grey'"
                  :icon="qweet.liked ? 'fa-solid fa-heart' : 'far fa-heart'" />
                <subtitle
                 class = 'q-mt-xs q-ml-sm'
                 :class="qweet.liked ? 'text-pink' : 'text-white'"
                  >1
                 </subtitle>
                </div>
              <q-btn
              @click="deleteQweet(qweet)"
              flat
              size="sm"
              round
              color="grey"
              icon="fas fa-trash" />
            </div>
        </q-item-section>
      </q-item>
    </transition-group>

    </q-list>
  </q-scroll-area>
  </q-page>
</template>

<script>


import { formatDistance,} from 'date-fns'
import { data } from 'browserslist';
import db from 'src/boot/firebase'
import { collection, doc, query, orderBy, onSnapshot, updateDoc, addDoc, deleteDoc } from "firebase/firestore";
import { defineComponent } from 'vue'

const qweetsRef = collection(db, "qweets");

export default defineComponent({
  name: 'PageHome',
  data() {
    return {
      newQweetContent: '',
      qweets: [
/*         {
          id:'ID1',
          content: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work. And the only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know when you find it.” — Steve Jobs",
          date: 1671708415664,
          liked: false

        },
        {
          id: 'ID2',
          content: '“When you change your thoughts, remember to also change your world.”—Norman Vincent Peale',
          date: 1671708475322,
          liked: true

        } */
      ]
    }
  },

  methods: {
  addNewQweet() {
    let newQweet = {
      content: this.newQweetContent,
      date: Date.now(),
      liked: false
    }
    //this.qweets.unshift(newQweet)

    const docRef = addDoc(collection(db, "qweets"), {
      content: newQweet.content,
      date: newQweet.date,
      liked: newQweet.liked
    });
    console.log("Document written with ID: ", docRef.id);

    this.newQweetContent =''
  },

  relativeDate(value) {
    return formatDistance(value, new Date())
  },

  deleteQweet(qweet) {
    deleteDoc(doc(db, "qweets", qweet.id));
    },

    async toggleLiked(qweet) {
      const washingtonRef = doc(db, "qweets", qweet.id);
      await updateDoc(washingtonRef, {
      liked: !qweet.liked
    });
    }
  },
  mounted() {
    const q = query(qweetsRef, orderBy('date'))
    onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let qweetChange = change.doc.data()
        qweetChange.id = change.doc.id
        if (change.type === "added") {
            console.log("New qweet: ", qweetChange)
            this.qweets.unshift(qweetChange)
        }
        if (change.type === "modified") {
            console.log("Modified qweet: ", qweetChange)
            let index = this.qweets.findIndex(qweet => qweet.id === qweetChange.id)
            Object.assign(this.qweets[index], qweetChange)
        }
        if (change.type === "removed") {
            console.log("Removed qweet: ", qweetChange)
            let index = this.qweets.findIndex(qweet => qweet.id === qweetChange.id)
            this.qweets.splice(index, 1)
        }
      })
})


  }
})
</script>

<style lang="sass">
.new-qweet
  textarea
    font-size: 19px
    line-height: 1.2 !important
.divider
  border-top: 1px solid
  border-bottom: 1px solid
  color: $grey-4
.qweet-content
  white-space: pre-line
.qweet-icons
  margin-left:-5px
</style>
