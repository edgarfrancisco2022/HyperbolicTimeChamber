import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TriggerSaveSessionModalService } from '../service/trigger-save-session-modal.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  exitChamberClickedSubject$: BehaviorSubject<any>;
  exitChamberClickedSubscription$: Subscription = new Subscription();

  /******  Save Session Modal  *******/

  starRatingActiveOrInactive = {
    star1: false,
    star2: false,
    star3: false,
    star4: false,
    star5: false
  }

  sessionDescription: string = "";
  sessionQualityRating: number = 0;

  constructor(private triggerSaveSessionModalService: TriggerSaveSessionModalService) { }

  ngOnInit(): void {
    this.exitChamberClickedSubject$ = this.triggerSaveSessionModalService.
                                      getExitChamberClicked();
    this.getExitChamberClickedSubscription();
  }

  private getExitChamberClickedSubscription() {
    this.exitChamberClickedSubscription$ = this.exitChamberClickedSubject$.subscribe(
      (togglerClicked) => {

        if (togglerClicked) {
          console.log(togglerClicked);
          let saveSessionModal: HTMLElement = document.querySelector('.saveSessionModal');
          saveSessionModal.click();
          this.triggerSaveSessionModalService.onExitChamberClicked(false);
        }
      }
    );
  }

  /* Save Session Modal Star Rating */
  onStar1Clicked(star: number): void {
    switch(star) {
      case 5:
        this.starRatingActiveOrInactive.star1 = true;
        this.starRatingActiveOrInactive.star2= true;
        this.starRatingActiveOrInactive.star3 = true;
        this.starRatingActiveOrInactive.star4 = true;
        this.starRatingActiveOrInactive.star5 = true;
        break;
      case 4:
        this.starRatingActiveOrInactive.star1 = false;
        this.starRatingActiveOrInactive.star2= true;
        this.starRatingActiveOrInactive.star3 = true;
        this.starRatingActiveOrInactive.star4 = true;
        this.starRatingActiveOrInactive.star5 = true;
        break;
      case 3:
        this.starRatingActiveOrInactive.star1 = false;
        this.starRatingActiveOrInactive.star2= false;
        this.starRatingActiveOrInactive.star3 = true;
        this.starRatingActiveOrInactive.star4 = true;
        this.starRatingActiveOrInactive.star5 = true;
        break;
      case 2:
        this.starRatingActiveOrInactive.star1 = false;
        this.starRatingActiveOrInactive.star2= false;
        this.starRatingActiveOrInactive.star3 = false;
        this.starRatingActiveOrInactive.star4 = true;
        this.starRatingActiveOrInactive.star5 = true;
        break;
      case 1:
        this.starRatingActiveOrInactive.star1 = false;
        this.starRatingActiveOrInactive.star2= false;
        this.starRatingActiveOrInactive.star3 = false;
        this.starRatingActiveOrInactive.star4 = false;
        this.starRatingActiveOrInactive.star5 = true;
        break;
    }
    this.sessionQualityRating = star;
  }

  isSaveSessionButtonDisabled(): boolean {
    return this.sessionDescription.length >= 1 && this.sessionQualityRating > 0 ? false : true;
  }

  onSaveSessionClicked(): void {
    this.triggerSaveSessionModalService.setCurrentSessionDescription(this.sessionDescription);
    this.triggerSaveSessionModalService.setCurentSessionQualityRating(this.sessionQualityRating);

    this.sessionDescription = "";
    this.sessionQualityRating = 0;

    this.starRatingActiveOrInactive.star1 = false;
    this.starRatingActiveOrInactive.star2 = false;
    this.starRatingActiveOrInactive.star3 = false;
    this.starRatingActiveOrInactive.star4 = false;
    this.starRatingActiveOrInactive.star5 = false;

    this.triggerSaveSessionModalService.onSaveSessionClicked(true);
  }

  onDoNotSaveSessionClicked(): void {
    this.triggerSaveSessionModalService.onSaveSessionClicked(false);
  }

}
