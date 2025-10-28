import { Injectable } from '@angular/core';

@Injectable()
export class ResponseManagerService 
 {
    constructor() {
    }

    error: any = {
        isError: true,
        errorMessage: '',
        isTimer:true
    }

    success: any = {
        isSuccess: true,
        successMessage: '',
        isTimer:true
    }
    warning: any = {
        isWarning: true,
        warningMessage: '',
        isTimer:true,
        warningNote:'',
        actionButton:'',
        actionParam:''
    }
}