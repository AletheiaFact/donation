<template>
	<div ref="paypal"></div>
</template>
  
<script>
export default {
	name: "PaypalButton",
	props: {
		amount: Number,
	},
	mounted: function() {
		paypal.Buttons({
			type: "submit",
			fundingSource: paypal.FUNDING.PAYPAL,
			style: {
				layout: "vertical",
				shape: "rect",
				color: 'white',
			},
			createOrder: async (data, actions) => {
				console.log("this.amount", this.amount)
				try {
					const response = await fetch(`http://localhost:9597/orders/${this.amount ? this.amount.toFixed(2) : ""}`, {
						method: "POST",
					});

					const details = await response.json();
					return details.id;
				} catch (error) {
					console.error(error);
					// Handle the error or display an appropriate error message to the user
				}
			},
			onApprove: async (data, actions) => {
				try {
					const response = await fetch(`http://localhost:9597/orders/${data.orderID}/capture`, {
						method: "POST"
					});

					const details = await response.json();
					// Three cases to handle:
					//   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
					//   (2) Other non-recoverable errors -> Show a failure message
					//   (3) Successful transaction -> Show confirmation or thank you message

					// This example reads a v2/checkout/orders capture response, propagated from the server
					// You could use a different API or structure for your 'orderData'
					const errorDetail = Array.isArray(details.details) && details.details[0];

					if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') {
					return actions.restart();
					// https://developer.paypal.com/docs/checkout/integration-features/funding-failure/
					}

					if (errorDetail) {
						let msg = 'Sorry, your transaction could not be processed.';
						msg += errorDetail.description ? ' ' + errorDetail.description : '';
						msg += details.debug_id ? ' (' + details.debug_id + ')' : '';
						alert(msg);
					}

					// Successful capture! For demo purposes:
					console.log('Capture result', details, JSON.stringify(details, null, 2));
				} catch (error) {
					console.error(error);
					// Handle the error or display an appropriate error message to the user
				}
			},
		})
		.render(this.$refs.paypal);
	}
}
</script>

<style scoped>
#donate-button {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

</style>