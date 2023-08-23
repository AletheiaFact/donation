<script>
import { FileTextOutlined } from "@ant-design/icons-vue";

export default {
  components: {
    FileTextOutlined,
  },
};
</script>

<template>
    <div style="display: flex; flex-direction: column; justify-content: center;">
      <span style="text-align: justify; margin-bottom: 16px; font-size: 14px; line-height: 1.3rem; font-weight: 300;">
        A AletheiaFact.org é mantida pela entidade sem fins lucrativos MOVIMENTO ALETHEIA FACT (veja nosso estatuto no link abaixo). Todo conteúdo da plataforma é realizado por voluntários e distribuído de forma livre e gratuita pela licença CC BY-SA 4.0. A plataforma não remunera e nem executa a cobrança de taxa ou mensalidade ao público de leitores e de criadores de conteúdo da plataforma. Além disso, todo código desenvolvido é open source e pode ser acessado em
        <a
          style="white-space: pre-wrap; display: inline; color: white;"
          href="https://github.com/AletheiaFact/aletheia"
          target="_blank"
          rel="noreferrer"
        >
          https://github.com/AletheiaFact/aletheia
        </a>
      </span>
      <a-button
        style="
            border-width: 2px;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 40px;
            width: 200px;
            border-radius: 4px;
            background: rgb(17, 39, 58);
            border-color: rgb(255, 255, 255);
            color: rgb(255, 255, 255);
            font-weight: 200;
        "
        href="https://docs.google.com/viewer?url=https://raw.githubusercontent.com/AletheiaFact/miscellaneous/290b19847f0da521963f74e7947d7863bf5d5624/documents/org_legal_register.pdf"
        target="_blank"
        rel="noreferrer"
      >
        Acesse nosso Estatuto
        <FileTextOutlined />
      </a-button>
    </div>
</template>