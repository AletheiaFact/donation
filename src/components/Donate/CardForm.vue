<template>
    <a-spin :spinning="spinning.value" :delay="0" :indicator="indicator" style="display: flex; justify-content: center;">
        <a-form
            v-if="isCardFormVisible"
            id="Card_form"
            layout="vertical"
            ref="formRef"
            :model="formData"
            :rules="rules"
            @finish="onFinish"
        >
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 16px">
                <a-form-item class="form-item" label="Nome" name="firstName">
                    <a-input v-model:value="formData.firstName" placeholder="Nome" />
                </a-form-item>
                <a-form-item class="form-item" label="Sobrenome" name="lastName">
                    <a-input v-model:value="formData.lastName" placeholder="Sobrenome" />
                </a-form-item>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <a-form-item class="form-item" label="Email" name="email">
                    <a-input v-model:value="formData.email" placeholder="email@gmail.com" />
                </a-form-item>
                <a-form-item class="form-item" label="CPF" name="taxId">
                    <a-input v-model:value="formData.taxId" placeholder="000.000.000-00" v-maska data-maska="###.###.###-##" />
                </a-form-item>
            </div>

            <a-form-item class="form-item" label="Nome no cartão" name="holder">
                <a-input
                    v-model:value="formData.holder"
                    placeholder="Nome"
                    v-maska:[cardHolderOptions]
                    data-maska="A A A A A A"
                    data-maska-tokens="A:[A-Z]:multiple"
                />
            </a-form-item>
            
            <a-form-item class="form-item" label="Número do cartão" name="cardNumber">
                <a-input
                    v-model:value="formData.cardNumber"
                    placeholder="4111.1111.1111.1111"
                    v-maska
                    data-maska="####.####.####.####"
                />
            </a-form-item>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div style="display: grid; grid-template-columns: 80px 80px; gap: 8px;">
                    <a-form-item class="form-item" label="Mês" name="monthExpiration">
                        <select  v-model="formData.monthExpiration">
                            <option v-for="month in months" :key="month">{{ month }}</option>
                        </select>
                    </a-form-item>
                    <a-form-item  class="form-item" label="Ano" name="yearExpiration">
                        <select v-model="formData.yearExpiration">
                            <option v-for="year in years" :key="year">{{ year }}</option>
                    </select>
                    </a-form-item>
                </div>
                <a-form-item class="form-item" label="CVV" name="cvv">
                    <a-input v-model:value="formData.cvv" placeholder="123" v-maska data-maska="####" />
                </a-form-item>
            </div>
            <a-form-item class="form-item">
                <a-button style="width: 100%;" html-type="submit">Doar</a-button>
            </a-form-item>
        </a-form>
    </a-spin>
</template>

<script setup lang="ts">
import { API } from "aws-amplify"
import { LoadingOutlined } from '@ant-design/icons-vue';
import { reactive, ref, h } from 'vue';
import { vMaska } from "maska"
import { message } from 'ant-design-vue';

declare global {
	interface Window {
		PagSeguro: any;
	}
}

const { isCardFormVisible, hideCardForm } = defineProps(['isCardFormVisible', 'hideCardForm']);

const currentYear = new Date().getFullYear()

const months = [...Array(12)].map((_, index) => {
    return index + 1 >= 10 ? index + 1 : `0${index + 1}`
});
const years = [...Array(8)].map((_, index) => currentYear + index);

const cardHolderOptions = {
  preProcess: (val: string) => val.toUpperCase()
}

const formRef = ref();
const amount = ref(0)

const spinning = reactive({ value: false });

const formData = reactive({
    firstName: '',
    lastName: '',
    email: '',
    taxId: '',
    holder: '',
    cardNumber: '',
    monthExpiration: '',
    yearExpiration: '',
    cvv: '',
    encryptedCard: '',
});

const indicator = h(LoadingOutlined, {
    style: {
        fontSize: '24px',
    },
    spin: true,
});

const onFinish = () => {
    formRef.value
        .validate()
        .then(() => {
            const activeListItem = document.querySelector('.active_amount')
            if (activeListItem) {
                const inputElement = activeListItem.querySelector('input');
                if (inputElement) {
                    amount.value = Number(inputElement.value);
                }
            }
            getEncryptCard()
        })
        .catch((error: any) => {
            console.log('error', error);
        });
};

const convertAmountValueToPagbankStandard = () => {
    const amountStr = amount.value.toString();

    if (amountStr.includes('.')) return parseInt(amountStr.replace(".","00"))
    else return parseInt(amountStr + '00');
}

const createEncryptCard = () => {
    return window.PagSeguro.encryptCard({
        publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr+ZqgD892U9/HXsa7XqBZUayPquAfh9xx4iwUbTSUAvTlmiXFQNTp0Bvt/5vK2FhMj39qSv1zi2OuBjvW38q1E374nzx6NNBL5JosV0+SDINTlCG0cmigHuBOyWzYmjgca+mtQu4WczCaApNaSuVqgb8u7Bd9GCOL4YJotvV5+81frlSwQXralhwRzGhj/A57CGPgGKiuPT+AOGmykIGEZsSD9RKkyoKIoc0OS8CPIzdBOtTQCIwrLn2FxI83Clcg55W8gkFSOS6rWNbG5qFZWMll6yl02HtunalHmUlRUL66YeGXdMDC2PuRcmZbGO5a/2tbVppW6mfSWG3NPRpgwIDAQAB",
        holder: formData.holder,
        number: formData.cardNumber.replace(/\./g, ""),
        expMonth: formData.monthExpiration,
        expYear: formData.yearExpiration,
        securityCode: formData.cvv
    });
}

const getEncryptCard = () => {
    const card = createEncryptCard()

    if(!card.hasErrors) {
        formData.encryptedCard = card.encryptedCard
        sendDetails();
    }
}

const sendDetails = async () => {
    try {
        console.log("send", amount)
        spinning.value = true;

        const url = `/card/${convertAmountValueToPagbankStandard()}`
        const response = 
            await API.post("PaymentAletheiaApi", url, {
                body: formData
            })                
        
        const paymentResponse = response.charges[0].payment_response
        
        if (paymentResponse.code === "20000") {
            message.success({
                content: () => `${"A doação com cartão de crédito foi concluída com êxito."}`,
            });
            formRef.value.resetFields();
            hideCardForm();
        } else {
            message.error({
                content: () => `Erro ao processar o pagamento: ${paymentResponse.message}`,
            });
        }
    } catch (error) {
        message.error({
            content: () => `${"Erro ao processar o pagamento"}`,
        });
    } finally {
        spinning.value = false;
    }
}

const validateCardEncrypted = async (rule: any) => {
    const fieldName = rule.field;

    const errorCodes = {
        cardNumber: 'INVALID_NUMBER',
        monthExpiration: 'INVALID_EXPIRATION_MONTH',
        yearExpiration: 'INVALID_EXPIRATION_YEAR',
        holder: 'INVALID_HOLDER',
    };

    const errorCode = errorCodes[fieldName as keyof typeof errorCodes];
    const card = createEncryptCard();
    const errors = card.errors;
    const hasInvalidField = errors.some((error: any) => error.code === errorCode);

    if (hasInvalidField) {
        return Promise.reject();
    } else {
        return Promise.resolve();
    }
};

const rules = {
    firstName: [
        { required: true, message: 'Campo obrigatório', trigger: 'change' },
        { min: 3, message: 'Preencha com no mínimo 3 caracteries', trigger: 'blur' },
    ],
    lastName: [
        { required: true, message: 'Campo obrigatório', trigger: 'change' },
        { min: 3, message: 'Preencha com no mínimo 3 caracteries', trigger: 'blur' },
    ],
    email: [{ type: "email", required: true, message: 'Campo obrigatório', trigger: 'change' }],
    taxId: [
        { required: true, message: 'Campo obrigatório', trigger: 'change' },
        { min: 11, message: 'CPF inválido', trigger: 'blur' },
    ],
    holder: [
        { required: true, validator: validateCardEncrypted, message: 'Nome no cartão inválido', trigger: 'blur' },
    ],
    cardNumber: [
        { required: true, validator: validateCardEncrypted, message: 'Número do cartão inválido', trigger: 'blur' },
    ],
    monthExpiration: [
        { required: true, validator: validateCardEncrypted, message: 'Mês de expiração inválido', trigger: 'blur' },
    ],
    yearExpiration: [
        { required: true, validator: validateCardEncrypted, message: 'Ano de expiração inválido', trigger: 'blur' },
    ],
    cvv: [{ required: true, message: 'Campo obrigatório', trigger: 'change' }],
};
</script>

<style scoped>
#Card_Form {
    display: flex;
    flex-direction: column;
    margin-top: 8px;
}

#Card_form input,
#Card_form select {
    background: rgb(245, 245, 245);
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    border: 1px solid rgb(200, 200, 200);
    height: 40px;
    width: 100%;
    padding: 10px;
}

#Card_form label {
    color: rgba(0,0,0,.85);
    font-size: 14px;
}

#Card_form button {
    border-width: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    padding-bottom: 0;
    border-radius: 4px;
    background: #11273a;
    border-color: #11273a;
    color: #fff;
}

a-input::placeholder,
a-select::placeholder {
    color: #929292;
}

input:focus,
select:focus {
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
}

select::placeholder {
    color: green;
}

.form-item {
    margin-bottom: 8px;
}

</style>
