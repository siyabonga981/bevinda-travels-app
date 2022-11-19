import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // serverUrl = 'http://localhost:3000';
  serverUrl = 'https://bevinda-travels.herokuapp.com'
  constructor(private http: HttpClient) { }
  getAgent(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }
  getAllAgents(endpoint): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.get<any>(url);
  }
  addAgent(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }
  updateAgent(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.put<any>(url, body);
  }
  updateProfilePic(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.put<any>(url, body);
  }
  deleteAgent(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }
  loginAgent(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }

  getClient(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }
  getClients(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }
  addClient(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }
  updateClient(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.put<any>(url, body);
  }
  deleteClient(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.delete<any>(url, body);
  }
  filterClients(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }

  getPrescriptions(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }
  addPrescription(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }
  updatePrescription(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.put<any>(url, body);
  }
  deletePrescription(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.delete<any>(url, body);
  }
  getAppointments(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }
  addAppointment(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }
  updateAppointment(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.put<any>(url, body);
  }
  deleteAppointment(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.delete<any>(url, body);
  }

  getInvoices(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }
  getInvoice(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }
  sendInvoice(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }
  updateInvoice(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.put<any>(url, body);
  }
  deleteInvoice(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.delete<any>(url, body);
  }

  getRewards(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }
  getReward(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }
  addReward(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }
  updateReward(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.put<any>(url, body);
  }
  deleteReward(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.delete<any>(url, body);
  }

  getBookings(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }
  getBooking(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }
  addBooking(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }
  updateBooking(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.put<any>(url, body);
  }
  deleteBooking(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.delete<any>(url, body);
  }
  sendContactEmail(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }

  memberShipSignUp(endpoint, body): Observable<any>{
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }

  getReservations(endpoint, body): Observable<any>{
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }
  getReservation(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }
  addReservation(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }
  updateReservation(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.put<any>(url, body);
  }
  deleteReservation(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.delete<any>(url, body);
  }

  createOzowLink(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }

  getAllUsers(endpoint): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.get<any>(url);
  }
  addUser(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.post<any>(url, body);
  }
  updateUser(endpoint, body): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.put<any>(url, body);
  }
  deleteUser(endpoint): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.delete<any>(url);
  }
  getUser(endpoint): Observable<any> {
    const url = `${this.serverUrl}/${endpoint}`;
    return this.http.get<any>(url);
  }
}
