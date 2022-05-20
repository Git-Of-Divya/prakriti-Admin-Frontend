import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Gardener } from 'src/app/model/gardener';
import { GardenerService } from 'src/app/service/gardener.service';
import { NgxSpinnerService } from 'ngx-spinner'

@Component({
  selector: 'app-gardener-list',
  templateUrl: './gardener-list.component.html',
  styleUrls: ['./gardener-list.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class GardenerListComponent implements OnInit {
  gardenerList?: Gardener[]
  starRating: any = [];


  constructor(private spinner: NgxSpinnerService, private gardenerService: GardenerService, private toaster: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.spinner.show()
    this.gardenerService.gardenerList().subscribe(data => {
      if (data.length > 0) {
        for (let gardener in data) {
          var total = 0;
          for (let rating of data[gardener].gardenerRating) {
            total = total + rating.rate;
          }
          this.starRating[gardener] = total / 5;
          console.log(this.starRating[gardener]);
        }

        this.gardenerList = data;
      }
      else
        this.toaster.info("No Gardener Available", "Sorry");
      this.spinner.hide();
    }, err => {
      if (err instanceof HttpErrorResponse) {
        if (err.status == 401) {
          this.toaster.error("Invalid User", "Error");
        }
        else if (err.status == 500) {
          this.toaster.error("Internal Server Error", "Error");

        }
        else if (err.status == 400) {
          this.toaster.error("Bad Request", "Error");
        }
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        location.reload();
      }
    })
  }

  // public ratingGardener(gardenerRating: any) {
  //   var total = 0;
  //   for (let rating of gardenerRating) {
  //     total = total + rating.rate;
  //   }
  //   this.starRating = total / 5;
  //   console.log(this.starRating);
  //   alert(this.starRating);
  // }

  public bookGardener(gardenerId: any) {
    if (sessionStorage.getItem('userId') && sessionStorage.getItem('token')) {
      this.gardenerService.bookTheGardener(gardenerId).subscribe(data => {
        console.log(data);

        if (data.message) {
          this.toaster.info("Already Requested", "");
        }
        else {
          this.toaster.success("Successfully Request Sent", "Success");
        }
      }, err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status == 500) {
            this.toaster.error("Internal Server Error", "Error");
          }
          else if (err.status == 400) {
            this.toaster.error("Bad Request", "Error");
          }
        }
      });
    }
    else {
      this.router.navigate(['signin']);
    }
  }
}
