class Validation {

    #forms  = []
    #rules  = {}
    #errors = []
    #messages = {}

    constructor() {
        const allInput = Array.from(document.querySelectorAll('input')).concat(
            Array.from(document.querySelectorAll('select')),
            Array.from(document.querySelectorAll('textarea')),
        );
        
        allInput.forEach(input => input.oninput = (e) => this.clearError(e.target));
    }

    setForm(formId) {
        if (formId instanceof Array) {
            formId.forEach(id => {
                this.#forms.push(document.getElementById(id))
            })
            return this
        }

        this.#forms.push(document.getElementById(formId))
        return this
    }

    setRules(rules) {
        this.#rules = rules
        return this
    }

    setMessages(messages) {
        this.#messages = messages
        return this
    }

    runGlobal() {
        window.addEventListener("load", () => {
            for (let form of this.#forms) {
                form.addEventListener("submit", (e) => {
                    e.preventDefault() 
                    const valid = this.formValidate(form)

                    if (!valid) {
                        console.error('Error Form =>', this.#errors)
                        throw new Error('invalid form')
                    } 

                })
            }
        })
    }

    run() {
        for (let form of this.#forms) {
            const valid = this.formValidate(form)

            if (!valid) {
                console.error('Error Form =>', this.#errors)
                throw new Error('invalid form')
            }
        }              

    }

    formValidate(formInput) {
        let numOfError = 0;
        this.#errors   = [];
        const _rules   = this.#rules
        const formName = Object.keys(_rules);
        const rules    = Object.values(_rules);

        for (let i = 0;i <formName.length;i++) {
            const form = formInput.querySelector(`[name="${formName[i]}"]`);
            const ruleStrings = rules[i].split('|')

            ruleStrings.forEach(r => {
                const rule = Validator.extractRule(r);
                const ruleValue = rule?.rule_value || null;
                let valid = false;
                let message = '';
                switch (rule.rule) {
                  case "required":
                    valid = Validator._require(form);
                    message = this.#messages[formName[i]]?.['required'] || 'Form is required'
                    break;
                  case "email":
                    valid = Validator._email(form);
                    message = this.#messages[formName[i]]?.['email'] || 'Email not valid'
                    break;
                  case "number":
                    valid = Validator._number(form);
                    message = this.#messages[formName[i]]?.['number'] || 'Must be a number'
                    break;
                  case "max":
                    valid = Validator._max(ruleValue, form);
                    message = this.#messages[formName[i]]?.['max'] || `Max ${ruleValue} character`
                    break;
                  case "min":
                    valid = Validator._min(ruleValue, form);
                    message = this.#messages[formName[i]]?.['min'] || `Min ${ruleValue} character`
                    break;
                  case "minUpper":
                    valid = Validator._minUpperCase(ruleValue, form);
                    message = this.#messages[formName[i]]?.['minUpper']?.replace(/[$]/g, ruleValue) || `Min ${ruleValue} uppercase character`
                    break;
                  case "minLower":
                    valid = Validator._minLowerCase(ruleValue, form);
                    message = this.#messages[formName[i]]?.['minLower']?.replace(/[$]/g, ruleValue) || `Min ${ruleValue} lowercase character lowercase`
                    break;
                  case "minDigit":
                    valid = Validator._minDigit(ruleValue, form);
                    message = this.#messages[formName[i]]?.['minDigit']?.replace(/[$]/g, ruleValue) || `Min ${ruleValue} number character`
                    break;
                  case "minSpecialChar":
                    valid = Validator._minSpecialChar(ruleValue, form);
                    message = this.#messages[formName[i]]?.['minSpecialChar']?.replace(/[$]/g, ruleValue) || `Min ${ruleValue} special character`
                    break;
                }

                if (!valid) {
                    this.formError(form, message);
                    this.#errors.push({ form: formName[i], errorMsg: message });
                    numOfError++;
                }
            })
        }

        return numOfError > 0 ? false : true;
    }

    formError(element, message) {
        element.classList.add('border-danger')
        const label = element.previousElementSibling;

        if (!label.querySelector('.form-error')) {
            label.style.display = 'flex';
            label.style.justifyContent = 'space-between';
            label.insertAdjacentHTML('beforeend', `<span class="form-error text-danger">${message}</span>`);
        }
    }

    clearError(element) {
        element.classList.remove('border-danger')
        const label = element.previousElementSibling;

        if (!label) return;
        const error = label.querySelector('.form-error');

        if (error) {
            label.querySelector('.form-error').remove();
        }
    }
}

class Validator {
    constructor() { }

    static extractRule(rule) {
        if (rule.indexOf(':') === -1) {
            return {rule: rule}
        }

        return {
            rule: rule.split(':')[0],
            rule_value: rule.split(':')[1],
        }
    }

    static formError(element) {
        element.classList.add('border-danger')
    }

    static _require(form) {
        return form?.value !== '';
    }

    static _email(form) {
        return form?.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
    }

    static _number(form) {
        return form?.value.match(/[0-9]/);
    }

    static _max(length, form) {
        return form?.value?.length <= length;
    }

    static _min(length, form) {
        return form?.value?.length >= length;
    }

    static _minUpperCase(length, form) {
        const regexString = `^(?=.*[A-Z]{${length}})[A-Za-z\\d#$@!%&*?]{0,}$`;
        const regex = new RegExp(regexString, 'g');
        return form?.value.match(regex)
    }
    
    static _minLowerCase(length, form) {
        const regexString = `^(?=.*[a-z]{${length}})[A-Za-z\\d#$@!%&*?]{0,}$`;
        const regex = new RegExp(regexString, 'g');
        return form?.value.match(regex)
    }
    
    static _minDigit(length, form) {
        const regexString = `^(?=.*\\d{${length}})[A-Za-z\\d#$@!%&*?]{0,}$`;
        const regex = new RegExp(regexString, 'g');
        return form?.value.match(regex)
    }

    static _minSpecialChar(length, form) {
        const regexString = `^(?=(.*[#$@!%&\\^&*\\-_=\\+'\\.,]){${length}})[A-Za-z\\d#$@!%&*?]{0,}$`;
        const regex = new RegExp(regexString, 'g');
        return form?.value.match(regex)
    }

}