#JAVASCRIPT FORM VALIDATOR<br />

#example usage:<br />

```
const validate = new Validator()

validate
                .setRules({
                    formName: 'required|minUpper:1|minDigit:1|minSpecialChar:2|minLower:2',
                    formEmail: 'required|email',
                    formPhone: 'required|number',
                    formAddress: 'required|min:10',
                })
                .setMessages({
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
                .run()

```
