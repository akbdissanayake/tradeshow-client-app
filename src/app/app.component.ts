import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TradeShowApiService} from './services/trade-show-api.service';
import {TradeShowModel} from './datamodels/trade-show-model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ToastrService} from 'ngx-toastr';
import {LoadingBarService} from '@ngx-loading-bar/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('header', [
      state('in', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0}),
        animate(1500)
      ]),
      transition(':leave',
        animate(1500, style({opacity: 0})))
    ])
  ]
})
export class AppComponent implements OnInit {
  formGroup: FormGroup;
  loader = false;
  constructor(private tradeshowapiservice: TradeShowApiService,
              private toastr: ToastrService,
              private loadingBar: LoadingBarService) {
  }
  showSuccess() {
    this.toastr.success('Marketing pieces are on their way!', 'Success', {
      timeOut: 3000,
      closeButton : true,
      progressBar : true
    });
  }
  showError() {
    this.toastr.error('The action performed was not successful', 'Error', {
      timeOut: 3000,
      closeButton : true,
      progressBar : true
    });
    // this.onReset();
  }
  startLoading() {
    this.loadingBar.start();
  }
  stopLoading() {
    this.loadingBar.complete();
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      firstName: new FormControl('', [
        Validators.required
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
      ]),
      lastName: new FormControl(''),
      phoneNumber: new FormControl(''),
      title: new FormControl(''),
      organization: new FormControl(''),
      salesInitials: new FormControl('')
    });
  }

  onSubmit() {
    const tradeShowModel: TradeShowModel = {
      firstName: this.formGroup.value.firstName,
      lastName: this.formGroup.value.lastName,
      email: this.formGroup.value.email,
      phoneNumber: this.formGroup.value.phoneNumber,
      title: this.formGroup.value.title,
      organization: this.formGroup.value.organization,
      salesInitials: this.formGroup.value.salesInitials,
      status: 0
    };
    this.loader = true;
    this.tradeshowapiservice.requestData(tradeShowModel).subscribe(
      response => {
        if (response.status === 1) {
          this.startLoading();
          this.showSuccess();
          this.stopLoading();
          this.loader = false;
          setTimeout(() => {
            location.reload();
          }, 3000);
          // this.formGroup.reset();
        } else {
          this.showError();
          this.loader = false;
        }
      },
      error => {
        this.loader = false;
        console.log(error);
        this.showError();
      }
    );
  }
  onReset() {
    this.formGroup.reset();
  }
}
