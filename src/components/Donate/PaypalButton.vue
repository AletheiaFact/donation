<template>
	<div id="error" class="hidden">Por favor selecione uma quantidade (mínimo 0.93 Reais)</div>
	<div ref="paypal"></div>
</template>
  
<script>
import { API } from 'aws-amplify';
import { message } from 'ant-design-vue';

export default {
	name: "PaypalButton",
	props: {
		amount: Number,
	},
	mounted: function() {
		paypal.Buttons({
			fundingSource: paypal.FUNDING.PAYPAL,
			style: {
				layout: "horizontal",
				shape: "rect",
				color: 'white',
				tagline: false,
				label: 'paypal',
			},
			onInit: function(data, actions) {
				actions.disable();

				const amountItems = document.querySelectorAll('.amount-list-item');
				amountItems.forEach(item => {
					item.addEventListener('click', function() {
						actions.enable()
					});
				});
			},
			onClick: function() {
				//TODO: Add Umami analytics
				if(document.querySelector('.active_amount') === null) {
					document.querySelector('#error').classList.remove('hidden');
				}
			},
			createOrder: async (data, actions) => {
				try {
					const response = 
						await API.post("DonateAletheiaApi",`/orders/${this.amount ? this.amount.toFixed(2) : ""}`, {});
					
					return response.id;
				} catch (error) {
					message.error({
						content: () => `${error.message}`,
						time: 6,
					});
				}
			},
			onApprove: async (data, actions) => {
				try {
					const response = 
						await API.post("DonateAletheiaApi", `/orders/${data.orderID}/capture`, {})

					const errorDetail = Array.isArray(response.details) && response.details[0];

					if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') return actions.restart();

					if (errorDetail) {
						let msg = 'Desculpe, sua transação não conseguiu ser processada.';
						msg += errorDetail.description ? ' ' + errorDetail.description : '';
						msg += response.debug_id ? ' (' + response.debug_id + ')' : '';
						alert(msg);
					}

					message.success({
						content: () => `Doação no valor de R$${this.amount} realizada com sucesso. A Aletheia Fact agradece !`,
						time: 6,
					});
				} catch (error) {
					message.error({
						content: () => `${error.message}`,
						time: 6,
					});
				}
			},
		})
		.render(this.$refs.paypal);
	}
}
</script>

<style scoped>

#error {
    margin: 8px 0;
    color: #ff4d4f;
    font-size: 12px;
}

.hidden {
	display: none;
}

</style>