import { isNullOrUndefined } from 'util';

export class Validations {
    static dateValidators(control: any): { [s: string]: boolean } {
        if (!isNullOrUndefined(control.value) && control.value != "") {
          const dateAfter = new Date();
          const dateNow = new Date(dateAfter.getFullYear(), dateAfter.getMonth(), dateAfter.getDate(), 0, 0, 0);
          let arrayDate = control.value.split('-');
          const date = new Date(parseInt(arrayDate[0]), parseInt(arrayDate[1]) - 1, parseInt(arrayDate[2]), 0, 0, 0);
          if (date > dateNow) {
            return { dateToCompareMaxNow: true }
          }
        }
      }
}
