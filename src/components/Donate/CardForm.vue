<script setup>
import { vMaska } from "maska"
const currentYear = new Date().getFullYear()
const months = [...Array(12)].map((_, index) => {
    return index + 1 >= 10 ? index + 1 : `0${index + 1}`
});
const years = [...Array(8)].map((_, index) => currentYear + index);

const cardHolderOptions = {
  preProcess: val => val.toUpperCase()
}
</script>

<template>
        <form
            v-if="isCardFormVisible"
            id="Card_form"
            @submit="checkForm"
            method="post"
            style="display: flex; flex-direction: column; margin-top: 8px;"
            >
        <h4 style="text-align: center; font-weight: 600;">Informações de pagamento</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
                <label for="first_name">Nome</label>
                <input
                    type="text"
                    id="first_name"
                    v-model="formData.firstName"
                    placeholder="Nome"
                />
                <span id="Card_form_error" v-if="hasFirstNameError">{{ getErrorByField('firstName') }}</span>

            </div>
            <div>
                <label for="last_name">Sobrenome</label>
                <input
                    type="text"
                    id="last_name"
                    v-model="formData.lastName"
                    placeholder="Sobrenome"
                />
                <span id="Card_form_error" v-if="hasLastNameError">{{ getErrorByField('firstName') }}</span>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 10px 0;">
            <div>
                <label for="email">Email</label>
                <input
                    type="text"
                    id="email"
                    v-model="formData.email"
                    placeholder="email@gmail.com"
                />
                <span id="Card_form_error" v-if="hasEmailError">{{ getErrorByField('email') }}</span>
            </div>
            <div >
                <label for="tax_id">CPF</label>
                <input
                    type="text"
                    id="tax_id"
                    v-model="formData.taxId"
                    placeholder="000.000.000-00"
                    v-maska
                    data-maska="###.###.###-##"
                >
                <span id="Card_form_error" v-if="hasTaxIdError">{{ getErrorByField('taxId') }}</span>
            </div>
        </div>

        <div>
            <label for="card_holder">Nome no cartão</label>
            <input
                type="text"
                id="card_holder"
                v-model="formData.holder"
                placeholder="Nome"
                v-maska:[cardHolderOptions]
                data-maska="A A A A A A"
                data-maska-tokens="A:[A-Z]:multiple"
            />
            <span id="Card_form_error" v-if="hasHolderError">{{ getErrorByField('holder') }}</span>
        </div>
        
        <div style="margin: 10px 0;">
            <label for="card_number">Numero do cartão</label>
            <input
                type="text"
                id="card_number"
                v-model="formData.cardNumber"
                placeholder="4111.1111.1111.1111"
                v-maska
                data-maska="####.####.####.####"
            />
            <span id="Card_form_error" v-if="hasCardNumberError">{{ getErrorByField('cardNumber') }}</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="display: flex; flex-wrap: wrap; width: 100%; column-gap: 8px;">
                <div style="width: calc(50% - 4px)">
                    <label for="month_expiration">Mês</label>
                    <select id="month_expiration" v-model="formData.monthExpiration">
                        <option disabled value="" selected>Selecione um mês</option>
                        <option v-for="month in months" :key="month">{{ month }}</option>
                    </select>
                </div>
                <div style="width: calc(50% - 4px)">
                    <label for="year_expiration">Ano</label>
                    <select id="year_expiration" v-model="formData.yearExpiration">
                        <option disabled value="" selected>Selecione um ano</option>
                        <option v-for="year in years" :key="year">{{ year }}</option>
                    </select>
                </div>
                
                <span id="Card_form_error" v-if="hasCardExpirationError">{{ getErrorByField('cardExpiration') }}</span>
            </div>
            <div>
                <label for="cvv">CVV</label>
                <input
                    type="text"
                    id="cvv"
                    v-model="formData.cvv"
                    placeholder="123"
                    maxlength="3"
                    v-maska
                    data-maska="###"
                />
                <span id="Card_form_error" v-if="hasCvvError">{{ getErrorByField('cvv') }}</span>
            </div>
        </div>
        <button style="margin-top: 10px;" type="button" @click="checkForm">Doar</button>
    </form>
</template>

<script>
import { API } from "aws-amplify"

export default {
    name: "CardForm",
    props: {
        amount: Number,
        isCardFormVisible: Boolean,
    },
    data() {
        return {
            errors: [],
            formData: {}
        };
    },
    computed: {
        hasFirstNameError() {
            return this.errors.some(error => 'firstName' in error);
        },
        hasLastNameError() {
            return this.errors.some(error => 'lastName' in error);
        },
        hasEmailError() {
            return this.errors.some(error => 'email' in error);
        },
        hasTaxIdError() {
            return this.errors.some(error => 'taxId' in error);
        },
        hasHolderError() {
            return this.errors.some(error => 'holder' in error);
        },
        hasCardNumberError() {
            return this.errors.some(error => 'cardNumber' in error);
        },
        hasCardExpirationError() {
            return this.errors.some(error => 'cardExpiration' in error);
        },
        hasCvvError() {
            return this.errors.some(error => 'cvv' in error);
        },
    },
    methods: {
        getErrorByField(field) {
            const errorObj = this.errors.find(error => field in error);
            return errorObj ? errorObj[field] : '';
        },
        checkForm: function (e) {
            console.log(this.errors)
            const {
                firstName,
                lastName,
                email,
                taxId,
                holder,
                cardNumber,
                monthExpiration,
                yearExpiration,
                cvv
            } = this.formData
            console.log("firstname", firstName)
            this.errors = [];
            this.checkIfIsEmpty(firstName, lastName, email, taxId, holder, cardNumber, monthExpiration, yearExpiration, cvv)
            this.checkIfIsValidValue(email, taxId, monthExpiration, yearExpiration)
            if(this.errors.length === 0) {
                this.checkEncryptedCard()
            }

            e.preventDefault();
        },

        checkIfIsEmpty(firstName, lastName, email, taxId, holder, cardNumber, monthExpiration, yearExpiration, cvv) {
            if (!firstName) {
                this.errors.push({firstName: 'Campo obrigatório.'});
            }

            if (!lastName) {
                this.errors.push({lastName: 'Campo obrigatório.'});
            }

            if (!email) {
                this.errors.push({email: 'Campo obrigatório.'});
            }

            if (!taxId) {
                this.errors.push({taxId: 'Campo obrigatório.'});
            }
            
            if (!holder) {
                this.errors.push({holder: 'Campo obrigatório.'});
            }
            
            if (!cardNumber) {
                this.errors.push({cardNumber: 'Campo obrigatório.'});
            }

            if (!monthExpiration || !yearExpiration) {
                this.errors.push({cardExpiration: 'Campos obrigatórios.'});
            }

            if (!cvv) {
                this.errors.push({cvv: 'Campo obrigatório.'});
            }
        },

        checkIfIsValidValue(email, taxId, month, year) {
            if (email) {
                const isValid = String(email)
                    .toLowerCase()
                    .match(
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    );
                if(!isValid) {
                    this.errors.push({
                        email: 'Email inválido.'
                    });
                }
            }

            if (taxId) {
                const numbersOnly = taxId.replace(/\D/g, '');
                const isValid = this.validateTaxId(numbersOnly)
                if(!isValid) {
                    this.errors.push({
                        taxId: 'CPF inválido.'
                    });
                }
            }

            this.checkIfCardExpirationIsValid(month, year)
        },

        checkIfCardExpirationIsValid(month, year) {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;
            console.log(Number(month), currentMonth)
            console.log(year, currentYear)
            if (Number(year) > currentYear) {
                return;
            } else if (Number(year) === currentYear && Number(month) >= currentMonth) {
                console.log("veio a")
                return;
            } else {
                return this.errors.push({cardExpiration: 'Expiração do cartão incorreta.'});;
            }
        },
        
        validateTaxId(taxId) {
            let sum = 0;
            let remaining;

            if(taxId == '00000000000') return false;
            for(let i = 1; i <= 9; i++) {
                sum += parseInt(taxId.substring(i-1, i)) * (11 - i);
            }

            remaining = (sum * 10) % 11;

            if((remaining == 10) || (remaining == 11)) remaining = 0;
            if(remaining != parseInt(taxId.substring(9, 10))) return false;

            sum = 0;
            for(let i = 1; i <= 10; i++) sum = sum + parseInt(taxId.substring(i-1, i))*(12-i);
            remaining = (sum * 10) % 11;

            if((remaining == 10) || (remaining == 11)) remaining = 0;
            if(remaining != parseInt(taxId.substring(10, 11))) return false;
            
            return true;
        },

        convertAmountValueToPagbankStandard() {
            const amountStr = this.amount.toString();

            if (amountStr.includes('.')) return parseInt(amountStr.replace(".","00"))
            else return parseInt(amountStr + '00');
        },

        checkEncryptedCard() {
            const card = PagSeguro.encryptCard({
                //TODO: take from .env
                publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr+ZqgD892U9/HXsa7XqBZUayPquAfh9xx4iwUbTSUAvTlmiXFQNTp0Bvt/5vK2FhMj39qSv1zi2OuBjvW38q1E374nzx6NNBL5JosV0+SDINTlCG0cmigHuBOyWzYmjgca+mtQu4WczCaApNaSuVqgb8u7Bd9GCOL4YJotvV5+81frlSwQXralhwRzGhj/A57CGPgGKiuPT+AOGmykIGEZsSD9RKkyoKIoc0OS8CPIzdBOtTQCIwrLn2FxI83Clcg55W8gkFSOS6rWNbG5qFZWMll6yl02HtunalHmUlRUL66YeGXdMDC2PuRcmZbGO5a/2tbVppW6mfSWG3NPRpgwIDAQAB",
                holder: this.formData.holder,
                number: this.formData.cardNumber.replace(/\./g, ""),
                expMonth: 12,
                expYear: 2024,
                securityCode: this.formData.cvv
            });
            console.log("card", card)
            const encrypted = card.encryptedCard;
            console.log("encrypted", encrypted)
            const hasErrors = card.hasErrors;
            console.log("hasErrors", hasErrors)
            const errors = card.errors;
            console.log("errors", errors)

            if(!hasErrors) {
                this.formData.encryptedCard = encrypted
                this.sendDetails();
            }
        },

        async sendDetails() {
            console.log("convertAmountValueToPagbankStandard(this.amount)", this.convertAmountValueToPagbankStandard(this.amount))
            const response = 
						await API.post("DonateAletheiaApi", `/orders/card_payment/${this.amount}`, {
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(this.formData),
                        })
            // const response = await fetch(`http://localhost:9597/card_payment/${this.convertAmountValueToPagbankStandard(this.amount)}00`, {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify(this.formData),
            // });
            console.log("response", response)
        }
    },
};
</script>

<style scoped>

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
input::placeholder,
select::placeholder {
    color: #929292;
}

input:focus,
select:focus {
    border: none;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
}

#Card_form_error {
    color: #ff4d4f;
    font-size: 12px;
}

</style>
