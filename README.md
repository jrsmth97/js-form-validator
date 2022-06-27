#JAVASCRIPT FORM VALIDATOR<br />

#example usage:<br />

```
const validate = new Validator()

document.getElementById('thisForm').onsubmit = (e) => {
    e.preventDefault()

    validate
            .setForm('thisForm') // Form Id         @required
            .setRules({         // Validation Rules @required
                formName: 'required',
                formEmail: 'required|email',
                formPassword: 'required|min:8|minUpper:1|minDigit:1|minSpecialChar:2',
                formPhone: 'required|number',
                formAddress: 'required|min:10',
            })                 
            .setMessages({       // Custom Validation Messages @optional
                formName: {
                    required: '.....',
                    minUpper: 'Min $ ...',
                    minDigit: 'Min $ ...'
                },
                formEmail: {
                    required: '...',
                    email: '...'
                }
            })
            .run()  // running validation

    ... {do something} ...
}

```
