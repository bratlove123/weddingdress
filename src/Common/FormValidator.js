import validator from 'validator';

class FormValidator {
  validation = {};

  constructor(validations) {
    this.validations = validations;
  }

  validate = (state, fieldToValidate) => {
    this.validation.isValid = true;
    var checkedFields = [];
    this.validations.forEach(v => {
      if(v.parent){
        const args = v.args || [];
          const validation_method = 
                typeof v.method === 'string' ?
                validator[v.method] : 
                v.method;
          
          let listControls = state[v.parent];
          if(listControls.length > 0){
            if(!this.validation[v.field + 's']){
              this.validation[v.field + 's'] = [];
            }
            listControls.forEach((e, i)=>{
              
                if(validation_method(e[v.field].toString(), ...args, state) !== v.validWhen){
                  if(!fieldToValidate || (fieldToValidate && fieldToValidate.field === v.field && fieldToValidate.id === i)){
                    if(this.validation[v.field + 's'][i]){
                      this.validation[v.field + 's'][i] = { isInvalid: true, message: v.message };
                    }
                    else{
                      this.validation[v.field + 's'].push({ isInvalid: true, message: v.message });
                    }
                  }
                  this.validation.isValid = false;
                }
                else{
                  if(this.validation[v.field + 's'][i]){
                    this.validation[v.field + 's'][i] = { isInvalid: false, message: '' };
                  }
                  else{
                    this.validation[v.field + 's'].push({ isInvalid: false, message: '' });
                  }
                }

            });
          }
      }
      else{
        if(checkedFields.indexOf(v.field) < 0){
          let args = v.args || [];
          const validation_method = 
                typeof v.method === 'string' ?
                validator[v.method] : 
                v.method
          if(v.comparison){
            if(!validation_method(state[v.field].toString(), state[v.comparison].toString())){
              if(!fieldToValidate || (fieldToValidate && fieldToValidate === v.field)){
                this.validation[v.field] = { isInvalid: true, message: v.message };
                checkedFields.push(v.field);
              }
              this.validation.isValid = false;
            }
            else{
              if(!fieldToValidate || (fieldToValidate && fieldToValidate === v.field)){
                this.validation[v.field] = { isInvalid: false, message: '' };
              }
            }
          }
          else{
            if(validation_method(state[v.field].toString(), ...args, state) !== v.validWhen ||
            (v.comparison && !validation_method(state[v.field].toString(), state[v.comparison].toString()))) {
              if(!fieldToValidate || (fieldToValidate && fieldToValidate === v.field)){
                this.validation[v.field] = { isInvalid: true, message: v.message };
                checkedFields.push(v.field);
              }
              this.validation.isValid = false;
            }
            else{
              if(!fieldToValidate || (fieldToValidate && fieldToValidate === v.field)){
                this.validation[v.field] = { isInvalid: false, message: '' };
              }
            }
          }
        }
      }
    });

    return this.validation;
  }

  reset = () => {
    this.validation = {}

    this.validations.map(v => {
      if(!v.parent){
        this.validation[v.field] = { isInvalid: false, message: '' }
      }
    });

    return { isValid: true, ...this.validation };
  }
}

export default FormValidator;