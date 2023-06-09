import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtService } from './jwt.service';
import { CreateEventPresenter } from '../interfaces/event/create_event.presenter';
import { Select, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { EventsState } from '../shared/state/events/events.state';
import { AssistancesState } from '../shared/state/events/assistances/assistances.state';
import { EventModel, EventCollectionModel } from '../models/event_collection.model';
import { SetMyEvents } from '../shared/state/events/events.actions';
import { tap } from 'rxjs/operators';
import { SetMyAssistances } from '../shared/state/events/assistances/assistances.actions';
import { CreateAssistancePresenter } from '../interfaces/event/assistance/create_assistance.presenter';
import { DeleteAssistancePresenter } from '../interfaces/event/assistance/delete_assistance.presenter';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  @Select(EventsState) events$: Observable<EventCollectionModel>;
  @Select(AssistancesState) assistance$: Observable<EventCollectionModel>;


  private readonly API_URL: string = environment.API_URL;
  public isChargingFeedEvents = false;

  constructor(
    private readonly http: HttpClient,
    private readonly jwt_service: JwtService,
    private readonly store: Store
  ) { }

  public createEvent(event:CreateEventPresenter): Observable<Object> {
    return this.http.post(
      `${this.API_URL}/event`,
      {
        name: event.name,
        description: event.description,
        lat: event.lat,
        long: event.long,
        date: event.date
      },
      this.jwt_service.getHttpOptions()
    );
  }

  public getEventsOfFriendsCollection(limit: number,offset: number): Observable<Object> {
    if (this.isChargingFeedEvents) {
      return of([]);
    }
    let params  = new HttpParams();
    params = params.append('limit', limit);
    params = params.append('offset', offset);
    this.isChargingFeedEvents = true;
    return this.http.get(
      `${this.API_URL}/event`,
      {
        params,
        ...this.jwt_service.getHttpOptions(),
      }
    ).pipe(
      tap(() => {
        this.isChargingFeedEvents = false;
      })
    )
  }

  public getMyEventsCollection(): Observable<Object>{
    return this.http.get(
      `${this.API_URL}/event/${this.jwt_service.getUserId()}`,
      this.jwt_service.getHttpOptions()
    );
  }

  public getAndStoreMyEventsCollection(): void {
    this.http.get(
      `${this.API_URL}/event/${this.jwt_service.getUserId()}`,
      this.jwt_service.getHttpOptions()
    )
    .subscribe((my_event_collection: any) => {
      this.storeMyEvents(my_event_collection.events);
    });
  }

  public getMyEvents(): Array<EventModel> {
    let events: Array<EventModel> = [];
    this.events$.subscribe(e => {
      events = e.events;
    });
    return events;
  }

  public storeMyEvents(events: Array<EventModel>): Observable<void> {
    return this.store.dispatch(new SetMyEvents({events}));
  }

  public deleteEvent(event_id : string): Observable<Object> {
    return this.http.delete(
      `${this.API_URL}/event/${event_id}`,
      this.jwt_service.getHttpOptions()
    );
  }

  public updateEvent(event: CreateEventPresenter, event_id : string): Observable<Object> {
    return this.http.put(
      `${this.API_URL}/event/${event_id}`,
      event,
      this.jwt_service.getHttpOptions()
    );
  }

  public createAssistance(assistance: CreateAssistancePresenter): Observable<Object> {
    return this.http.post(
      `${this.API_URL}/event/assistant/${assistance.event_id}}`,
      {},
      this.jwt_service.getHttpOptions()
    );
  }

  public deleteAssistance(assistance: DeleteAssistancePresenter): Observable<Object> {
    return this.http.post(
      `${this.API_URL}/event/assistant`,
      assistance,
      this.jwt_service.getHttpOptions(),
    );
  }

  public getAndStoreMyAssistancesCollection(): void {
    this.http.get(
      `${this.API_URL}/event/assistant/my-assistant/${this.jwt_service.getUserId()}`,
      this.jwt_service.getHttpOptions()
    )
    .subscribe((my_assistance_collection: any) => {
      this.storeMyAssistances(my_assistance_collection.events)
    });
  }

  public getMyAssistances(): Array<EventModel> {
    let assistances: Array<EventModel> = [];
    this.assistance$.subscribe(e => {
      assistances = e.events;
    });
    return assistances;
  }

  private storeMyAssistances(events: Array<EventModel>): Observable<void> {
    return this.store.dispatch(new SetMyAssistances({events}));
  }
}
