#JAVASCRIPT FORM VALIDATOR<br />

#example usage:<br />

```
const validate = new Validator()

validate
        .setForm('thisForm') // Form Id         @required
        .setRules({         // Validation Rules @required
            formName: 'required|minUpper:1|minDigit:1|minSpecialChar:2|minLower:2',
            formEmail: 'required|email',
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

```
