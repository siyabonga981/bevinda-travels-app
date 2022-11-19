import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  parseISO,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { AfterViewInit } from '@angular/core';
import { ConfirmActionComponent } from '../confirm-action/confirm-action.component';
import { Router } from '@angular/router';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
})
export class AppointmentsComponent implements OnInit, AfterViewInit {
  spinner: boolean = false;
  mode: ProgressSpinnerMode = 'indeterminate';
  minDate: Date = new Date();
  minDateEnd: Date = new Date();
  minDateEdit = new Date();
  maxDateEdit = new Date();
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  @ViewChild('dialogContent', { static: true }) dialogContent: TemplateRef<any>;
  @ViewChild('editDialogContent', { static: true })
  editDialogContent: TemplateRef<any>;
  @ViewChild('appointmentForm') appointmentForm;
  @ViewChild('x') x: any;

  patients: any[] = [];
  appointment = {
    start: null,
    end: null,
    patient: null,
    title: '',
    primaryColor: '#059bd7',
    allDay: true,
    resizable: {
      beforeStart: true,
      afterEnd: true,
    },
    draggable: false,
  };

  dataForm = {
    start: null,
    end: null,
    patient: null,
    primaryColor: '#059bd7',
    resizable: {
      beforeStart: true,
      afterEnd: true,
    },
    draggable: false,
  };

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: any;
  };

  actions = [
    {
      onClick: ({ event }: { event }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      onClick: ({ event }: { event }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  events: any[] = [];

  activeDayIsOpen: boolean = false;
  editAppointment: boolean = false;
  appointments: any[] = [];
  commonDates: any[] = [];
  sameDayColor: string = '';
  showAddDialog: boolean = false;
  constructor(
    private modal: NgbModal,
    private dialog: MatDialog,
    private api: ApiService,
    private common: CommonService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {
    if(!this.common.getAgent()){
      this.router.navigate(['login']);
    }
    this.getAppointmentsFromAPI();
  }

  ngOnInit(): void {
    this.minDateEnd.setMinutes(this.minDateEnd.getMinutes() + 30);
  }
  ngAfterViewInit() {}
  clickedInput() {
  }
  dayClicked({ date, events }: { date: Date; events: any }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: any, x?): any {
    this.modalData = { event, action };
    this.minDateEdit.setMinutes(event.start.getMinutes() - 1);
    this.maxDateEdit.setMinutes(event.end.getMinutes() - 1);
    this.getPatientFromAPI(event.patient.idNumber);
    this.dialog
      .open(this.editDialogContent, { data: event, disableClose: true })
      .afterClosed()
      .subscribe((res) => {
        if (res.msg === 'undefined') {
          this.deleteSelectedAppointment(res._id);
        } else if (res.msg === 'closed') {
          this.refreshComponent();
        } else {
          res._id = event._id;
          (res.draggable = false),
            (res.resizable = {
              beforeStart: true,
              afterEnd: true,
            }),
            (res.doctor = this.common.getAgent().userDetails.username);
          this.updateSelectedAppointment(res);
        }
      });
  }

  validateForm() {
    if (this.appointmentForm.status == 'INVALID') {
      this.snackbar.open('Please insert all fields', 'Close', {
        duration: 2500,
        panelClass: ['redBackground', 'whiteColor'],
      });
    }
  }

  openAddAppointmentDialog(): void {
    this.showAddDialog = true;
    this.dialog
      .open(this.dialogContent, { disableClose: true })
      .afterClosed()
      .subscribe((res) => {
        if (res.msg == 'closed') {
          this.showAddDialog = false;
          return false;
        } else {
          let newAppointment = {
            title: res.title,
            start: res.start,
            end: res.end,
            patient: res.patient,
            primaryColor: this.appointment.primaryColor,
            draggable: false,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
            doctor: this.common.getAgent().userDetails.username,
          };
          this.showAddDialog = false;
          this.saveAppointmentInDB(newAppointment);
        }
      });
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: any) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  getAppointmentsFromAPI() {
    this.api
      .getAppointments('appointments/getAppointments', {
        doctor: this.common.getAgent().userDetails.username,
      })
      .subscribe((res) => {
        this.spinner = false;
        if (res.length) {
          let allAppointments = res.map((appointment) => {
            return {
              _id: appointment._id,
              title: appointment.title,
              start: parseISO(appointment.start),
              end: parseISO(appointment.end),
              patient: appointment.patient,
              primaryColor: appointment.primaryColor,
              draggable: false,
              resizable: {
                beforeStart: true,
                afterEnd: true,
              },
            };
          });
          this.events = [...allAppointments];
        } else {
          this.spinner = false;

        }
      });
  }

  getPatientFromAPI(idNumber) {
    if (idNumber && idNumber.length === 13) {
      this.api
        .getAgent('patients/getPatient', {
          'personalDetails.idNumber': idNumber,
        })
        .subscribe((response) => {
          if (response) {
            this.patients = response.patient;
            this.snackbar.open(response.msg, 'Close', {
              duration: 2500,
              panelClass: ['greenBackground', 'whiteColor'],
            });
          } else {
            this.snackbar.open(
              'Patient with that ID number not found',
              'Dismiss',
              {
                duration: 3000,
                panelClass: ['redBackground', 'whiteColor'],
              }
            );
          }
        }),
        (err) => {
          console.log(err.msg);
        };
    }
  }

  saveAppointmentInDB(newAppointment) {
    this.spinner = true;
    this.api
      .addAppointment('appointments/addAppointment', newAppointment)
      .subscribe(
        (res) => {
          this.spinner = false;
          if (res) {
            this.snackbar.open(
              `Appointment with ${newAppointment.patient.firstName} made successfuly`,
              'Close',
              {
                duration: 2500,
                panelClass: ['greenBackground', 'whiteColor'],
              }
            );
            setTimeout(() => {
              this.refreshComponent();
            }, 1500);
          }
        },
        (err) => {
          this.spinner = false;
          this.refreshComponent();
          this.snackbar.open(err.error, 'Dismiss', {
            duration: 3000,
            panelClass: ['redBackground', 'whiteColor'],
          });
        }
      );
  }

  updateSelectedAppointment(appointmentToUpdate) {
    this.api
      .updateAppointment(
        `appointments/updateAppointment/${appointmentToUpdate._id}`,
        appointmentToUpdate
      )
      .subscribe(
        (res) => {
          if (res) {
            this.snackbar.open(res.msg, 'Close', {
              duration: 5000,
              panelClass: ['greenBackground', 'whiteColor'],
            });
            setTimeout(() => {
              this.refreshComponent();
            }, 1500);
          }
        },
        (err) => {
          this.refreshComponent();
          this.snackbar.open(err.msg, 'Close', {
            duration: 5000,
            panelClass: ['redBackground', 'whiteColor'],
          });
        }
      );
  }

  deleteSelectedAppointment(appointmentToDelete) {
    this.dialog
      .open(ConfirmActionComponent, {
        data: 'Delete this appointment?',
        disableClose: true,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.api
            .deleteAppointment(
              `appointments/deleteAppointment/${appointmentToDelete}`,
              appointmentToDelete
            )
            .subscribe(
              (res) => {
                if (res) {
                  this.snackbar.open(res.msg, 'Close', {
                    duration: 5000,
                    panelClass: ['greenBackground', 'whiteColor'],
                  });
                }
              },
              (err) => {
                this.refreshComponent();
                this.snackbar.open(err.msg, 'Close', {
                  duration: 5000,
                  panelClass: ['redBackground', 'whiteColor'],
                });
              }
            );
        } else {
          this.refreshComponent();
        }
      });
  }

  refreshComponent(): void {
    window.location.reload();
  }
}
