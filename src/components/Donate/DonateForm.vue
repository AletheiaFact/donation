<template>
    <form id="Donate_form">
        <h2 class="donate-title">Valor da doação (Real)</h2>
        <section class="amount-section">
            <ul>
                <li
                    class="amount-list-item"
                    v-for="amount in predefinedAmounts" :key="amount.id"
                    @click="handleAmountSelection(amount.value)"
                    :class="{
                        active_amount: amount.value === (totalAmount - (isChecked ? taxAmount : 0))
                        && isCustomButtonSelected !== true
                    }"
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
            <div v-if="showError" id="error">Por favor selecione uma quantidade (mínimo 0.93 Reais)</div>
            <div v-if="taxAmount" style="margin-top: 8px; display: flex; gap: 4px; align-items: flex-start;">
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
                <PaypalButton :amount="totalAmount" :handleClick="handleClickPaypalButton" />
            </div>
            <div>
                <button
                    class="credit-card-button"
                    @click="showCardForm($event)"
                    style="
                        width: 100%;
                        display: flex;
                        margin-top: 4px;
                        gap: 8px;
                        align-items: center;
                    "
                >
                    <span style="margin-top: 5px;"><CreditCardOutline /></span>
                    Cartão de crédito ou débito
                </button>
                <CardForm
                    :isCardFormVisible="isCardFormVisible"
                    :hideCardForm="hideCardForm"
                    :getAmountValue="getAmountValue"
                />
            </div>
        </section>
    </form>
    <div class="donation_explanation">
        <h4>Para onde vai sua doação</h4>
        <p><strong>Tecnologia:</strong> Servidores, largura de banda, manutenção, desenvolvimento.</p>
        <p><strong>Pessoas e Projetos:</strong> Os outros sites importantes têm milhares de funcionários. Nosso time é pequeno com uma mistura de voluntários e prestadores de serviços para apoiar uma ampla variedade de projetos, tornando a sua doação um grande investimento em uma organização sem fins lucrativos altamente eficiente.</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PaypalButton from './PaypalButton.vue';
import CreditCardOutline from "vue-material-design-icons/CreditCardOutline.vue"
import CardForm from './CardForm.vue';

const predefinedAmounts = [
    { id: '2', label: 'R$ 2', value: 2 },
    { id: '5', label: 'R$ 5', value: 5 },
    { id: '10', label: 'R$ 10', value: 10 },
    { id: '20', label: 'R$ 20', value: 20 },
    { id: '30', label: 'R$ 30', value: 30 },
    { id: '50', label: 'R$ 50', value: 50 },
    { id: '100', label: 'R$ 100', value: 100 },
]

const totalAmount = ref();
const customAmountValue = ref();
const isCustomButtonSelected = ref();
const customInput = ref();
const isCardFormVisible = ref(false);
const showError = ref(false);
const isChecked = ref(false);
const taxAmount = ref(0);

const handleAmountSelection = (amount: number): void => {
    showError.value = false
    customAmountValue.value = null;
    clearTotalAmountAndButtonSelectedValues();
    calculateTotalAmount(amount)
}

const handleCustomAmountInput = (event: Event): void  =>{
    showError.value = false
    const target = event.target as HTMLInputElement;
    calculateTotalAmount(Number(target.value))
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

const showCardForm = (event: Event) => {
    event.preventDefault();
    if(totalAmount.value) {
        isCardFormVisible.value = !isCardFormVisible.value
    } else {
        showError.value = true
    }
}

const hideCardForm = () => {
    isCardFormVisible.value = false
}

const handleClickPaypalButton = () => {
    //TODO: Add Umami analytics
    if(!totalAmount.value) {
        showError.value = true
    }
}

const calculatePaypalDomesticFeeDeduction = (amount: number) => {
    taxAmount.value = amount * 0.0499 + 0.60
}

const handleTaxCheckboxChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    isChecked.value = target.checked;
    if (isChecked.value) addTaxAmountToTotalAmount(totalAmount.value);
}

const addTaxAmountToTotalAmount = (amount: number) => {
    totalAmount.value = amount + taxAmount.value
}

const calculateTotalAmount = (amount: number) => {
    calculatePaypalDomesticFeeDeduction(amount)
    if(isChecked.value) addTaxAmountToTotalAmount(amount)
    else totalAmount.value = amount;
}

const getAmountValue = () => totalAmount.value
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

#error {
    margin: 8px 0;
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

.credit-card-button {
    border-width: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 45px;
    padding-bottom: 0;
    border-radius: 4px;
    background: #11273a;
    border-color: #11273a;
    color: #fff;
}
</style>
