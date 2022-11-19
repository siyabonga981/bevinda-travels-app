import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmActionComponent } from '../confirm-action/confirm-action.component';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

class Product {
  name: string;
  price: number;
  qty: number;
}
class Invoice {
  customerName: string;
  address: string;
  contactNo: number;
  email: string;
  paid: boolean = false;
  products: Product[] = [];
  additionalDetails: string;
  ref: any;
  dateCleared: any;
  dateCreated: any;
  constructor() {

  }
}
@Component({
  selector: 'app-create-edit-invoice',
  templateUrl: './create-edit-invoice.component.html',
  styleUrls: ['./create-edit-invoice.component.scss'],
})
export class CreateEditInvoiceComponent {
  invoice = new Invoice();
  agent: any = {};
  client: any = {};
  invoices: any[] = [];
  invoiceObj: any = {};
  pdfLink: any = {};
  spinner: boolean = false;
  mode: ProgressSpinnerMode = 'indeterminate';
  latestInvoice: any = {
    number: 1,
  };
  constructor(
    public router: Router,
    private api: ApiService,
    private common: CommonService,
    private snackbar: MatSnackBar,
    public sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {
    this.agent = this.common.getAgent();
    if(!this.agent){
        this.router.navigate(['login']);
    }
    this.checkIfRouteIsCreateInvoice();
    this.invoice.additionalDetails = '';
    !this.router.url.includes('createInvoice') ? this.getAllInvoices() : null
  }

  ngOnDestroy() {
    if (!this.router.url.includes('editInvoice')) {
      sessionStorage.clear();
    }
  }

  checkIfRouteIsCreateInvoice() {
    if (this.router.url.includes('createInvoice')) {
      sessionStorage.clear();
    } else if (
      JSON.parse(sessionStorage.getItem('invoiceID')) === null &&
      !this.router.url.includes('createInvoice')
    ) {
      this.router.navigate(['BevindaTravels/invoices']);
    } else {
      if (JSON.parse(sessionStorage.getItem('invoiceID')) !== null) {
        this.getInvoiceFromDB();
      }
    }
  }

  generatePDF(action = 'open') {
    let docDefinition = {
      content: [
        {
          text: 'BEVINDA TRAVELS',
          fontSize: 20,
          alignment: 'center',
          color: '#047886',
        },
        {
          text: 'CLIENT INVOICE',
          fontSize: 16,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: '#ccc',
        },
        {
          text: 'Customer Details',
          style: 'sectionHeader',
        },
        {
          columns: [
            [
              {
                text: this.invoice?.customerName,
                bold: true,
              },
              { text: this.invoice?.address },
              { text: this.invoice?.email },
              { text: this.invoice?.contactNo },
            ],
            [
              {
                text: `Cleared: ${new Date().toDateString().slice(0, 16)}`,
                alignment: 'right',
              },
              {
                text: `REF : ${this.invoice?.ref}`,
                alignment: 'right',
              },
              {
                text: `Invoice Status : Unpaid`,
                alignment: 'right',
                color: '#EC5646',
              },
            ],
          ],
        },
        {
          text: 'Invoice Details',
          style: 'sectionHeader',
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Product', 'Price', 'Quantity', 'Amount (R)'],
              ...this.invoice?.products.map((p) => [
                p.name,
                p.price,
                p.qty,
                (p.price * p.qty).toFixed(2),
              ]),
              [
                { text: 'Total Amount (R)', colSpan: 3 },
                {},
                {},
                this.invoice?.products
                  .reduce((sum, p) => sum + p.qty * p.price, 0)
                  .toFixed(2),
              ],
            ],
          },
        },
        {
          text: 'Additional Details',
          style: 'sectionHeader',
        },
        {
          text: this.invoice?.additionalDetails,
          margin: [0, 0, 0, 15],
        },
        {
          columns: [
            [{ qr: `${this.invoice?.customerName}`, fit: '50' }],
            [{ text: 'Signature', alignment: 'right', italics: true }],
          ],
        },
        {
          text: 'Terms and Conditions',
          style: 'sectionHeader',
        },
        {
          ul: [
            'Invoice to be cleared within 5 working days.',
            'Failure to clear the invoice in the specified time will result in a 30% interest to be paid within 15 days from the day it was added',
          ],
        },
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 15],
        },
      },
    };
    if (action === 'download') {
      pdfMake
        .createPdf(docDefinition)
        .download(
          `Invoice - ${this.client.firstName} ${this.client.lastName}.pdf`
        );
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      pdfMake.createPdf(docDefinition).open();
    }
  }

  addProduct() {
    this.invoice.products.push(new Product());
  }

  getClientFromAPI(phoneNumber, form) {
    if (phoneNumber && phoneNumber.length === 10) {
      this.api
        .getAgent('clients/getClient', {
          'personalDetails.clientAddress.phone': phoneNumber,
        })
        .subscribe(
          (response) => {
            if (response) {

              this.client = response.client[0].personalDetails;

              this.invoice.customerName = `${this.client.firstName} ${this.client.lastName}`;
              this.invoice.address = `${this.client.clientAddress.street}
${this.client.clientAddress.city}
${this.client.clientAddress.town}
${this.client.clientAddress.code}`;
              this.invoice.email = this.client.clientAddress.email;
              this.invoice.contactNo = this.client.clientAddress.phone;
              this.snackbar.open(response.msg, 'Close', {
                duration: 2500,
                panelClass: ['greenBackground', 'whiteColor'],
              });
            }
          },
          (err) => {
             form.reset();
            this.snackbar.open(err.error.msg, 'Close', {
              duration: 3000,
              panelClass: ['redBackground', 'whiteColor'],
            });
          }
        );
    }
  }

  downloadPDF(pdf) {
    this.pdfLink = this.sanitizer.bypassSecurityTrustResourceUrl(pdf);
  }

  getAllInvoices() {
    this.spinner = true;
    this.api
      .getInvoices('invoices/getInvoices', {})
      .subscribe(
        (response) => {
          this.spinner = false;
          if (response?.invoices?.length) {
            this.invoices = response;
            this.getLatestInvoice(response.invoices);
            this.snackbar.open(response.msg, 'Close', {
              duration: 2500,
              panelClass: ['greenBackground', 'whiteColor'],
            });
          }
        },
        (err) => {
          this.spinner = false;
          this.snackbar.open(err.error.msg, 'Close', {
            duration: 3000,
            panelClass: ['redBackground', 'whiteColor'],
          });
        }
      );
  }

  getLatestInvoice(invoices) {
    for (let i = 0; i < invoices.length; i++) {
      if (invoices[i]?.ref.split('-')[1] > this.latestInvoice) {
        this.latestInvoice.number = invoices[i].ref.split('-')[1];
      } else {
        this.latestInvoice.number = 1;
      }
      this.latestInvoice.number++;
    }
  }
  sendInvoice(form) {
    let docDefinition = {
      content: [
        {
          text: 'BEVINDA TRAVELS',
          fontSize: 20,
          alignment: 'center',
          color: '#047886',
        },
        {
          text: 'CLIENT INVOICE',
          fontSize: 16,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: '#ccc',
        },
        {
          text: 'Customer Details',
          style: 'sectionHeader',
        },
        {
          columns: [
            [
              {
                text: this.invoice?.customerName,
                bold: true,
              },
              { text: this.invoice?.address },
              { text: this.invoice?.email },
              { text: this.invoice?.contactNo },
            ],
            [
              {
                text: `Created: ${new Date().toLocaleString().slice(0, 21)}`,
                alignment: 'right',
              },
              {
                text: `REF : ${this.invoice?.customerName} - ${this.latestInvoice?.number}`,
                alignment: 'right',
              },
              {
                text: `Invoice Status : Unpaid`,
                alignment: 'right',
                color: '#EC5646',
              },
            ],
          ],
        },
        {
          text: 'Invoice Details',
          style: 'sectionHeader',
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Product', 'Price', 'Quantity', 'Amount (R)'],
              ...this.invoice?.products.map((p) => [
                p.name,
                p.price,
                p.qty,
                (p.price * p.qty).toFixed(2),
              ]),
              [
                { text: 'Total Amount (R)', colSpan: 3 },
                {},
                {},
                this.invoice?.products
                  .reduce((sum, p) => sum + p.qty * p.price, 0)
                  .toFixed(2),
              ],
            ],
          },
        },
        {
          text: 'Additional Details',
          style: 'sectionHeader',
        },
        {
          text: this.invoice?.additionalDetails,
          margin: [0, 0, 0, 15],
        },
        {
          columns: [
            [{ qr: `${this.invoice?.customerName}`, fit: '50' }],
            [{ text: 'Signature', alignment: 'right', italics: true }],
          ],
        },
        {
          text: 'Terms and Conditions',
          style: 'sectionHeader',
        },
        {
          ul: [
            'Invoice to be cleared within 5 working days.',
            'Failure to clear the invoice in the specified time will result in a 30% interest to be paid within 15 days from the day it was added',
          ],
        },
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 15],
        },
      },
    };
    pdfMake.createPdf(docDefinition).getBase64(
      function (encodedString) {
        let invoicetoSend = {
          name: this.invoice.customerName,
          contactNo: this.invoice.contactNo,
          email: this.invoice.email,
          address: this.invoice.address,
          additionalDetails: form.additionalDetails,
          paid: false,
          items: this.invoice.products,
          blob: `data:application/pdf;base64, ${encodedString}`,
          agent: this.agent.userDetails.username,
          dateCreated: new Date(),
          dateCleared: 'N/A',
          ref: this.invoice.customerName + ' - ' + this.latestInvoice?.number,
        };
        this.saveInvoice(invoicetoSend);
      }.bind(this) 
    );
  }
  removeItem(i) {
    this.invoice.products.splice(i, 1);
  }

  saveInvoice(invoiceToSave) {
    this.api.sendInvoice('invoices/sendInvoice', invoiceToSave).subscribe(
      (res) => {
        if (res) {
          this.snackbar.open(res.msg, 'Close', {
            duration: 2500,
            panelClass: ['greenBackground', 'whiteColor'],
          });
          setTimeout(() => {
            this.router.navigate(['BevindaTravels/invoices']);
          }, 1500);
        }
      },
      (err) => {
        this.snackbar.open(err.error.msg, 'Close', {
          duration: 2500,
          panelClass: ['redBackground', 'whiteColor'],
        });
      }
    );
  }

  getInvoiceFromDB() {
    let appointmentID = JSON.parse(sessionStorage.getItem('invoiceID'));
    this.api
      .getInvoice('invoices/getInvoice', { _id: appointmentID })
      .subscribe(
        (res) => {
          this.invoice = res[0];
          this.invoiceObj = res[0];
          if (JSON.parse(sessionStorage.getItem('path')) === 'edit') {
            this.editInvoice();
          }
        },
        (err) => {
          this.snackbar.open(err.error.msg, 'Close', {
            duration: 2500,
            panelClass: ['redBackground', 'whiteColor'],
          });
        }
      );
  }

  editInvoice() {
    this.router.navigate(['BevindaTravels/invoices/editInvoice']);
    sessionStorage.setItem('path', JSON.stringify('edit'));
    this.invoice.customerName = `${this.invoiceObj?.name}`;
    this.invoice.address = `${this.invoiceObj?.address}`;
    this.invoice.email = this.invoiceObj?.email;
    this.invoice.contactNo = this.invoiceObj?.contactNo;
    this.invoice.products = this.invoiceObj?.items;
    this.invoice.ref = this.invoiceObj?.ref;
  }

  updateAndEmailInvoice(form) {
    let dateCleared =
      this.invoice.paid == true && this.invoice.dateCleared == 'N/A'
        ? new Date()
        : this.invoice.paid == false
        ? 'N/A'
        : this.invoice.dateCleared;
    let dateCreated = this.invoice.dateCreated;
    let color = this.invoice.paid == true ? '#74df74' : '#EC5646';
    let docDefinition = {
      content: [
        {
          text: 'BEVINDA TRAVELS',
          fontSize: 20,
          alignment: 'center',
          color: '#047886',
        },
        {
          text: 'CLIENT INVOICE',
          fontSize: 16,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: '#ccc',
        },
        {
          text: 'Customer Details',
          style: 'sectionHeader',
        },
        {
          columns: [
            [
              {
                text: this.invoice?.customerName,
                bold: true,
              },
              { text: this.invoice?.address },
              { text: this.invoice?.email },
              { text: this.invoice?.contactNo },
            ],
            [
              {
                text: `Created: ${new Date(dateCreated)
                  .toLocaleString()
                  .slice(0, 21)}`,
                alignment: 'right',
              },
              {
                text: `Cleared: ${
                  dateCleared.length == 3
                    ? 'N/A'
                    : typeof dateCleared == 'object' && dateCleared !== null
                    ? dateCleared.toLocaleString().slice(0, 21)
                    : new Date(dateCleared).toLocaleTimeString().slice(0, 16)
                }`,
                alignment: 'right',
              },
              {
                text: `REF : ${this.invoice.ref}`,
                alignment: 'right',
              },
              {
                text: `Invoice Status: ${
                  this.invoice.paid == true ? 'Paid' : 'Unpaid'
                }`,
                alignment: 'right',
                color: color,
                'font-weight': '600',
              },
            ],
          ],
        },
        {
          text: 'Invoice Details',
          style: 'sectionHeader',
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Product', 'Price', 'Quantity', 'Amount (R)'],
              ...this.invoice?.products.map((p) => [
                p.name,
                p.price,
                p.qty,
                (p.price * p.qty).toFixed(2),
              ]),
              [
                { text: 'Total Amount (R)', colSpan: 3 },
                {},
                {},
                this.invoice?.products
                  .reduce((sum, p) => sum + p.qty * p.price, 0)
                  .toFixed(2),
              ],
            ],
          },
        },
        {
          text: 'Additional Details',
          style: 'sectionHeader',
        },
        {
          text: this.invoice?.additionalDetails,
          margin: [0, 0, 0, 15],
        },
        {
          columns: [
            [{ qr: `${this.invoice?.customerName}`, fit: '50' }],
            [{ text: 'Signature', alignment: 'right', italics: true }],
          ],
        },
        {
          text: 'Terms and Conditions',
          style: 'sectionHeader',
        },
        {
          ul: [
            'Invoice to be cleared within 5 working days.',
            'Failure to clear the invoice in the specified time will result in a 30% interest to be paid within 15 days from the day it was added',
          ],
        },
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 15],
        },
      },
    };
    pdfMake.createPdf(docDefinition).getBase64(
      function (encodedString) {
        let invoiceToUpdate = {
          name: this.invoice.name,
          contactNo: this.invoice.contactNo,
          email: this.invoice.email,
          address: this.invoice.address,
          additionalDetails: this.invoice.additionalDetails,
          paid: this.invoice.paid,
          items: this.invoice.products,
          blob: `data:application/pdf;base64, ${encodedString}`,
          agent: this.agent.userDetails.username,
          dateCreated: dateCreated,
          dateCleared: dateCleared,
          ref: this.invoice.ref,
        };

        this.updateEmailAndSaveInvoice(invoiceToUpdate);
      }.bind(this) 
    );
  }

  updateEmailAndSaveInvoice(invoiceToUpdate) {
    this.api
      .updateInvoice(
        'invoices/updateInvoice/' + this.invoiceObj._id,
        invoiceToUpdate
      )
      .subscribe(
        (res) => {
          if (res) {
            this.snackbar.open(res.msg, 'Close', {
              duration: 2500,
              panelClass: ['greenBackground', 'whiteColor'],
            });
            setTimeout(() => {
              this.router.navigate(['BevindaTravels/invoices']);
            }, 1500);
          }
        },
        (err) => {
          this.snackbar.open(err.error.msg, 'Close', {
            duration: 3000,
            panelClass: ['redBackground', 'whiteColor'],
          });
        }
      );
  }
  sanitizePDF(pdf): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(pdf);
  }

  deleteInvoice() {
    let msg = 'Are you sure you want to delete this invoice?';
    this.dialog
      .open(ConfirmActionComponent, { data: msg })
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.api
            .deleteInvoice('invoices/deleteInvoice/' + this.invoiceObj._id, {
              _id: this.invoiceObj._id,
            })
            .subscribe(
              (res) => {
                if (res) {
                  this.snackbar.open(res.msg, 'Close', {
                    duration: 2500,
                    panelClass: ['greenBackground', 'whiteColor'],
                  });
                  setTimeout(() => {
                    this.router.navigate(['BevindaTravels/invoices']);
                  }, 500);
                }
              },
              (err) => {
                this.snackbar.open(err.error.msg, 'Close', {
                  duration: 3000,
                  panelClass: ['redBackground', 'whiteColor'],
                });
              }
            );
        }
      });
  }
}
