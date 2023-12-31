<template>
	<div ref="paypal"></div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import { API } from 'aws-amplify';
import { message } from 'ant-design-vue';

declare global {
	interface Window {
		paypal: any;
	}
}

export default defineComponent({
	name: "PaypalButton",
	props: {
    	amount: Number as () => number | null,
		handleClick: Function,
  	},
	mounted: function() {
		window.paypal.Buttons({
			fundingSource: window.paypal.FUNDING.PAYPAL,
			style: {
				layout: "horizontal",
				shape: "rect",
				color: 'white',
				tagline: false,
				label: 'paypal',
			},
			onInit: function(data: any, actions: any): void {
				actions.disable();

				const amountItems = document.querySelectorAll('.amount-list-item');
				amountItems.forEach(item => {
					item.addEventListener('click', function() {
						actions.enable()
					});
				});
			},
			onClick: this.handleClick,
			createOrder: async () => {
				try {
					const response = 
						await API.post("DonateAletheiaApi",`/orders/${this.amount ? this.amount.toFixed(2) : ""}`, {});
					
					return response.id;
				} catch (error: any) {
					message.error({
						content: () => `${error.message}`,
					});
				}
			},
			onApprove: async (data: any, actions: any) => {
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
					});
				} catch (error: any) {
					message.error({
						content: () => `${error.message}`,
					});
				}
			},
		})
		.render(this.$refs.paypal);
	}
})
</script>
