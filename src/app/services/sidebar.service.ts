
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private readonly _open$ = new BehaviorSubject<boolean>(true);
  readonly open$ = this._open$.asObservable();

  get isOpen(): boolean { return this._open$.value; }
  toggle(): void { this._open$.next(!this._open$.value); }
  open(): void { this._open$.next(true); }
  close(): void { this._open$.next(false); }
}