<template>
    <div
      style="
        padding: 10px 0;
      "
    >
        <div>
            <h3 style="font-size: 23px; color: white; font-weight: 200; letter-spacing: 1px;">
                Siga nossas redes sociais
            </h3>
        </div>
        <div style="
            display: grid;
            grid-template-columns: 50px 50px 50px 50px;
            justify-content: center;
        ">
            <a-button
                href="https://www.instagram.com/aletheiafact"
                target="_blank"
                rel="noreferrer"
            >
                <instagram />
            </a-button>

            <a-button
                href="https://www.facebook.com/AletheiaFactorg-107521791638412"
                target="_blank"
                rel="noreferrer"
            >
                <facebook />
            </a-button>

            <a-button
                href="https://www.linkedin.com/company/aletheiafact-org"
                target="_blank"
                rel="noreferrer"
            >
                <linkedin />
            </a-button>

            <a-button
                href="https://github.com/AletheiaFact/aletheia"
                target="_blank"
                rel="noreferrer"
            >
                <github />
            </a-button>
                
        </div>
        <div style="width: 324px; margin: 10px auto;">
            <divider style="background-color: #fff;" />
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { Divider } from "ant-design-vue";
import Instagram from "vue-material-design-icons";
import Linkedin from 'vue-material-design-icons/Linkedin.vue';
import Github from 'vue-material-design-icons/Github.vue';
import Facebook from 'vue-material-design-icons/Facebook.vue';
</script>


<style scoped>
    a {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        color: white;
        border: none;
    }
</style>