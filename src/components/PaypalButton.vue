<template>
    <div id="donate-button-container">
      <div id="donate-button"></div>
    </div>
  </template>
  
<script>
  export default {
    mounted() {
      const script = document.createElement('script');
      script.src = 'https://www.paypalobjects.com/donate/sdk/donate-sdk.js';
      script.async = true;
      script.onload = this.initializePayPalButton;
  
      document.head.appendChild(script);
    },
    methods: {
      initializePayPalButton() {
        PayPal.Donation.Button({
          env: 'production',
          hosted_button_id: 'AQRDEB2YY9WVN',
          image: {
            src: 'https://pics.paypal.com/00/s/MDU0NDQ0NzItYWQ3Yi00NDZiLTg3ZGQtODc1MDYwZDZmNjMw/file.PNG',
            alt: 'Donate with PayPal button',
            title: 'PayPal - The safer, easier way to pay online!',
          },
          type: "submit",
        }).render('#donate-button');
      },
    },
  };
</script>
  