<script setup lang="ts">
import AletheiaInfo from './AletheiaInfo.vue'
import AletheiaSocialMediaFooter from './AletheiaSocialMediaFooter.vue'
import FooterInfo from "./FooterInfo.vue"
</script>

<template>
    <footer
      style="
        text-align: center;
        background: #11273a;
        color: white;
        padding: 32px;
      "
    >
      <div
        style="
            display: grid;
            justify-content: center;
            grid-template-columns: 1fr 1fr 1fr;
        "
      >
        <div>
          <aletheia-social-media-footer />
          <div
            style="
              margin-top: 10px;
              width: 100%;
              text-align: center;
              flex-direction: column;
              margin-bottom: 0;
              font-weight: 200;
              font-size: 14px;
              line-height: 1.2rem;
              padding: 20px;
            "
          >
            <div style="margin-bottom: 16px;">
              <a
                rel="license noreferrer"
                href="https://creativecommons.org/licenses/by-sa/4.0/"
                target="_blank"
              >
                <img
                  height="31"
                  width="88"
                  alt="Creative Commons License"
                  src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png"
                />
              </a>
            </div>
  
            <span>Todo conteúdo dessa plataforma é licenciado através da licença </span>
            <a
              style="
                white-space: pre-wrap;
                display: inline-block;
                color: white;
              "
              rel="license noreferrer"
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              target="_blank"
            >
              Creative Commons Attribution-ShareAlike 4.0 International License
            </a>
          </div>
        </div>
        <div
          style="
            display: flex;
            justify-content: space-between;
            flex-direction: column;
          "
        >
          <FooterInfo />
          <div>
            <h3
              style="
                width: 100%;
                font-size: 23px;
                font-weight: 400;
                letter-spacing: 1px;
                color: white;
                margin-bottom: 0;
                margin-top: 8px;
                text-align: center;
              "
            >
                AletheiaFact.org ©2021
            </h3>
          </div>
        </div>
        <div
          style="display: flex; flex-direction: column;"
        >
          <AletheiaInfo />
        </div>
      </div>
    </footer>
  </template>
  