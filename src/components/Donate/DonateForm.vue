<template>
    <form
        id="Donate_form"
    >
        <h2 class="donate-title">Valor da doação (Real)</h2>
        <section class="amount-section">
            <ul>
                <li
                    class="amount-list-item"
                    v-for="amount in predefinedAmounts" :key="amount.id"
                    @click="handleAmountSelection(amount.value)"
                    :class="{ active_amount: totalAmount === amount.value && isCustomButtonSelected !== true }"
                >
                    <input :id="amount.id" type="radio" v-model="totalAmount" :value="amount.value" />
                    <label>{{ amount.label }}</label>
                </li>
                <li
                    class="amount-list-item"
                    id="custom_amount_button"
                    @click="handleCustomButtonClicked"
                    :class="{ active_amount: isCustomButtonSelected}"
                >
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
            <div style="margin-top: 8px;">
                <PaypalButton :amount="totalAmount" />
            </div>
            
        </section>
    </form>
    <div class="donation_explanation">
        <h4>Para onde vai sua doação</h4>
        <p><strong>Tecnologia:</strong> Servidores, largura de banda, manutenção, desenvolvimento.</p>
        <p><strong>Pessoas e Projetos:</strong> Os outros sites importantes têm milhares de funcionários. Temos cerca de 30 funcionários e prestadores de serviços para apoiar uma ampla variedade de projetos, tornando a sua doação um grande investimento em uma organização sem fins lucrativos altamente eficiente.</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PaypalButton from './PaypalButton.vue';

const predefinedAmounts = [
    { id: '2', label: 'R$ 2', value: 2 },
    { id: '5', label: 'R$ 5', value: 5 },
    { id: '10', label: 'R$ 10', value: 10 },
    { id: '20', label: 'R$ 20', value: 20 },
    { id: '30', label: 'R$ 30', value: 30 },
    { id: '50', label: 'R$ 50', value: 50 },
    { id: '100', label: 'R$ 100', value: 100 },
]

const totalAmount = ref()
const customAmountValue = ref()
const isCustomButtonSelected = ref()
const customInput = ref()

const handleAmountSelection = (amount: number): void => {
    customAmountValue.value = null;
    clearTotalAmountAndButtonSelectedValues();
    totalAmount.value = amount;
}

const handleCustomAmountInput = (event: Event): void  =>{
    const target = event.target as HTMLInputElement;
    totalAmount.value = Number(target.value);
}

const handleCustomButtonClicked = () => {
    clearTotalAmountAndButtonSelectedValues();
    isCustomButtonSelected.value = true;
    customInput.value.focus();
}

const clearTotalAmountAndButtonSelectedValues = () => {
    isCustomButtonSelected.value = false
    totalAmount.value = null;
}
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