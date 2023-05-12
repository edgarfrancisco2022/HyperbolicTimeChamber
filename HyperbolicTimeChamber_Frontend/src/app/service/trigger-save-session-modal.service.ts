import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TriggerSaveSessionModalService {

  private exitChamberClicked$ = new BehaviorSubject(false);
  private currentSessionDescription: string = "";
  private currentSessionQualityRating: number = 0;

  private saveSessionClicked$ = new BehaviorSubject(false);

  constructor() {
    this.onExitChamberClicked(false);
  }

  onExitChamberClicked(exitChamberClicked: boolean): void {
    this.exitChamberClicked$.next(exitChamberClicked);
  }

  getExitChamberClicked(): BehaviorSubject<boolean> {
    return this.exitChamberClicked$;
  }

  getCurrentSessionDescription(): string {
    return this.currentSessionDescription;
  }

  setCurrentSessionDescription(sessionDescription: string): void {
    this.currentSessionDescription = sessionDescription;
  }

  getcurrentSessionQualityRating(): number {
    return this.currentSessionQualityRating;
  }

  setCurentSessionQualityRating(sessionQualityRating: number): void {
    this.currentSessionQualityRating = sessionQualityRating;
  }

  onSaveSessionClicked(saveSessionClicked: boolean): void {
    this.saveSessionClicked$.next(saveSessionClicked);
  }

  getSaveSessionClicked(): BehaviorSubject<boolean> {
    return this.saveSessionClicked$;
  }
}
