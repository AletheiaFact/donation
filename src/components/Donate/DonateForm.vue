<template>
    <form class="donate-form">
        <h2 class="donate-title">Donation amount (Real)</h2>
        <section class="amount-section">
            <ul>
                <li
                    class="amount-list-item"
                    v-for="amount in predefinedAmounts" :key="amount.id"
                    @click="handleAmountSelection(amount.value, true)"
                    :class="{ active_amount: selectedAmount === amount.value && selectedAmount !== customAmountValue }"
                >
                    <input :id="amount.id" type="radio" v-model="selectedAmount" :value="amount.value" />
                    <label>{{ amount.label }}</label>
                </li>
                <li
                    class="amount-list-item"
                    id="custom_amount_button"
                    @click="handleCustomButtonClicked"
                    :class="{ active_amount: isCustomButtonSelected}"
                >
                    <input id="other" type="radio" v-model="customAmountValue" :value="customAmountValue" />
                    <label>Other</label>
                    <input
                        ref="customInput"
                        id="custom_amount"
                        type="number"
                        min="1"
                        v-model="customAmountValue"
                        @input="handleCustomAmountInput"
                    />
                </li>
            </ul>
            <div class="text-error" v-if="error">{{ error }}</div>
            <div v-if="taxAmount > 0" style="margin-top: 8px; display: flex; gap: 4px; align-items: flex-start;">
                <div style="margin-top: 4px;">
                    <input type="checkbox" id="tax_amount" @change="handleTaxCheckboxChange" />
                </div>
                <div>
                    <span style="font-size: 12px; text-align: justify;">
                        Acrescentarei generosamente R${{ taxAmount.toFixed(2) }} para cobrir as taxas de transação para que você possa ficar com 100% da minha doação.
                    </span>
                </div>
            </div>
            <div style="margin-top: 8px;">
                <PaypalButton :amount="totalAmount" />
            </div>
            <div class="donation_explanation">
                <h4>Para onde vai sua doação</h4>
                <p><strong>Tecnologia:</strong> Servidores, largura de banda, manutenção, desenvolvimento.</p>
                <p><strong>Pessoas e Projetos:</strong> Os outros sites importantes têm milhares de funcionários. Temos cerca de 30 funcionários e prestadores de serviços para apoiar uma ampla variedade de projetos, tornando a sua doação um grande investimento em uma organização sem fins lucrativos altamente eficiente.</p>
            </div>
        </section>
    </form>
</template>

<script>
import PaypalButton from './PaypalButton.vue';

export default {
    components: {
        PaypalButton
    },
    data() {
        return {
            predefinedAmounts: [
                { id: '2', label: 'R$ 2', value: 2 },
                { id: '5', label: 'R$ 5', value: 5 },
                { id: '10', label: 'R$ 10', value: 10 },
                { id: '20', label: 'R$ 20', value: 20 },
                { id: '30', label: 'R$ 30', value: 30 },
                { id: '50', label: 'R$ 50', value: 50 },
                { id: '100', label: 'R$ 100', value: 100 },
            ],
            customAmountValue: null,
            taxAmount: null,
            selectedAmount: null,
            totalAmount: null,
            isChecked: false,
            isCustomButtonSelected: false,
            error: null,
        };
    },
    methods: {
        handleAmountSelection(amount, predefinedAmounts) {
            document.querySelector('#error').classList.add('hidden');
            this.customAmountValue = null
            if (predefinedAmounts) this.clearValues();
            this.selectedAmount = amount;
            this.calculateTotalAmount(this.selectedAmount)
        },

        handleCustomAmountInput({ target }) {
            const inputValue = (target).value;
            this.customAmountValue = Number(inputValue);
            this.CustomValueIsGreaterThanMinumunValue(this.customAmountValue);
            if (this.customAmountValue >= 0) this.calculateTotalAmount(this.customAmountValue);
        },

        CustomValueIsGreaterThanMinumunValue(value) {
            if(value >= 0 && value <= 0.93) {
                this.error = value >= 0 && value <= 0.93 ? "Por favor selecione uma quantidade (mínimo 0.93 Reais)" : null
            } else {
                document.querySelector('#error').classList.add('hidden');
            }
        },

        calculateTaxAmount(amount) {
            this.taxAmount = amount >= 9 ? (amount * 0.04) : 0.35
        },

        handleTaxCheckboxChange({ target }) {
            this.isChecked = target.checked
            if (this.isChecked) this.addTaxAmountToTotalAmount(this.totalAmount);
            else this.totalAmount = this.selectedAmount || this.customAmountValue;
        },

        addTaxAmountToTotalAmount(amount) {
            this.totalAmount = amount + this.taxAmount
        },

        calculateTotalAmount(amount) {
            this.calculateTaxAmount(amount)
            if(this.isChecked) this.addTaxAmountToTotalAmount(amount)
            else this.totalAmount = amount;
        },
        
        handleCustomButtonClicked() {
            this.clearValues();
            this.isCustomButtonSelected = true;
            this.$nextTick(() => {
                this.$refs.customInput.focus();
            });
        },

        clearValues() {
            this.isCustomButtonSelected = false
            this.selectedAmount = null
            this.totalAmount = null;
        },
    },
};
</script>

<style scoped>

.donate-title {
    margin-bottom: 6px;
    text-align: center;
    font-weight: bold;
    font-size: 18px;
}

.donation_frequency {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
}

form button,
form li {
    display: flex;
    justify-content: center;
    align-items: center;
    border-width: 2px;
    height: 50px;
    padding: 4px 12px;
    font-size: 14px;
    border-radius: 4px;
    line-height: 20px;
    min-width: 75px;
}

.donation_frequency > button {
    flex: 1;
}
.unactive {
    border-color: rgb(81, 81, 81);
    background: rgb(255, 255, 255)
}

.active {
    background: rgb(17, 39, 58);
    border-color: rgb(17, 39, 58);
    color: rgb(255, 255, 255);
}

.amount-section {
    margin-top: 20px;
}

.amount-section ul {
    display: flex;
    margin: 0;
    padding: 0;
    list-style: none;
    gap: 8px;
    flex-wrap: wrap;
}

.amount-section li {
    border: 1px solid rgb(81, 81, 81);
    background-color: #f6f6f6;
    height: 60px;
    font-size: 15px;
    line-height: 1.2;
    text-align: center;
    flex: 1 0 0;
}

.amount-section li.active_amount {
    background: rgb(17, 39, 58);
    border-color: rgb(17, 39, 58);
    color: rgb(255, 255, 255);
}

input[type="radio"] {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    border: 0;
    clip: rect(0 0 0 0);
}

input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}

#custom_amount_button {
    display: flex;
    flex-direction: column;
}

#custom_amount {
    border: 1px solid #000;
    width: 50px;
    color: #000;
}

.text-error {
    margin-top: 8px;
    color: #ff4d4f;
    font-size: 12px;
}

.donation_explanation > h4 {
    text-align: center;
    margin-top: 16px;
    font-weight: 600;
}

.donation_explanation > p {
    font-size: 12px;
    line-height: 1.1rem;
}
</style>
